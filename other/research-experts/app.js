(function() {
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var directory = window.EXPERT_DIRECTORY || { experts: [], fields: [], generatedAt: '' };
    var summaryLine = document.getElementById('expert-summary');
    var updatedLine = document.getElementById('expert-updated');
    var galaxyHint = document.getElementById('galaxy-hint');
    var galaxyMeta = document.getElementById('galaxy-meta');
    var heroStats = document.getElementById('hero-stats');
    var filterRoot = document.getElementById('field-filters');
    var resultRail = document.getElementById('result-rail');
    var detailRoot = document.getElementById('expert-detail');
    var themeToggle = document.getElementById('theme-toggle');
    var galaxyMap = document.getElementById('galaxy-map');
    var galaxyEmpty = document.getElementById('galaxy-empty');
    var detailOverlay = document.getElementById('detail-overlay');
    var narrowViewport = window.matchMedia('(max-width: 960px)');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    var state = {
        field: 'All',
        activeId: '',
        detailOpen: false,
        hoverId: ''
    };

    var scene = {
        width: 1000,
        height: 780,
        padX: 118,
        padY: 92,
        starById: {},
        visibleStars: [],
        rafId: 0
    };

    var fieldPalette = {
        'Development': '#f6bf68',
        'Econometrics': '#9fb8ff',
        'Education': '#e6d4ff',
        'Environment / Energy': '#7fd8b8',
        'Finance': '#ff9c80',
        'Health': '#8fd3ff',
        'Innovation / Productivity': '#ffd36f',
        'Labor': '#f3e6b2',
        'Macro': '#d6c4ff',
        'Mathematics': '#c8d3ff',
        'Organization / Personnel': '#ffc993',
        'Political Economy': '#ffb7b4',
        'Public Economics': '#f7dd8f',
        'Trade': '#c3e88d',
        'Urban / Spatial': '#95d2ff',
        'General': '#f2d2a0'
    };

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function hashString(value) {
        var hash = 2166136261;
        for (var index = 0; index < value.length; index += 1) {
            hash ^= value.charCodeAt(index);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return hash >>> 0;
    }

    function mulberry32(seed) {
        return function() {
            var t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function createSvgElement(tagName, attributes) {
        var element = document.createElementNS(SVG_NS, tagName);
        Object.keys(attributes || {}).forEach(function(key) {
            element.setAttribute(key, attributes[key]);
        });
        return element;
    }

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

    function compactText(value, maxLength) {
        if (!value) return '';
        if (value.length <= maxLength) return value;
        return value.slice(0, maxLength - 1).trim() + '…';
    }

    function getFieldColor(field) {
        return fieldPalette[field] || fieldPalette.General;
    }

    function buildStarModel(expert) {
        var seed = hashString(expert.id || expert.name || String(Math.random()));
        var random = mulberry32(seed);
        var armCount = 3;
        var armIndex = Math.floor(random() * armCount);
        var distance = 0.14 + Math.pow(random(), 0.76) * 0.92;
        var rotation = distance * 5.8 + armIndex * ((Math.PI * 2) / armCount) + (random() - 0.5) * 0.8;
        var anchorX = Math.cos(rotation) * distance * 0.94 + (random() - 0.5) * 0.12;
        var anchorY = Math.sin(rotation) * distance * 0.58 + (random() - 0.5) * 0.16;
        var paperCount = (expert.papers || []).length;
        var primaryField = (expert.fields || [])[0] || 'General';

        return {
            expert: expert,
            id: expert.id,
            name: expert.name,
            primaryField: primaryField,
            paperCount: paperCount,
            radius: clamp(4.8 + paperCount * 0.72, 4.8, 9.8),
            color: getFieldColor(primaryField),
            anchorX: anchorX,
            anchorY: anchorY,
            driftPhase: random() * Math.PI * 2,
            driftRadius: 1.8 + random() * 4.4,
            driftSpeed: 0.42 + random() * 0.52,
            layoutX: 0,
            layoutY: 0
        };
    }

    function prepareScene() {
        scene.starById = {};
        directory.experts.forEach(function(expert) {
            scene.starById[expert.id] = buildStarModel(expert);
        });
    }

    function getFilteredExperts() {
        return directory.experts.filter(function(expert) {
            return state.field === 'All' || (expert.fields || []).indexOf(state.field) !== -1;
        });
    }

    function ensureActiveExpert(filteredExperts) {
        if (!filteredExperts.length) {
            state.activeId = '';
            state.detailOpen = false;
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

    function selectExpert(id, shouldOpenDetail) {
        state.activeId = id;
        if (narrowViewport.matches && shouldOpenDetail) {
            state.detailOpen = true;
        }
        render();
    }

    function closeMobileDetail() {
        state.detailOpen = false;
        syncDetailVisibility();
    }

    function syncDetailVisibility() {
        var shouldShowMobileDetail = narrowViewport.matches && state.detailOpen && state.activeId;
        document.body.classList.toggle('detail-open', Boolean(shouldShowMobileDetail));
        detailOverlay.hidden = !shouldShowMobileDetail;
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

    function renderFilters() {
        var counts = { All: directory.experts.length };

        directory.experts.forEach(function(expert) {
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

    function renderMeta(filteredExperts) {
        summaryLine.textContent = filteredExperts.length + ' of ' + directory.experts.length + ' experts visible';
        updatedLine.textContent = 'Last refreshed ' + formatDate(directory.generatedAt);
        galaxyHint.textContent = state.field === 'All'
            ? 'Filter by field, then click a star or a result chip to open the profile.'
            : 'Filtered to ' + state.field + '.';
        galaxyMeta.textContent = filteredExperts.length + ' stars in view';
    }

    function renderResultRail(filteredExperts) {
        resultRail.innerHTML = '';

        filteredExperts.forEach(function(expert) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'result-chip' + (expert.id === state.activeId ? ' is-active' : '');
            button.addEventListener('click', function() {
                selectExpert(expert.id, true);
            });

            var name = document.createElement('strong');
            name.textContent = expert.name;
            button.appendChild(name);

            var meta = document.createElement('span');
            meta.textContent = compactText((expert.fields || []).slice(0, 2).join(' · ') || expert.department || 'Profile', 44);
            button.appendChild(meta);

            resultRail.appendChild(button);
        });
    }

    function layoutVisibleStars(filteredExperts) {
        var visibleStars = filteredExperts.map(function(expert) {
            return scene.starById[expert.id];
        });

        if (!visibleStars.length) {
            scene.visibleStars = [];
            return;
        }

        if (visibleStars.length === 1) {
            visibleStars[0].layoutX = scene.width / 2;
            visibleStars[0].layoutY = scene.height / 2;
            scene.visibleStars = visibleStars;
            return;
        }

        var minX = visibleStars[0].anchorX;
        var maxX = visibleStars[0].anchorX;
        var minY = visibleStars[0].anchorY;
        var maxY = visibleStars[0].anchorY;

        visibleStars.forEach(function(star) {
            minX = Math.min(minX, star.anchorX);
            maxX = Math.max(maxX, star.anchorX);
            minY = Math.min(minY, star.anchorY);
            maxY = Math.max(maxY, star.anchorY);
        });

        var midX = (minX + maxX) / 2;
        var midY = (minY + maxY) / 2;
        var rangeX = Math.max(maxX - minX, 0.22);
        var rangeY = Math.max(maxY - minY, 0.22);
        var scale = Math.min(
            (scene.width - scene.padX * 2) / rangeX,
            (scene.height - scene.padY * 2) / rangeY
        );

        scale = clamp(scale, 520, 1240);

        visibleStars.forEach(function(star) {
            star.layoutX = scene.width / 2 + (star.anchorX - midX) * scale;
            star.layoutY = scene.height / 2 + (star.anchorY - midY) * scale;
        });

        scene.visibleStars = visibleStars;
    }

    function renderScene(filteredExperts, activeExpert) {
        galaxyMap.innerHTML = '';
        layoutVisibleStars(filteredExperts);
        galaxyEmpty.hidden = filteredExperts.length !== 0;

        if (!filteredExperts.length) {
            return;
        }

        var backgroundGroup = createSvgElement('g');
        backgroundGroup.appendChild(createSvgElement('circle', {
            cx: scene.width / 2,
            cy: scene.height / 2,
            r: 92,
            fill: 'rgba(255, 222, 168, 0.13)'
        }));
        backgroundGroup.appendChild(createSvgElement('circle', {
            cx: scene.width / 2,
            cy: scene.height / 2,
            r: 170,
            fill: 'rgba(255, 244, 216, 0.05)'
        }));
        galaxyMap.appendChild(backgroundGroup);

        var starsGroup = createSvgElement('g');
        scene.visibleStars
            .slice()
            .sort(function(left, right) { return left.radius - right.radius; })
            .forEach(function(star) {
                var expert = star.expert;
                var starGroup = createSvgElement('g', {
                    class: 'star-node' +
                        (expert.id === state.activeId ? ' is-active' : '') +
                        (expert.id === state.hoverId ? ' is-hovered' : ''),
                    tabindex: '0',
                    role: 'button',
                    'aria-label': 'Open profile for ' + expert.name
                });

                var halo = createSvgElement('circle', {
                    class: 'star-halo',
                    cx: '0',
                    cy: '0',
                    r: String(star.radius * 3.4),
                    fill: star.color
                });

                var core = createSvgElement('circle', {
                    class: 'star-core',
                    cx: '0',
                    cy: '0',
                    r: String(star.radius),
                    fill: star.color
                });

                starGroup.appendChild(halo);
                starGroup.appendChild(core);

                if (expert.id === state.activeId) {
                    starGroup.appendChild(createSvgElement('circle', {
                        cx: '0',
                        cy: '0',
                        r: String(star.radius * 1.95),
                        fill: 'none',
                        stroke: star.color,
                        'stroke-width': '1.6',
                        'stroke-opacity': '0.9'
                    }));
                }

                var nameLabel = createSvgElement('text', {
                    class: expert.id === state.activeId ? 'star-label star-label-active' : 'star-label star-label-small',
                    x: String(star.radius + 10),
                    y: String(expert.id === state.activeId ? -star.radius - 8 : -star.radius - 3)
                });
                nameLabel.textContent = expert.name;
                starGroup.appendChild(nameLabel);

                if (expert.id === state.activeId) {
                    starGroup.appendChild(createSvgElement('text', {
                        class: 'star-count-label',
                        x: String(star.radius + 16),
                        y: String(star.radius + 18)
                    })).textContent = ((expert.papers || []).length || 0) + ' papers';
                }

                starGroup.addEventListener('mouseenter', function() {
                    state.hoverId = expert.id;
                    starGroup.classList.add('is-hovered');
                });
                starGroup.addEventListener('mouseleave', function() {
                    if (state.hoverId === expert.id) {
                        state.hoverId = '';
                    }
                    starGroup.classList.remove('is-hovered');
                });
                starGroup.addEventListener('click', function() {
                    selectExpert(expert.id, true);
                });
                starGroup.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectExpert(expert.id, true);
                    }
                });

                star.group = starGroup;
                starsGroup.appendChild(starGroup);
            });

        galaxyMap.appendChild(starsGroup);

        var stageCopy = createSvgElement('text', {
            class: 'stage-copy',
            x: '34',
            y: String(scene.height - 34)
        });
        stageCopy.textContent = filteredExperts.length + ' visible stars in a shared galaxy';
        galaxyMap.appendChild(stageCopy);

        applyStarPositions(performance.now());
        startSceneAnimation();
    }

    function applyStarPositions(time) {
        scene.visibleStars.forEach(function(star) {
            if (!star.group) return;

            var driftX = 0;
            var driftY = 0;

            if (!reducedMotion.matches) {
                driftX = Math.cos(time * 0.00017 * star.driftSpeed + star.driftPhase) * star.driftRadius;
                driftY = Math.sin(time * 0.00013 * star.driftSpeed + star.driftPhase * 1.23) * star.driftRadius * 0.86;
            }

            star.group.setAttribute(
                'transform',
                'translate(' + (star.layoutX + driftX).toFixed(2) + ' ' + (star.layoutY + driftY).toFixed(2) + ')'
            );
        });
    }

    function startSceneAnimation() {
        if (scene.rafId || reducedMotion.matches) return;

        var step = function(time) {
            applyStarPositions(time);
            scene.rafId = window.requestAnimationFrame(step);
        };

        scene.rafId = window.requestAnimationFrame(step);
    }

    function stopSceneAnimation() {
        if (!scene.rafId) return;
        window.cancelAnimationFrame(scene.rafId);
        scene.rafId = 0;
    }

    function buildDetailSection(labelText, valueText) {
        var block = document.createElement('section');
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
            var empty = document.createElement('div');
            empty.className = 'empty-detail';

            var line1 = document.createElement('p');
            line1.textContent = 'Select a star to open the profile view.';
            empty.appendChild(line1);

            var line2 = document.createElement('p');
            line2.className = 'empty-note';
            line2.textContent = 'Pick a field if you want a quieter sky.';
            empty.appendChild(line2);

            detailRoot.appendChild(empty);
            syncDetailVisibility();
            return;
        }

        var header = document.createElement('header');
        header.className = 'detail-header';

        var top = document.createElement('div');
        top.className = 'detail-header-top';

        var titleWrap = document.createElement('div');

        var eyebrow = document.createElement('p');
        eyebrow.className = 'detail-eyebrow';
        eyebrow.textContent = 'Selected profile';
        titleWrap.appendChild(eyebrow);

        var title = document.createElement('h2');
        title.textContent = activeExpert.name;
        titleWrap.appendChild(title);

        top.appendChild(titleWrap);

        var closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'close-detail';
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', closeMobileDetail);
        top.appendChild(closeButton);

        header.appendChild(top);

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
            var emptyPaper = document.createElement('p');
            emptyPaper.className = 'detail-copy';
            emptyPaper.textContent = 'No clean title was detected automatically. Open the official page to browse current work.';
            paperBlock.appendChild(emptyPaper);
        }

        detailRoot.appendChild(paperBlock);
        syncDetailVisibility();
    }

    function render() {
        var filteredExperts = getFilteredExperts();
        var activeExpert = ensureActiveExpert(filteredExperts);

        renderMeta(filteredExperts);
        renderFilters();
        renderResultRail(filteredExperts);
        renderScene(filteredExperts, activeExpert);
        renderDetail(activeExpert);
    }

    function initDirectory() {
        directory.experts = (directory.experts || []).slice().sort(function(left, right) {
            return left.name.localeCompare(right.name);
        });
        directory.fields = (directory.fields || []).slice().sort(function(left, right) {
            return left.localeCompare(right);
        });
        state.activeId = directory.experts.length ? directory.experts[0].id : '';
    }

    function bindEvents() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && narrowViewport.matches) {
                closeMobileDetail();
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

        if (detailOverlay) {
            detailOverlay.addEventListener('click', closeMobileDetail);
        }

        narrowViewport.addEventListener('change', function(event) {
            if (!event.matches) {
                state.detailOpen = false;
            }
            syncDetailVisibility();
        });

        reducedMotion.addEventListener('change', function(event) {
            if (event.matches) {
                stopSceneAnimation();
                applyStarPositions(performance.now());
            } else {
                startSceneAnimation();
            }
        });
    }

    function init() {
        initDirectory();
        prepareScene();
        renderStats();
        render();
        setThemeButtonLabel();
        bindEvents();
        syncDetailVisibility();
    }

    init();
})();
