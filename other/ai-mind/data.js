window.AI_MIND_DATA = {
    generatedAt: '2026-06-10',
    principles: [
        {
            title: { en: 'Treat the agent as a research operator', vi: 'Xem tác nhân AI như một người vận hành nghiên cứu' },
            text: { en: 'Give it a task contract, source boundaries, acceptance checks, and permission limits. Do not rely on a clever prompt to carry an unclear workflow.', vi: 'Hãy giao cho nó một bản nhiệm vụ, ranh giới nguồn, tiêu chí nghiệm thu và giới hạn quyền. Đừng trông chờ một câu lệnh khéo léo cứu một quy trình chưa rõ ràng.' }
        },
        {
            title: { en: 'Start from evidence, not literature theater', vi: 'Bắt đầu từ bằng chứng, không phải màn trình diễn văn liệu' },
            text: { en: 'For empirical economics, audit data, sample, variables, identification, and outputs before asking the agent to write a story.', vi: 'Với kinh tế học thực nghiệm, hãy kiểm toán dữ liệu, mẫu, biến, chiến lược nhận diện và kết quả trước khi yêu cầu tác nhân AI viết câu chuyện.' }
        },
        {
            title: { en: 'Make context a system', vi: 'Biến ngữ cảnh thành một hệ thống' },
            text: { en: 'Keep wiki pages, repo instructions, source catalogs, skills, and memory thin but connected. The point is retrieval discipline, not hoarding notes.', vi: 'Giữ trang wiki, chỉ dẫn kho mã, danh mục nguồn, kỹ năng và trí nhớ gọn nhưng liên kết với nhau. Mục tiêu là truy xuất có kỷ luật, không phải tích trữ ghi chú.' }
        },
        {
            title: { en: 'Verify before polishing', vi: 'Kiểm chứng trước khi trau chuốt' },
            text: { en: 'Every agent output needs a check: code run, table match, citation check, source trace, screenshot, or a clearly stated residual risk.', vi: 'Mọi đầu ra của tác nhân AI đều cần một phép kiểm: chạy mã, đối chiếu bảng, kiểm tra trích dẫn, truy nguồn, ảnh chụp hoặc nêu rõ rủi ro còn lại.' }
        }
    ],
    modules: [
        {
            id: 'chatbot-agent',
            title: { en: 'From chatbot to research agent', vi: 'Từ chatbot đến tác nhân nghiên cứu AI' },
            stage: { en: 'Foundation', vi: 'Nền tảng' },
            image: '/docs/ai-mind/assets/part-covers/part-00-chatbot-agent.png',
            promise: { en: 'Separate chat, custom assistants, IDE helpers, and full workspace agents so learners know what changed and why it matters.', vi: 'Phân biệt trò chuyện AI, trợ lý tùy chỉnh, công cụ hỗ trợ trong môi trường lập trình và tác nhân làm việc trực tiếp trong không gian dự án để hiểu đúng sức mạnh và rủi ro.' },
            outcomes: [
                { en: 'Explain why agents are different from chatbots', vi: 'Giải thích tác nhân AI khác chatbot ở điểm nào' },
                { en: 'Identify the agent control surface: files, tools, permissions, memory, and actions', vi: 'Nhận diện các điểm điều khiển tác nhân: tệp, công cụ, quyền truy cập, trí nhớ và hành động' },
                { en: 'Decide when a task needs an agent instead of a chat window', vi: 'Biết khi nào đầu việc cần tác nhân AI thay vì chỉ dùng cửa sổ trò chuyện' }
            ],
            exercise: { en: 'Map three real research tasks into chatbot-only, assistant, and workspace-agent versions.', vi: 'Chọn ba đầu việc nghiên cứu thật và ánh xạ thành ba phiên bản: chỉ dùng chatbot, dùng trợ lý và dùng tác nhân trong không gian dự án.' }
        },
        {
            id: 'control-philosophy',
            title: { en: 'Control philosophy: delegate without outsourcing understanding', vi: 'Triết lý kiểm soát: giao việc nhưng không giao mất hiểu biết' },
            stage: { en: 'Mindset', vi: 'Tư duy' },
            image: '/docs/ai-mind/assets/part-covers/part-01-control-philosophy.png',
            promise: { en: 'Build the course stance: AI is a research companion and operator, not a replacement for domain judgment.', vi: 'Xác lập quan điểm của khóa học: AI là bạn đồng hành và người vận hành nghiên cứu, không thay thế phán đoán chuyên môn.' },
            outcomes: [
                { en: 'Separate delegation from abdication', vi: 'Phân biệt giao việc với buông quyền kiểm soát' },
                { en: 'Keep human ownership over claims, evidence, and interpretation', vi: 'Giữ quyền chịu trách nhiệm của con người với luận điểm, bằng chứng và diễn giải' },
                { en: 'Use the agent as the first tutor for setup and self-learning', vi: 'Dùng tác nhân AI như người hướng dẫn đầu tiên khi cài đặt và tự học' }
            ],
            exercise: { en: 'Write a one-page control charter for your own agent: what it may do, what it must ask, and what you will always verify.', vi: 'Viết một bản quy ước kiểm soát dài một trang: tác nhân được làm gì, phải hỏi gì và phần nào anh luôn tự kiểm chứng.' }
        },
        {
            id: 'setup-orientation',
            title: { en: 'Setup, orientation, permissions, and sandboxes', vi: 'Cài đặt, định hướng, quyền truy cập và vùng cách ly' },
            stage: { en: 'Setup', vi: 'Cài đặt' },
            image: '/docs/ai-mind/assets/part-covers/part-02-setup-orientation.png',
            promise: { en: 'Use Codex as the main setup example, then compare Claude Code and Antigravity so tool changes do not break the mental model.', vi: 'Lấy Codex làm ví dụ cài đặt chính, sau đó so sánh Claude Code và Antigravity để dù đổi công cụ vẫn giữ được mô hình tư duy.' },
            outcomes: [
                { en: 'Create project instructions and safe workspace boundaries', vi: 'Tạo chỉ dẫn dự án và ranh giới không gian làm việc an toàn' },
                { en: 'Understand permissions, terminals, logs, and file-edit flows', vi: 'Hiểu quyền truy cập, cửa sổ lệnh, nhật ký và luồng chỉnh sửa tệp' },
                { en: 'Explain where Claude Code and Antigravity differ from Codex', vi: 'Giải thích khác biệt chính giữa Claude Code, Antigravity và Codex' }
            ],
            exercise: { en: 'Set up a dummy research repo with AGENTS.md, logs folder, data boundary, and a no-secrets rule.', vi: 'Cài đặt một kho mã nghiên cứu giả với AGENTS.md, thư mục nhật ký, ranh giới dữ liệu và quy tắc không đụng tới thông tin bí mật.' }
        },
        {
            id: 'wiki-memory',
            title: { en: 'Wiki memory and portable second brain', vi: 'Trí nhớ wiki và bộ não thứ hai có thể mang theo' },
            stage: { en: 'Memory', vi: 'Trí nhớ' },
            image: '/docs/ai-mind/assets/part-covers/part-03-wiki-memory.png',
            promise: { en: 'Turn scattered notes into a library-like memory system that works across Codex, Claude Code, Obsidian, NotebookLM, and future agents.', vi: 'Biến ghi chú rải rác thành hệ thống trí nhớ dạng thư viện, dùng được với Codex, Claude Code, Obsidian, NotebookLM và các tác nhân tương lai.' },
            outcomes: [
                { en: 'Separate private corpus, wiki, memory index, and public outputs', vi: 'Tách kho tư liệu riêng, wiki, chỉ mục trí nhớ và đầu ra công khai' },
                { en: 'Design retrieval paths instead of forcing the agent to reread everything', vi: 'Thiết kế đường truy xuất thay vì bắt tác nhân đọc lại cả thư viện' },
                { en: 'Create update routines for long-term self-learning', vi: 'Tạo nhịp cập nhật để tác nhân và người dùng cùng học lâu dài' }
            ],
            exercise: { en: 'Build a three-level memory map for one project: index page, source page, and reusable fact card.', vi: 'Xây bản đồ trí nhớ ba tầng cho một dự án: trang chỉ mục, trang nguồn và thẻ dữ kiện có thể tái sử dụng.' }
        },
        {
            id: 'skills',
            title: { en: 'Skills as reusable research workflows', vi: 'Kỹ năng như quy trình nghiên cứu tái sử dụng' },
            stage: { en: 'Skills', vi: 'Kỹ năng' },
            image: '/docs/ai-mind/assets/part-covers/part-04-skills.png',
            promise: { en: 'Convert repeated research judgment into explicit skills for idea generation, literature, data, results, writing, and review.', vi: 'Biến phán đoán lặp lại trong nghiên cứu thành kỹ năng rõ ràng cho ý tưởng, văn liệu, dữ liệu, kết quả, viết và rà soát.' },
            outcomes: [
                { en: 'Distinguish prompts, rules, skills, and full agents', vi: 'Phân biệt yêu cầu, quy tắc, kỹ năng và tác nhân hoàn chỉnh' },
                { en: 'Read and write a skill template with triggers, inputs, workflow, and verification', vi: 'Đọc và viết khuôn kỹ năng gồm điều kiện kích hoạt, đầu vào, quy trình và bước kiểm chứng' },
                { en: 'Build five skills along an empirical research pipeline', vi: 'Xây năm kỹ năng dọc theo quy trình nghiên cứu thực nghiệm' }
            ],
            exercise: { en: 'Draft one skill for result-table review and one skill for source-to-dataset crawling.', vi: 'Viết một kỹ năng rà soát bảng kết quả và một kỹ năng thu thập từ nguồn thành bộ dữ liệu.' }
        },
        {
            id: 'connectors-tools',
            title: { en: 'Plugins, MCP, Zotero, NotebookLM, Gmail, and Drive', vi: 'Tiện ích, MCP, Zotero, NotebookLM, Gmail và Drive' },
            stage: { en: 'Connectors', vi: 'Kết nối' },
            image: '/docs/ai-mind/assets/part-covers/part-05-connectors-tools.png',
            promise: { en: 'Teach connectors as workflow infrastructure, not shiny add-ons: every connection needs a use case, permission model, and failure mode.', vi: 'Dạy kết nối như hạ tầng quy trình, không phải đồ chơi mới: mỗi kết nối cần tình huống sử dụng, mô hình quyền truy cập và kiểu sai hỏng.' },
            outcomes: [
                { en: 'Choose connectors by bottleneck: papers, files, email, calendar, browser, or databases', vi: 'Chọn kết nối theo điểm nghẽn: bài nghiên cứu, tệp, thư điện tử, lịch, trình duyệt hoặc cơ sở dữ liệu' },
                { en: 'Use Zotero and NotebookLM for paper-grounded work', vi: 'Dùng Zotero và NotebookLM cho công việc bám sát bài nghiên cứu' },
                { en: 'Design Gmail/Drive routines without leaking private data', vi: 'Thiết kế nhịp làm việc Gmail/Drive mà không rò rỉ dữ liệu riêng tư' }
            ],
            exercise: { en: 'Design a connector map for a literature review sprint and list what the agent may never send outside the machine.', vi: 'Thiết kế bản đồ kết nối cho một đợt tổng quan văn liệu và liệt kê dữ liệu tác nhân không bao giờ được gửi ra ngoài máy.' }
        },
        {
            id: 'applied-research',
            title: { en: 'Applied research modules from empty folder to research output', vi: 'Thực hành nghiên cứu: từ thư mục trống đến đầu ra hoàn chỉnh' },
            stage: { en: 'Applied', vi: 'Thực hành' },
            image: '/docs/ai-mind/assets/part-covers/part-06-applied-research.png',
            promise: { en: 'Adapt the Paul Goldsmith-Pinkham style spine: setup, data, scraping, databases, writing, skills, sandboxes, and O-ring verification.', vi: 'Dựa theo khung thực hành của Paul Goldsmith-Pinkham: cài đặt, dữ liệu, thu thập web, cơ sở dữ liệu, viết, kỹ năng, vùng cách ly và kiểm chứng theo chuỗi O-ring.' },
            outcomes: [
                { en: 'Run empty-folder-to-figure workflows', vi: 'Chạy quy trình từ thư mục trống đến biểu đồ' },
                { en: 'Convert source pages into structured datasets', vi: 'Biến trang nguồn thành bộ dữ liệu có cấu trúc' },
                { en: 'Tie writing and verification to empirical outputs', vi: 'Gắn phần viết và kiểm chứng với đầu ra thực nghiệm' }
            ],
            exercise: { en: 'Create a reproducible mini-project: source, raw data, script, figure, memo, and verification checklist.', vi: 'Tạo dự án nhỏ có thể tái lập: nguồn, dữ liệu gốc, mã lệnh, biểu đồ, bản ghi nhớ và danh sách kiểm chứng.' }
        },
        {
            id: 'project-workflows',
            title: { en: 'Research project operations and consulting workflows', vi: 'Vận hành dự án nghiên cứu và quy trình tư vấn' },
            stage: { en: 'Operations', vi: 'Vận hành' },
            image: '/docs/ai-mind/assets/part-covers/part-07-project-workflows.png',
            promise: { en: 'Show how agents can reduce manual coordination in team projects: data refresh, error reports, assignment, reminders, and delivery tracking.', vi: 'Cho thấy tác nhân AI có thể giảm việc điều phối thủ công trong dự án nhóm: cập nhật dữ liệu, báo lỗi, phân công, nhắc việc và theo dõi sản phẩm bàn giao.' },
            outcomes: [
                { en: 'Redesign daily data checks with API scripts and scheduled summaries', vi: 'Thiết kế lại kiểm tra dữ liệu hằng ngày bằng mã API và bản tóm tắt theo lịch' },
                { en: 'Turn QA errors into owner-deadline-task records', vi: 'Biến lỗi kiểm tra chất lượng thành đầu việc có người phụ trách và hạn xử lý' },
                { en: 'Define the human role in approval, interpretation, and escalation', vi: 'Xác định vai trò con người trong phê duyệt, diễn giải và chuyển cấp' }
            ],
            exercise: { en: 'Build a 9am project operations workflow for one real data pipeline.', vi: 'Thiết kế quy trình vận hành lúc 9 giờ sáng cho một luồng dữ liệu thật.' }
        },
        {
            id: 'automation-routines',
            title: { en: 'Automation, routines, and autonomous modes', vi: 'Tự động hoá, nhịp làm việc và chế độ tự vận hành' },
            stage: { en: 'Automation', vi: 'Tự động hóa' },
            image: '/docs/ai-mind/assets/part-covers/part-08-automation-routines.png',
            promise: { en: 'Explain routines and autonomous agent modes as bounded loops with triggers, stop rules, alerts, and human review.', vi: 'Giải thích nhịp làm việc và chế độ tác nhân tự vận hành như vòng lặp có điều kiện kích hoạt, quy tắc dừng, cảnh báo và rà soát của con người.' },
            outcomes: [
                { en: 'Identify tasks safe enough for automation', vi: 'Nhận diện đầu việc đủ an toàn để tự động hoá' },
                { en: 'Set checkpoints, logs, notifications, and rollback paths', vi: 'Đặt điểm dừng, nhật ký, thông báo và đường quay lui' },
                { en: 'Avoid silent failure in unattended agent work', vi: 'Tránh lỗi âm thầm trong công việc tác nhân chạy không có người giám sát' }
            ],
            exercise: { en: 'Write an automation spec with trigger, inputs, output, error cases, and escalation rule.', vi: 'Viết đặc tả tự động hoá gồm điều kiện kích hoạt, đầu vào, đầu ra, trường hợp lỗi và quy tắc chuyển cấp.' }
        },
        {
            id: 'crawling-data',
            title: { en: 'Crawling data with AI agents', vi: 'Thu thập dữ liệu bằng tác nhân AI' },
            stage: { en: 'Crawling', vi: 'Thu thập dữ liệu' },
            image: '/docs/ai-mind/assets/part-covers/part-09-crawling-data.png',
            promise: { en: 'Teach crawling as a reproducible research pipeline: source discovery, schema, extraction, checkpointing, QA, and refresh.', vi: 'Dạy thu thập web như một quy trình nghiên cứu có thể tái lập: tìm nguồn, thiết kế cấu trúc dữ liệu, trích xuất, đặt điểm dừng, kiểm tra chất lượng và cập nhật.' },
            outcomes: [
                { en: 'Choose between browser crawl, API pull, HTML parse, and manual source capture', vi: 'Chọn giữa thu thập bằng trình duyệt, lấy qua API, phân tích HTML và ghi nhận nguồn thủ công' },
                { en: 'Design checkpoints and evidence logs', vi: 'Thiết kế điểm dừng và nhật ký bằng chứng' },
                { en: 'Convert crawler output into research-ready tables', vi: 'Biến đầu ra thu thập thành bảng sẵn sàng cho nghiên cứu' }
            ],
            exercise: { en: 'Create a crawler plan for one public source, including schema, retry rules, and validation sample.', vi: 'Lập kế hoạch thu thập cho một nguồn công khai, gồm cấu trúc dữ liệu, quy tắc thử lại và mẫu kiểm tra.' }
        },
        {
            id: 'case-studies',
            title: { en: 'Case studies from Huy’s projects', vi: 'Tình huống nghiên cứu từ các dự án của Huy' },
            stage: { en: 'Cases', vi: 'Tình huống' },
            image: '/docs/ai-mind/assets/part-covers/part-10-case-studies.png',
            promise: { en: 'Ground the course in real artifacts: Grid Atlas, Lietsi crawler, patent crawler, and KOICA map/crosswalk workflows.', vi: 'Neo khoá học vào sản phẩm thật: Grid Atlas, công cụ thu thập Lietsi, công cụ thu thập bằng sáng chế và quy trình bản đồ/đối chiếu KOICA.' },
            outcomes: [
                { en: 'Translate local project experience into teachable workflows', vi: 'Chuyển kinh nghiệm dự án trên máy thành quy trình có thể giảng dạy' },
                { en: 'Show screenshots and outputs as evidence, not decoration', vi: 'Dùng ảnh chụp và đầu ra như bằng chứng, không chỉ để trang trí' },
                { en: 'Explain what the agent did and what the human still owned', vi: 'Giải thích tác nhân làm phần nào và con người vẫn chịu trách nhiệm phần nào' }
            ],
            exercise: { en: 'Select one personal project and turn it into a teaching case: problem, workflow, agent role, human checks, and final artifact.', vi: 'Chọn một dự án cá nhân và biến thành tình huống dạy học: vấn đề, quy trình, vai trò tác nhân, bước kiểm tra của con người và sản phẩm cuối.' }
        },
        {
            id: 'teaching-sequence',
            title: { en: 'Teaching sequence and cohort design', vi: 'Thiết kế trình tự dạy học và lớp học' },
            stage: { en: 'Teaching', vi: 'Giảng dạy' },
            image: '/docs/ai-mind/assets/part-covers/part-11-teaching-sequence.png',
            promise: { en: 'Turn the manual into a teachable syllabus with lectures, labs, readings, assignments, and project milestones.', vi: 'Biến giáo trình thành chương trình học có bài giảng, thực hành, bài đọc, bài tập và mốc dự án.' },
            outcomes: [
                { en: 'Sequence concepts before tool-specific details', vi: 'Xếp khái niệm trước chi tiết riêng của từng công cụ' },
                { en: 'Balance mindset, setup, skill design, applied labs, and project work', vi: 'Cân bằng tư duy, cài đặt, thiết kế kỹ năng, bài thực hành ứng dụng và công việc dự án' },
                { en: 'Define outputs students can submit and verify', vi: 'Định nghĩa đầu ra học viên có thể nộp và kiểm chứng' }
            ],
            exercise: { en: 'Create a four-week and an eight-week version of the course.', vi: 'Tạo phiên bản khóa học 4 tuần và 8 tuần.' }
        },
        {
            id: 'instructor-notes',
            title: { en: 'Instructor notes, risks, and public/private boundaries', vi: 'Ghi chú giảng viên, rủi ro và ranh giới công khai/riêng tư' },
            stage: { en: 'Instructor', vi: 'Giảng viên' },
            image: '/docs/ai-mind/assets/part-covers/part-12-instructor-notes.png',
            promise: { en: 'Protect the course from hype, copyright leakage, privacy mistakes, and unsupported research claims.', vi: 'Bảo vệ khóa học khỏi thổi phồng, rò rỉ bản quyền, lỗi riêng tư và luận điểm nghiên cứu không đủ bằng chứng.' },
            outcomes: [
                { en: 'Keep full text and transcripts in the private corpus only', vi: 'Chỉ giữ toàn văn và bản chép lời trong kho tư liệu riêng' },
                { en: 'Teach students to cite, summarize, and verify safely', vi: 'Dạy học viên trích dẫn, tóm tắt và kiểm chứng an toàn' },
                { en: 'Maintain a living source atlas and update routine', vi: 'Duy trì bản đồ nguồn sống và nhịp cập nhật' }
            ],
            exercise: { en: 'Audit one course handout for source safety, privacy risk, and unsupported claims.', vi: 'Rà soát một tài liệu phát tay theo ba tiêu chí: an toàn nguồn, rủi ro riêng tư và luận điểm thiếu bằng chứng.' }
        }
    ],
    library: [
        {
            title: 'Economics task contract',
            type: 'Template',
            stage: 'Mindset',
            tool: 'Any agent',
            audience: 'Economists',
            summary: 'A compact prompt contract for empirical tasks: data, sample, output, assumptions, checks, and non-goals.',
            url: '',
            tags: ['economics', 'task-contract', 'verification']
        },
        {
            title: 'AGENTS.md project instructions',
            type: 'Guide',
            stage: 'Context',
            tool: 'Codex',
            audience: 'Researchers who code',
            summary: 'Project-level instructions that tell coding agents how to work inside a repo, what to verify, and what not to touch.',
            url: 'https://developers.openai.com/codex/guides/agents-md',
            tags: ['codex', 'instructions', 'repo']
        },
        {
            title: 'Codex skills',
            type: 'Guide',
            stage: 'Tools',
            tool: 'Codex',
            audience: 'Workflow builders',
            summary: 'Reusable local procedures for recurring tasks such as literature review, Stata auditing, frontend QA, or citation checks.',
            url: 'https://developers.openai.com/codex/skills',
            tags: ['codex', 'skills', 'workflow']
        },
        {
            title: 'Claude memory and CLAUDE.md',
            type: 'Guide',
            stage: 'Memory',
            tool: 'Claude Code',
            audience: 'Agent power users',
            summary: 'A reference pattern for hierarchical memory files and project instructions.',
            url: 'https://docs.anthropic.com/en/docs/claude-code/memory',
            tags: ['claude', 'memory', 'instructions']
        },
        {
            title: 'Context engineering for agents',
            type: 'Guide',
            stage: 'Context',
            tool: 'General',
            audience: 'Agent designers',
            summary: 'A framing for treating context as a designed system rather than dumping files into a prompt.',
            url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
            tags: ['context', 'agents', 'architecture']
        },
        {
            title: 'AI Research Skills Library',
            type: 'Library',
            stage: 'Tools',
            tool: 'Cross-agent',
            audience: 'Researchers',
            summary: 'A public skill collection aimed at research workflows and reusable agent behavior.',
            url: 'https://github.com/orchestra-research/AI-research-SKILLs',
            tags: ['skills', 'research', 'library']
        },
        {
            title: 'cc-thinking-skills',
            type: 'GitHub repo',
            stage: 'Mindset',
            tool: 'Claude Code',
            audience: 'Agent operators',
            summary: 'Mental models and critical-thinking routines for agents: first principles, Bayesian thinking, systems thinking, OODA, and premortems.',
            url: 'https://github.com/tjboudreaux/cc-thinking-skills',
            tags: ['starred', 'thinking', 'skills']
        },
        {
            title: 'Obsidian second brain skill',
            type: 'GitHub repo',
            stage: 'Memory',
            tool: 'Obsidian',
            audience: 'Knowledge workers',
            summary: 'Cross-CLI skill for turning an Obsidian vault into an AI-first second brain across coding agents.',
            url: 'https://github.com/eugeniughelbur/obsidian-second-brain',
            tags: ['starred', 'obsidian', 'memory']
        },
        {
            title: 'Firecrawl',
            type: 'GitHub repo',
            stage: 'Sources',
            tool: 'Web extraction',
            audience: 'Source collectors',
            summary: 'Search, scrape, and convert web pages into agent-usable source material at scale.',
            url: 'https://github.com/firecrawl/firecrawl',
            tags: ['starred', 'crawler', 'sources']
        },
        {
            title: 'MemPalace',
            type: 'GitHub repo',
            stage: 'Memory',
            tool: 'MCP',
            audience: 'Long-running agent users',
            summary: 'Open-source AI memory system that can act as an external retrieval layer when memory must be queryable.',
            url: 'https://github.com/MemPalace/mempalace',
            tags: ['starred', 'memory', 'mcp']
        },
        {
            title: 'Auto-Research-In-Sleep',
            type: 'GitHub repo',
            stage: 'Research',
            tool: 'Cross-agent',
            audience: 'Research automation users',
            summary: 'Markdown-only skills for autonomous research loops, idea discovery, review, and experiment automation.',
            url: 'https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep',
            tags: ['starred', 'research', 'automation']
        },
        {
            title: 'Headroom',
            type: 'GitHub repo',
            stage: 'Context',
            tool: 'MCP',
            audience: 'Long-context users',
            summary: 'Compresses tool outputs, logs, files, and RAG chunks before they reach the model.',
            url: 'https://github.com/chopratejas/headroom',
            tags: ['starred', 'context', 'tokens']
        },
        {
            title: 'Claude Code for Applied Economists',
            type: 'Course series',
            stage: 'Data',
            tool: 'Claude Code',
            audience: 'Applied economists',
            summary: 'Paul Goldsmith-Pinkham\'s economist-facing sequence: setup, empty folder to figure, web/EDGAR scraping, structured databases, writing, skills, and sandboxes.',
            url: 'https://paulgp.substack.com/feed',
            tags: ['paul-gp', 'economics', 'claude-code', 'data']
        },
        {
            title: 'AI Agents for Economics Research',
            type: 'Webinar/tutorial',
            stage: 'Research',
            tool: 'Claude Code + Codex',
            audience: 'Economists',
            summary: 'Aniket Panjwani\'s practical framing for literature review, coding, data work, replication, writing, and slides with budget-aware agent workflows.',
            url: 'https://ai-mba.io/tutorials/ai-agents-for-economics-research',
            tags: ['aniket', 'economics', 'agents', 'workflow']
        },
        {
            title: 'Claude Blattman',
            type: 'Workflow library',
            stage: 'System',
            tool: 'Claude Code',
            audience: 'Professionals who do not code',
            summary: 'Chris Blattman\'s applied workflow library for schedules, communication, project management, deep research, plan review, and CLAUDE.md setup.',
            url: 'https://claudeblattman.com',
            tags: ['blattman', 'management', 'workflow', 'claude-md']
        },
        {
            title: 'Claude Code for quantitative social scientists',
            type: 'Substack series',
            stage: 'Verification',
            tool: 'Claude Code',
            audience: 'Quantitative social scientists',
            summary: 'Scott Cunningham\'s running Claude Code field notes, with emphasis on checklists, applied econometrics, AI disclosure, and research production.',
            url: 'https://causalinf.substack.com/s/claude-code',
            tags: ['scott-cunningham', 'econometrics', 'checklists', 'claude-code']
        },
        {
            title: 'Pedro Sant\'Anna Claude Code workflow',
            type: 'Template',
            stage: 'System',
            tool: 'Claude Code',
            audience: 'Academic researchers',
            summary: 'A production-grade academic template for papers, slides, data analysis, replication packages, multi-agent review, and quality gates.',
            url: 'https://psantanna.com/claude-code-my-workflow/',
            tags: ['pedro-santanna', 'replication', 'latex', 'quality-gates']
        },
        {
            title: 'StatsClaw',
            type: 'Research system',
            stage: 'Data',
            tool: 'Multi-agent software workflow',
            audience: 'Statistical software builders',
            summary: 'A collaborative AI workflow for producing statistical software in R, Python, C++, Julia, and Stata from natural language.',
            url: 'https://statsclaw.ai',
            tags: ['yiqing-xu', 'statsclaw', 'statistical-software', 'agents']
        },
        {
            title: 'Empirical Work in the Age of AI',
            type: 'Panel video',
            stage: 'Mindset',
            tool: 'General AI',
            audience: 'Social scientists',
            summary: 'Stanford IRiSS panel on how AI is changing empirical work and what social scientists should treat as durable judgment versus automatable work.',
            url: 'https://www.youtube.com/watch?v=XG4YWtEJtOg',
            tags: ['stanford-iriss', 'empirical-work', 'ai', 'research']
        },
        {
            title: 'Andrej Karpathy: English as programming language',
            type: 'Mindset reference',
            stage: 'Mindset',
            tool: 'General AI',
            audience: 'Agent operators',
            summary: 'Useful north-star framing: natural language is now part of the control surface, but understanding remains non-transferable.',
            url: 'https://karpathy.ai',
            tags: ['karpathy', 'english', 'understanding', 'mindset']
        }
    ],
    sources: [
        {
            title: 'Existing X Repost Atlas',
            sourceType: 'Personal X reposts',
            status: 'Integrated live',
            credibility: 'Curated by Huy',
            stage: 'Sources',
            url: '/other/x-reposts/',
            notes: 'The AI/tool subset is imported into this page when the repost dataset is available.'
        },
        {
            title: 'OpenAI Codex AGENTS.md guide',
            sourceType: 'Official docs',
            status: 'Seeded',
            credibility: 'Primary source',
            stage: 'Context',
            url: 'https://developers.openai.com/codex/guides/agents-md',
            notes: 'Use for project instruction patterns and repo-level operating contracts.'
        },
        {
            title: 'OpenAI Codex skills guide',
            sourceType: 'Official docs',
            status: 'Seeded',
            credibility: 'Primary source',
            stage: 'Tools',
            url: 'https://developers.openai.com/codex/skills',
            notes: 'Use for teaching the difference between prompts and durable workflow skills.'
        },
        {
            title: 'Anthropic Claude Code memory',
            sourceType: 'Official docs',
            status: 'Seeded',
            credibility: 'Primary source',
            stage: 'Memory',
            url: 'https://docs.anthropic.com/en/docs/claude-code/memory',
            notes: 'Use as a comparison point for CLAUDE.md, hierarchical instructions, and memory hygiene.'
        },
        {
            title: 'Effective context engineering for AI agents',
            sourceType: 'Engineering article',
            status: 'Seeded',
            credibility: 'Primary source',
            stage: 'Context',
            url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
            notes: 'Useful for explaining why context architecture matters more than prompt length.'
        },
        {
            title: 'Huy starred GitHub repositories',
            sourceType: 'GitHub stars',
            status: 'Partially seeded',
            credibility: 'Personal curation',
            stage: 'Sources',
            url: 'https://github.com/huylvu?tab=stars',
            notes: 'Initial pass seeded agent, memory, context, and skill repositories from the public GitHub API.'
        },
        {
            title: 'DeepLearning.AI Agentic AI learning materials',
            sourceType: 'Course reference',
            status: 'Candidate',
            credibility: 'Educational source',
            stage: 'Mindset',
            url: 'https://www.deeplearning.ai/courses/agentic-ai/',
            notes: 'Good comparison material, but this course should stay research-workflow first rather than tool-demo first.'
        },
        {
            title: 'ToolUniverse skills showcase',
            sourceType: 'Skill examples',
            status: 'Candidate',
            credibility: 'Academic tool project',
            stage: 'Tools',
            url: 'https://zitniklab.hms.harvard.edu/ToolUniverse/guide/skills_showcase.html',
            notes: 'Useful external example for domain-specific scientific agent skills.'
        },
        {
            title: 'Paul Goldsmith-Pinkham Substack archive',
            sourceType: 'Substack RSS',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'Sources',
            url: 'https://paulgp.substack.com/feed',
            notes: 'RSS currently exposes 20 posts. Key course spine: setup, figures, scraping/EDGAR, large datasets, writing/thinking, skills, permissions, O-ring, LLM-friendly papers.'
        },
        {
            title: 'Getting Started with Claude Code: A Researcher’s Setup Guide',
            sourceType: 'Paul GP post',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'Setup',
            url: 'https://paulgp.substack.com/p/getting-started-with-claude-code',
            notes: 'Use for the setup module: environment, repo habits, and first-session workflow.'
        },
        {
            title: 'From an Empty Folder to a Figure using Claude Code',
            sourceType: 'Paul GP post',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'Data',
            url: 'https://paulgp.substack.com/p/from-an-empty-folder-to-a-figure',
            notes: 'Use as the first hands-on empirical exercise: source to analysis artifact.'
        },
        {
            title: 'From EDGAR Filings to a Structured Database using Claude Code',
            sourceType: 'Paul GP post',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'Data',
            url: 'https://paulgp.substack.com/p/from-edgar-filings-to-a-structured',
            notes: 'Use for web scraping and source-to-database lessons.'
        },
        {
            title: 'Large Datasets and Structured Databases',
            sourceType: 'Paul GP post',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'Data',
            url: 'https://paulgp.substack.com/p/large-datasets-and-structured-databases',
            notes: 'Use for schema, chunking, database thinking, and limits of simple prompt workflows.'
        },
        {
            title: 'Writing & Thinking with AI Assistance',
            sourceType: 'Paul GP post',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'Writing',
            url: 'https://paulgp.substack.com/p/writing-and-thinking-with-ai-assistance',
            notes: 'Use for writing module: AI as clarifier and reviewer, not a substitute for understanding.'
        },
        {
            title: 'Skills: Specifying How an Agent Should Think',
            sourceType: 'Paul GP post',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'System',
            url: 'https://paulgp.substack.com/p/skills-specifying-how-an-agent-should',
            notes: 'Use for skill design: reusable reasoning routines and task-specific agent behavior.'
        },
        {
            title: 'Permissions, Sandboxes, and Autonomous Agents',
            sourceType: 'Paul GP post',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'Setup',
            url: 'https://paulgp.substack.com/p/permissions-sandboxes-and-autonomous',
            notes: 'Use for safety, permissions, sandboxing, and autonomy boundaries.'
        },
        {
            title: 'AI and the Research O-Ring',
            sourceType: 'Paul GP post',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'Verification',
            url: 'https://paulgp.substack.com/p/ai-and-the-research-o-ring',
            notes: 'Use for the central verification metaphor: one weak unchecked step can break the research product.'
        },
        {
            title: 'Aniket Panjwani YouTube channel',
            sourceType: 'YouTube RSS',
            status: 'Crawled',
            credibility: 'Practitioner source',
            stage: 'Tools',
            url: 'https://www.youtube.com/@aniketapanjwani/videos',
            notes: 'Channel RSS identified latest videos on Scott Cunningham, Codex full course, Claude Code, Codex plugin, managed agents, phone/desktop workflows, and economics work.'
        },
        {
            title: 'OpenAI Codex Full Course 4 Hours: Build & Ship',
            sourceType: 'Aniket video',
            status: 'Crawled',
            credibility: 'Practitioner source',
            stage: 'Tools',
            url: 'https://www.youtube.com/watch?v=j7d5rs0iMlE',
            notes: 'Candidate source for tool-specific Codex build workflow; keep separate from the economist mindset spine.'
        },
        {
            title: 'Scott Cunningham - Claude Code, economics research, and returns to expertise',
            sourceType: 'Aniket video',
            status: 'Crawled',
            credibility: 'Economist/practitioner source',
            stage: 'Verification',
            url: 'https://www.youtube.com/watch?v=0MFHo_dywCM',
            notes: 'Use for the “expertise still matters” thread and the applied-econometrics checklist mindset.'
        },
        {
            title: 'AI Agents for Economics Research',
            sourceType: 'Aniket tutorial page',
            status: 'Crawled',
            credibility: 'Practitioner source',
            stage: 'Research',
            url: 'https://ai-mba.io/tutorials/ai-agents-for-economics-research',
            notes: 'Public page describes literature review, coding, data work, replication, writing, and slides for economists.'
        },
        {
            title: 'Claude Blattman',
            sourceType: 'Workflow library',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'System',
            url: 'https://claudeblattman.com',
            notes: 'Chris Blattman’s “AI for professionals who do not code” library: CLAUDE.md, project management, plan review, deep research, and practical workflows.'
        },
        {
            title: 'Scott Cunningham Claude Code series',
            sourceType: 'Substack section',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'Verification',
            url: 'https://causalinf.substack.com/s/claude-code',
            notes: 'Section page and feed confirm a long-running Claude Code series for quantitative and empirical social science projects.'
        },
        {
            title: 'Pedro Sant’Anna Claude Code academic workflow',
            sourceType: 'Workflow template',
            status: 'Crawled',
            credibility: 'Economist primary source',
            stage: 'System',
            url: 'https://psantanna.com/claude-code-my-workflow/',
            notes: 'Production-grade template for papers, lecture slides, data analyses, replication packages, multi-agent review, and quality gates.'
        },
        {
            title: 'StatsClaw',
            sourceType: 'Research/software project',
            status: 'Crawled',
            credibility: 'Academic source',
            stage: 'Data',
            url: 'https://statsclaw.ai',
            notes: 'Yiqing Xu / collaborators: AI collaboration workflow for statistical software development across R, Python, C++, Julia, and Stata.'
        },
        {
            title: 'Yiqing Xu AI/reproducibility papers',
            sourceType: 'Researcher website',
            status: 'Crawled',
            credibility: 'Academic source',
            stage: 'Verification',
            url: 'https://yiqingxu.org',
            notes: 'Research page exposes StatsClaw and AI reproducibility papers; useful for statistical software and reproducibility modules.'
        },
        {
            title: 'Andrej Karpathy AI/software learning materials',
            sourceType: 'Researcher website',
            status: 'Crawled',
            credibility: 'Primary source',
            stage: 'Mindset',
            url: 'https://karpathy.ai',
            notes: 'Use selectively for the control-surface mindset: English as programming interface, but understanding cannot be outsourced.'
        },
        {
            title: 'Jeremy Nguyen / A.I. for Humans',
            sourceType: 'X screenshot',
            status: 'Candidate from X screenshot',
            credibility: 'AI educator / researcher',
            stage: 'Writing',
            url: 'https://x.com/JeremyNguyenPhD',
            notes: 'Screenshot indicates AI for writing, productivity, business, education, and research. Needs deeper X/site crawl before becoming a core source.'
        },
        {
            title: 'Pedro Sant’Anna triple differences package',
            sourceType: 'X screenshot / package link',
            status: 'Candidate from X screenshot',
            credibility: 'Economist primary source',
            stage: 'Verification',
            url: 'https://marcelortiz.com/triplediff/',
            notes: 'Screenshot points to DDD tools and paper; useful for an econometrics verification case study after source verification.'
        }
    ]
};

