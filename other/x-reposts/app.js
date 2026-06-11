(function() {
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var STORAGE_KEY = 'huy:x-reposts:review-state:v1';
    var dataset = window.X_REPOSTS_DATA || { reposts: [] };
    var rawRows = Array.isArray(dataset.reposts) ? dataset.reposts : [];

    var searchInput = document.getElementById('search-input');
    var topicFilter = document.getElementById('topic-filter');
    var typeFilter = document.getElementById('type-filter');
    var priorityFilter = document.getElementById('priority-filter');
    var statusFilter = document.getElementById('status-filter');
    var sortSelect = document.getElementById('sort-select');
    var heroStats = document.getElementById('hero-stats');
    var atlasMeta = document.getElementById('atlas-meta');
    var topicLegend = document.getElementById('topic-legend');
    var atlasSvg = document.getElementById('topic-atlas');
    var emptyState = document.getElementById('empty-state');
    var resultList = document.getElementById('result-list');
    var resultCount = document.getElementById('result-count');
    var inspector = document.getElementById('inspector');
    var themeToggle = document.getElementById('theme-toggle');

    var palette = {
        'AI/tools': 'var(--rust)',
        'Data/statistics': 'var(--green)',
        'Career/network': 'var(--amber)',
        'Applied economics': 'var(--blue)',
        'Other': 'var(--slate)'
    };

    var state = {
        query: '',
        topic: 'All',
        type: 'All',
        priority: 'All',
        status: 'All',
        sort: 'date-desc',
        activeId: ''
    };

    function numberValue(value) {
        var parsed = Number(String(value || '').replace(/,/g, ''));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function dateValue(value) {
        var parsed = Date.parse(value || '');
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function compactNumber(value) {
        var n = numberValue(value);
        if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
        return String(n);
    }

    function formatDate(value) {
        var timestamp = dateValue(value);
        if (!timestamp) return 'Unknown date';
        return new Date(timestamp).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function compactText(value, maxLength) {
        var text = String(value || '').replace(/\s+/g, ' ').trim();
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength - 1).trim() + '…';
    }

    function hashString(value) {
        var hash = 2166136261;
        for (var i = 0; i < value.length; i += 1) {
            hash ^= value.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return hash >>> 0;
    }

    function seededOffset(id, salt, spread) {
        var hash = hashString(String(id) + ':' + salt);
        return ((hash % 1000) / 1000 - 0.5) * spread;
    }

    function createSvgElement(tagName, attributes) {
        var element = document.createElementNS(SVG_NS, tagName);
        Object.keys(attributes || {}).forEach(function(key) {
            element.setAttribute(key, attributes[key]);
        });
        return element;
    }

    function getStoredReview() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
        } catch (err) {
            return {};
        }
    }

    function saveStoredReview(reviewState) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewState));
    }

    function updateReview(recordId, patch) {
        var reviewState = getStoredReview();
        reviewState[recordId] = Object.assign({}, reviewState[recordId] || {}, patch);
        saveStoredReview(reviewState);
        render();
    }

    function normalizeRow(row) {
        var engagement = numberValue(row.like_count) + numberValue(row.repost_count) * 2 + numberValue(row.reply_count) * 3;
        return Object.assign({}, row, {
            topic_primary: row.topic_primary || 'Other',
            topic_secondary: row.topic_secondary || 'Other',
            content_type: row.content_type || 'Other',
            priority: row.priority || 'Low',
            status: row.status || 'New',
            engagement: engagement,
            timestamp: dateValue(row.reposted_at)
        });
    }

    var rows = rawRows.map(normalizeRow);

    function withReview(row) {
        var review = getStoredReview()[row.record_id] || {};
        return Object.assign({}, row, {
            reviewStatus: review.status || row.status || 'New',
            reviewPriority: review.priorityOverride || row.priority || 'Low',
            bookmarked: Boolean(review.bookmarked),
            localNote: review.note || ''
        });
    }

    function uniqueValues(key) {
        var values = {};
        rows.forEach(function(row) {
            if (row[key]) values[row[key]] = true;
        });
        return Object.keys(values).sort();
    }

    function addOptions(select, values) {
        values.forEach(function(value) {
            var option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function searchableBlob(row) {
        return [
            row.post_text,
            row.author_handle,
            row.author_name,
            row.topic_primary,
            row.topic_secondary,
            row.content_type,
            row.tags,
            row.urls
        ].join(' ').toLowerCase();
    }

    function getFilteredRows() {
        var query = state.query.trim().toLowerCase();
        return rows.map(withReview).filter(function(row) {
            if (state.topic !== 'All' && row.topic_primary !== state.topic) return false;
            if (state.type !== 'All' && row.content_type !== state.type) return false;
            if (state.priority !== 'All' && row.reviewPriority !== state.priority) return false;
            if (state.status !== 'All' && row.reviewStatus !== state.status) return false;
            return !query || searchableBlob(row).indexOf(query) !== -1;
        }).sort(function(a, b) {
            if (state.sort === 'engagement-desc') return b.engagement - a.engagement || b.timestamp - a.timestamp;
            if (state.sort === 'author-asc') return String(a.author_handle).localeCompare(String(b.author_handle));
            return b.timestamp - a.timestamp;
        });
    }

    function ensureActive(filtered) {
        if (!filtered.length) {
            state.activeId = '';
            return null;
        }
        var active = filtered.find(function(row) {
            return row.record_id === state.activeId;
        });
        if (!active) {
            active = filtered[0];
            state.activeId = active.record_id;
        }
        return active;
    }

    function renderStats(filtered) {
        var reviewed = rows.map(withReview).filter(function(row) {
            return row.reviewStatus && row.reviewStatus !== 'New';
        }).length;
        var authors = {};
        rows.forEach(function(row) {
            if (row.author_handle) authors[row.author_handle] = true;
        });
        var stats = [
            { label: 'reposts', value: rows.length },
            { label: 'topics', value: uniqueValues('topic_primary').length },
            { label: 'authors', value: Object.keys(authors).length },
            { label: 'reviewed locally', value: reviewed }
        ];
        heroStats.innerHTML = stats.map(function(item) {
            return '<div class="stat"><strong>' + item.value + '</strong><span>' + item.label + '</span></div>';
        }).join('');
        atlasMeta.textContent = filtered.length + ' visible of ' + rows.length + ' reposts';
    }

    function renderLegend() {
        var topics = uniqueValues('topic_primary');
        topicLegend.innerHTML = topics.map(function(topic) {
            var color = palette[topic] || 'var(--slate)';
            return '<span class="legend-item"><span class="legend-swatch" style="background:' + color + '"></span>' + topic + '</span>';
        }).join('');
    }

    function renderAtlas(filtered) {
        atlasSvg.innerHTML = '';
        emptyState.hidden = filtered.length > 0;
        var width = 980;
        var height = 620;
        var padX = 74;
        var padY = 78;
        var topics = uniqueValues('topic_primary');
        var topicIndex = {};
        topics.forEach(function(topic, index) {
            topicIndex[topic] = index;
        });

        topics.forEach(function(topic, index) {
            var x = topics.length === 1 ? width / 2 : padX + (index / (topics.length - 1)) * (width - padX * 2);
            atlasSvg.appendChild(createSvgElement('line', {
                class: 'lane-line',
                x1: x,
                x2: x,
                y1: padY - 34,
                y2: height - padY + 24
            }));
            var label = createSvgElement('text', {
                class: 'lane-label',
                x: x,
                y: padY - 46,
                'text-anchor': 'middle'
            });
            label.textContent = topic;
            atlasSvg.appendChild(label);
        });

        var grouped = {};
        filtered.forEach(function(row) {
            grouped[row.topic_primary] = grouped[row.topic_primary] || [];
            grouped[row.topic_primary].push(row);
        });
        Object.keys(grouped).forEach(function(topic) {
            grouped[topic].sort(function(a, b) {
                return b.timestamp - a.timestamp;
            });
        });

        var nodeModels = filtered.map(function(row) {
            var group = grouped[row.topic_primary] || [];
            var index = group.findIndex(function(item) {
                return item.record_id === row.record_id;
            });
            var topicCount = topics.length;
            var xBase = topicCount === 1 ? width / 2 : padX + (topicIndex[row.topic_primary] / (topicCount - 1)) * (width - padX * 2);
            var yBase = group.length <= 1 ? height / 2 : padY + (index / (group.length - 1)) * (height - padY * 2);
            var radius = Math.max(4.6, Math.min(13, 4.6 + Math.sqrt(row.engagement || 1) * 0.38));
            return {
                row: row,
                x: xBase + seededOffset(row.record_id, 'x', 58),
                y: yBase + seededOffset(row.record_id, 'y', 26),
                radius: radius
            };
        }).sort(function(a, b) {
            return b.radius - a.radius;
        });

        nodeModels.forEach(function(model) {
            var row = model.row;
            var node = createSvgElement('circle', {
                class: 'repost-node' + (row.record_id === state.activeId ? ' active' : ''),
                cx: model.x,
                cy: model.y,
                r: model.radius,
                fill: palette[row.topic_primary] || 'var(--slate)',
                'data-id': row.record_id,
                tabindex: '0',
                role: 'button',
                'aria-label': compactText(row.post_text, 90)
            });
            var title = createSvgElement('title');
            title.textContent = '@' + row.author_handle + ': ' + compactText(row.post_text, 140);
            node.appendChild(title);
            node.addEventListener('click', function() {
                state.activeId = row.record_id;
                render();
            });
            node.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    state.activeId = row.record_id;
                    render();
                }
            });
            atlasSvg.appendChild(node);
        });
    }

    function renderResults(filtered) {
        resultCount.textContent = filtered.length + (filtered.length === 1 ? ' repost' : ' reposts');
        var visible = filtered.slice(0, 90);
        resultList.innerHTML = visible.map(function(row) {
            var active = row.record_id === state.activeId ? ' active' : '';
            var title = compactText(row.post_text || row.original_post_url, 110);
            return [
                '<button class="result-row' + active + '" type="button" data-id="' + row.record_id + '">',
                '<span><span class="result-title">' + escapeHtml(title) + '</span>',
                '<span class="result-meta">@' + escapeHtml(row.author_handle || 'unknown') + ' · ' + formatDate(row.reposted_at) + '</span></span>',
                '<span class="result-chip">' + escapeHtml(row.topic_primary) + '</span>',
                '</button>'
            ].join('');
        }).join('');
        Array.prototype.forEach.call(resultList.querySelectorAll('.result-row'), function(button) {
            button.addEventListener('click', function() {
                state.activeId = button.getAttribute('data-id');
                render();
            });
        });
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderInspector(row) {
        if (!row) {
            inspector.innerHTML = '<div class="empty-inspector"><p>Select a repost to inspect and manage it.</p><span>Review state is saved locally in this browser.</span></div>';
            return;
        }
        var tags = [row.topic_primary, row.topic_secondary, row.content_type, row.tags, row.media_type]
            .filter(Boolean)
            .join(';')
            .split(';')
            .map(function(tag) { return tag.trim(); })
            .filter(Boolean);
        var uniqueTags = [];
        tags.forEach(function(tag) {
            if (uniqueTags.indexOf(tag) === -1) uniqueTags.push(tag);
        });
        inspector.innerHTML = [
            '<div class="detail-header">',
            '<p class="detail-label">' + escapeHtml(row.reviewStatus) + ' · ' + escapeHtml(row.reviewPriority) + '</p>',
            '<h2 class="detail-title">' + escapeHtml(compactText(row.post_text, 92)) + '</h2>',
            '<div class="detail-author">@' + escapeHtml(row.author_handle || 'unknown') + ' · ' + escapeHtml(row.author_name || 'Unknown author') + ' · ' + formatDate(row.reposted_at) + '</div>',
            '</div>',
            '<p class="detail-text">' + escapeHtml(row.post_text) + '</p>',
            '<div class="detail-links">',
            row.original_post_url ? '<a class="detail-link" href="' + escapeHtml(row.original_post_url) + '" target="_blank" rel="noopener">Original post</a>' : '<span class="detail-link">No original link</span>',
            row.repost_url ? '<a class="detail-link" href="' + escapeHtml(row.repost_url) + '" target="_blank" rel="noopener">My repost</a>' : '<span class="detail-link">No repost link</span>',
            '</div>',
            '<div class="metric-grid">',
            metricHtml('Likes', compactNumber(row.like_count)),
            metricHtml('Reposts', compactNumber(row.repost_count)),
            metricHtml('Replies', compactNumber(row.reply_count)),
            metricHtml('Views', compactNumber(row.view_count)),
            '</div>',
            '<div class="tags">' + uniqueTags.slice(0, 10).map(function(tag) { return '<span class="tag">' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
            '<div class="review-grid">',
            '<div class="review-row"><span class="detail-label">Status</span><select class="review-field" id="status-control">' + statusOptions(row.reviewStatus) + '</select></div>',
            '<div class="review-row"><span class="detail-label">Priority</span><select class="review-field" id="priority-control">' + priorityOptions(row.reviewPriority) + '</select></div>',
            '<button class="bookmark-button' + (row.bookmarked ? ' active' : '') + '" id="bookmark-control" type="button">' + (row.bookmarked ? 'Bookmarked' : 'Bookmark') + '</button>',
            '<label><span class="detail-label">Note</span><textarea class="note-field" id="note-control" placeholder="Private local note...">' + escapeHtml(row.localNote) + '</textarea></label>',
            '</div>'
        ].join('');

        document.getElementById('status-control').addEventListener('change', function(event) {
            updateReview(row.record_id, { status: event.target.value });
        });
        document.getElementById('priority-control').addEventListener('change', function(event) {
            updateReview(row.record_id, { priorityOverride: event.target.value });
        });
        document.getElementById('bookmark-control').addEventListener('click', function() {
            updateReview(row.record_id, { bookmarked: !row.bookmarked });
        });
        document.getElementById('note-control').addEventListener('input', debounce(function(event) {
            updateReview(row.record_id, { note: event.target.value });
        }, 250));
    }

    function metricHtml(label, value) {
        return '<div class="metric"><span class="metric-label">' + label + '</span><strong>' + value + '</strong></div>';
    }

    function statusOptions(active) {
        return ['New', 'Reviewed', 'Saved to wiki', 'To read', 'To cite', 'To share', 'Ignore'].map(function(value) {
            return '<option value="' + value + '"' + (value === active ? ' selected' : '') + '>' + value + '</option>';
        }).join('');
    }

    function priorityOptions(active) {
        return ['High', 'Medium', 'Low', 'Archive only'].map(function(value) {
            return '<option value="' + value + '"' + (value === active ? ' selected' : '') + '>' + value + '</option>';
        }).join('');
    }

    function debounce(fn, delay) {
        var timeoutId;
        return function() {
            var args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                fn.apply(null, args);
            }, delay);
        };
    }

    function render() {
        var filtered = getFilteredRows();
        var active = ensureActive(filtered);
        renderStats(filtered);
        renderAtlas(filtered);
        renderResults(filtered);
        renderInspector(active);
    }

    function bindControls() {
        searchInput.addEventListener('input', function(event) {
            state.query = event.target.value;
            render();
        });
        topicFilter.addEventListener('change', function(event) {
            state.topic = event.target.value;
            render();
        });
        typeFilter.addEventListener('change', function(event) {
            state.type = event.target.value;
            render();
        });
        priorityFilter.addEventListener('change', function(event) {
            state.priority = event.target.value;
            render();
        });
        statusFilter.addEventListener('change', function(event) {
            state.status = event.target.value;
            render();
        });
        sortSelect.addEventListener('change', function(event) {
            state.sort = event.target.value;
            render();
        });
        themeToggle.addEventListener('click', function() {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    function init() {
        addOptions(topicFilter, uniqueValues('topic_primary'));
        addOptions(typeFilter, uniqueValues('content_type'));
        addOptions(priorityFilter, ['High', 'Medium', 'Low', 'Archive only']);
        addOptions(statusFilter, ['New', 'Reviewed', 'Saved to wiki', 'To read', 'To cite', 'To share', 'Ignore']);
        renderLegend();
        bindControls();
        render();
    }

    init();
})();
