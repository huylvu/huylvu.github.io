(function() {
    var data = window.AI_MIND_DATA || {};
    var modules = Array.isArray(data.modules) ? data.modules : [];
    var library = Array.isArray(data.library) ? data.library : [];
    var sources = Array.isArray(data.sources) ? data.sources : [];
    var importedSources = importXReposts();
    var importedLibrary = importXRepostLibrary();
    var allLibrary = library.map(normalizeLibraryRow).concat(importedLibrary);
    var allSources = sources.concat(importedSources);

    var state = {
        activeModule: modules.length ? modules[0].id : '',
        lang: localStorage.getItem('aiMindLang') || 'en',
        activeLibraryId: '',
        libraryQuery: '',
        stage: 'All',
        type: 'All',
        tool: 'All',
        librarySort: 'relevance-desc',
        libraryLimit: 10,
        sourceStatus: 'All'
    };

    var moduleList = document.getElementById('module-list');
    var moduleDetail = document.getElementById('module-detail');
    var principleList = document.getElementById('principle-list');
    var metrics = document.getElementById('metrics');
    var libraryList = document.getElementById('library-list');
    var librarySearch = document.getElementById('library-search');
    var stageFilter = document.getElementById('stage-filter');
    var typeFilter = document.getElementById('type-filter');
    var toolFilter = document.getElementById('tool-filter');
    var librarySort = document.getElementById('library-sort');
    var libraryCount = document.getElementById('library-count');
    var libraryInspector = document.getElementById('library-inspector');
    var sourceChips = document.getElementById('source-chips');
    var sourceList = document.getElementById('source-list');
    var libraryRandom = document.getElementById('library-random');
    var sourceCount = document.getElementById('source-count');
    var themeToggle = document.getElementById('theme-toggle');
    var partStrip = document.getElementById('part-strip');
    var scrollProgress = document.getElementById('scroll-progress');
    var langButtons = Array.prototype.slice.call(document.querySelectorAll('[data-lang]'));
    var easterToast = document.getElementById('easter-toast');
    var heroTitle = document.getElementById('hero-title');
    var mindMap = document.querySelector('.mind-map');
    var mapCore = document.querySelector('.map-core');
    var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    var manualAccessButtons = Array.prototype.slice.call(document.querySelectorAll('[data-manual-access]'));
    var manualAccessModal = document.getElementById('manual-access-modal');
    var manualCloseButtons = Array.prototype.slice.call(document.querySelectorAll('[data-manual-close]'));
    var manualLastTrigger = null;
    var keyBuffer = '';
    var coreClicks = 0;
    var stampPresses = 0;
    var pendingReveals = [];
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var copy = {
        en: {
            metrics: ['course parts', 'library records', 'source records', 'workflow stages', 'X reposts imported'],
            sourceVisible: ' visible of ',
            sources: ' sources',
            outcomes: 'Outcomes',
            exercise: 'Exercise',
            openPart: 'Open part',
            unlocked: 'Control mode unlocked. Ask better, verify harder.',
            overdriveOn: 'Overdrive engaged. The agents are orbiting faster — keep them on a leash.',
            overdriveOff: 'Overdrive disengaged. Back to careful, verifiable work.',
            archivist: 'Archivist badge unlocked. Ten stamps pressed — you read the fine print.',
            randomPull: 'Random pull from the stacks.',
            catalogCard: 'Catalog card',
            allStatuses: 'All',
            static: {
                '#hero-title': 'Control Your AI Mind',
                '.hero-subtitle': 'Agentic workflows for economists and research people.',
                '.hero-text': 'Learn to design, run, and verify AI agent workflows for economic research. Build agents that read, code, retrieve, analyze, and write under your control.',
                '.primary-action': 'Start with the map',
                '.secondary-action': 'Open library',
                '.manual-action': 'Read manual',
                '#manual-title': 'Thirteen part covers, one operating system for agentic research.',
                '#principles-title': 'Mindset first, tools second.',
                '#course-title': "A researcher's path from prompt user to agent controller.",
                '#labs-title': 'Real artifacts, <em>shipped</em> with agent workflows.',
                '#library-title': 'Patterns, templates, and tools <em>worth testing</em>.',
                '#sources-title': 'A working <em>backlog</em> for the course knowledge base.',
                '#library-random': 'Random pull',
                '#closing-title': 'Take back the controls.',
                '.closing-text': 'Thirteen parts, one manual, and a library that keeps growing. Start from the map, or read the full training manual first.',
                '.closing-actions .primary-action': 'Start with the map',
                '.closing-actions .manual-action': 'Read manual',
                '#manual-access-title': 'Manual access',
                '#manual-access-description': 'The complete manual is reserved for enrolled students. Course access is also available by bank transfer.',
                '#manual-price-label': 'Course access',
                '#manual-bank-label': 'Bank',
                '#manual-account-label': 'Account number',
                '#manual-holder-label': 'Account holder',
                '#manual-access-note': 'After transferring, send the payment confirmation to Huy to receive access.',
                '#manual-close-label': 'Close'
            }
        },
        vi: {
            metrics: ['phần học', 'mục thư viện', 'nguồn tư liệu', 'chặng workflow', 'repost X đã nhập'],
            sourceVisible: ' đang hiển thị trên ',
            sources: ' nguồn',
            outcomes: 'Kết quả học được',
            exercise: 'Bài thực hành',
            openPart: 'Mở phần này',
            unlocked: 'Đã mở Control mode. Hỏi sắc hơn, kiểm chứng kỹ hơn.',
            overdriveOn: 'Overdrive bật. Agent quay nhanh hơn — nhớ giữ dây cương.',
            overdriveOff: 'Overdrive tắt. Quay lại làm việc cẩn thận, kiểm chứng được.',
            archivist: 'Mở khóa huy hiệu Archivist. Mười con dấu — anh đọc kỹ thật.',
            randomPull: 'Rút ngẫu nhiên một phiếu từ kho.',
            catalogCard: 'Phiếu thư mục',
            allStatuses: 'Tất cả',
            static: {
                '#hero-title': 'Control Your AI Mind',
                '.hero-subtitle': 'Workflow AI agent cho economist và người làm research.',
                '.hero-text': 'Học cách thiết kế, chạy và kiểm chứng workflow AI agent cho nghiên cứu kinh tế. Xây agent biết đọc, code, truy xuất, phân tích và viết dưới quyền kiểm soát của mình.',
                '.primary-action': 'Bắt đầu từ bản đồ',
                '.secondary-action': 'Mở thư viện',
                '.manual-action': 'Đọc manual',
                '#manual-title': 'Mười ba bìa Part, một hệ điều hành cho agentic research.',
                '#principles-title': 'Mindset trước, tool sau.',
                '#course-title': 'Lộ trình từ người dùng prompt thành người điều khiển agent nghiên cứu.',
                '#labs-title': 'Artifact thật, <em>ship thật</em> bằng agent workflow.',
                '#library-title': 'Pattern, template và tool <em>đáng thử nghiệm</em>.',
                '#sources-title': 'Backlog <em>nguồn tư liệu</em> cho kho kiến thức khóa học.',
                '#library-random': 'Rút ngẫu nhiên',
                '#closing-title': 'Giành lại quyền điều khiển.',
                '.closing-text': 'Mười ba phần, một manual, và một thư viện vẫn đang lớn dần. Bắt đầu từ bản đồ, hoặc đọc trọn bộ training manual trước.',
                '.closing-actions .primary-action': 'Bắt đầu từ bản đồ',
                '.closing-actions .manual-action': 'Đọc manual',
                '#manual-access-title': 'Quyền truy cập manual',
                '#manual-access-description': 'Bản manual đầy đủ chỉ dành cho học viên tham gia khóa học. Anh cũng có thể đăng ký quyền truy cập bằng chuyển khoản.',
                '#manual-price-label': 'Phí tham gia khóa học',
                '#manual-bank-label': 'Ngân hàng',
                '#manual-account-label': 'Số tài khoản',
                '#manual-holder-label': 'Chủ tài khoản',
                '#manual-access-note': 'Sau khi chuyển khoản, gửi xác nhận thanh toán cho Huy để nhận quyền truy cập.',
                '#manual-close-label': 'Đóng'
            }
        }
    };

    function textOf(value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return value[state.lang] || value.en || value.vi || '';
        }
        return value || '';
    }

    function importXReposts() {
        var dataset = window.X_REPOSTS_DATA || {};
        var rows = Array.isArray(dataset.reposts) ? dataset.reposts : [];
        return filterRelevantXRows(rows).slice(0, 30).map(function(row) {
            return {
                title: compactText(row.post_text || row.original_post_url || 'X repost', 82),
                sourceType: 'X repost',
                status: row.status || 'New',
                credibility: row.credibility || 'Personal curation',
                stage: row.topic_primary || 'Sources',
                url: row.original_post_url || row.repost_url || '/other/x-reposts/',
                notes: [
                    row.author_handle ? '@' + row.author_handle : '',
                    row.topic_secondary || '',
                    row.content_type || ''
                ].filter(Boolean).join(' | ')
            };
        });
    }

    function importXRepostLibrary() {
        var dataset = window.X_REPOSTS_DATA || {};
        var rows = Array.isArray(dataset.reposts) ? dataset.reposts : [];
        return filterRelevantXRows(rows).slice(0, 105).map(function(row) {
            var engagement = numberValue(row.like_count) + numberValue(row.repost_count) * 2 + numberValue(row.reply_count) * 3;
            var tags = [row.topic_primary, row.topic_secondary, row.content_type, row.media_type, row.tags]
                .filter(Boolean)
                .join(';')
                .split(';')
                .map(function(tag) { return tag.trim(); })
                .filter(Boolean);
            return normalizeLibraryRow({
                id: 'x-' + (row.record_id || row.original_post_url || row.repost_url),
                title: compactText(row.post_text || row.original_post_url || 'X repost', 96),
                type: 'X repost',
                stage: row.topic_primary || 'Sources',
                tool: row.topic_secondary || 'X',
                audience: 'Curated repost readers',
                summary: row.post_text || 'Curated X repost.',
                url: row.original_post_url || row.repost_url || '/other/x-reposts/',
                sourceUrl: row.repost_url || '',
                sourceType: 'X repost',
                author: row.author_handle ? '@' + row.author_handle : row.author_name || 'Unknown author',
                date: row.original_created_at || row.reposted_at || '',
                status: row.status || 'New',
                credibility: row.credibility || 'Personal curation',
                relevance: row.research_relevance || 'Potential lead',
                mediaType: row.media_type || '',
                language: row.language || '',
                stats: {
                    likes: numberValue(row.like_count),
                    reposts: numberValue(row.repost_count),
                    replies: numberValue(row.reply_count),
                    views: numberValue(row.view_count),
                    engagement: engagement
                },
                tags: tags
            });
        });
    }

    function filterRelevantXRows(rows) {
        return rows.filter(function(row) {
            var blob = [
                row.topic_primary,
                row.topic_secondary,
                row.content_type,
                row.tags,
                row.post_text,
                row.urls
            ].join(' ').toLowerCase();
            return blob.indexOf('ai') !== -1 ||
                blob.indexOf('agent') !== -1 ||
                blob.indexOf('claude') !== -1 ||
                blob.indexOf('codex') !== -1 ||
                blob.indexOf('skill') !== -1 ||
                blob.indexOf('obsidian') !== -1 ||
                blob.indexOf('notebook') !== -1 ||
                blob.indexOf('mcp') !== -1;
        });
    }

    function normalizeLibraryRow(row, index) {
        var tags = Array.isArray(row.tags)
            ? row.tags
            : String(row.tags || '').split(/[;,]/).map(function(tag) { return tag.trim(); }).filter(Boolean);
        var stats = row.stats || {};
        return Object.assign({}, row, {
            id: row.id || 'seed-' + String(index || hashString(row.title || row.url || 'library')),
            sourceType: row.sourceType || row.type || 'Course source',
            author: row.author || row.audience || 'Course corpus',
            date: row.date || row.updated || row.generatedAt || '',
            status: row.status || 'Seeded',
            credibility: row.credibility || 'Course seed',
            relevance: row.relevance || row.audience || 'Course material',
            stats: Object.assign({
                likes: 0,
                reposts: 0,
                replies: 0,
                views: 0,
                engagement: 0
            }, stats),
            tags: tags
        });
    }

    function numberValue(value) {
        var parsed = Number(String(value || '').replace(/,/g, ''));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function dateValue(value) {
        var parsed = Date.parse(value || '');
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function formatDate(value) {
        var timestamp = dateValue(value);
        if (!timestamp) return 'No date';
        return new Date(timestamp).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function compactNumber(value) {
        var n = numberValue(value);
        if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
        return String(n);
    }

    function hashString(value) {
        var hash = 2166136261;
        String(value || '').split('').forEach(function(char) {
            hash ^= char.charCodeAt(0);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        });
        return hash >>> 0;
    }

    function compactText(value, maxLength) {
        var text = String(value || '').replace(/\s+/g, ' ').trim();
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength - 1).trim() + '...';
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function uniqueValues(rows, key) {
        var seen = {};
        rows.forEach(function(row) {
            var value = textOf(row[key]);
            if (value) seen[value] = true;
        });
        return Object.keys(seen).sort();
    }

    function fillSelect(select, values) {
        values.forEach(function(value) {
            var option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function renderMetrics() {
        var stages = uniqueValues(allLibrary.concat(modules), 'stage').length;
        var xCount = importedSources.length;
        var metricLabels = copy[state.lang].metrics;
        var items = [
            { value: modules.length, label: metricLabels[0] },
            { value: allLibrary.length, label: metricLabels[1] },
            { value: allSources.length, label: metricLabels[2] },
            { value: stages, label: metricLabels[3] },
            { value: xCount, label: metricLabels[4] }
        ];
        metrics.innerHTML = items.map(function(item) {
            return '<div class="metric"><strong data-count="' + item.value + '">' + (reducedMotion ? item.value : 0) + '</strong><span>' + item.label + '</span></div>';
        }).join('');
    }

    function renderPrinciples() {
        var principles = Array.isArray(data.principles) ? data.principles : [];
        principleList.innerHTML = principles.map(function(item, index) {
            return [
                '<article class="principle">',
                    '<span>' + String(index + 1).padStart(2, '0') + '</span>',
                    '<div>',
                        '<h3>' + escapeHtml(item.title) + '</h3>',
                        '<p>' + escapeHtml(item.text) + '</p>',
                    '</div>',
                '</article>'
            ].join('');
        }).join('');
    }

    function renderModules() {
        moduleList.innerHTML = modules.map(function(module, index) {
            var active = module.id === state.activeModule ? ' active' : '';
            return [
                '<li>',
                    '<button class="module-button' + active + '" type="button" data-module-id="' + escapeHtml(module.id) + '">',
                        '<span>' + String(index + 1).padStart(2, '0') + '</span>',
                        '<strong>' + escapeHtml(textOf(module.title)) + '</strong>',
                        '<em>' + escapeHtml(textOf(module.stage)) + '</em>',
                    '</button>',
                '</li>'
            ].join('');
        }).join('');

        var activeModule = modules.find(function(module) {
            return module.id === state.activeModule;
        }) || modules[0];

        if (!activeModule) {
            moduleDetail.innerHTML = '';
            return;
        }

        moduleDetail.innerHTML = [
            '<img class="detail-cover" src="' + escapeHtml(activeModule.image || '') + '" alt="">',
            '<p class="detail-stage">' + escapeHtml(textOf(activeModule.stage)) + '</p>',
            '<h3>' + escapeHtml(textOf(activeModule.title)) + '</h3>',
            '<p class="detail-promise">' + escapeHtml(textOf(activeModule.promise)) + '</p>',
            '<h4>' + copy[state.lang].outcomes + '</h4>',
            '<ul>',
                activeModule.outcomes.map(function(outcome) {
                    return '<li>' + escapeHtml(textOf(outcome)) + '</li>';
                }).join(''),
            '</ul>',
            '<h4>' + copy[state.lang].exercise + '</h4>',
            '<p>' + escapeHtml(textOf(activeModule.exercise)) + '</p>'
        ].join('');
    }

    function renderPartAtlas() {
        if (!partStrip) return;
        partStrip.innerHTML = modules.map(function(module, index) {
            return [
                '<article class="part-card" data-module-id="' + escapeHtml(module.id) + '">',
                    '<img src="' + escapeHtml(module.image || '') + '" alt="">',
                    '<div>',
                        '<span>Part ' + index + '</span>',
                        '<h3>' + escapeHtml(textOf(module.title)) + '</h3>',
                        '<p>' + escapeHtml(textOf(module.stage)) + '</p>',
                    '</div>',
                '</article>'
            ].join('');
        }).join('');
    }

    function libraryBlob(row) {
        return [
            row.title,
            row.type,
            row.stage,
            row.tool,
            row.audience,
            row.summary,
            row.author,
            row.sourceType,
            row.credibility,
            row.relevance,
            (row.tags || []).join(' ')
        ].join(' ').toLowerCase();
    }

    function filteredLibrary() {
        var query = state.libraryQuery.trim().toLowerCase();
        return allLibrary.filter(function(row) {
            if (state.stage !== 'All' && textOf(row.stage) !== state.stage) return false;
            if (state.type !== 'All' && row.type !== state.type) return false;
            if (state.tool !== 'All' && row.tool !== state.tool) return false;
            return !query || libraryBlob(row).indexOf(query) !== -1;
        }).sort(function(a, b) {
            if (state.librarySort === 'date-desc') return dateValue(b.date) - dateValue(a.date);
            if (state.librarySort === 'title-asc') return String(a.title).localeCompare(String(b.title));
            if (state.librarySort === 'engagement-desc') return (b.stats.engagement || 0) - (a.stats.engagement || 0);
            return libraryScore(b) - libraryScore(a) || dateValue(b.date) - dateValue(a.date);
        });
    }

    function libraryScore(row) {
        var stageBoost = ['X repost', 'Course series', 'Guide', 'GitHub repo', 'Workflow library'].indexOf(row.type) >= 0 ? 2 : 1;
        var engagement = Math.min(8, Math.log10((row.stats.engagement || 0) + 1));
        var seeded = row.sourceType === 'X repost' ? 0 : 3;
        return seeded + stageBoost + engagement;
    }

    function renderLibrary() {
        var rows = filteredLibrary();
        var active = ensureActiveLibrary(rows);
        var visibleRows = rows.slice(0, state.libraryLimit);
        if (libraryCount) {
            libraryCount.textContent = (state.lang === 'vi' ? 'Đang hiện ' : 'Showing ') + visibleRows.length + (state.lang === 'vi' ? ' trên ' : ' of ') + rows.length + (state.lang === 'vi' ? ' kết quả' : ' results');
        }
        if (!rows.length) {
            libraryList.innerHTML = '<p class="empty-state">No library records match these filters.</p>';
            renderLibraryInspector(null);
            return;
        }
        libraryList.innerHTML = visibleRows.map(function(row, index) {
            var activeClass = row.id === state.activeLibraryId ? ' active' : '';
            var delay = Math.min(index, 8) * 45;
            return [
                '<button class="library-row' + activeClass + '" type="button" data-library-id="' + escapeHtml(row.id) + '" style="animation-delay:' + delay + 'ms">',
                    '<span class="row-index">' + String(index + 1).padStart(2, '0') + '</span>',
                    '<span class="row-main">',
                        '<span class="row-meta">' + escapeHtml(textOf(row.stage)) + ' · ' + escapeHtml(row.type) + ' · ' + escapeHtml(formatDate(row.date)) + '</span>',
                        '<h3>' + escapeHtml(row.title) + '</h3>',
                        '<p>' + escapeHtml(row.summary) + '</p>',
                    '</span>',
                    '<span class="row-end">',
                        '<span class="row-tool">' + escapeHtml(row.tool) + '</span>',
                        '<span class="row-arrow" aria-hidden="true">&rarr;</span>',
                    '</span>',
                '</button>'
            ].join('');
        }).join('') + (visibleRows.length < rows.length
            ? '<button class="library-load-more" type="button" data-load-more="true">' + (state.lang === 'vi' ? 'Xem thêm ' : 'Show ') + Math.min(10, rows.length - visibleRows.length) + (state.lang === 'vi' ? ' mục' : ' more') + '</button>'
            : '');
        renderLibraryInspector(active);
    }

    function ensureActiveLibrary(rows) {
        if (!rows.length) {
            state.activeLibraryId = '';
            return null;
        }
        var active = rows.find(function(row) {
            return row.id === state.activeLibraryId;
        });
        if (!active) {
            active = rows[0];
            state.activeLibraryId = active.id;
        }
        return active;
    }

    function renderLibraryInspector(row) {
        if (!libraryInspector) return;
        if (!row) {
            libraryInspector.innerHTML = [
                '<div class="empty-inspector">',
                    '<p>No library item selected.</p>',
                    '<span>Use search or loosen filters.</span>',
                '</div>'
            ].join('');
            return;
        }
        var stats = row.stats || {};
        var link = row.url ? '<a class="detail-link" href="' + escapeHtml(row.url) + '" target="_blank" rel="noreferrer">Open source</a>' : '<span class="detail-link muted-link">No source link</span>';
        var repostLink = row.sourceUrl ? '<a class="detail-link" href="' + escapeHtml(row.sourceUrl) + '" target="_blank" rel="noreferrer">My repost</a>' : '';
        libraryInspector.innerHTML = [
            '<div class="catalog-card" key="' + escapeHtml(row.id) + '">',
                '<p class="card-rule"><span>' + escapeHtml(copy[state.lang].catalogCard) + '</span><span>' + escapeHtml(row.sourceType) + ' · ' + escapeHtml(formatDate(row.date)) + '</span></p>',
                '<h3>' + escapeHtml(row.title) + '</h3>',
                '<p class="detail-author">' + escapeHtml(row.author) + ' · ' + escapeHtml(row.credibility) + '</p>',
                '<p class="card-summary">' + escapeHtml(row.summary) + '</p>',
                '<div class="detail-links">' + link + repostLink + '</div>',
                '<dl class="card-stats">',
                    statCell('Views', compactNumber(stats.views)),
                    statCell('Likes', compactNumber(stats.likes)),
                    statCell('Reposts', compactNumber(stats.reposts)),
                    statCell('Replies', compactNumber(stats.replies)),
                '</dl>',
                '<h4>Why it matters</h4>',
                '<p>' + escapeHtml(row.relevance || row.audience || 'Course material') + '</p>',
                '<h4>How to use it</h4>',
                '<p>' + escapeHtml(row.type === 'X repost' ? 'Treat this as a lead. Open the original post, inspect the linked material, then decide whether it becomes a source, skill, case study, or archive item.' : 'Use this as a course source. Extract the workflow pattern, cite the original link, and convert reusable steps into skills or assignments.') + '</p>',
                '<div class="tag-row">' + (row.tags || []).slice(0, 10).map(function(tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
            '</div>'
        ].join('');
    }

    function statCell(label, value) {
        return '<div><dt>' + escapeHtml(label) + '</dt><dd>' + escapeHtml(value) + '</dd></div>';
    }

    function filteredSources() {
        return allSources.filter(function(row) {
            return state.sourceStatus === 'All' || row.status === state.sourceStatus;
        });
    }

    function stampKey(status) {
        var key = String(status || 'new').toLowerCase();
        if (key.indexOf('crawl') !== -1) return 'crawled';
        if (key.indexOf('seed') !== -1) return 'seeded';
        if (key.indexOf('candidate') !== -1) return 'candidate';
        if (key.indexOf('new') !== -1) return 'new';
        return 'other';
    }

    function renderSourceChips() {
        if (!sourceChips) return;
        var counts = {};
        allSources.forEach(function(row) {
            var status = row.status || 'New';
            counts[status] = (counts[status] || 0) + 1;
        });
        var statuses = Object.keys(counts).sort();
        var chips = ['<button class="source-chip' + (state.sourceStatus === 'All' ? ' active' : '') + '" type="button" data-status-filter="All">' + escapeHtml(copy[state.lang].allStatuses) + ' <i>' + allSources.length + '</i></button>'];
        statuses.forEach(function(status) {
            var active = state.sourceStatus === status ? ' active' : '';
            chips.push('<button class="source-chip' + active + '" type="button" data-status-filter="' + escapeHtml(status) + '">' + escapeHtml(status) + ' <i>' + counts[status] + '</i></button>');
        });
        sourceChips.innerHTML = chips.join('');
    }

    function renderSources() {
        var rows = filteredSources();
        sourceCount.textContent = rows.length + copy[state.lang].sourceVisible + allSources.length + copy[state.lang].sources;
        sourceList.innerHTML = rows.map(function(row, index) {
            var link = row.url ? '<a class="ledger-open" href="' + escapeHtml(row.url) + '" target="_blank" rel="noreferrer">Open &nearr;</a>' : '';
            var delay = Math.min(index, 8) * 45;
            return [
                '<article class="source-row" style="animation-delay:' + delay + 'ms">',
                    '<span class="ledger-no" aria-hidden="true">' + String(index + 1).padStart(3, '0') + '</span>',
                    '<div class="ledger-body">',
                        '<p class="source-meta">' + escapeHtml(row.sourceType) + ' / ' + escapeHtml(row.stage) + '</p>',
                        '<h3>' + escapeHtml(row.title) + '</h3>',
                        '<p>' + escapeHtml(row.notes) + '</p>',
                    '</div>',
                    '<div class="source-status">',
                        '<button class="stamp" type="button" data-stamp="' + stampKey(row.status) + '">' + escapeHtml(row.status) + '</button>',
                        '<small>' + escapeHtml(row.credibility) + '</small>',
                        link,
                    '</div>',
                '</article>'
            ].join('');
        }).join('');
    }

    function renderAll() {
        applyStaticCopy();
        renderMetrics();
        renderPrinciples();
        renderPartAtlas();
        renderModules();
        renderLibrary();
        renderSourceChips();
        renderSources();
        tagRevealTargets();
        observeRevealTargets();
        if (window.ScrollTrigger && ScrollTrigger.refresh) ScrollTrigger.refresh();
    }

    function applyStaticCopy() {
        var strings = copy[state.lang].static;
        Object.keys(strings).forEach(function(selector) {
            var node = document.querySelector(selector);
            if (!node) return;
            if (strings[selector].indexOf('<em>') !== -1) {
                node.innerHTML = strings[selector];
            } else {
                node.textContent = strings[selector];
            }
        });
        splitHeroTitle();
        langButtons.forEach(function(button) {
            button.classList.toggle('active', button.getAttribute('data-lang') === state.lang);
        });
        document.documentElement.setAttribute('lang', state.lang === 'vi' ? 'vi' : 'en');
    }

    function bindEvents() {
        manualAccessButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                if (!manualAccessModal) return;
                manualLastTrigger = button;
                manualAccessModal.classList.add('open');
                manualAccessModal.setAttribute('aria-hidden', 'false');
                document.body.classList.add('manual-modal-open');
                var closeButton = manualAccessModal.querySelector('.manual-access-close');
                if (closeButton) {
                    window.setTimeout(function() { closeButton.focus(); }, 0);
                }
            });
        });

        function closeManualAccess() {
            if (!manualAccessModal || !manualAccessModal.classList.contains('open')) return;
            manualAccessModal.classList.remove('open');
            manualAccessModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('manual-modal-open');
            if (manualLastTrigger) manualLastTrigger.focus();
        }

        manualCloseButtons.forEach(function(button) {
            button.addEventListener('click', closeManualAccess);
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') closeManualAccess();
        });

        moduleList.addEventListener('click', function(event) {
            var button = event.target.closest('[data-module-id]');
            if (!button) return;
            state.activeModule = button.getAttribute('data-module-id');
            renderModules();
        });

        librarySearch.addEventListener('input', function() {
            state.libraryQuery = librarySearch.value;
            state.libraryLimit = 10;
            renderLibrary();
        });

        stageFilter.addEventListener('change', function() {
            state.stage = stageFilter.value;
            state.libraryLimit = 10;
            renderLibrary();
        });

        typeFilter.addEventListener('change', function() {
            state.type = typeFilter.value;
            state.libraryLimit = 10;
            renderLibrary();
        });

        toolFilter.addEventListener('change', function() {
            state.tool = toolFilter.value;
            state.libraryLimit = 10;
            renderLibrary();
        });

        librarySort.addEventListener('change', function() {
            state.librarySort = librarySort.value;
            state.libraryLimit = 10;
            renderLibrary();
        });

        libraryList.addEventListener('click', function(event) {
            var loadMore = event.target.closest('[data-load-more]');
            if (loadMore) {
                state.libraryLimit += 10;
                renderLibrary();
                return;
            }
            var row = event.target.closest('[data-library-id]');
            if (!row) return;
            state.activeLibraryId = row.getAttribute('data-library-id');
            renderLibrary();
        });

        if (sourceChips) {
            sourceChips.addEventListener('click', function(event) {
                var chip = event.target.closest('[data-status-filter]');
                if (!chip) return;
                state.sourceStatus = chip.getAttribute('data-status-filter');
                renderSourceChips();
                renderSources();
            });
        }

        if (sourceList) {
            sourceList.addEventListener('click', function(event) {
                var stamp = event.target.closest('.stamp');
                if (!stamp) return;
                stamp.classList.remove('pressed');
                void stamp.offsetWidth;
                stamp.classList.add('pressed');
                stampPresses += 1;
                burst(event.clientX, event.clientY, 4);
                if (stampPresses === 10) {
                    burst(event.clientX, event.clientY, 26);
                    showToast(copy[state.lang].archivist);
                }
            });
        }

        if (libraryRandom) {
            libraryRandom.addEventListener('click', function(event) {
                var rows = filteredLibrary();
                if (!rows.length) return;
                var pick = rows[Math.floor(Math.random() * rows.length)];
                state.activeLibraryId = pick.id;
                var position = rows.indexOf(pick);
                if (position >= state.libraryLimit) state.libraryLimit = position + 1;
                renderLibrary();
                burst(event.clientX, event.clientY, 10);
                showToast(copy[state.lang].randomPull);
            });
        }

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

        langButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                state.lang = button.getAttribute('data-lang') || 'en';
                localStorage.setItem('aiMindLang', state.lang);
                renderAll();
            });
        });

        if (partStrip) {
            partStrip.addEventListener('click', function(event) {
                var card = event.target.closest('[data-module-id]');
                if (!card) return;
                state.activeModule = card.getAttribute('data-module-id');
                renderModules();
                document.getElementById('course').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        document.addEventListener('keydown', function(event) {
            if (event.target && /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) return;
            keyBuffer = (keyBuffer + event.key.toLowerCase()).slice(-8);
            if (keyBuffer.indexOf('mind') !== -1) {
                keyBuffer = '';
                unlockControlMode();
            }
        });

        if (mapCore) {
            mapCore.addEventListener('click', handleCoreClick);
        }
    }

    function updateScrollProgress() {
        var doc = document.documentElement;
        if (scrollProgress) {
            var total = doc.scrollHeight - window.innerHeight;
            var ratio = total > 0 ? doc.scrollTop / total : 0;
            scrollProgress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, ratio)) + ')';
        }
        updateParallax();
        updateScrollSpy();
        sweepPendingReveals();
    }

    function splitHeroTitle() {
        if (!heroTitle || reducedMotion) return;
        var words = String(heroTitle.textContent || '').trim().split(/\s+/);
        heroTitle.innerHTML = words.map(function(word, index) {
            return '<span class="word"><i style="--d:' + (index * 90) + 'ms">' + escapeHtml(word) + '</i></span>';
        }).join(' ');
    }

    function updateParallax() {
        if (!mindMap || reducedMotion || window.innerWidth <= 960) return;
        var drift = Math.min(window.scrollY, 900) * 0.045;
        mindMap.style.setProperty('--par', drift.toFixed(1) + 'px');
    }

    function updateScrollSpy() {
        if (!navAnchors.length) return;
        var current = '';
        ['course', 'library', 'sources'].forEach(function(id) {
            var section = document.getElementById(id);
            if (section && section.getBoundingClientRect().top < window.innerHeight * 0.4) {
                current = '#' + id;
            }
        });
        navAnchors.forEach(function(anchor) {
            anchor.classList.toggle('active', anchor.getAttribute('href') === current);
        });
        var homeLink = document.querySelector('.nav-links a[href="/other/ai-mind/"]');
        if (homeLink) homeLink.classList.toggle('active', !current);
    }

    function animateCount(node) {
        var target = numberValue(node.getAttribute('data-count'));
        if (!target || reducedMotion) {
            node.textContent = String(target);
            return;
        }
        var start = null;
        function tick(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min(1, (timestamp - start) / 900);
            var eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = String(Math.round(target * eased));
            if (progress < 1) window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
    }

    function burst(x, y, count) {
        if (reducedMotion) return;
        var colors = ['#C15F3C', '#D97757', '#4F7259', '#E3DACC'];
        for (var i = 0; i < count; i += 1) {
            var dot = document.createElement('span');
            var angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
            var distance = 50 + Math.random() * 90;
            dot.className = 'burst-dot';
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            dot.style.background = colors[i % colors.length];
            dot.style.setProperty('--bx', (Math.cos(angle) * distance).toFixed(0) + 'px');
            dot.style.setProperty('--by', (Math.sin(angle) * distance).toFixed(0) + 'px');
            document.body.appendChild(dot);
            window.setTimeout(function(node) {
                return function() { node.remove(); };
            }(dot), 900);
        }
    }

    function showToast(message) {
        if (!easterToast) return;
        easterToast.textContent = message;
        easterToast.classList.add('show');
        window.setTimeout(function() {
            easterToast.classList.remove('show');
        }, 3200);
    }

    function handleCoreClick(event) {
        coreClicks += 1;
        burst(event.clientX, event.clientY, 6);
        if (coreClicks % 7 !== 0) return;
        var engaged = document.documentElement.classList.toggle('overdrive');
        burst(event.clientX, event.clientY, 26);
        showToast(copy[state.lang][engaged ? 'overdriveOn' : 'overdriveOff']);
    }

    function unlockControlMode() {
        var engaged = document.documentElement.classList.toggle('control-mode');
        if (engaged) burst(window.innerWidth / 2, window.innerHeight / 2, 20);
        showToast(engaged ? copy[state.lang].unlocked : (state.lang === 'vi' ? 'Đã tắt Control mode.' : 'Control mode off.'));
    }

    function tagRevealTargets() {
        var staticTargets = document.querySelectorAll(
            '.section-head, .preview-head, .timeline-preview article, .library-preview-table, .mock-search, .closing-cta'
        );
        Array.prototype.forEach.call(staticTargets, function(node) {
            node.classList.add('reveal');
        });
    }

    function revealNode(node) {
        if (node.classList.contains('is-visible')) return;
        node.classList.add('is-visible');
        var counter = node.querySelector('[data-count]');
        if (counter && !counter.getAttribute('data-counted')) {
            counter.setAttribute('data-counted', '1');
            animateCount(counter);
        }
        window.setTimeout(function() {
            node.style.transitionDelay = '';
        }, 1200);
        var pendingIndex = pendingReveals.indexOf(node);
        if (pendingIndex !== -1) pendingReveals.splice(pendingIndex, 1);
    }

    function sweepPendingReveals() {
        if (!pendingReveals.length) return;
        var limit = window.innerHeight * 0.94;
        pendingReveals.slice().forEach(function(node) {
            if (node.getBoundingClientRect().top < limit) revealNode(node);
        });
    }

    function observeRevealTargets() {
        var targets = document.querySelectorAll('.metric, .principle, .part-card, .lab-card, .reveal');
        if (!('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(targets, function(node) { node.classList.add('is-visible'); });
            return;
        }
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                    revealNode(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        var siblingIndex = {};
        targets.forEach(function(target) {
            if (target.classList.contains('is-visible')) return;
            var parentKey = target.parentNode ? (target.parentNode.className || 'root') : 'root';
            siblingIndex[parentKey] = (siblingIndex[parentKey] || 0) + 1;
            target.style.transitionDelay = ((siblingIndex[parentKey] - 1) % 6) * 70 + 'ms';
            if (pendingReveals.indexOf(target) === -1) pendingReveals.push(target);
            observer.observe(target);
        });
        sweepPendingReveals();
    }

    fillSelect(stageFilter, uniqueValues(allLibrary, 'stage'));
    fillSelect(typeFilter, uniqueValues(allLibrary, 'type'));
    fillSelect(toolFilter, uniqueValues(allLibrary, 'tool'));
    function initGsapEffects() {
        if (!window.gsap || !window.ScrollTrigger) return;
        gsap.registerPlugin(ScrollTrigger);

        var mm = gsap.matchMedia();
        mm.add('(min-width: 961px) and (prefers-reduced-motion: no-preference)', function() {
            var atlas = document.querySelector('.part-atlas');
            if (!atlas || !partStrip) return;
            atlas.classList.add('gsap-horizontal');

            var distance = function() {
                return Math.max(0, partStrip.scrollWidth - atlas.clientWidth);
            };

            gsap.to(partStrip, {
                x: function() { return -distance(); },
                ease: 'none',
                scrollTrigger: {
                    trigger: atlas,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: function() { return '+=' + distance(); },
                    invalidateOnRefresh: true
                }
            });

            return function() {
                atlas.classList.remove('gsap-horizontal');
                gsap.set(partStrip, { clearProps: 'x' });
            };
        });

        window.addEventListener('load', function() {
            ScrollTrigger.refresh();
        });
    }

    bindEvents();
    renderAll();
    updateScrollProgress();
    initGsapEffects();

    if (window.console && console.log) {
        console.log('%cControl Your AI Mind', 'font-size:18px;font-weight:bold;color:#123c69;');
        console.log('Hidden controls: type "mind" anywhere, or click the AI core seven times.');
    }
})();