// Starred GitHub repos (curated from github.com/huylvu stars, 2026-06-11)
window.AI_MIND_DATA.library.push.apply(window.AI_MIND_DATA.library, [
 {
  "id": "gh-obra-superpowers",
  "title": "obra/superpowers",
  "type": "GitHub repo",
  "stage": "System",
  "tool": "Shell",
  "audience": "Starred by Huy",
  "summary": "An agentic skills framework & software development methodology that works.",
  "url": "https://github.com/obra/superpowers",
  "sourceType": "Starred repo",
  "author": "obra",
  "date": "2026-06-11",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Agentic skills framework and dev methodology; the reference point for structuring a skill library.",
  "stats": {
   "likes": 224105,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 224105
  },
  "tags": []
 },
 {
  "id": "gh-multica-ai-andrej-karpathy-skills",
  "title": "multica-ai/andrej-karpathy-skills",
  "type": "GitHub repo",
  "stage": "Mindset",
  "tool": "GitHub",
  "audience": "Starred by Huy",
  "summary": "A single CLAUDE.md file to improve Claude Code behavior, derived from Andrej Karpathy's observations on LLM coding pitfalls.",
  "url": "https://github.com/multica-ai/andrej-karpathy-skills",
  "sourceType": "Starred repo",
  "author": "multica-ai",
  "date": "2026-04-20",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Karpathy-derived CLAUDE.md guidance: explicit assumptions, surgical diffs, verifiable outcomes.",
  "stats": {
   "likes": 173108,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 173108
  },
  "tags": []
 },
 {
  "id": "gh-imbad0202-academic-research-skills",
  "title": "Imbad0202/academic-research-skills",
  "type": "GitHub repo",
  "stage": "Research",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "Academic Research Skills for Claude Code: research → write → review → revise → finalize",
  "url": "https://github.com/Imbad0202/academic-research-skills",
  "sourceType": "Starred repo",
  "author": "Imbad0202",
  "date": "2026-06-11",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Full research-to-paper skill pipeline: research, write, review, revise, finalize.",
  "stats": {
   "likes": 30070,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 30070
  },
  "tags": [
   "academic-pipeline",
   "academic-writing",
   "ai-research",
   "claude",
   "claude-code",
   "literature-review"
  ]
 },
 {
  "id": "gh-galaxy-dawn-claude-scholar",
  "title": "Galaxy-Dawn/claude-scholar",
  "type": "GitHub repo",
  "stage": "Research",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "Semi-automated research assistant for academic research and software development. Supports Claude Code, Codex CLI, Kimi Code CLI, and OpenCode across ideation, ",
  "url": "https://github.com/Galaxy-Dawn/claude-scholar",
  "sourceType": "Starred repo",
  "author": "Galaxy-Dawn",
  "date": "2026-06-05",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Semi-automated research assistant pattern for academic work across Claude tools.",
  "stats": {
   "likes": 4283,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 4283
  },
  "tags": [
   "academic-research",
   "ai-agents",
   "claude",
   "claude-code",
   "codex-cli",
   "developer-tools"
  ]
 },
 {
  "id": "gh-aiming-lab-autoresearchclaw",
  "title": "aiming-lab/AutoResearchClaw",
  "type": "GitHub repo",
  "stage": "Research",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "Fully autonomous & self-evolving research from idea to paper. Chat an Idea. Get a Paper. 🦞",
  "url": "https://github.com/aiming-lab/AutoResearchClaw",
  "sourceType": "Starred repo",
  "author": "aiming-lab",
  "date": "2026-06-03",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Fully autonomous idea-to-paper loop; study it for orchestration patterns and failure modes.",
  "stats": {
   "likes": 13356,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 13356
  },
  "tags": [
   "autonomous-research",
   "citation-verification",
   "llm-agents",
   "metaclaw",
   "multi-agent-debate",
   "openclaw"
  ]
 },
 {
  "id": "gh-learningcircuit-local-deep-research",
  "title": "LearningCircuit/local-deep-research",
  "type": "GitHub repo",
  "stage": "Research",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": " ~95% on SimpleQA (e.g. Qwen3.6-27B on a 3090). Supports all local and cloud LLMs (llama.cpp, Ollama, Google, ...). 10+ search engines - arXiv, PubMed, your pri",
  "url": "https://github.com/LearningCircuit/local-deep-research",
  "sourceType": "Starred repo",
  "author": "LearningCircuit",
  "date": "2026-06-11",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Local deep-research harness; useful blueprint for source sweeps without cloud lock-in.",
  "stats": {
   "likes": 8440,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 8440
  },
  "tags": [
   "academia",
   "anthropic",
   "arxiv",
   "brave",
   "deep-research",
   "encryption"
  ]
 },
 {
  "id": "gh-hanlulong-econ-writing-skill",
  "title": "hanlulong/econ-writing-skill",
  "type": "GitHub repo",
  "stage": "Writing",
  "tool": "Shell",
  "audience": "Starred by Huy",
  "summary": "Agent Skill that transforms AI assistants into expert economics paper writers. Synthesizes 50+ guides by Cochrane, McCloskey, Shapiro, Head, Bellemare, Goldin, ",
  "url": "https://github.com/hanlulong/econ-writing-skill",
  "sourceType": "Starred repo",
  "author": "hanlulong",
  "date": "2026-05-30",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Economics paper-writing skill distilled from 50+ guides; direct course material.",
  "stats": {
   "likes": 360,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 360
  },
  "tags": []
 },
 {
  "id": "gh-wantongc-journal-adapt-writing-skill",
  "title": "WantongC/journal-adapt-writing-skill",
  "type": "GitHub repo",
  "stage": "Writing",
  "tool": "GitHub",
  "audience": "Starred by Huy",
  "summary": "Learn any journal's writing conventions from its published papers, then revise your manuscript to match — section by section.",
  "url": "https://github.com/WantongC/journal-adapt-writing-skill",
  "sourceType": "Starred repo",
  "author": "WantongC",
  "date": "2026-05-15",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Learns a target journal's conventions from its published papers, then adapts your manuscript.",
  "stats": {
   "likes": 675,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 675
  },
  "tags": [
   "academic-writing",
   "claude",
   "economics",
   "journal",
   "latex",
   "llm"
  ]
 },
 {
  "id": "gh-hardikpandya-stop-slop",
  "title": "hardikpandya/stop-slop",
  "type": "GitHub repo",
  "stage": "Writing",
  "tool": "GitHub",
  "audience": "Starred by Huy",
  "summary": "A skill file for removing AI tells from prose",
  "url": "https://github.com/hardikpandya/stop-slop",
  "sourceType": "Starred repo",
  "author": "hardikpandya",
  "date": "2026-03-17",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Anti-AI-tells prose skill; pairs with the course's writing-verification stance.",
  "stats": {
   "likes": 9953,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 9953
  },
  "tags": []
 },
 {
  "id": "gh-delibae-claude-prism",
  "title": "delibae/claude-prism",
  "type": "GitHub repo",
  "stage": "Writing",
  "tool": "TypeScript",
  "audience": "Starred by Huy",
  "summary": "An offline-first scientific writing workspace powered by Claude. LaTeX + Python + 100+ scientific skills all running locally.",
  "url": "https://github.com/delibae/claude-prism",
  "sourceType": "Starred repo",
  "author": "delibae",
  "date": "2026-06-09",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Offline-first scientific writing workspace: LaTeX + Python + scientific skills.",
  "stats": {
   "likes": 1568,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 1568
  },
  "tags": [
   "academic",
   "ai",
   "claude",
   "claude-code",
   "desktop-app",
   "editor"
  ]
 },
 {
  "id": "gh-nutlope-hallmark",
  "title": "Nutlope/hallmark",
  "type": "GitHub repo",
  "stage": "Tools",
  "tool": "CSS",
  "audience": "Starred by Huy",
  "summary": "Anti-AI-slop design skill for Claude Code, Cursor, and Codex.",
  "url": "https://github.com/Nutlope/hallmark",
  "sourceType": "Starred repo",
  "author": "Nutlope",
  "date": "2026-06-04",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Anti-slop design skill for agent-built interfaces.",
  "stats": {
   "likes": 3030,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 3030
  },
  "tags": []
 },
 {
  "id": "gh-leonxlnx-taste-skill",
  "title": "Leonxlnx/taste-skill",
  "type": "GitHub repo",
  "stage": "Tools",
  "tool": "Shell",
  "audience": "Starred by Huy",
  "summary": "Taste-Skill - gives your AI good taste. stops the AI from generating boring, generic slop ",
  "url": "https://github.com/Leonxlnx/taste-skill",
  "sourceType": "Starred repo",
  "author": "Leonxlnx",
  "date": "2026-06-09",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Taste constraints for agents; stops generic generated design.",
  "stats": {
   "likes": 41032,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 41032
  },
  "tags": [
   "agent",
   "ai",
   "claude",
   "claude-code",
   "codex",
   "coding"
  ]
 },
 {
  "id": "gh-greensock-gsap-skills",
  "title": "greensock/gsap-skills",
  "type": "GitHub repo",
  "stage": "Tools",
  "tool": "GitHub",
  "audience": "Starred by Huy",
  "summary": "Official AI skills for GSAP. These skills teach AI coding agents how to correctly use GSAP (GreenSock Animation Platform), including best practices, common anim",
  "url": "https://github.com/greensock/gsap-skills",
  "sourceType": "Starred repo",
  "author": "greensock",
  "date": "2026-04-21",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Official GSAP skills: correct animation, ScrollTrigger, and performance usage for agents.",
  "stats": {
   "likes": 8902,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 8902
  },
  "tags": []
 },
 {
  "id": "gh-ykdojo-claude-code-tips",
  "title": "ykdojo/claude-code-tips",
  "type": "GitHub repo",
  "stage": "Tools",
  "tool": "HTML",
  "audience": "Starred by Huy",
  "summary": "43 tips for getting the most out of Claude Code, from basics to advanced - includes a custom status line script and Claude Code running itself in a container. A",
  "url": "https://github.com/ykdojo/claude-code-tips",
  "sourceType": "Starred repo",
  "author": "ykdojo",
  "date": "2026-06-11",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "43 field-tested Claude Code tips from basics to advanced.",
  "stats": {
   "likes": 8682,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 8682
  },
  "tags": [
   "agentic",
   "agentic-ai",
   "agentic-coding",
   "agentic-workflow",
   "ai",
   "claude"
  ]
 },
 {
  "id": "gh-zarazhangrui-frontend-slides",
  "title": "zarazhangrui/frontend-slides",
  "type": "GitHub repo",
  "stage": "Tools",
  "tool": "JavaScript",
  "audience": "Starred by Huy",
  "summary": "Create beautiful slides on the web using a coding agent's frontend skills",
  "url": "https://github.com/zarazhangrui/frontend-slides",
  "sourceType": "Starred repo",
  "author": "zarazhangrui",
  "date": "2026-06-10",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Slide decks built by coding agents; the pattern behind deck-style course materials.",
  "stats": {
   "likes": 21198,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 21198
  },
  "tags": [
   "ai-slides",
   "anthropic",
   "claude",
   "claude-code",
   "claude-skill",
   "generative-ui"
  ]
 },
 {
  "id": "gh-imnmv-clauder",
  "title": "IMNMV/ClaudeR",
  "type": "GitHub repo",
  "stage": "Tools",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "Connect RStudio to Claude Code, Codex, Gemini, and other LLM agents via MCP. Multi-agent orchestration, automated manuscript   auditing, and zero-config setup w",
  "url": "https://github.com/IMNMV/ClaudeR",
  "sourceType": "Starred repo",
  "author": "IMNMV",
  "date": "2026-06-08",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "RStudio connected to Claude/Codex via MCP; the bridge for R-first economists.",
  "stats": {
   "likes": 266,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 266
  },
  "tags": [
   "agent",
   "ai",
   "claude",
   "cli",
   "codex",
   "data-science"
  ]
 },
 {
  "id": "gh-pedrohcgs-claude-code-my-workflow",
  "title": "pedrohcgs/claude-code-my-workflow",
  "type": "GitHub repo",
  "stage": "System",
  "tool": "HTML",
  "audience": "Starred by Huy",
  "summary": "A ready-to-fork Claude Code template for academics using LaTeX/Beamer + R. Multi-agent review, quality gates, adversarial QA, and replication protocols.",
  "url": "https://github.com/pedrohcgs/claude-code-my-workflow",
  "sourceType": "Starred repo",
  "author": "pedrohcgs",
  "date": "2026-06-10",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Ready-to-fork Claude Code template for academics: LaTeX/Beamer + R with multi-agent review.",
  "stats": {
   "likes": 1249,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 1249
  },
  "tags": [
   "academic-writing",
   "causal-inference",
   "claude-code",
   "claude-code-skills",
   "econometrics",
   "economics"
  ]
 },
 {
  "id": "gh-railly-agentfiles",
  "title": "Railly/agentfiles",
  "type": "GitHub repo",
  "stage": "System",
  "tool": "TypeScript",
  "audience": "Starred by Huy",
  "summary": "Browse, create, and edit AI agent files across Claude Code, Cursor, Codex, and 13+ tools — from Obsidian.",
  "url": "https://github.com/Railly/agentfiles",
  "sourceType": "Starred repo",
  "author": "Railly",
  "date": "2026-05-17",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Browse and edit agent files across Claude Code, Cursor, Codex and 13+ tools.",
  "stats": {
   "likes": 586,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 586
  },
  "tags": [
   "agent-skills",
   "ai-agents",
   "ai-tools",
   "claude-code",
   "codex",
   "coding-agents"
  ]
 },
 {
  "id": "gh-k-dense-ai-mimeo",
  "title": "K-Dense-AI/mimeo",
  "type": "GitHub repo",
  "stage": "System",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "Mimeograph an expert into a SKILL.md or AGENTS.md for your agent.",
  "url": "https://github.com/K-Dense-AI/mimeo",
  "sourceType": "Starred repo",
  "author": "K-Dense-AI",
  "date": "2026-05-27",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Mimeograph an expert into SKILL.md / AGENTS.md; the skill-from-corpus pattern.",
  "stats": {
   "likes": 193,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 193
  },
  "tags": []
 },
 {
  "id": "gh-microsoft-skillopt",
  "title": "microsoft/SkillOpt",
  "type": "GitHub repo",
  "stage": "System",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "SkillOpt is a text-space optimizer that trains reusable natural-language skills for frozen LLM agents through trajectory-driven edits, validation-gated updates,",
  "url": "https://github.com/microsoft/SkillOpt",
  "sourceType": "Starred repo",
  "author": "microsoft",
  "date": "2026-06-10",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Text-space optimizer that trains reusable natural-language skills for frozen LLMs.",
  "stats": {
   "likes": 5706,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 5706
  },
  "tags": [
   "agent-skills",
   "self-evolving-agents"
  ]
 },
 {
  "id": "gh-affaan-m-ecc",
  "title": "affaan-m/ECC",
  "type": "GitHub repo",
  "stage": "System",
  "tool": "JavaScript",
  "audience": "Starred by Huy",
  "summary": "The agent harness performance optimization system. Skills, instincts, memory, security, and research-first development for Claude Code, Codex, Opencode, Cursor ",
  "url": "https://github.com/affaan-m/ECC",
  "sourceType": "Starred repo",
  "author": "affaan-m",
  "date": "2026-06-11",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Agent harness optimization: skills, instincts, memory, security, and resources.",
  "stats": {
   "likes": 213010,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 213010
  },
  "tags": [
   "ai-agents",
   "anthropic",
   "claude",
   "claude-code",
   "developer-tools",
   "llm"
  ]
 },
 {
  "id": "gh-x1xhlol-system-prompts-and-models-of-ai-tools",
  "title": "x1xhlol/system-prompts-and-models-of-ai-tools",
  "type": "GitHub repo",
  "stage": "Context",
  "tool": "GitHub",
  "audience": "Starred by Huy",
  "summary": "FULL Augment Code, Claude Code, Cluely, CodeBuddy, Comet, Cursor, Devin AI, Junie, Kiro, Leap.new, Lovable, Manus, NotionAI, Orchids.app, Perplexity, Poke, Qode",
  "url": "https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools",
  "sourceType": "Starred repo",
  "author": "x1xhlol",
  "date": "2026-06-09",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "System prompts of major AI tools; read to understand how production agents are instructed.",
  "stats": {
   "likes": 139669,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 139669
  },
  "tags": [
   "ai",
   "bolt",
   "cluely",
   "copilot",
   "cursor",
   "cursorai"
  ]
 },
 {
  "id": "gh-genexis-ai-chromex",
  "title": "GENEXIS-AI/chromex",
  "type": "GitHub repo",
  "stage": "Tools",
  "tool": "TypeScript",
  "audience": "Starred by Huy",
  "summary": "A Codex-powered Chrome side-panel assistant for page context, tabs, voice, and image workflows.",
  "url": "https://github.com/GENEXIS-AI/chromex",
  "sourceType": "Starred repo",
  "author": "GENEXIS-AI",
  "date": "2026-05-10",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Codex-powered Chrome side panel for page context, tabs, voice, and image workflows.",
  "stats": {
   "likes": 1132,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 1132
  },
  "tags": []
 },
 {
  "id": "gh-hkcanan-katmer-code",
  "title": "hkcanan/katmer-code",
  "type": "GitHub repo",
  "stage": "Memory",
  "tool": "TypeScript",
  "audience": "Starred by Huy",
  "summary": "Multi-provider AI sidebar for Obsidian — Claude, Gemini, Codex, Antigravity. Per-tab routing, same-tab consult, inline diff, CLAUDE.md auto-mirror, academic res",
  "url": "https://github.com/hkcanan/katmer-code",
  "sourceType": "Starred repo",
  "author": "hkcanan",
  "date": "2026-05-26",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Multi-provider AI sidebar inside Obsidian with per-tab routing.",
  "stats": {
   "likes": 452,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 452
  },
  "tags": [
   "academic-research",
   "ai",
   "antigravity",
   "chatgpt",
   "claude",
   "codex"
  ]
 },
 {
  "id": "gh-ar9av-obsidian-wiki",
  "title": "Ar9av/obsidian-wiki",
  "type": "GitHub repo",
  "stage": "Memory",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "Framework for AI agents to build and maintain a digital brain through Obsidian wiki using Karpathy's LLM Wiki pattern",
  "url": "https://github.com/Ar9av/obsidian-wiki",
  "sourceType": "Starred repo",
  "author": "Ar9av",
  "date": "2026-06-11",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Agents maintaining a digital brain in Obsidian, Karpathy-style; close to the course wiki-memory module.",
  "stats": {
   "likes": 1802,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 1802
  },
  "tags": [
   "agent-skills",
   "brain",
   "knowledge-base",
   "llm-tools",
   "obsidian",
   "wiki"
  ]
 },
 {
  "id": "gh-gnekt-my-brain-is-full-crew",
  "title": "gnekt/My-Brain-Is-Full-Crew",
  "type": "GitHub repo",
  "stage": "Memory",
  "tool": "Shell",
  "audience": "Starred by Huy",
  "summary": "Built by a PhD whose memory was failing, whose diet was a mess, and whose anxiety had its own agenda. Most second brain tools ignore the fact that your brain do",
  "url": "https://github.com/gnekt/My-Brain-Is-Full-Crew",
  "sourceType": "Starred repo",
  "author": "gnekt",
  "date": "2026-05-10",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "A PhD's personal agent crew for memory, routines, and life ops; useful end-to-end example.",
  "stats": {
   "likes": 3165,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 3165
  },
  "tags": []
 },
 {
  "id": "gh-unclecode-crawl4ai",
  "title": "unclecode/crawl4ai",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "🚀🤖 Crawl4AI: Open-source LLM Friendly Web Crawler & Scraper. Don't be shy, join here: https://discord.gg/jP8KfhDhyN",
  "url": "https://github.com/unclecode/crawl4ai",
  "sourceType": "Starred repo",
  "author": "unclecode",
  "date": "2026-06-04",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "LLM-friendly web crawler and scraper; the workhorse for source-to-dataset lessons.",
  "stats": {
   "likes": 68252,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 68252
  },
  "tags": []
 },
 {
  "id": "gh-run-llama-liteparse",
  "title": "run-llama/liteparse",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "Rust",
  "audience": "Starred by Huy",
  "summary": "A fast, helpful, and open-source document parser",
  "url": "https://github.com/run-llama/liteparse",
  "sourceType": "Starred repo",
  "author": "run-llama",
  "date": "2026-06-11",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Fast open-source document parser for AI-ready data.",
  "stats": {
   "likes": 9862,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 9862
  },
  "tags": [
   "document-ocr",
   "document-processing",
   "ocr",
   "ocr-recognition",
   "pdf",
   "pdf-parser"
  ]
 },
 {
  "id": "gh-opendataloader-project-opendataloader-pdf",
  "title": "opendataloader-project/opendataloader-pdf",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "Java",
  "audience": "Starred by Huy",
  "summary": "PDF Parser for AI-ready data. Automate PDF accessibility. Open-source.",
  "url": "https://github.com/opendataloader-project/opendataloader-pdf",
  "sourceType": "Starred repo",
  "author": "opendataloader-project",
  "date": "2026-06-11",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "PDF parsing for AI-ready data at scale; pairs with the crawling module.",
  "stats": {
   "likes": 24356,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 24356
  },
  "tags": [
   "a11y",
   "accessibility",
   "ai",
   "bounding-box",
   "document-parsing",
   "eaa"
  ]
 },
 {
  "id": "gh-sinaptik-ai-pandas-ai",
  "title": "sinaptik-ai/pandas-ai",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "Chat with your database or your datalake (SQL, CSV, parquet). PandasAI makes data analysis conversational using LLMs and RAG.",
  "url": "https://github.com/sinaptik-ai/pandas-ai",
  "sourceType": "Starred repo",
  "author": "sinaptik-ai",
  "date": "2025-10-28",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Conversational analysis over dataframes and databases; assess where it helps vs. hides logic.",
  "stats": {
   "likes": 23582,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 23582
  },
  "tags": [
   "ai",
   "csv",
   "data",
   "data-analysis",
   "data-science",
   "data-visualization"
  ]
 },
 {
  "id": "gh-fromcsuzhou-econometrics-agent",
  "title": "FromCSUZhou/Econometrics-Agent",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "Econometrics AI Agent: A specialized LLM-driven agent for automating complex econometric analysis with zero-shot learning, outperforming general AI in expert ta",
  "url": "https://github.com/FromCSUZhou/Econometrics-Agent",
  "sourceType": "Starred repo",
  "author": "FromCSUZhou",
  "date": "2025-07-01",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "LLM-driven agent for automating econometric analysis; benchmark its claims against the O-ring rule.",
  "stats": {
   "likes": 355,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 355
  },
  "tags": []
 },
 {
  "id": "gh-cinnamon-kotaemon",
  "title": "Cinnamon/kotaemon",
  "type": "GitHub repo",
  "stage": "Sources",
  "tool": "Python",
  "audience": "Starred by Huy",
  "summary": "An open-source RAG-based tool for chatting with your documents.",
  "url": "https://github.com/Cinnamon/kotaemon",
  "sourceType": "Starred repo",
  "author": "Cinnamon",
  "date": "2026-06-09",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Open RAG tool for chatting with documents; candidate for the paper-grounded reading stack.",
  "stats": {
   "likes": 25453,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 25453
  },
  "tags": [
   "chatbot",
   "llms",
   "open-source",
   "rag"
  ]
 },
 {
  "id": "gh-0xnyk-council-of-high-intelligence",
  "title": "0xNyk/council-of-high-intelligence",
  "type": "GitHub repo",
  "stage": "Verification",
  "tool": "Shell",
  "audience": "Starred by Huy",
  "summary": "18 AI personas deliberate your hardest decisions across multiple LLM providers. Aristotle, Feynman, Kahneman, Torvalds & more — structured multi-round deliberat",
  "url": "https://github.com/0xNyk/council-of-high-intelligence",
  "sourceType": "Starred repo",
  "author": "0xNyk",
  "date": "2026-05-21",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Multi-persona deliberation across providers; a pattern for adversarial review panels.",
  "stats": {
   "likes": 943,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 943
  },
  "tags": [
   "ai-agents",
   "claude",
   "claude-code",
   "decision-making",
   "deliberation",
   "gemini"
  ]
 },
 {
  "id": "gh-lrberge-fixest",
  "title": "lrberge/fixest",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "R",
  "audience": "Starred by Huy",
  "summary": "Fixed-effects estimations",
  "url": "https://github.com/lrberge/fixest",
  "sourceType": "Starred repo",
  "author": "lrberge",
  "date": "2026-06-10",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Fast fixed-effects estimation in R; core applied-econ tooling.",
  "stats": {
   "likes": 445,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 445
  },
  "tags": []
 },
 {
  "id": "gh-sergiocorreia-reghdfe",
  "title": "sergiocorreia/reghdfe",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "Stata",
  "audience": "Starred by Huy",
  "summary": "Linear, IV and GMM Regressions With Any Number of Fixed Effects",
  "url": "https://github.com/sergiocorreia/reghdfe",
  "sourceType": "Starred repo",
  "author": "sergiocorreia",
  "date": "2026-03-19",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Linear, IV and GMM regressions with any number of fixed effects in Stata.",
  "stats": {
   "likes": 250,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 250
  },
  "tags": [
   "fixed-effects",
   "linear-models",
   "ols",
   "regression",
   "stata"
  ]
 },
 {
  "id": "gh-worldbank-ietoolkit",
  "title": "worldbank/ietoolkit",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "Stata",
  "audience": "Starred by Huy",
  "summary": "Stata commands designed for Impact Evaluations in particular, but also data work in general",
  "url": "https://github.com/worldbank/ietoolkit",
  "sourceType": "Starred repo",
  "author": "worldbank",
  "date": "2026-03-31",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Stata commands for impact evaluation and disciplined data work.",
  "stats": {
   "likes": 239,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 239
  },
  "tags": [
   "ado",
   "balance-table",
   "dime",
   "impact-evaluations",
   "pscore-matching",
   "stata"
  ]
 },
 {
  "id": "gh-kmueller-lab-global-macro-database",
  "title": "KMueller-Lab/Global-Macro-Database",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "Stata",
  "audience": "Starred by Huy",
  "summary": "This repository includes replication code and raw data used in the construction of the Global Macro Database.",
  "url": "https://github.com/KMueller-Lab/Global-Macro-Database",
  "sourceType": "Starred repo",
  "author": "KMueller-Lab",
  "date": "2026-04-30",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Replication code and raw data behind the Global Macro Database.",
  "stats": {
   "likes": 247,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 247
  },
  "tags": []
 },
 {
  "id": "gh-quartz-bad-data-guide",
  "title": "Quartz/bad-data-guide",
  "type": "GitHub repo",
  "stage": "Data",
  "tool": "GitHub",
  "audience": "Starred by Huy",
  "summary": "An exhaustive reference to problems seen in real-world data along with suggestions on how to resolve them.",
  "url": "https://github.com/Quartz/bad-data-guide",
  "sourceType": "Starred repo",
  "author": "Quartz",
  "date": "2021-09-20",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "An exhaustive catalog of real-world data problems and what to do about them.",
  "stats": {
   "likes": 4118,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 4118
  },
  "tags": [
   "data",
   "documentation",
   "guide",
   "qz-things"
  ]
 },
 {
  "id": "gh-vikjam-mostly-harmless-replication",
  "title": "vikjam/mostly-harmless-replication",
  "type": "GitHub repo",
  "stage": "Verification",
  "tool": "Stata",
  "audience": "Starred by Huy",
  "summary": "Replication of tables and figures from \"Mostly Harmless Econometrics\" in Stata, R, Python and Julia. ",
  "url": "https://github.com/vikjam/mostly-harmless-replication",
  "sourceType": "Starred repo",
  "author": "vikjam",
  "date": "2025-06-29",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Mostly Harmless Econometrics tables replicated in Stata, R, Python and Julia.",
  "stats": {
   "likes": 657,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 657
  },
  "tags": [
   "econometrics",
   "economics",
   "julia",
   "python",
   "r",
   "replication"
  ]
 },
 {
  "id": "gh-paulgp-applied-methods-phd",
  "title": "paulgp/applied-methods-phd",
  "type": "GitHub repo",
  "stage": "Verification",
  "tool": "TeX",
  "audience": "Starred by Huy",
  "summary": "Repo for Yale Applied Empirical Methods PHD Course",
  "url": "https://github.com/paulgp/applied-methods-phd",
  "sourceType": "Starred repo",
  "author": "paulgp",
  "date": "2026-04-30",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Paul Goldsmith-Pinkham's applied empirical methods PhD course; the course's methodological spine.",
  "stats": {
   "likes": 2216,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 2216
  },
  "tags": []
 },
 {
  "id": "gh-borusyak-are213",
  "title": "borusyak/are213",
  "type": "GitHub repo",
  "stage": "Verification",
  "tool": "GitHub",
  "audience": "Starred by Huy",
  "summary": "PhD Applied Econometrics class taught at UC Berkeley",
  "url": "https://github.com/borusyak/are213",
  "sourceType": "Starred repo",
  "author": "borusyak",
  "date": "2026-02-02",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Borusyak's PhD applied econometrics class at Berkeley.",
  "stats": {
   "likes": 378,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 378
  },
  "tags": []
 },
 {
  "id": "gh-gabors-data-analysis-da_case_studies",
  "title": "gabors-data-analysis/da_case_studies",
  "type": "GitHub repo",
  "stage": "Verification",
  "tool": "Jupyter Notebook",
  "audience": "Starred by Huy",
  "summary": "Codes for case studies for the Bekes-Kezdi Data Analysis textbook",
  "url": "https://github.com/gabors-data-analysis/da_case_studies",
  "sourceType": "Starred repo",
  "author": "gabors-data-analysis",
  "date": "2026-06-07",
  "status": "Starred",
  "credibility": "Starred repo",
  "relevance": "Case-study code for the Bekes-Kezdi Data Analysis textbook.",
  "stats": {
   "likes": 244,
   "reposts": 0,
   "replies": 0,
   "views": 0,
   "engagement": 244
  },
  "tags": []
 }
]);
