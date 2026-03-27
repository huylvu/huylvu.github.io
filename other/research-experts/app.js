(function() {
    var directory = window.EXPERT_DIRECTORY || { experts: [], fields: [], generatedAt: '' };
    var searchInput = document.getElementById('expert-search');
    var summaryLine = document.getElementById('expert-summary');
    var updatedLine = document.getElementById('expert-updated');
    var heroStats = document.getElementById('hero-stats');
    var filterRoot = document.getElementById('field-filters');
    var listRoot = document.getElementById('expert-list');
    var detailRoot = document.getElementById('expert-detail');
    var themeToggle = document.getElementById('theme-toggle');
    var emptyStateTemplate = document.getElementById('empty-state-template');

    var state = {
        query: '',
        field: 'All',
        activeId: ''
    };

    function setThemeButtonLabel() {
        if (!themeToggle) return;
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.textContent = isDark ? 'Light' : 'Dark';
    }

    function formatDate(value) {
        if (!value) return 'Unknown update time';
        var date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'Unknown update time';
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function searchableBlob(expert) {
        return [
            expert.name || '',
            expert.affiliation || '',
            expert.department || '',
            expert.summary || '',
            (expert.fields || []).join(' '),
            (expert.papers || []).map(function(paper) { return paper.title; }).join(' ')
        ].join(' ').toLowerCase();
    }

    function matchesQuery(expert, query) {
        return !query || searchableBlob(expert).indexOf(query) !== -1;
    }

    function compactText(value, maxLength) {
        if (!value) return '';
        if (value.length <= maxLength) return value;
        return value.slice(0, maxLength - 1).trim() + '…';
    }

    function getFilteredExperts() {
        var query = state.query.trim().toLowerCase();
        return directory.experts.filter(function(expert) {
            var matchesField = state.field === 'All' || (expert.fields || []).indexOf(state.field) !== -1;
            return matchesField && matchesQuery(expert, query);
        });
    }

    function ensureActiveExpert(filteredExperts) {
        if (!filteredExperts.length) {
            state.activeId = '';
            return null;
        }

        var active = filteredExperts.find(function(expert) {
            return expert.id === state.activeId;
        });

        if (!active) {
            active = filteredExperts[0];
            state.activeId = active.id;
        }

        return active;
    }

    function renderStats() {
        var departments = {};
        directory.experts.forEach(function(expert) {
            if (expert.department) {
                departments[expert.department] = true;
            }
        });

        var stats = [
            { label: 'Experts', value: String(directory.experts.length) },
            { label: 'Fields', value: String((directory.fields || []).length) },
            { label: 'Departments', value: String(Object.keys(departments).length) }
        ];

        heroStats.innerHTML = '';
        stats.forEach(function(stat) {
            var item = document.createElement('div');
            item.className = 'stat';

            var value = document.createElement('strong');
            value.textContent = stat.value;
            item.appendChild(value);

            var label = document.createElement('span');
            label.textContent = stat.label;
            item.appendChild(label);

            heroStats.appendChild(item);
        });
    }

    function renderFilters(filteredExperts) {
        var query = state.query.trim().toLowerCase();
        var queryMatches = directory.experts.filter(function(expert) {
            return matchesQuery(expert, query);
        });
        var counts = { All: queryMatches.length };
        queryMatches.forEach(function(expert) {
            (expert.fields || []).forEach(function(field) {
                counts[field] = (counts[field] || 0) + 1;
            });
        });

        filterRoot.innerHTML = '';
        ['All'].concat(directory.fields || []).forEach(function(field) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'filter-chip' + (state.field === field ? ' is-active' : '');
            button.textContent = field + ' (' + (counts[field] || 0) + ')';
            button.addEventListener('click', function() {
                state.field = field;
                render();
            });
            filterRoot.appendChild(button);
        });
    }

    function renderList(filteredExperts) {
        listRoot.innerHTML = '';

        if (!filteredExperts.length) {
            listRoot.appendChild(emptyStateTemplate.content.cloneNode(true));
            return;
        }

        filteredExperts.forEach(function(expert) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'expert-row' + (expert.id === state.activeId ? ' is-active' : '');
            button.addEventListener('click', function() {
                state.activeId = expert.id;
                render();
            });

            var top = document.createElement('div');
            top.className = 'expert-row-top';

            var name = document.createElement('strong');
            name.className = 'expert-name';
            name.textContent = expert.name;
            top.appendChild(name);

            var status = document.createElement('span');
            status.className = 'expert-status expert-status-' + (expert.status || 'ok');
            status.textContent = expert.status === 'manual' ? 'manual' : 'live';
            top.appendChild(status);

            button.appendChild(top);

            var dept = document.createElement('p');
            dept.className = 'expert-dept';
            dept.textContent = compactText(expert.department || expert.affiliation || 'Department unavailable', 110);
            button.appendChild(dept);

            var chips = document.createElement('div');
            chips.className = 'expert-chip-row';
            (expert.fields || []).slice(0, 3).forEach(function(field) {
                var chip = document.createElement('span');
                chip.className = 'inline-chip';
                chip.textContent = field;
                chips.appendChild(chip);
            });
            button.appendChild(chips);

            var note = document.createElement('p');
            note.className = 'expert-note';
            note.textContent = (expert.papers || []).length
                ? (expert.papers || []).length + ' selected titles'
                : 'Open official site for current work';
            button.appendChild(note);

            listRoot.appendChild(button);
        });
    }

    function buildDetailSection(labelText, valueText) {
        var block = document.createElement('div');
        block.className = 'detail-block';

        var label = document.createElement('p');
        label.className = 'detail-label';
        label.textContent = labelText;
        block.appendChild(label);

        var value = document.createElement('p');
        value.className = 'detail-copy';
        value.textContent = valueText || 'Not available yet';
        block.appendChild(value);

        return block;
    }

    function renderDetail(activeExpert) {
        detailRoot.innerHTML = '';

        if (!activeExpert) {
            detailRoot.appendChild(emptyStateTemplate.content.cloneNode(true));
            return;
        }

        var header = document.createElement('header');
        header.className = 'detail-header';

        var eyebrow = document.createElement('p');
        eyebrow.className = 'detail-eyebrow';
        eyebrow.textContent = 'Selected profile';
        header.appendChild(eyebrow);

        var title = document.createElement('h2');
        title.textContent = activeExpert.name;
        header.appendChild(title);

        var summary = document.createElement('p');
        summary.className = 'detail-summary';
        summary.textContent = activeExpert.summary || activeExpert.affiliation || activeExpert.department;
        header.appendChild(summary);

        var link = document.createElement('a');
        link.className = 'detail-link';
        link.href = activeExpert.officialSite;
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.textContent = 'Open official page';
        header.appendChild(link);

        detailRoot.appendChild(header);

        var fieldRow = document.createElement('div');
        fieldRow.className = 'detail-chip-row';
        (activeExpert.fields || []).forEach(function(field) {
            var chip = document.createElement('span');
            chip.className = 'detail-chip';
            chip.textContent = field;
            fieldRow.appendChild(chip);
        });
        detailRoot.appendChild(fieldRow);

        detailRoot.appendChild(buildDetailSection('Affiliation', activeExpert.affiliation));
        detailRoot.appendChild(buildDetailSection('Department', activeExpert.department));

        var paperBlock = document.createElement('section');
        paperBlock.className = 'detail-block';

        var paperLabel = document.createElement('p');
        paperLabel.className = 'detail-label';
        paperLabel.textContent = 'Selected work';
        paperBlock.appendChild(paperLabel);

        if ((activeExpert.papers || []).length) {
            var paperList = document.createElement('ul');
            paperList.className = 'paper-list';

            activeExpert.papers.forEach(function(paper) {
                var item = document.createElement('li');
                item.className = 'paper-item';

                var paperLink = document.createElement('a');
                paperLink.href = paper.url || activeExpert.officialSite;
                paperLink.target = '_blank';
                paperLink.rel = 'noreferrer';
                paperLink.textContent = paper.title;
                item.appendChild(paperLink);

                paperList.appendChild(item);
            });

            paperBlock.appendChild(paperList);
        } else {
            var empty = document.createElement('p');
            empty.className = 'detail-copy';
            empty.textContent = 'No clean title was detected automatically. Open the official page to browse current work.';
            paperBlock.appendChild(empty);
        }

        detailRoot.appendChild(paperBlock);
    }

    function renderMeta(filteredExperts) {
        summaryLine.textContent = filteredExperts.length + ' of ' + directory.experts.length + ' experts visible';
        updatedLine.textContent = 'Last refreshed ' + formatDate(directory.generatedAt);
    }

    function render() {
        var filteredExperts = getFilteredExperts();
        var activeExpert = ensureActiveExpert(filteredExperts);

        renderMeta(filteredExperts);
        renderFilters(filteredExperts);
        renderList(filteredExperts);
        renderDetail(activeExpert);
    }

    function init() {
        directory.experts = (directory.experts || []).slice().sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
        directory.fields = (directory.fields || []).slice().sort(function(a, b) {
            return a.localeCompare(b);
        });
        state.activeId = directory.experts.length ? directory.experts[0].id : '';

        renderStats();
        render();
        setThemeButtonLabel();

        if (searchInput) {
            searchInput.addEventListener('input', function(event) {
                state.query = event.target.value || '';
                render();
            });
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === '/' && document.activeElement !== searchInput) {
                event.preventDefault();
                searchInput.focus();
            }
        });

        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
                setThemeButtonLabel();
            });
        }
    }

    init();
})();
