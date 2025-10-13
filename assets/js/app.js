// Game State
let gameState = {
    capital: 100000,
    marketShare: 1,
    employees: 5,
    technology: 'Cơ bản',
    round: 1,
    scenarios: [
        {
            text: "Bạn vừa thành lập một startup công nghệ. Một tập đoàn lớn đang cạnh tranh trực tiếp với bạn bằng cách giảm giá sản phẩm xuống 50%. Bạn sẽ làm gì?",
            choices: [
                { text: "Giảm giá để cạnh tranh", impact: { capital: -20000, marketShare: 2, employees: -1 } },
                { text: "Tập trung vào chất lượng", impact: { capital: -15000, marketShare: 1, technology: "Trung bình" } },
                { text: "Tìm đối tác liên minh", impact: { capital: -10000, marketShare: 3, employees: 2 } },
                { text: "Đổi mới sáng tạo", impact: { capital: -25000, marketShare: 2, technology: "Tiên tiến" } }
            ]
        },
        {
            text: "Một tập đoàn lớn muốn mua lại công ty của bạn với giá 500,000 VNĐ. Bạn sẽ làm gì?",
            choices: [
                { text: "Chấp nhận bán", impact: { capital: 500000, marketShare: 0, employees: 0 } },
                { text: "Từ chối và tiếp tục", impact: { capital: -10000, marketShare: 1, employees: 1 } },
                { text: "Đàm phán giá cao hơn", impact: { capital: 300000, marketShare: 0, employees: 0 } },
                { text: "Hợp tác thay vì bán", impact: { capital: 50000, marketShare: 5, employees: 3 } }
            ]
        },
        {
            text: "Công ty của bạn đang phát triển tốt nhưng gặp khó khăn về nhân lực. Bạn sẽ làm gì?",
            choices: [
                { text: "Tăng lương để thu hút", impact: { capital: -30000, employees: 3 } },
                { text: "Đào tạo nhân viên hiện tại", impact: { capital: -20000, technology: "Tiên tiến", employees: 1 } },
                { text: "Thuê ngoài", impact: { capital: -15000, employees: 2 } },
                { text: "Tự động hóa", impact: { capital: -40000, technology: "Tiên tiến", employees: -1 } }
            ]
        }
    ]
};

