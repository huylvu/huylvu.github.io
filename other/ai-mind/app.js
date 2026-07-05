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
        lang: localStorage.getItem('aiMindLang') || 'vi',
        activeLibraryId: '',
        libraryQuery: '',
        topic: 'All',
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
    var topicChips = document.getElementById('topic-chips');
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
    var mainContent = document.querySelector('.mind-shell');
    var manualCloseButtons = Array.prototype.slice.call(document.querySelectorAll('[data-manual-close]'));
    var formPlaceholderLinks = Array.prototype.slice.call(document.querySelectorAll('[data-form-placeholder]'));
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
            formPending: 'Registration form link will be added here soon.',
            static: {
                '#hero-title': 'Control Your AI Mind',
                '.hero-subtitle': 'Agentic workflows for economists and research people.',
                '.hero-text': 'Learn to design, run, and verify AI agent workflows for economic research. Build agents that read, code, retrieve, analyze, and write under your control.',
                '.primary-action': 'Start with the map',
                '.secondary-action': 'Open library',
                '.manual-action': 'Course options',
                '#manual-title': 'Thirteen part covers, one operating system for agentic research.',
                '#principles-title': 'Mindset first, tools second.',
                '#course-title': "A researcher's path from prompt user to agent controller.",
                '#labs-title': 'Real artifacts, <em>shipped</em> with agent workflows.',
                '#library-title': 'Patterns, templates, and tools <em>worth testing</em>.',
                '#sources-title': 'A working <em>backlog</em> for the course knowledge base.',
                '#library-random': 'Random pull',
                '#closing-title': 'Take back the controls.',
                '.closing-text': 'Thirteen parts, one workflow map, and a library that keeps growing. Start from the map, or choose the support level that matches your work.',
                '#closing-enroll': 'Enroll the course',
                '#closing-manual': 'Course options',
                '#closing-map': 'Start with the map',
                '#manual-access-title': 'Enroll the course',
                '#manual-access-description': 'Choose the level of support that matches the problem you need to solve. Registration will go through a short form.',
                '#manual-plan-basic-label': 'Self-paced',
                '#manual-plan-basic-price': '500k',
                '#manual-plan-basic-title': 'Self-paced setup',
                '#manual-plan-basic-copy': 'Follow the course path and setup guidance at your own pace.',
                '#manual-plan-guided-label': 'Guided',
                '#manual-plan-guided-price': '1000k',
                '#manual-plan-guided-title': 'Guide + direct call',
                '#manual-plan-guided-copy': 'Get practical guidance and one live call to walk through your setup.',
                '#manual-plan-training-label': 'Tailored',
                '#manual-plan-training-price': '2000k',
                '#manual-plan-training-title': 'Problem-focused training',
                '#manual-plan-training-copy': 'Train around the specific issue you face, using your current knowledge, constraints, and workflow gaps.',
                '#manual-access-note': 'The registration form link will be added here. It should ask which plan you choose, what problem you are facing, your current context, and your contact email so Huy can follow up via huymaeco@gmail.com.',
                '#manual-form-label': 'Open registration form'
            }
        },
        vi: {
            metrics: ['phần học', 'mục thư viện', 'nguồn tư liệu', 'chặng quy trình', 'bài đăng X đã nhập'],
            sourceVisible: ' đang hiển thị trên ',
            sources: ' nguồn',
            outcomes: 'Kết quả học được',
            exercise: 'Bài thực hành',
            openPart: 'Mở phần này',
            unlocked: 'Đã mở chế độ kiểm soát. Hỏi sắc hơn, kiểm chứng kỹ hơn.',
            overdriveOn: 'Đã bật chế độ tăng tốc. Các tác nhân AI quay nhanh hơn — nhớ giữ quyền kiểm soát.',
            overdriveOff: 'Đã tắt chế độ tăng tốc. Quay lại làm việc cẩn thận, kiểm chứng được.',
            archivist: 'Đã mở khóa huy hiệu Lưu trữ. Mười con dấu — bạn đọc kỹ thật.',
            randomPull: 'Rút ngẫu nhiên một phiếu từ kho.',
            catalogCard: 'Phiếu thư mục',
            allStatuses: 'Tất cả',
            formPending: 'Link form đăng ký sẽ được gắn ở đây sau.',
            static: {
                '#hero-title': 'Control Your AI Mind',
                '.hero-subtitle': 'Quy trình tác nhân AI cho nhà kinh tế và người làm nghiên cứu.',
                '.hero-text': 'Học cách thiết kế, vận hành và kiểm chứng quy trình tác nhân AI cho nghiên cứu kinh tế. Xây tác nhân biết đọc, lập trình, truy xuất, phân tích và viết dưới quyền kiểm soát của mình.',
                '.primary-action': 'Bắt đầu từ bản đồ',
                '.secondary-action': 'Mở thư viện',
                '.manual-action': 'Xem gói học',
                '#manual-title': 'Mười ba phần, một hệ điều hành cho nghiên cứu với tác nhân AI.',
                '#principles-title': 'Tư duy trước, công cụ sau.',
                '#course-title': 'Lộ trình từ người viết yêu cầu thành người điều khiển tác nhân nghiên cứu.',
                '#labs-title': 'Sản phẩm thật, <em>được hoàn thiện</em> bằng quy trình tác nhân AI.',
                '#library-title': 'Mẫu, khuôn và công cụ <em>đáng thử nghiệm</em>.',
                '#sources-title': 'Danh sách chờ <em>nguồn tư liệu</em> cho kho kiến thức khóa học.',
                '#library-random': 'Rút ngẫu nhiên',
                '#closing-title': 'Giành lại quyền điều khiển.',
                '.closing-text': 'Mười ba phần, một bản đồ workflow và một thư viện vẫn đang lớn dần. Bắt đầu từ bản đồ hoặc chọn mức hỗ trợ phù hợp với việc của bạn.',
                '#closing-enroll': 'Đăng ký khoá học',
                '#closing-manual': 'Xem gói học',
                '#closing-map': 'Bắt đầu từ bản đồ',
                '#manual-access-title': 'Đăng ký khoá học',
                '#manual-access-description': 'Chọn mức hỗ trợ phù hợp với vấn đề bạn đang cần xử lý. Đăng ký sẽ đi qua một form ngắn.',
                '#manual-plan-basic-label': 'Tự học',
                '#manual-plan-basic-price': '500k',
                '#manual-plan-basic-title': 'Tự học theo lộ trình',
                '#manual-plan-basic-copy': 'Đi theo lộ trình khoá học và tự làm theo hướng dẫn cài đặt, vận hành, kiểm chứng.',
                '#manual-plan-guided-label': 'Có người kèm',
                '#manual-plan-guided-price': '1000k',
                '#manual-plan-guided-title': 'Guide + call trực tiếp',
                '#manual-plan-guided-copy': 'Có hướng dẫn thực hành và một buổi call trực tiếp để đi qua setup của bạn.',
                '#manual-plan-training-label': 'Theo vấn đề',
                '#manual-plan-training-price': '2000k',
                '#manual-plan-training-title': 'Training theo vấn đề thật',
                '#manual-plan-training-copy': 'Training đúng vấn đề bạn đang gặp, dựa trên kiến thức sẵn có, ràng buộc và điểm nghẽn trong workflow hiện tại.',
                '#manual-access-note': 'Link Google Form sẽ được gắn ở đây sau. Form cần hỏi: chọn gói nào, đang gặp vấn đề gì, bối cảnh/kiến thức hiện tại, và email liên hệ để Huy phản hồi qua huymaeco@gmail.com.',
                '#manual-form-label': 'Điền form đăng ký'
            }
        }
    };

    var staticText = {
        'Intro': 'Giới thiệu', 'Home': 'Trang chủ', 'Course': 'Khoá học', 'Library': 'Thư viện', 'Studio': 'Mô phỏng', 'Theme': 'Giao diện',
        'curated by': 'biên soạn bởi', 'Agentic workflows for economists and research people.': 'Quy trình tác nhân AI cho nhà kinh tế và người làm nghiên cứu.',
        'For economists, researchers, and policy minds': 'Dành cho nhà kinh tế, nhà nghiên cứu và người làm chính sách',
        'Applied economists': 'Nhà kinh tế ứng dụng', 'Research assistants': 'Trợ lý nghiên cứu', 'PhD applicants': 'Ứng viên tiến sĩ', 'Policy researchers': 'Nhà nghiên cứu chính sách',
        'Context': 'Ngữ cảnh', 'Define the problem': 'Xác định vấn đề', 'Gather background': 'Thu thập bối cảnh', 'Set constraints': 'Đặt ràng buộc',
        'Memory': 'Trí nhớ', 'Store & retrieve': 'Lưu và truy xuất', 'Version knowledge': 'Quản lý phiên bản tri thức', 'Long-term recall': 'Ghi nhớ dài hạn',
        'Verification': 'Kiểm chứng', 'Check results': 'Kiểm tra kết quả', 'Robustness tests': 'Kiểm tra độ vững', 'Reproducibility': 'Khả năng tái lập',
        'Research': 'Nghiên cứu', 'Explore & analyze': 'Khám phá và phân tích', 'Write & visualize': 'Viết và trực quan hoá', 'Publish & iterate': 'Công bố và cải tiến',
        'Tools': 'Công cụ', 'Code & compute': 'Lập trình và tính toán', 'Data access': 'Truy cập dữ liệu', 'External APIs': 'API bên ngoài',
        'Skills': 'Kỹ năng', 'Methods & models': 'Phương pháp và mô hình', 'Prompting patterns': 'Mẫu giao việc', 'Evaluation skills': 'Kỹ năng đánh giá',
        'Context engineering': 'Thiết kế ngữ cảnh', 'Agent contracts': 'Bản giao việc cho tác nhân AI', 'Wiki memory': 'Trí nhớ wiki', 'Skills as workflows': 'Kỹ năng dưới dạng quy trình',
        'O-ring verification': 'Kiểm chứng theo chuỗi O-ring', 'Source to dataset': 'Từ nguồn đến bộ dữ liệu', "Delegate, don't abdicate": 'Giao việc nhưng không buông trách nhiệm',
        'Course map': 'Bản đồ khoá học', 'A step-by-step path from foundations to research impact.': 'Lộ trình từng bước từ nền tảng đến tác động nghiên cứu.', 'View full course': 'Xem toàn bộ khoá học',
        'Control': 'Kiểm soát', 'Delegate work without outsourcing understanding.': 'Giao việc nhưng không giao mất hiểu biết.', 'Setup': 'Cài đặt', 'Instructions, permissions, sandboxes, and logs.': 'Chỉ dẫn, quyền truy cập, vùng cách ly và nhật ký.',
        'Contracts': 'Bản giao việc', 'Turn research requests into checkable tasks.': 'Biến yêu cầu nghiên cứu thành đầu việc có thể kiểm tra.', 'Data': 'Dữ liệu', 'Move from source to figure to structured database.': 'Đi từ nguồn tới biểu đồ và cơ sở dữ liệu có cấu trúc.',
        'Writing': 'Viết', 'Use AI to clarify claims, not hide weak evidence.': 'Dùng AI để làm rõ luận điểm, không che giấu bằng chứng yếu.', 'Build O-ring checks before publishing outputs.': 'Dựng chuỗi kiểm tra O-ring trước khi công bố kết quả.',
        'Search lessons, guides, templates, and datasets.': 'Tìm bài học, hướng dẫn, khuôn mẫu và bộ dữ liệu.', 'Search by topic, tool, method, or keyword...': 'Tìm theo chủ đề, công cụ, phương pháp hoặc từ khoá...',
        'Title': 'Tiêu đề', 'Type': 'Loại', 'Topic': 'Chủ đề', 'Level': 'Mức độ', 'Core': 'Cốt lõi', 'Applied': 'Ứng dụng', 'Series': 'Chuỗi', 'Advanced': 'Nâng cao',
        'Operating frame': 'Khung vận hành', 'Applied labs': 'Bài thực hành ứng dụng', 'Skill library': 'Thư viện kỹ năng', 'Search': 'Tìm kiếm', 'Sort': 'Sắp xếp',
        'Relevance': 'Độ liên quan', 'Newest': 'Mới nhất', 'Title A-Z': 'Tiêu đề A-Z', 'Engagement': 'Tương tác', 'Loading library...': 'Đang tải thư viện...',
        'Open full X Repost Atlas': 'Mở toàn bộ bản đồ bài đăng X', 'Begin': 'Bắt đầu', 'psst — type': 'gợi ý — hãy gõ', 'anywhere.': 'ở bất kỳ đâu.',
        'Enroll the course': 'Đăng ký khoá học', 'Course options': 'Xem gói học', 'Start with the map': 'Bắt đầu từ bản đồ', 'Open library': 'Mở thư viện',
        'Open registration form': 'Điền form đăng ký', 'Self-paced setup': 'Tự học theo lộ trình', 'Guide + direct call': 'Guide + call trực tiếp', 'Problem-focused training': 'Training theo vấn đề thật',
        'Map · Live': 'Bản đồ · Trực tuyến', 'Dashboard · Live': 'Bảng điều khiển · Trực tuyến', 'Tracker · Live': 'Theo dõi · Trực tuyến', 'Library · Live': 'Thư viện · Trực tuyến', 'App · Internal': 'Ứng dụng · Nội bộ', 'Map · Internal': 'Bản đồ · Nội bộ',
        'Vietnam Grid Atlas': 'Bản đồ Lưới điện Việt Nam', 'X Repost Atlas': 'Bản đồ Bài đăng X', 'Research Experts I Follow': 'Chuyên gia nghiên cứu tôi theo dõi',
        'Bookshelf': 'Giá sách', 'Tax Simulation': 'Mô phỏng thuế', 'Tobacco Mapping 2025': 'Bản đồ thuốc lá 2025',
        "Map-first atlas of Vietnam's power system: plants, transmission backbone, substations, and data centers — built source-to-GeoJSON with agent pipelines.": 'Bản đồ hệ thống điện Việt Nam gồm nhà máy, lưới truyền tải, trạm biến áp và trung tâm dữ liệu — được xây từ nguồn đến GeoJSON bằng quy trình tác nhân AI.',
        '158 reposts crawled from X and normalized into a research-lead dashboard: topics, credibility, priority, and follow-up status.': '158 bài đăng lại từ X được thu thập và chuẩn hoá thành bảng đầu mối nghiên cứu: chủ đề, độ tin cậy, ưu tiên và trạng thái theo dõi.',
        'A galaxy-style tracker of 70 researchers across 15 fields, with profiles, selected work, and field filters.': 'Bản theo dõi dạng thiên hà gồm 70 nhà nghiên cứu thuộc 15 lĩnh vực, kèm hồ sơ, công trình chọn lọc và bộ lọc lĩnh vực.',
        "A reading shelf for the past year's books and papers — including a 50-paper SEZ literature spine with notes and ratings.": 'Giá sách cho các sách và bài nghiên cứu trong năm qua — gồm một trục văn liệu 50 bài về đặc khu kinh tế, kèm ghi chú và đánh giá.',
        'Five-year tobacco-tax scenario builder for DEPOCEN: consumption, retail price, revenue, prevalence, and mortality under each policy path.': 'Công cụ dựng kịch bản thuế thuốc lá 5 năm cho DEPOCEN: tiêu dùng, giá bán lẻ, thu ngân sách, tỷ lệ hút và tử vong theo từng phương án chính sách.',
        'Retail mapping across Hanoi and HCMC: store locations, brand availability, prices, and outlet characteristics for field teams.': 'Bản đồ bán lẻ tại Hà Nội và TP.HCM: vị trí cửa hàng, nhãn hiệu, giá và đặc điểm điểm bán cho nhóm thực địa.'
    };

    var viTerms = [
        [/\bAI agents?\b/gi, 'tác nhân AI'], [/\bagents?\b/gi, 'tác nhân AI'], [/\bworkflow(s)?\b/gi, 'quy trình'], [/\bworkspace\b/gi, 'không gian làm việc'],
        [/\bprompt(s)?\b/gi, 'yêu cầu'], [/\btools?\b/gi, 'công cụ'], [/\bpermissions?\b/gi, 'quyền truy cập'], [/\bmemory\b/gi, 'trí nhớ'], [/\bskills?\b/gi, 'kỹ năng'],
        [/\bclaims?\b/gi, 'luận điểm'], [/\bevidence\b/gi, 'bằng chứng'], [/\boutputs?\b/gi, 'đầu ra'], [/\binputs?\b/gi, 'đầu vào'], [/\bverification\b/gi, 'kiểm chứng'],
        [/\bsetup\b/gi, 'cài đặt'], [/\bsandboxes?\b/gi, 'vùng cách ly'], [/\blog(s)?\b/gi, 'nhật ký'], [/\bfiles?\b/gi, 'tệp'], [/\bsource(s)?\b/gi, 'nguồn'],
        [/\btask(s)?\b/gi, 'đầu việc'], [/\bowner(s)?\b/gi, 'người phụ trách'], [/\bdeadline(s)?\b/gi, 'hạn xử lý'], [/\breview\b/gi, 'rà soát'], [/\bwriting\b/gi, 'viết'],
        [/\bautomation\b/gi, 'tự động hoá'], [/\bcheckpoint(s)?\b/gi, 'điểm dừng'], [/\bconnector(s)?\b/gi, 'kết nối'], [/\bcase stud(y|ies)\b/gi, 'tình huống nghiên cứu'],
        [/\bartifact(s)?\b/gi, 'sản phẩm'], [/\bpublic\b/gi, 'công khai'], [/\bprivate\b/gi, 'riêng tư'], [/\bresult(s)?\b/gi, 'kết quả'], [/\bdata\b/gi, 'dữ liệu']
    ];

    var viPhrases = {
        'Template': 'Khuôn mẫu', 'Guide': 'Hướng dẫn', 'Library': 'Thư viện', 'GitHub repo': 'Kho mã GitHub',
        'Starred repo': 'Kho mã đã đánh dấu', 'X repost': 'Bài đăng X được tuyển chọn',
        'Course series': 'Chuỗi khoá học', 'Webinar/tutorial': 'Hội thảo và hướng dẫn', 'Workflow library': 'Thư viện quy trình',
        'Substack series': 'Chuỗi bài Substack', 'Research system': 'Hệ thống nghiên cứu', 'Panel video': 'Video tọa đàm', 'Mindset reference': 'Tư liệu tư duy',
        'Mindset': 'Tư duy', 'Sources': 'Nguồn tư liệu', 'System': 'Hệ thống', 'Context': 'Ngữ cảnh', 'Research': 'Nghiên cứu',
        'Any agent': 'Mọi tác nhân AI', 'General': 'Dùng chung', 'Cross-agent': 'Đa tác nhân', 'Web extraction': 'Thu thập web', 'General AI': 'AI dùng chung',
        'Economists': 'Nhà kinh tế', 'Researchers who code': 'Nhà nghiên cứu có lập trình', 'Workflow builders': 'Người xây quy trình',
        'Agent power users': 'Người dùng tác nhân AI chuyên sâu', 'Agent designers': 'Người thiết kế tác nhân AI', 'Researchers': 'Nhà nghiên cứu',
        'Agent operators': 'Người vận hành tác nhân AI', 'Knowledge workers': 'Người lao động tri thức', 'Source collectors': 'Người thu thập nguồn',
        'Long-running agent users': 'Người dùng tác nhân AI dài hạn', 'Research automation users': 'Người dùng tự động hoá nghiên cứu',
        'Long-context users': 'Người dùng ngữ cảnh dài', 'Applied economists': 'Nhà kinh tế ứng dụng', 'Academic researchers': 'Nhà nghiên cứu học thuật',
        'Social scientists': 'Nhà khoa học xã hội', 'Quantitative social scientists': 'Nhà khoa học xã hội định lượng',
        'Professionals who do not code': 'Người làm chuyên môn không lập trình', 'Statistical software builders': 'Người xây phần mềm thống kê'
    };

    function localizeVi(value) {
        var result = String(value || '');
        if (viPhrases[result]) return viPhrases[result];
        viTerms.forEach(function(pair) { result = result.replace(pair[0], pair[1]); });
        return result;
    }

    function displayStatus(value) {
        if (state.lang !== 'vi') return value || '';
        var map = {
            'All': 'Tất cả', 'New': 'Mới', 'Seeded': 'Đã đưa vào', 'Crawled': 'Đã thu thập', 'Candidate': 'Ứng viên',
            'Integrated live': 'Đã tích hợp trực tuyến', 'Partially seeded': 'Đã đưa vào một phần', 'Personal curation': 'Tuyển chọn cá nhân',
            'Primary source': 'Nguồn sơ cấp', 'Educational source': 'Nguồn giáo dục', 'Academic tool project': 'Dự án công cụ học thuật',
            'Economist primary source': 'Nguồn sơ cấp từ nhà kinh tế', 'Practitioner source': 'Nguồn thực hành', 'Academic source': 'Nguồn học thuật'
        };
        return map[value] || localizeVi(value);
    }

    function textOf(value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return value[state.lang] || value.en || value.vi || '';
        }
        return state.lang === 'vi' ? localizeVi(value) : (value || '');
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
            id: row.id || 'seed-' + String(index || hashString((row.title && row.title.en) || row.title || row.url || 'library')),
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
        return new Date(timestamp).toLocaleDateString(state.lang === 'vi' ? 'vi-VN' : 'en-US', {
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
                        '<h3>' + escapeHtml(textOf(item.title)) + '</h3>',
                        '<p>' + escapeHtml(textOf(item.text)) + '</p>',
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
                        '<span>' + String(index).padStart(2, '0') + '</span>',
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
            '<img class="detail-cover" src="' + escapeHtml(activeModule.image || '') + '" alt="" loading="lazy" decoding="async">',
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
                '<button class="part-card" type="button" data-module-id="' + escapeHtml(module.id) + '">',
                    '<img src="' + escapeHtml(module.image || '') + '" alt="" loading="lazy" decoding="async">',
                    '<div>',
                        '<span>' + (state.lang === 'vi' ? 'Phần ' : 'Part ') + String(index).padStart(2, '0') + '</span>',
                        '<h3>' + escapeHtml(textOf(module.title)) + '</h3>',
                        '<p>' + escapeHtml(textOf(module.stage)) + '</p>',
                    '</div>',
                '</button>'
            ].join('');
        }).join('');
    }

    function libraryBlob(row) {
        return [
            textOf(row.title),
            textOf(row.type),
            textOf(row.stage),
            textOf(row.tool),
            textOf(row.audience),
            textOf(row.summary),
            textOf(row.author),
            textOf(row.sourceType),
            textOf(row.credibility),
            textOf(row.relevance),
            (row.tags || []).map(textOf).join(' ')
        ].join(' ').toLowerCase();
    }

    var LIBRARY_TOPICS = [
        { key: 'Data', label: { en: 'Data', vi: 'Dữ liệu' }, test: /\bdata|dataset|stata\b|econometric|regression|panel|survey|statistic|spreadsheet|database/ },
        { key: 'Skills', label: { en: 'Skills', vi: 'Kỹ năng' }, test: /skill|template|checklist|playbook|prompt|workflow/ },
        { key: 'Crawling', label: { en: 'Crawling', vi: 'Thu thập web' }, test: /crawl|scrap|extract|harvest|spider|firecrawl|web data|source-to/ },
        { key: 'Agents', label: { en: 'Agents & tools', vi: 'Tác nhân AI và công cụ' }, test: /agent|claude|codex|mcp\b|gpt|llm|gemini|copilot|automation|\bcli\b/ },
        { key: 'Memory', label: { en: 'Memory & notes', vi: 'Trí nhớ và ghi chú' }, test: /memor|obsidian|wiki|second brain|knowledge base|note|zotero|context/ },
        { key: 'Writing', label: { en: 'Writing', vi: 'Viết' }, test: /writ|paper|latex|draft|citation|\bcite\b|abstract|journal/ },
        { key: 'Verification', label: { en: 'Verification', vi: 'Kiểm chứng' }, test: /verif|audit|reproduc|causal|robust|check/ }
    ];

    function rowTopics(row) {
        if (!row._topics) {
            var blob = libraryBlob(row);
            row._topics = LIBRARY_TOPICS.filter(function(topic) {
                return topic.test.test(blob);
            }).map(function(topic) {
                return topic.key;
            });
        }
        return row._topics;
    }

    function renderTopicChips() {
        if (!topicChips) return;
        var counts = {};
        allLibrary.forEach(function(row) {
            rowTopics(row).forEach(function(key) {
                counts[key] = (counts[key] || 0) + 1;
            });
        });
        var chips = ['<button class="topic-chip' + (state.topic === 'All' ? ' active' : '') + '" type="button" data-topic-filter="All">' + escapeHtml(copy[state.lang].allStatuses) + ' <i>' + allLibrary.length + '</i></button>'];
        LIBRARY_TOPICS.forEach(function(topic) {
            if (!counts[topic.key]) return;
            var active = state.topic === topic.key ? ' active' : '';
            chips.push('<button class="topic-chip' + active + '" type="button" data-topic-filter="' + escapeHtml(topic.key) + '">' + escapeHtml(topic.label[state.lang] || topic.label.en) + ' <i>' + counts[topic.key] + '</i></button>');
        });
        topicChips.innerHTML = chips.join('');
    }

    function filteredLibrary() {
        var query = state.libraryQuery.trim().toLowerCase();
        return allLibrary.filter(function(row) {
            if (state.topic !== 'All' && rowTopics(row).indexOf(state.topic) === -1) return false;
            return !query || libraryBlob(row).indexOf(query) !== -1;
        }).sort(function(a, b) {
            if (state.librarySort === 'date-desc') return dateValue(b.date) - dateValue(a.date);
            if (state.librarySort === 'title-asc') return textOf(a.title).localeCompare(textOf(b.title));
            if (state.librarySort === 'engagement-desc') return (b.stats.engagement || 0) - (a.stats.engagement || 0);
            return libraryScore(b) - libraryScore(a) || dateValue(b.date) - dateValue(a.date);
        });
    }

    function libraryScore(row) {
        var rawType = row.type && typeof row.type === 'object' ? row.type.en : row.type;
        var stageBoost = ['X repost', 'Course series', 'Guide', 'GitHub repo', 'Workflow library'].indexOf(rawType) >= 0 ? 2 : 1;
        var engagement = Math.min(8, Math.log10((row.stats.engagement || 0) + 1));
        var seeded = row.sourceType === 'X repost' ? 0 : 3;
        return seeded + stageBoost + engagement;
    }

    function isImportedLibraryRow(row) {
        return /^(x|gh)-/.test(String(row.id || '')) || Boolean(row.sourceUrl);
    }

    // X-repost rows only: their title/summary/relevance/tags are raw EN text pulled live from the
    // repost feed with no authored Vietnamese, so VI mode still needs a generic placeholder note.
    // gh-* rows (GitHub library records) now carry real {en,vi} content and populated tags, so they
    // no longer need this fallback — only isImportedLibraryRow() still applies to them (for the
    // lead-vs-curated-source framing in the inspector's "How to use it" panel).
    function isUntranslatedImportRow(row) {
        return /^x-/.test(String(row.id || ''));
    }

    function renderLibrary() {
        var rows = filteredLibrary();
        var active = ensureActiveLibrary(rows);
        var visibleRows = rows.slice(0, state.libraryLimit);
        if (libraryCount) {
            libraryCount.textContent = (state.lang === 'vi' ? 'Đang hiện ' : 'Showing ') + visibleRows.length + (state.lang === 'vi' ? ' trên ' : ' of ') + rows.length + (state.lang === 'vi' ? ' kết quả' : ' results');
        }
        if (!rows.length) {
            libraryList.innerHTML = '<p class="empty-state">' + (state.lang === 'vi' ? 'Không có mục thư viện nào khớp bộ lọc.' : 'No library records match these filters.') + '</p>';
            renderLibraryInspector(null);
            return;
        }
        libraryList.innerHTML = visibleRows.map(function(row, index) {
            var activeClass = row.id === state.activeLibraryId ? ' active' : '';
            var delay = Math.min(index, 8) * 45;
            var untranslated = isUntranslatedImportRow(row);
            var visibleTitle = textOf(row.title);
            var visibleSummary = state.lang === 'vi' && untranslated ? 'Đầu mối tư liệu đã được tuyển chọn. Mở nguồn gốc để đọc nội dung đầy đủ và tự kiểm chứng.' : textOf(row.summary);
            return [
                '<button class="library-row' + activeClass + '" type="button" data-library-id="' + escapeHtml(row.id) + '" style="animation-delay:' + delay + 'ms">',
                    '<span class="row-index">' + String(index + 1).padStart(2, '0') + '</span>',
                    '<span class="row-main">',
                        '<span class="row-meta">' + escapeHtml(textOf(row.stage)) + ' · ' + escapeHtml(textOf(row.type)) + ' · ' + escapeHtml(formatDate(row.date)) + '</span>',
                        '<h3>' + escapeHtml(visibleTitle) + '</h3>',
                        '<p>' + escapeHtml(visibleSummary) + '</p>',
                    '</span>',
                    '<span class="row-end">',
                        '<span class="row-tool">' + escapeHtml(textOf(row.tool)) + '</span>',
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
                    '<p>' + (state.lang === 'vi' ? 'Chưa chọn mục thư viện.' : 'No library item selected.') + '</p>',
                    '<span>' + (state.lang === 'vi' ? 'Hãy tìm kiếm hoặc nới bộ lọc.' : 'Use search or loosen filters.') + '</span>',
                '</div>'
            ].join('');
            return;
        }
        var stats = row.stats || {};
        var isImported = isImportedLibraryRow(row);
        var untranslated = isUntranslatedImportRow(row);
        var visibleTitle = textOf(row.title);
        var visibleSummary = state.lang === 'vi' && untranslated ? 'Đầu mối tư liệu đã được tuyển chọn. Mở bài gốc, kiểm tra tài liệu liên kết rồi mới quyết định cách sử dụng.' : textOf(row.summary);
        var link = row.url ? '<a class="detail-link" href="' + escapeHtml(row.url) + '" target="_blank" rel="noreferrer">' + (state.lang === 'vi' ? 'Mở nguồn' : 'Open source') + '</a>' : '<span class="detail-link muted-link">' + (state.lang === 'vi' ? 'Không có liên kết nguồn' : 'No source link') + '</span>';
        var repostLink = row.sourceUrl ? '<a class="detail-link" href="' + escapeHtml(row.sourceUrl) + '" target="_blank" rel="noreferrer">' + (state.lang === 'vi' ? 'Bài tôi đăng lại' : 'My repost') + '</a>' : '';
        libraryInspector.innerHTML = [
            '<div class="catalog-card" key="' + escapeHtml(row.id) + '">',
                '<p class="card-rule"><span>' + escapeHtml(copy[state.lang].catalogCard) + '</span><span>' + escapeHtml(textOf(row.sourceType)) + ' · ' + escapeHtml(formatDate(row.date)) + '</span></p>',
                '<h3>' + escapeHtml(visibleTitle) + '</h3>',
                '<p class="detail-author">' + escapeHtml(textOf(row.author)) + ' · ' + escapeHtml(textOf(row.credibility)) + '</p>',
                '<p class="card-summary">' + escapeHtml(visibleSummary) + '</p>',
                '<div class="detail-links">' + link + repostLink + '</div>',
                '<dl class="card-stats">',
                    statCell(state.lang === 'vi' ? 'Lượt xem' : 'Views', compactNumber(stats.views)),
                    statCell(state.lang === 'vi' ? 'Lượt thích' : 'Likes', compactNumber(stats.likes)),
                    statCell(state.lang === 'vi' ? 'Đăng lại' : 'Reposts', compactNumber(stats.reposts)),
                    statCell(state.lang === 'vi' ? 'Phản hồi' : 'Replies', compactNumber(stats.replies)),
                '</dl>',
                '<h4>' + (state.lang === 'vi' ? 'Vì sao quan trọng' : 'Why it matters') + '</h4>',
                '<p>' + escapeHtml(state.lang === 'vi' && untranslated ? 'Nguồn này có thể gợi ý công cụ, kỹ năng hoặc quy trình cho khoá học; cần đọc nguồn gốc trước khi sử dụng.' : textOf(row.relevance || row.audience || (state.lang === 'vi' ? 'Tư liệu khoá học' : 'Course material'))) + '</p>',
                '<h4>' + (state.lang === 'vi' ? 'Cách sử dụng' : 'How to use it') + '</h4>',
                '<p>' + escapeHtml(state.lang === 'vi' ? (isImported ? 'Xem đây là một đầu mối. Mở bài gốc, kiểm tra tài liệu liên kết, rồi quyết định đưa nó thành nguồn, kỹ năng, tình huống nghiên cứu hay mục lưu trữ.' : 'Dùng đây như nguồn của khoá học. Rút ra mẫu quy trình, dẫn liên kết gốc và chuyển các bước tái sử dụng thành kỹ năng hoặc bài tập.') : (isImported ? 'Treat this as a lead. Open the original post, inspect the linked material, then decide whether it becomes a source, skill, case study, or archive item.' : 'Use this as a course source. Extract the workflow pattern, cite the original link, and convert reusable steps into skills or assignments.')) + '</p>',
                '<div class="tag-row">' + (state.lang === 'vi' && untranslated ? '' : (row.tags || []).slice(0, 10).map(function(tag) { return '<span>' + escapeHtml(textOf(tag)) + '</span>'; }).join('')) + '</div>',
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
            chips.push('<button class="source-chip' + active + '" type="button" data-status-filter="' + escapeHtml(status) + '">' + escapeHtml(displayStatus(status)) + ' <i>' + counts[status] + '</i></button>');
        });
        sourceChips.innerHTML = chips.join('');
    }

    function renderSources() {
        var rows = filteredSources();
        sourceCount.textContent = rows.length + copy[state.lang].sourceVisible + allSources.length + copy[state.lang].sources;
        sourceList.innerHTML = rows.map(function(row, index) {
            var link = row.url ? '<a class="ledger-open" href="' + escapeHtml(row.url) + '" target="_blank" rel="noreferrer">' + (state.lang === 'vi' ? 'Mở' : 'Open') + ' &nearr;</a>' : '';
            var delay = Math.min(index, 8) * 45;
            return [
                '<article class="source-row" style="animation-delay:' + delay + 'ms">',
                    '<span class="ledger-no" aria-hidden="true">' + String(index + 1).padStart(3, '0') + '</span>',
                    '<div class="ledger-body">',
                        '<p class="source-meta">' + escapeHtml(textOf(row.sourceType)) + ' / ' + escapeHtml(textOf(row.stage)) + '</p>',
                        '<h3>' + escapeHtml(textOf(row.title)) + '</h3>',
                        '<p>' + escapeHtml(textOf(row.notes)) + '</p>',
                    '</div>',
                    '<div class="source-status">',
                        '<button class="stamp" type="button" data-stamp="' + stampKey(row.status) + '">' + escapeHtml(displayStatus(row.status)) + '</button>',
                        '<small>' + escapeHtml(displayStatus(row.credibility)) + '</small>',
                        link,
                    '</div>',
                '</article>'
            ].join('');
        }).join('');
    }

    function renderAll() {
        if (easterToast && !easterToast.classList.contains('show')) easterToast.textContent = '';
        applyStaticCopy();
        renderMetrics();
        renderPrinciples();
        renderPartAtlas();
        renderModules();
        renderTopicChips();
        renderLibrary();
        renderSourceChips();
        renderSources();
        tagRevealTargets();
        observeRevealTargets();
        if (window.ScrollTrigger && ScrollTrigger.refresh) ScrollTrigger.refresh();
    }

    function applyStaticCopy() {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        var node;
        while ((node = walker.nextNode())) {
            var raw = node.nodeValue;
            var key = raw.trim();
            if (node.parentElement && node.parentElement.closest('.map-core')) continue;
            if (!key || !staticText[key]) continue;
            var replacement = state.lang === 'vi' ? staticText[key] : key;
            node.nodeValue = raw.replace(key, replacement);
        }
        Object.keys(staticText).forEach(function(en) {
            if (state.lang !== 'en') return;
            var vi = staticText[en];
            var reverseWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            var reverseNode;
            while ((reverseNode = reverseWalker.nextNode())) {
                var reverseRaw = reverseNode.nodeValue;
                if (reverseRaw.trim() === vi) reverseNode.nodeValue = reverseRaw.replace(vi, en);
            }
        });
        var placeholders = {
            'skills, memory, Stata, Claude, Codex...': 'kỹ năng, trí nhớ, Stata, Claude, Codex...'
        };
        document.querySelectorAll('[placeholder]').forEach(function(input) {
            var en = input.getAttribute('data-placeholder-en') || input.getAttribute('placeholder');
            input.setAttribute('data-placeholder-en', en);
            input.setAttribute('placeholder', state.lang === 'vi' ? (placeholders[en] || en) : en);
        });
        var attributes = {
            'AI Mind navigation': 'Điều hướng AI Mind', 'Language switcher': 'Chuyển ngôn ngữ', 'Toggle color theme': 'Đổi giao diện màu',
            'About Huy — huylvu.github.io': 'Giới thiệu Huy — huylvu.github.io', 'Target audience': 'Đối tượng học',
            'Agentic research workflow map': 'Bản đồ quy trình nghiên cứu với tác nhân AI', 'Course and library preview': 'Xem trước khoá học và thư viện',
            'Knowledge base summary': 'Tóm tắt kho kiến thức', 'Library filters': 'Bộ lọc thư viện', 'Filter library by topic': 'Lọc thư viện theo chủ đề',
            'Selected library item': 'Mục thư viện đang chọn', 'Filter sources by status': 'Lọc nguồn theo trạng thái', 'Close manual access dialog': 'Đóng hộp quyền truy cập giáo trình',
            'Course enrollment options': 'Các lựa chọn đăng ký khoá học'
        };
        document.querySelectorAll('[aria-label]').forEach(function(el) {
            var en = el.getAttribute('data-aria-en') || el.getAttribute('aria-label');
            el.setAttribute('data-aria-en', en);
            el.setAttribute('aria-label', state.lang === 'vi' ? (attributes[en] || en) : en);
        });
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
                if (mainContent) mainContent.setAttribute('inert', '');
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
            if (mainContent) mainContent.removeAttribute('inert');
            if (manualLastTrigger) manualLastTrigger.focus();
        }

        manualCloseButtons.forEach(function(button) {
            button.addEventListener('click', closeManualAccess);
        });

        formPlaceholderLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                showToast(copy[state.lang].formPending);
            });
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

        if (topicChips) {
            topicChips.addEventListener('click', function(event) {
                var chip = event.target.closest('[data-topic-filter]');
                if (!chip) return;
                state.topic = chip.getAttribute('data-topic-filter');
                state.libraryLimit = 10;
                renderTopicChips();
                renderLibrary();
            });
        }

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
        showToast(engaged ? copy[state.lang].unlocked : (state.lang === 'vi' ? 'Đã tắt chế độ kiểm soát.' : 'Control mode off.'));
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