// Company Analysis Data
const companyAnalysis = {
    google: {
        title: "Google - Phân tích theo lý thuyết Mác-Lênin",
        content: `
            <h3>🔍 Đặc điểm độc quyền:</h3>
            <ul>
                <li><strong>Thị phần tìm kiếm:</strong> 90%+ trên toàn cầu</li>
                <li><strong>Kiểm soát dữ liệu:</strong> Thu thập và sử dụng dữ liệu người dùng</li>
                <li><strong>Quảng cáo:</strong> Thống trị thị trường quảng cáo trực tuyến</li>
            </ul>
            
            <h3>📊 Tác động theo Mác-Lênin:</h3>
            <ul>
                <li><strong>Bóc lột giá trị thặng dư:</strong> Tạo ra lợi nhuận khổng lồ từ lao động của người dùng</li>
                <li><strong>Tập trung tư bản:</strong> Sáp nhập và mua lại các công ty nhỏ</li>
                <li><strong>Độc quyền công nghệ:</strong> Kiểm soát các thuật toán và nền tảng</li>
            </ul>
            
            <h3>⚠️ Tác động tiêu cực:</h3>
            <ul>
                <li>Khó khăn cho các công cụ tìm kiếm mới</li>
                <li>Kiểm soát thông tin và ý kiến công chúng</li>
                <li>Vi phạm quyền riêng tư người dùng</li>
            </ul>
        `
    },
    amazon: {
        title: "Amazon - Phân tích theo lý thuyết Mác-Lênin",
        content: `
            <h3>🛒 Đặc điểm độc quyền:</h3>
            <ul>
                <li><strong>Thương mại điện tử:</strong> Thống trị thị trường B2C</li>
                <li><strong>AWS:</strong> Dẫn đầu dịch vụ đám mây</li>
                <li><strong>Logistics:</strong> Kiểm soát chuỗi phân phối</li>
            </ul>
            
            <h3>📊 Tác động theo Mác-Lênin:</h3>
            <ul>
                <li><strong>Bóc lột lao động:</strong> Điều kiện làm việc khắc nghiệt tại kho</li>
                <li><strong>Độc quyền giá cả:</strong> Thao túng giá sản phẩm</li>
                <li><strong>Tập trung tư bản:</strong> Mua lại các đối thủ cạnh tranh</li>
            </ul>
            
            <h3>⚠️ Tác động tiêu cực:</h3>
            <ul>
                <li>Phá hủy các cửa hàng truyền thống</li>
                <li>Bóc lột người bán trên nền tảng</li>
                <li>Điều kiện lao động không công bằng</li>
            </ul>
        `
    },
    shopee: {
        title: "Shopee - Phân tích theo lý thuyết Mác-Lênin",
        content: `
            <h3>🛍️ Đặc điểm độc quyền:</h3>
            <ul>
                <li><strong>Thị trường Đông Nam Á:</strong> Dẫn đầu tại nhiều quốc gia</li>
                <li><strong>Thanh toán điện tử:</strong> Tích hợp dịch vụ tài chính</li>
                <li><strong>Logistics:</strong> Mạng lưới phân phối rộng</li>
            </ul>
            
            <h3>📊 Tác động theo Mác-Lênin:</h3>
            <ul>
                <li><strong>Bóc lột người bán:</strong> Phí hoa hồng cao</li>
                <li><strong>Tập trung tư bản:</strong> Được hỗ trợ bởi Sea Limited</li>
                <li><strong>Độc quyền thông tin:</strong> Kiểm soát dữ liệu người dùng</li>
            </ul>
            
            <h3>⚠️ Tác động tiêu cực:</h3>
            <ul>
                <li>Khó khăn cho các nền tảng thương mại điện tử nhỏ</li>
                <li>Phụ thuộc vào một nền tảng duy nhất</li>
                <li>Rủi ro về quyền riêng tư dữ liệu</li>
            </ul>
        `
    },
    grab: {
        title: "Grab - Phân tích theo lý thuyết Mác-Lênin",
        content: `
            <h3>🚗 Đặc điểm độc quyền:</h3>
            <ul>
                <li><strong>Dịch vụ gọi xe:</strong> Thống trị thị trường Đông Nam Á</li>
                <li><strong>Giao hàng:</strong> Mở rộng sang logistics</li>
                <li><strong>Thanh toán:</strong> GrabPay tích hợp</li>
            </ul>
            
            <h3>📊 Tác động theo Mác-Lênin:</h3>
            <ul>
                <li><strong>Bóc lột tài xế:</strong> Phí hoa hồng cao, không có bảo hiểm</li>
                <li><strong>Độc quyền giá cả:</strong> Thao túng giá cước</li>
                <li><strong>Tập trung tư bản:</strong> Mua lại các đối thủ</li>
            </ul>
            
            <h3>⚠️ Tác động tiêu cực:</h3>
            <ul>
                <li>Điều kiện lao động không ổn định cho tài xế</li>
                <li>Phá hủy ngành taxi truyền thống</li>
                <li>Phụ thuộc vào một nền tảng duy nhất</li>
            </ul>
        `
    }
};

// AI Chat Responses
const aiResponses = {
    "cạnh tranh độc quyền": "Cạnh tranh độc quyền là hình thức cạnh tranh giữa các tập đoàn lớn có khả năng thao túng thị trường. Theo Mác-Lênin, đây là giai đoạn phát triển cao của chủ nghĩa tư bản, nơi tư bản tập trung và tập trung hóa đạt mức độ cao.",
    
    "bóc lột": "Bóc lột trong chủ nghĩa tư bản là việc tư bản chiếm đoạt giá trị thặng dư do người lao động tạo ra. Các tập đoàn lớn bóc lột không chỉ người lao động mà còn cả người tiêu dùng thông qua việc thu thập và sử dụng dữ liệu cá nhân.",
    
    "tập trung tư bản": "Tập trung tư bản là quá trình tích tụ tư bản vào tay một số ít các tập đoàn lớn. Điều này dẫn đến việc hình thành các độc quyền và oligopoly, làm giảm tính cạnh tranh thực sự trên thị trường.",
    
    "giải pháp": "Để đối phó với cạnh tranh độc quyền, sinh viên cần: 1) Nâng cao nhận thức về bản chất của chủ nghĩa tư bản, 2) Hỗ trợ các doanh nghiệp nhỏ và startup, 3) Thúc đẩy tính minh bạch và công bằng trong kinh doanh, 4) Phát triển các mô hình kinh tế hợp tác.",
    
    "startup": "Startup trong môi trường cạnh tranh độc quyền gặp nhiều khó khăn: thiếu vốn, khó tiếp cận thị trường, bị các tập đoàn lớn mua lại hoặc loại bỏ. Cần có chính sách hỗ trợ và bảo vệ các doanh nghiệp nhỏ."
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeGame();
    initializeChat();
    initializeModal();
    initializeStudio();
    initializeTheme();
});

// Navigation functionality
function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const contentSections = document.querySelectorAll('.content-section');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and sections
            navTabs.forEach(t => t.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Game functionality
function initializeGame() {
    updateGameStats();
}

function updateGameStats() {
    document.getElementById('capital').textContent = formatNumber(gameState.capital) + ' VNĐ';
    document.getElementById('market-share').textContent = gameState.marketShare + '%';
    document.getElementById('employees').textContent = gameState.employees;
    document.getElementById('technology').textContent = gameState.technology;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function makeChoice(choiceIndex) {
    const currentScenario = gameState.scenarios[gameState.round - 1];
    const choice = currentScenario.choices[choiceIndex - 1];
    
    // Apply impact
    if (choice.impact.capital) gameState.capital += choice.impact.capital;
    if (choice.impact.marketShare) gameState.marketShare += choice.impact.marketShare;
    if (choice.impact.employees) gameState.employees += choice.impact.employees;
    if (choice.impact.technology) gameState.technology = choice.impact.technology;
    
    // Update stats
    updateGameStats();
    
    // Show result
    showGameResult(choice);
    
    // Check if game should continue
    if (gameState.round < gameState.scenarios.length) {
        setTimeout(() => {
            nextScenario();
        }, 3000);
    } else {
        setTimeout(() => {
            endGame();
        }, 3000);
    }
}

function showGameResult(choice) {
    const resultDiv = document.getElementById('game-result');
    let resultText = `<h3>Kết quả:</h3><p>Bạn đã chọn: <strong>${choice.text}</strong></p>`;
    
    if (choice.impact.capital) {
        resultText += `<p>Vốn: ${choice.impact.capital > 0 ? '+' : ''}${formatNumber(choice.impact.capital)} VNĐ</p>`;
    }
    if (choice.impact.marketShare) {
        resultText += `<p>Thị phần: ${choice.impact.marketShare > 0 ? '+' : ''}${choice.impact.marketShare}%</p>`;
    }
    if (choice.impact.employees) {
        resultText += `<p>Nhân viên: ${choice.impact.employees > 0 ? '+' : ''}${choice.impact.employees}</p>`;
    }
    if (choice.impact.technology) {
        resultText += `<p>Công nghệ: ${choice.impact.technology}</p>`;
    }
    
    resultDiv.innerHTML = resultText;
    resultDiv.classList.add('show');
}

function nextScenario() {
    gameState.round++;
    const currentScenario = gameState.scenarios[gameState.round - 1];
    
    document.getElementById('scenario-text').textContent = currentScenario.text;
    document.getElementById('game-result').classList.remove('show');
}

function endGame() {
    const resultDiv = document.getElementById('game-result');
    let finalResult = `<h3>🎉 Kết thúc trò chơi!</h3>`;
    
    if (gameState.capital > 200000 && gameState.marketShare > 5) {
        finalResult += `<p><strong>Chúc mừng!</strong> Bạn đã thành công xây dựng một doanh nghiệp mạnh mẽ!</p>`;
    } else if (gameState.capital < 50000 || gameState.marketShare < 1) {
        finalResult += `<p><strong>Thất bại!</strong> Doanh nghiệp của bạn đã phá sản hoặc bị loại bỏ khỏi thị trường.</p>`;
    } else {
        finalResult += `<p><strong>Tạm ổn!</strong> Doanh nghiệp của bạn vẫn tồn tại nhưng cần cải thiện thêm.</p>`;
    }
    
    finalResult += `<p>Điều này cho thấy sự khó khăn của các doanh nghiệp nhỏ trong môi trường cạnh tranh độc quyền!</p>`;
    
    resultDiv.innerHTML = finalResult;
}

// Company analysis functionality
function analyzeCompany(company) {
    const modal = document.getElementById('analysis-modal');
    const content = document.getElementById('analysis-content');
    
    const analysis = companyAnalysis[company];
    content.innerHTML = `
        <h2>${analysis.title}</h2>
        ${analysis.content}
        <div style="margin-top: 2rem; padding: 1rem; background: #e3f2fd; border-radius: 8px;">
            <h4>💡 Đề xuất cho sinh viên:</h4>
            <ul>
                <li>Nâng cao nhận thức về bản chất của các tập đoàn độc quyền</li>
                <li>Hỗ trợ các doanh nghiệp nhỏ và startup địa phương</li>
                <li>Thúc đẩy tính minh bạch và công bằng trong kinh doanh</li>
                <li>Phát triển các mô hình kinh tế hợp tác và chia sẻ</li>
            </ul>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('analysis-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Chat functionality
function initializeChat() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show loading
    const loadingDiv = addMessage('<div class="loading"></div> Đang suy nghĩ...', 'ai');
    
    // Generate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        loadingDiv.innerHTML = `<div class="message-content"><i class="fas fa-robot"></i><p>${response}</p></div>`;
    }, 1500);
}

function addMessage(content, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `<div class="message-content"><i class="fas fa-user"></i><p>${content}</p></div>`;
    } else {
        messageDiv.innerHTML = `<div class="message-content"><i class="fas fa-robot"></i><p>${content}</p></div>`;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific keywords
    for (const [keyword, response] of Object.entries(aiResponses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }
    
    // General responses
    if (lowerMessage.includes('mác') || lowerMessage.includes('lênin')) {
        return "Theo lý thuyết Mác-Lênin, chủ nghĩa tư bản phát triển qua các giai đoạn từ cạnh tranh tự do đến độc quyền. Cạnh tranh độc quyền là đặc trưng của chủ nghĩa tư bản hiện đại, nơi một số ít tập đoàn lớn thống trị thị trường và bóc lột người lao động cũng như người tiêu dùng.";
    }
    
    if (lowerMessage.includes('tư bản') || lowerMessage.includes('capitalism')) {
        return "Chủ nghĩa tư bản là hệ thống kinh tế dựa trên sở hữu tư nhân về tư liệu sản xuất và bóc lột giá trị thặng dư. Trong giai đoạn độc quyền, tư bản tập trung vào tay một số ít tập đoàn lớn, tạo ra sự bất bình đẳng và bóc lột.";
    }
    
    if (lowerMessage.includes('giải pháp') || lowerMessage.includes('làm gì')) {
        return "Để đối phó với cạnh tranh độc quyền, sinh viên cần: 1) Nâng cao nhận thức về bản chất của chủ nghĩa tư bản, 2) Hỗ trợ các doanh nghiệp nhỏ và startup, 3) Thúc đẩy tính minh bạch và công bằng trong kinh doanh, 4) Phát triển các mô hình kinh tế hợp tác và chia sẻ.";
    }
    
    // Default response
    return "Tôi có thể giúp bạn hiểu về lý thuyết Mác-Lênin về cạnh tranh và độc quyền. Bạn có thể hỏi về: bản chất của cạnh tranh độc quyền, tác động của các tập đoàn lớn, hoặc đề xuất giải pháp cho sinh viên. Hãy đặt câu hỏi cụ thể hơn!";
}

// Studio functionality
function initializeStudio() {
    setupPosterGenerator();
    setupDebateSimulator();
}

// Theme toggling
function initializeTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// Poster Generator
function setupPosterGenerator() {
    const canvas = document.getElementById('poster-canvas');
    if (!canvas) return; // not on this tab yet
    const ctx = canvas.getContext('2d');
    const titleInput = document.getElementById('poster-title');
    const sloganInput = document.getElementById('poster-slogan');
    const presetSelect = document.getElementById('poster-preset');
    const fontSelect = document.getElementById('poster-font');
    const colorInput = document.getElementById('poster-color');
    const themeSelect = document.getElementById('poster-theme');
    const sizeSelect = document.getElementById('poster-size');
    const imgInput = document.getElementById('poster-img');
    const previewBtn = document.getElementById('poster-preview-btn');
    const downloadBtn = document.getElementById('poster-download-btn');
    const exportJpgBtn = document.getElementById('poster-export-jpg');

    let bgImage = null;

    function applySize() {
        const [w, h] = sizeSelect.value.split('x').map(Number);
        canvas.width = w; canvas.height = h;
    }

    function drawPoster() {
        const w = canvas.width, h = canvas.height;
        // background
        ctx.fillStyle = colorInput.value || '#1e3c72';
        ctx.fillRect(0, 0, w, h);

        if (bgImage) {
            // cover
            const ratio = Math.max(w / bgImage.width, h / bgImage.height);
            const nw = bgImage.width * ratio;
            const nh = bgImage.height * ratio;
            const nx = (w - nw) / 2;
            const ny = (h - nh) / 2;
            ctx.globalAlpha = 0.25;
            ctx.drawImage(bgImage, nx, ny, nw, nh);
            ctx.globalAlpha = 1;
        }

        // theme shapes
        const theme = themeSelect.value;
        if (theme === 'modern') {
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            for (let i = 0; i < 6; i++) {
                const rw = w * (0.15 + 0.1 * Math.random());
                const rh = h * (0.02 + 0.03 * Math.random());
                const rx = Math.random() * (w - rw);
                const ry = Math.random() * (h - rh);
                ctx.fillRect(rx, ry, rw, rh);
            }
        } else if (theme === 'contrast') {
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, 'rgba(255,255,255,0.12)');
            grad.addColorStop(1, 'rgba(0,0,0,0.12)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }

        // preset overlays
        const preset = presetSelect ? presetSelect.value : 'clean';
        if (preset === 'gradient') {
            const overlay = ctx.createLinearGradient(0, 0, w, h);
            overlay.addColorStop(0, 'rgba(255,255,255,0.10)');
            overlay.addColorStop(1, 'rgba(0,0,0,0.15)');
            ctx.fillStyle = overlay;
            ctx.fillRect(0, 0, w, h);
        } else if (preset === 'grid') {
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 1;
            const step = Math.floor(w * 0.05);
            for (let x = step; x < w; x += step) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = step; y < h; y += step) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }
        }

        // title
        const title = (titleInput.value || 'Cạnh tranh và Độc quyền').toUpperCase();
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.floor(w * 0.06)}px ${fontSelect ? fontSelect.value : 'Inter, Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        wrapText(ctx, title, w / 2, h * 0.12, w * 0.8, Math.floor(w * 0.07));

        // divider
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(w * 0.15, h * 0.34, w * 0.7, Math.max(2, Math.floor(h * 0.0025)));

        // slogan
        const slogan = sloganInput.value || 'Hiểu để hành động công bằng';
        ctx.fillStyle = '#e3f2fd';
        ctx.font = `${Math.floor(w * 0.035)}px ${fontSelect ? fontSelect.value : 'Inter, Arial'}`;
        wrapText(ctx, slogan, w / 2, h * 0.38, w * 0.8, Math.floor(w * 0.045));

        // footer tag
        const tag = 'Kinh tế Chính trị Mác-Lênin';
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.floor(w * 0.03)}px ${fontSelect ? fontSelect.value : 'Inter, Arial'}`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(tag, w - w * 0.06, h - h * 0.06);
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        const lines = [];
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i].trim(), x, y + i * lineHeight);
        }
    }

    function handleImage(file) {
        if (!file) { bgImage = null; drawPoster(); return; }
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => { bgImage = img; drawPoster(); };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    sizeSelect.addEventListener('change', () => { applySize(); drawPoster(); });
    titleInput.addEventListener('input', drawPoster);
    sloganInput.addEventListener('input', drawPoster);
    colorInput.addEventListener('input', drawPoster);
    themeSelect.addEventListener('change', drawPoster);
    if (presetSelect) presetSelect.addEventListener('change', drawPoster);
    if (fontSelect) fontSelect.addEventListener('change', drawPoster);
    imgInput.addEventListener('change', e => handleImage(e.target.files[0]));
    previewBtn.addEventListener('click', drawPoster);
    downloadBtn.addEventListener('click', () => {
        drawPoster();
        const link = document.createElement('a');
        link.download = 'poster_mln.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    if (exportJpgBtn) {
        exportJpgBtn.addEventListener('click', () => {
            drawPoster();
            const link = document.createElement('a');
            link.download = 'poster_mln.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.92);
            link.click();
        });
    }

    applySize();
    drawPoster();
}

// Debate Simulator
function setupDebateSimulator() {
    const startBtn = document.getElementById('debate-start');
    if (!startBtn) return;
    const nextBtn = document.getElementById('debate-next');
    const resetBtn = document.getElementById('debate-reset');
    const transcript = document.getElementById('debate-transcript');
    const scenarioSelect = document.getElementById('debate-scenario');

    const scripts = {
        bigtech: [
            { role: 'Nhà kinh tế Mác-xít', text: 'Big Tech thể hiện sự tập trung tư bản cực độ; dữ liệu là tư liệu sản xuất mới.' },
            { role: 'Đại diện tập đoàn', text: 'Quy mô giúp chúng tôi đổi mới, giảm chi phí và tăng trải nghiệm người dùng.' },
            { role: 'Doanh nghiệp nhỏ', text: 'Chi phí quảng cáo và phụ thuộc nền tảng khiến chúng tôi khó tồn tại.' },
            { role: 'Chính sách công', text: 'Cần luật cạnh tranh nền tảng và quyền dữ liệu cho người dùng.' }
        ],
        gig: [
            { role: 'Người lao động gig', text: 'Thu nhập biến động, thiếu an sinh; thuật toán quyết định lương.' },
            { role: 'Doanh nghiệp nền tảng', text: 'Chúng tôi cung cấp việc linh hoạt và cơ hội tiếp cận khách hàng.' },
            { role: 'Nhà nghiên cứu lao động', text: 'Đây là hình thức bóc lột mới dựa trên quản trị bằng thuật toán.' },
            { role: 'Cơ quan nhà nước', text: 'Xem xét bảo hộ lao động và tiêu chuẩn hợp đồng công bằng.' }
        ],
        merger: [
            { role: 'Nhà đầu tư', text: 'Sáp nhập tạo hiệu quả và sức cạnh tranh toàn cầu.' },
            { role: 'Chuyên gia chính sách', text: 'Hiệu quả cho cổ đông nhưng rủi ro độc quyền và thất nghiệp.' },
            { role: 'Công nhân', text: 'Lo ngại sa thải và cắt giảm phúc lợi sau sáp nhập.' },
            { role: 'Nhà kinh tế Mác-xít', text: 'Đó là hệ quả tất yếu của tích tụ và tập trung tư bản.' }
        ]
    };

    let step = 0;
    let current = [];

    function renderLine(line) {
        const div = document.createElement('div');
        div.className = 'debate-msg';
        div.innerHTML = `<span class="debate-role">${line.role}:</span><span class="debate-text"> ${line.text}</span>`;
        transcript.appendChild(div);
        transcript.scrollTop = transcript.scrollHeight;
    }

    function start() {
        transcript.innerHTML = '';
        step = 0;
        current = scripts[scenarioSelect.value].slice();
        nextBtn.disabled = false;
        resetBtn.disabled = false;
        startBtn.disabled = true;
        renderLine({ role: 'Điều phối', text: 'Bắt đầu phiên tranh biện. Mỗi bên phát biểu lần lượt.' });
    }

    function next() {
        if (step < current.length) {
            renderLine(current[step]);
            step++;
        } else {
            renderLine({ role: 'Điều phối', text: 'Kết thúc. Hãy rút ra bài học chính sách từ nhiều góc nhìn.' });
            nextBtn.disabled = true;
            startBtn.disabled = false;
        }
    }

    function reset() {
        transcript.innerHTML = '';
        step = 0;
        nextBtn.disabled = true;
        resetBtn.disabled = true;
        startBtn.disabled = false;
    }

    startBtn.addEventListener('click', start);
    nextBtn.addEventListener('click', next);
    resetBtn.addEventListener('click', reset);
}


