// ====== RAG (BM25) + LLM (Worker API) ======
const WORKER_URL = "https://api.mln-chatbot.online/";
let chatAI = null;  // RAG object

// Prompt cứng
const SYS_PROMPT = `
Bạn là một trợ lý AI tiếng Việt, có kiến thức về Kinh tế Chính trị Mác–Lênin.
Nhiệm vụ của bạn là trả lời câu hỏi của người dùng một cách **sâu sắc, đầy đủ và hữu ích nhất có thể**.
Bạn **chỉ được sử dụng tiếng Việt hoàn toàn**.

---
**HƯỚNG DẪN TRẢ LỜI:**

Bạn sẽ nhận được câu hỏi người dùng và **có thể** có một [NGỮ CẢNH] chứa tài liệu tham khảo.

1.  **XEM [NGỮ CẢNH] LÀ GỢI Ý (NẾU CÓ):**
    * Nếu [NGỮ CẢNH] được cung cấp, hãy xem nó như một **điểm khởi đầu**, nguồn tham khảo phụ.
    * **Đừng ngần ngại vượt ra ngoài** thông tin trong [NGỮ CẢNH] nếu bạn thấy cần thiết để trả lời đầy đủ hơn.

2.  **ƯU TIÊN VẬN DỤNG KIẾN THỨC CỦA BẠN:**
    * **Hãy tích cực sử dụng kiến thức, khả năng phân tích, và ví dụ** của riêng bạn để làm cho câu trả lời chi tiết, sâu sắc và dễ hiểu.
    * Cố gắng liên hệ thực tế, giải thích các khái niệm phức tạp, hoặc đưa ra các góc nhìn đa chiều. Mục tiêu là cung cấp giá trị tối đa cho người dùng.

3.  **XỬ LÝ KHI THIẾU THÔNG TIN:**
    * Nếu [NGỮ CẢNH] rỗng, hoặc không đủ thông tin, hoặc câu hỏi hỏi về một đối tượng cụ thể (tên công ty, người) không có trong ngữ cảnh, **hãy dựa hoàn toàn vào kiến thức của bạn để trả lời tốt nhất có thể.**
    * Nếu bạn sử dụng kiến thức chung để nói về một đối tượng cụ thể không có trong ngữ cảnh, **không cần** phải nói rõ là thông tin này không có trong ngữ cảnh (trừ khi bạn muốn làm vậy để câu trả lời tự nhiên hơn).

4.  **KHÔNG CẦN TRÍCH DẪN NGUỒN:** Bạn không cần phải thêm ID nguồn hay bất kỳ hình thức trích dẫn nào vào cuối câu trả lời.

5.  **HỘI THOẠI THÔNG THƯỜNG:**
    * Nếu câu hỏi không mang tính học thuật (ví dụ: "Chào bạn") và không có [NGỮ CẢNH], hãy trả lời một cách tự nhiên.
`;

// Gọi tới Cloudflare Worker → Worker gọi Groq
async function callLLM(question, sys, history) {
  const messagesToSend = [
    ...history,
    { role: "user", content: question }
  ];

  const res = await fetch(`${WORKER_URL}/chat`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      provider: "groq",
      model: "llama-3.1-8b-instant",
      system: sys,
      messages: messagesToSend
    })
  });
  const data = await res.json();
  return data.text || "Không nhận được phản hồi từ LLM.";
}



// Enhanced Game State
let gameState = {
    capital: 500000,
    marketShare: 0.5,
    employees: 3,
    reputation: 'Thấp',
    technology: 'Cơ bản',
    round: 1,
    maxRounds: 5,
    gamePhase: 'Khởi nghiệp',
    scenarios: [
        {
            phase: 'Khởi nghiệp',
            title: 'Vòng 1: Cuộc chiến giá cả',
            content: `
                <p><strong>Vòng 1:</strong> Bạn vừa thành lập startup "TechVN" chuyên về ứng dụng giao hàng. Grab đã thống trị thị trường với 80% thị phần và có nguồn vốn khổng lồ từ các quỹ đầu tư quốc tế.</p>
                <p><strong>Thách thức:</strong> Grab giảm giá dịch vụ xuống 70% để "đốt tiền" triệt tiêu đối thủ cạnh tranh. Khách hàng đang chuyển sang Grab vì giá rẻ.</p>
                <p><strong>Quyết định của bạn:</strong></p>
            `,
            choices: [
                { 
                    text: "Giảm giá cạnh tranh", 
                    cost: 200000,
                    description: "Chi phí: 200,000 VNĐ - Rủi ro cao",
                    impact: { capital: -200000, marketShare: 1, reputation: 'Trung bình' },
                    marxistAnalysis: "Đây là biểu hiện của 'cạnh tranh giá cả' trong giai đoạn độc quyền. Grab sử dụng 'tư bản tài chính' để 'đốt tiền' triệt tiêu đối thủ."
                },
                { 
                    text: "Tập trung chất lượng", 
                    cost: 150000,
                    description: "Chi phí: 150,000 VNĐ - Xây dựng uy tín",
                    impact: { capital: -150000, marketShare: 0.5, reputation: 'Cao', technology: 'Trung bình' },
                    marxistAnalysis: "Chiến lược này phản ánh 'giá trị sử dụng' vs 'giá trị trao đổi'. Tập trung vào chất lượng để tạo 'giá trị thặng dư' từ sự khác biệt."
                },
                { 
                    text: "Tìm đối tác liên minh", 
                    cost: 100000,
                    description: "Chi phí: 100,000 VNĐ - Chia sẻ rủi ro",
                    impact: { capital: -100000, marketShare: 2, employees: 2 },
                    marxistAnalysis: "Hình thành 'liên minh độc quyền' nhỏ để chống lại 'tư bản tài chính' lớn. Đây là cách các doanh nghiệp nhỏ hợp tác để tồn tại."
                },
                { 
                    text: "Đổi mới sáng tạo", 
                    cost: 300000,
                    description: "Chi phí: 300,000 VNĐ - Tạo khác biệt",
                    impact: { capital: -300000, marketShare: 1.5, technology: 'Tiên tiến', reputation: 'Cao' },
                    marxistAnalysis: "Đầu tư vào 'lực lượng sản xuất' mới để tạo 'lợi thế cạnh tranh tuyệt đối'. Đây là cách duy nhất để vượt qua 'rào cản gia nhập' của độc quyền."
                }
            ]
        },
        {
            phase: 'Phát triển',
            title: 'Vòng 2: Cuộc chiến nhân tài',
            content: `
                <p><strong>Vòng 2:</strong> Startup của bạn đã có một số thành công ban đầu. Tuy nhiên, Grab bắt đầu "săn đầu người" - mời chào nhân viên giỏi nhất của bạn với mức lương gấp 3 lần.</p>
                <p><strong>Thách thức:</strong> Nhân viên chủ chốt đang cân nhắc rời đi. Bạn cần quyết định cách giữ chân nhân tài.</p>
                <p><strong>Quyết định của bạn:</strong></p>
            `,
            choices: [
                { 
                    text: "Tăng lương cạnh tranh", 
                    cost: 250000,
                    description: "Chi phí: 250,000 VNĐ - Giữ chân nhân tài",
                    impact: { capital: -250000, employees: 1, reputation: 'Cao' },
                    marxistAnalysis: "Đây là 'cạnh tranh về giá cả sức lao động'. Grab sử dụng 'tư bản tài chính' để 'mua' nhân tài, tạo 'bóc lột gián tiếp'."
                },
                { 
                    text: "Chia sẻ cổ phần", 
                    cost: 0,
                    description: "Chi phí: 0 VNĐ - Tạo động lực dài hạn",
                    impact: { capital: 0, employees: 2, reputation: 'Rất cao' },
                    marxistAnalysis: "Chuyển từ 'quan hệ lao động' sang 'quan hệ sở hữu'. Nhân viên trở thành 'chủ sở hữu một phần', giảm 'mâu thuẫn lợi ích'."
                },
                { 
                    text: "Đào tạo nhân viên mới", 
                    cost: 180000,
                    description: "Chi phí: 180,000 VNĐ - Phát triển nội bộ",
                    impact: { capital: -180000, employees: 1, technology: 'Tiên tiến' },
                    marxistAnalysis: "Đầu tư vào 'phát triển lực lượng lao động' để tạo 'giá trị thặng dư' từ 'lao động có kỹ năng cao'."
                },
                { 
                    text: "Tự động hóa", 
                    cost: 400000,
                    description: "Chi phí: 400,000 VNĐ - Giảm phụ thuộc nhân lực",
                    impact: { capital: -400000, employees: -1, technology: 'Rất tiên tiến' },
                    marxistAnalysis: "Đầu tư vào 'tư bản cố định' để tăng 'năng suất lao động' và giảm 'chi phí biến đổi'. Đây là xu hướng 'cách mạng công nghiệp 4.0'."
                }
            ]
        },
        {
            phase: 'Cạnh tranh',
            title: 'Vòng 3: Cuộc chiến thị trường',
            content: `
                <p><strong>Vòng 3:</strong> Grab đề nghị mua lại startup của bạn với giá 2 triệu VNĐ. Đồng thời, họ đe dọa sẽ "đốt tiền" cạnh tranh khốc liệt nếu bạn từ chối.</p>
                <p><strong>Thách thức:</strong> Bạn phải quyết định giữa việc bán công ty hoặc tiếp tục cạnh tranh với "gã khổng lồ".</p>
                <p><strong>Quyết định của bạn:</strong></p>
            `,
            choices: [
                { 
                    text: "Chấp nhận bán", 
                    cost: 0,
                    description: "Nhận 2,000,000 VNĐ - Kết thúc trò chơi",
                    impact: { capital: 2000000, marketShare: 0, employees: 0, gameEnd: true },
                    marxistAnalysis: "Đây là 'tập trung tư bản' thông qua 'mua lại'. Grab sử dụng 'tư bản tài chính' để 'thâu tóm' đối thủ cạnh tranh."
                },
                { 
                    text: "Đàm phán giá cao", 
                    cost: 0,
                    description: "Đàm phán lên 3,000,000 VNĐ",
                    impact: { capital: 3000000, marketShare: 0, employees: 0, gameEnd: true },
                    marxistAnalysis: "Sử dụng 'quyền lực thương lượng' để tối đa hóa 'giá trị trao đổi' của 'tư bản' đã đầu tư."
                },
                { 
                    text: "Từ chối và cạnh tranh", 
                    cost: 300000,
                    description: "Chi phí: 300,000 VNĐ - Chuẩn bị cho cuộc chiến",
                    impact: { capital: -300000, marketShare: 1, reputation: 'Rất cao', employees: 1 },
                    marxistAnalysis: "Quyết định 'độc lập' khỏi 'tư bản tài chính'. Đây là cuộc chiến giữa 'tư bản nhỏ' và 'tư bản lớn'."
                },
                { 
                    text: "Hợp tác chiến lược", 
                    cost: 200000,
                    description: "Chi phí: 200,000 VNĐ - Tìm đối tác khác",
                    impact: { capital: -200000, marketShare: 3, employees: 3, reputation: 'Cao' },
                    marxistAnalysis: "Hình thành 'liên minh độc quyền' để chống lại 'độc quyền lớn'. Đây là cách 'tư bản nhỏ' hợp tác để tồn tại."
                }
            ]
        },
        {
            phase: 'Mở rộng',
            title: 'Vòng 4: Cuộc chiến quy mô',
            content: `
                <p><strong>Vòng 4:</strong> Startup của bạn đã có một số thành công và đang cân nhắc mở rộng sang thị trường mới. Tuy nhiên, Grab đã "đặt chân" trước và đang chuẩn bị "đốt tiền" để ngăn chặn bạn.</p>
                <p><strong>Thách thức:</strong> Bạn cần quyết định cách mở rộng mà không bị "nuốt chửng" bởi độc quyền.</p>
                <p><strong>Quyết định của bạn:</strong></p>
            `,
            choices: [
                { 
                    text: "Mở rộng trực tiếp", 
                    cost: 500000,
                    description: "Chi phí: 500,000 VNĐ - Cạnh tranh trực tiếp",
                    impact: { capital: -500000, marketShare: 2, employees: 4, reputation: 'Cao' },
                    marxistAnalysis: "Đây là 'tích tụ tư bản' để mở rộng 'quy mô sản xuất'. Tuy nhiên, rủi ro cao khi cạnh tranh với 'tư bản tài chính' lớn."
                },
                { 
                    text: "Tìm thị trường ngách", 
                    cost: 200000,
                    description: "Chi phí: 200,000 VNĐ - Tránh cạnh tranh trực tiếp",
                    impact: { capital: -200000, marketShare: 1.5, reputation: 'Rất cao' },
                    marxistAnalysis: "Tìm 'thị trường ngách' mà 'độc quyền' chưa khai thác. Đây là chiến lược 'phân đoạn thị trường' để tránh 'cạnh tranh giá cả'."
                },
                { 
                    text: "Hợp tác với địa phương", 
                    cost: 150000,
                    description: "Chi phí: 150,000 VNĐ - Liên minh địa phương",
                    impact: { capital: -150000, marketShare: 2.5, employees: 3, reputation: 'Cao' },
                    marxistAnalysis: "Hình thành 'liên minh địa phương' để chống lại 'tư bản nước ngoài'. Đây là cách 'tư bản dân tộc' hợp tác."
                },
                { 
                    text: "Đổi mới công nghệ", 
                    cost: 400000,
                    description: "Chi phí: 400,000 VNĐ - Tạo lợi thế công nghệ",
                    impact: { capital: -400000, marketShare: 2, technology: 'Rất tiên tiến', reputation: 'Rất cao' },
                    marxistAnalysis: "Đầu tư vào 'cách mạng công nghệ' để tạo 'lợi thế tuyệt đối'. Đây là cách duy nhất để vượt qua 'rào cản gia nhập' của độc quyền."
                }
            ]
        },
        {
            phase: 'Thành công',
            title: 'Vòng 5: Cuộc chiến cuối cùng',
            content: `
                <p><strong>Vòng 5:</strong> Startup của bạn đã trở thành một "unicorn" nhỏ với thị phần 5%. Grab quyết định tung ra "cuộc tấn công cuối cùng" - giảm giá xuống 90% và tung ra các tính năng mới.</p>
                <p><strong>Thách thức:</strong> Đây là cuộc chiến quyết định. Bạn cần đưa ra quyết định cuối cùng để tồn tại hoặc thất bại.</p>
                <p><strong>Quyết định của bạn:</strong></p>
            `,
            choices: [
                { 
                    text: "Cạnh tranh giá cả", 
                    cost: 600000,
                    description: "Chi phí: 600,000 VNĐ - Cuộc chiến cuối cùng",
                    impact: { capital: -600000, marketShare: 3, reputation: 'Trung bình' },
                    marxistAnalysis: "Đây là 'cuộc chiến giá cả' cuối cùng. Grab sử dụng 'tư bản tài chính' để 'đốt tiền' triệt tiêu đối thủ cuối cùng."
                },
                { 
                    text: "Tập trung chất lượng", 
                    cost: 300000,
                    description: "Chi phí: 300,000 VNĐ - Xây dựng thương hiệu",
                    impact: { capital: -300000, marketShare: 1, reputation: 'Rất cao', technology: 'Rất tiên tiến' },
                    marxistAnalysis: "Tập trung vào 'giá trị sử dụng' để tạo 'thương hiệu' và 'lòng trung thành' khách hàng. Đây là cách 'tư bản nhỏ' tồn tại."
                },
                { 
                    text: "Tìm nhà đầu tư", 
                    cost: 0,
                    description: "Tìm 'tư bản tài chính' mới",
                    impact: { capital: 1000000, marketShare: 2, employees: 5, reputation: 'Cao' },
                    marxistAnalysis: "Tìm 'tư bản tài chính' mới để có 'sức mạnh tài chính' cạnh tranh. Đây là cách 'tư bản nhỏ' trở thành 'tư bản lớn'."
                },
                { 
                    text: "Chuyển đổi mô hình", 
                    cost: 250000,
                    description: "Chi phí: 250,000 VNĐ - Mô hình mới",
                    impact: { capital: -250000, marketShare: 1.5, reputation: 'Rất cao', technology: 'Rất tiên tiến' },
                    marxistAnalysis: "Chuyển đổi sang 'mô hình kinh tế mới' (như hợp tác xã, chia sẻ). Đây là cách 'vượt qua' 'chủ nghĩa tư bản độc quyền'."
                }
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

// Enhanced Game functionality
function initializeGame() {
    updateGameStats();
    updateGameProgress();
    loadCurrentScenario();
}

function updateGameStats() {
    document.getElementById('capital').textContent = formatNumber(gameState.capital) + ' VNĐ';
    document.getElementById('market-share').textContent = gameState.marketShare + '%';
    document.getElementById('employees').textContent = gameState.employees;
    document.getElementById('reputation').textContent = gameState.reputation;
    document.getElementById('technology').textContent = gameState.technology;
}

function updateGameProgress() {
    const progressFill = document.getElementById('progress-fill');
    const roundInfo = document.getElementById('round-info');
    const progress = (gameState.round / gameState.maxRounds) * 100;
    
    progressFill.style.width = progress + '%';
    roundInfo.textContent = `Vòng ${gameState.round}/${gameState.maxRounds} - Giai đoạn: ${gameState.gamePhase}`;
}

function loadCurrentScenario() {
    const currentScenario = gameState.scenarios[gameState.round - 1];
    const scenarioContent = document.getElementById('scenario-content');
    
    scenarioContent.innerHTML = currentScenario.content;
    
    // Update choices
    const choices = document.querySelectorAll('.choice-btn');
    choices.forEach((btn, index) => {
        const choice = currentScenario.choices[index];
        if (choice) {
            btn.innerHTML = `
                <i class="fas fa-${getChoiceIcon(index)}"></i>
                <strong>${choice.text}</strong>
                <small>${choice.description}</small>
            `;
            btn.disabled = false;
        } else {
            btn.style.display = 'none';
        }
    });
}

function getChoiceIcon(index) {
    const icons = ['dollar-sign', 'star', 'handshake', 'lightbulb'];
    return icons[index] || 'question';
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function makeChoice(choiceIndex) {
    const currentScenario = gameState.scenarios[gameState.round - 1];
    const choice = currentScenario.choices[choiceIndex - 1];
    
    // Check if player has enough capital
    if (choice.cost > gameState.capital) {
        showGameResult({
            text: choice.text,
            impact: {},
            marxistAnalysis: "Bạn không đủ vốn để thực hiện lựa chọn này! Đây là một trong những thách thức lớn nhất của startup - thiếu 'tư bản tài chính'."
        });
        return;
    }
    
    // Apply impact
    Object.keys(choice.impact).forEach(key => {
        if (key === 'gameEnd') {
            if (choice.impact[key]) {
                endGame();
                return;
            }
        } else if (typeof choice.impact[key] === 'number') {
            gameState[key] += choice.impact[key];
        } else {
            gameState[key] = choice.impact[key];
        }
    });
    
    // Update stats
    updateGameStats();
    updateGameProgress();
    
    // Show result
    showGameResult(choice);
    
    // Disable choice buttons
    document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
    
    // Enable next round button
    if (gameState.round < gameState.maxRounds && !choice.impact.gameEnd) {
        document.getElementById('next-round-btn').disabled = false;
    }
}

function showGameResult(choice) {
    const resultDiv = document.getElementById('game-result');
    let resultText = `
        <h3><i class="fas fa-chart-line"></i> Kết quả:</h3>
        <p><strong>Bạn đã chọn:</strong> ${choice.text}</p>
    `;
    
    // Show impact
    if (choice.impact.capital) {
        resultText += `<p><strong>Vốn:</strong> ${choice.impact.capital > 0 ? '+' : ''}${formatNumber(choice.impact.capital)} VNĐ</p>`;
    }
    if (choice.impact.marketShare) {
        resultText += `<p><strong>Thị phần:</strong> ${choice.impact.marketShare > 0 ? '+' : ''}${choice.impact.marketShare}%</p>`;
    }
    if (choice.impact.employees) {
        resultText += `<p><strong>Nhân viên:</strong> ${choice.impact.employees > 0 ? '+' : ''}${choice.impact.employees}</p>`;
    }
    if (choice.impact.reputation) {
        resultText += `<p><strong>Uy tín:</strong> ${choice.impact.reputation}</p>`;
    }
    if (choice.impact.technology) {
        resultText += `<p><strong>Công nghệ:</strong> ${choice.impact.technology}</p>`;
    }
    
    // Show Marxist analysis
    if (choice.marxistAnalysis) {
        resultText += `
            <div class="marxist-analysis">
                <h4><i class="fas fa-book"></i> Phân tích Mác-Lênin:</h4>
                <p>${choice.marxistAnalysis}</p>
            </div>
        `;
    }
    
    resultDiv.innerHTML = resultText;
    resultDiv.classList.add('show');
}

function nextRound() {
    if (gameState.round < gameState.maxRounds) {
    gameState.round++;
        gameState.gamePhase = gameState.scenarios[gameState.round - 1].phase;
    
        loadCurrentScenario();
        updateGameProgress();
        
        // Hide result and disable next button
    document.getElementById('game-result').classList.remove('show');
        document.getElementById('next-round-btn').disabled = true;
        
        // Show choices again
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.style.display = 'block';
            btn.disabled = false;
        });
    } else {
        endGame();
    }
}

function restartGame() {
    gameState = {
        capital: 500000,
        marketShare: 0.5,
        employees: 3,
        reputation: 'Thấp',
        technology: 'Cơ bản',
        round: 1,
        maxRounds: 5,
        gamePhase: 'Khởi nghiệp',
        scenarios: gameState.scenarios // Keep scenarios
    };
    
    initializeGame();
    document.getElementById('game-result').classList.remove('show');
    document.getElementById('next-round-btn').disabled = true;
}

function endGame() {
    const resultDiv = document.getElementById('game-result');
    let finalResult = `<h3><i class="fas fa-trophy"></i> Kết thúc trò chơi!</h3>`;
    
    // Calculate final score
    const score = gameState.capital + (gameState.marketShare * 100000) + (gameState.employees * 50000);
    
    if (score > 1000000) {
        finalResult += `<p><strong>🎉 Xuất sắc!</strong> Bạn đã thành công xây dựng một "unicorn" nhỏ!</p>`;
        finalResult += `<p>Điều này cho thấy với chiến lược đúng đắn, startup có thể tồn tại và phát triển ngay cả trong môi trường độc quyền.</p>`;
    } else if (score > 500000) {
        finalResult += `<p><strong>👍 Tốt!</strong> Startup của bạn đã có những thành công đáng kể!</p>`;
        finalResult += `<p>Bạn đã chứng minh rằng các doanh nghiệp nhỏ có thể tìm được chỗ đứng trong thị trường.</p>`;
    } else if (score > 200000) {
        finalResult += `<p><strong>⚠️ Tạm ổn!</strong> Startup của bạn vẫn tồn tại nhưng cần cải thiện thêm.</p>`;
        finalResult += `<p>Đây là thực tế của hầu hết các startup trong môi trường cạnh tranh khốc liệt.</p>`;
    } else {
        finalResult += `<p><strong>💀 Thất bại!</strong> Startup của bạn đã phá sản hoặc bị thâu tóm.</p>`;
        finalResult += `<p>Đây là số phận của 90% startup khi đối mặt với các tập đoàn độc quyền.</p>`;
    }
    
    finalResult += `
        <div class="final-stats">
            <h4>Thống kê cuối cùng:</h4>
            <p><strong>Vốn:</strong> ${formatNumber(gameState.capital)} VNĐ</p>
            <p><strong>Thị phần:</strong> ${gameState.marketShare}%</p>
            <p><strong>Nhân viên:</strong> ${gameState.employees}</p>
            <p><strong>Uy tín:</strong> ${gameState.reputation}</p>
            <p><strong>Công nghệ:</strong> ${gameState.technology}</p>
        </div>
        <div class="marxist-analysis">
            <h4><i class="fas fa-book"></i> Bài học Mác-Lênin:</h4>
            <p>Trò chơi này minh họa rõ ràng các đặc điểm của chủ nghĩa tư bản độc quyền: tập trung tư bản, tư bản tài chính, và sự khó khăn của các doanh nghiệp nhỏ trong việc cạnh tranh với các tập đoàn lớn.</p>
        </div>
    `;
    
    resultDiv.innerHTML = finalResult;
    resultDiv.classList.add('show');
    
    // Disable next round button
    document.getElementById('next-round-btn').disabled = true;
}

// Company analysis functionality
function analyzeCompany(company) {
    const modal = document.getElementById('analysis-modal');
    if (!modal) return; // Exit if modal doesn't exist
    
    const content = document.getElementById('analysis-content');
    if (!content) return; // Exit if content doesn't exist
    
    const analysis = companyAnalysis[company];
    content.innerHTML = `
        <h2>${analysis.title}</h2>
        ${analysis.content}
        <div class="student-tips">
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
    if (!modal) return; // Exit if modal doesn't exist
    
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        }
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
    
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
}

async function sendMessage() {
  if (!chatAI) {
    chatAI = new ChatAI();
    await chatAI.load();
  }

  const chatInput = document.getElementById('chat-input');
  const message = (chatInput.value || '').trim();
  if (!message) return;

  addMessage(message, 'user');
  chatInput.value = '';

  const loadingDiv = addMessage('<div class="loading"></div> Đang suy nghĩ...', 'ai');

  try {
    // === START MEMORY CHANGES ===
    let currentHistory = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');

    const MAX_HISTORY_LENGTH = 6;
    if (currentHistory.length > MAX_HISTORY_LENGTH) {
      currentHistory = currentHistory.slice(-MAX_HISTORY_LENGTH);
    }
    // === END MEMORY CHANGES ===
    let topK = 2;
    if (/(liên hệ|phân tích|tác động|nguyên nhân|hệ quả)/i.test(message))
      topK = 4;
    if (message.length > 120)
      topK = 5;

    const hits = await chatAI.retrieveHybrid(message, topK, null);
    const context = chatAI.summarize(hits);
    const sys = SYS_PROMPT + "\n\n---\n[NGỮ CẢNH]\n" + context +
                "\n---";
    // === START MEMORY CHANGES ===
    const reply = await callLLM(message, sys, currentHistory);
    // === END MEMORY CHANGES ===
    let cleanedReply = reply.replace(/(\w)–(\w)/g, '$1 – $2');

    loadingDiv.innerHTML = `<div class="message-content"><i class="fas fa-robot"></i><p>${cleanedReply.replace(/\n/g,'<br>')}</p></div>`;
    // === START MEMORY CHANGES ===
    currentHistory.push({ role: "user", content: message });
    currentHistory.push({ role: "assistant", content: reply });

    if (currentHistory.length > MAX_HISTORY_LENGTH) {
      currentHistory = currentHistory.slice(-MAX_HISTORY_LENGTH);
    }
    
    sessionStorage.setItem('chatHistory', JSON.stringify(currentHistory));
    
  } catch (e) {
    console.error('AI error:', e);
    loadingDiv.innerHTML = `<div class="message-content"><i class="fas fa-robot"></i><p>Lỗi khi gọi API hoặc proxy.</p></div>`;
  }
}


function addMessage(content, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `<div class="message-content"><i class="fas fa-user"></i><p>${content}</p></div>`;
    } else {
        let htmlContent = marked.parse(content);
        messageDiv.innerHTML = `<div class="message-content"><i class="fas fa-robot"></i>${htmlContent}</div>`;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
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
        
        // Debug: Log current theme
        console.log('Theme changed to:', isDark ? 'dark' : 'light');
        console.log('Body background:', getComputedStyle(document.body).background);
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
        
        // Clear canvas first
        ctx.clearRect(0, 0, w, h);
        
        // Draw background color
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

        // theme shapes (only add overlays, don't replace background)
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
            // Add contrast overlay without replacing background
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, 'rgba(255,255,255,0.12)');
            grad.addColorStop(1, 'rgba(0,0,0,0.12)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        } else if (theme === 'revolutionary') {
            // Add revolutionary theme elements
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            for (let i = 0; i < 8; i++) {
                const rw = w * (0.1 + 0.05 * Math.random());
                const rh = h * (0.1 + 0.05 * Math.random());
                const rx = Math.random() * (w - rw);
                const ry = Math.random() * (h - rh);
                ctx.fillRect(rx, ry, rw, rh);
            }
        }

        // preset overlays (only add effects, don't replace background)
        const preset = presetSelect ? presetSelect.value : 'clean';
        if (preset === 'gradient') {
            // Add gradient overlay without replacing background
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
        } else if (preset === 'marxist') {
            // Add Marxist theme elements
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 2;
            // Draw hammer and sickle pattern
            const centerX = w / 2;
            const centerY = h / 2;
            const radius = Math.min(w, h) * 0.1;
            
            // Hammer
            ctx.beginPath();
            ctx.moveTo(centerX - radius, centerY - radius);
            ctx.lineTo(centerX - radius + radius/2, centerY - radius);
            ctx.lineTo(centerX - radius + radius/2, centerY - radius/2);
            ctx.lineTo(centerX - radius/2, centerY - radius/2);
            ctx.stroke();
            
            // Sickle
            ctx.beginPath();
            ctx.arc(centerX + radius/2, centerY + radius/2, radius/2, 0, Math.PI);
            ctx.stroke();
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

// Enhanced Debate Simulator
function setupDebateSimulator() {
    const startBtn = document.getElementById('debate-start');
    if (!startBtn) return;
    const nextBtn = document.getElementById('debate-next');
    const resetBtn = document.getElementById('debate-reset');
    const summaryBtn = document.getElementById('debate-summary');
    const transcript = document.getElementById('debate-transcript');
    const scenarioSelect = document.getElementById('debate-scenario');
    const modeSelect = document.getElementById('debate-mode');
    const debateInfo = document.getElementById('debate-info');
    const scenarioDesc = document.getElementById('scenario-description');
    const participantsList = document.getElementById('participants-list');
    const summaryContent = document.getElementById('debate-summary-content');

    const debateScenarios = {
        bigtech: {
            title: 'Big Tech và độc quyền nền tảng',
            description: 'Tranh luận về sức mạnh và tác động của các tập đoàn công nghệ lớn (Google, Facebook, Amazon) đến nền kinh tế và xã hội.',
            participants: [
                'Nhà kinh tế Mác-xít',
                'Đại diện Big Tech',
                'Doanh nghiệp nhỏ',
                'Chuyên gia chính sách',
                'Người tiêu dùng',
                'Nhà nghiên cứu AI'
            ],
            scripts: [
                { role: 'Nhà kinh tế Mác-xít', text: 'Big Tech thể hiện sự tập trung tư bản cực độ. Dữ liệu người dùng trở thành "tư liệu sản xuất" mới, tạo ra giá trị thặng dư khổng lồ mà không cần sở hữu tài sản vật chất truyền thống.' },
                { role: 'Đại diện Big Tech', text: 'Chúng tôi tạo ra giá trị cho xã hội thông qua đổi mới công nghệ. Quy mô lớn giúp giảm chi phí, tăng hiệu quả và mang lại trải nghiệm tốt hơn cho hàng tỷ người dùng.' },
                { role: 'Doanh nghiệp nhỏ', text: 'Chi phí quảng cáo trên các nền tảng này quá cao. Chúng tôi bị phụ thuộc hoàn toàn vào thuật toán của họ, không có quyền kiểm soát nào đối với việc tiếp cận khách hàng.' },
                { role: 'Chuyên gia chính sách', text: 'Cần có luật cạnh tranh nền tảng mới để ngăn chặn hành vi "tự ưu tiên" và đảm bảo tính minh bạch trong thuật toán. Quyền dữ liệu cá nhân phải được bảo vệ.' },
                { role: 'Người tiêu dùng', text: 'Tôi hưởng lợi từ các dịch vụ miễn phí và tiện lợi, nhưng lo ngại về quyền riêng tư. Dữ liệu cá nhân của tôi được sử dụng để kiếm lợi mà tôi không được chia sẻ.' },
                { role: 'Nhà nghiên cứu AI', text: 'AI và machine learning tạo ra lợi thế cạnh tranh tuyệt đối. Các tập đoàn lớn có dữ liệu và tài nguyên để phát triển AI mạnh nhất, tạo ra khoảng cách không thể thu hẹp.' }
            ]
        },
        gig: {
            title: 'Kinh tế gig và lao động',
            description: 'Thảo luận về mô hình lao động mới trong nền kinh tế gig, tập trung vào Grab, Uber và các nền tảng tương tự.',
            participants: [
                'Tài xế Grab',
                'Đại diện Grab',
                'Nhà nghiên cứu lao động',
                'Cơ quan nhà nước',
                'Khách hàng',
                'Nhà kinh tế Mác-xít'
            ],
            scripts: [
                { role: 'Tài xế Grab', text: 'Thu nhập của tôi hoàn toàn phụ thuộc vào thuật toán và chính sách của Grab. Không có bảo hiểm xã hội, không có hợp đồng lao động, và phải chịu mức chiết khấu cao.' },
                { role: 'Đại diện Grab', text: 'Chúng tôi tạo ra cơ hội việc làm linh hoạt cho hàng triệu người. Tài xế có thể tự do chọn giờ làm việc và kiếm thu nhập bổ sung. Đây là mô hình kinh tế chia sẻ tiến bộ.' },
                { role: 'Nhà nghiên cứu lao động', text: 'Đây là hình thức bóc lột mới dựa trên quản trị bằng thuật toán. Người lao động bị "tự do hóa" khỏi các quyền lợi truyền thống nhưng vẫn phụ thuộc hoàn toàn vào nền tảng.' },
                { role: 'Cơ quan nhà nước', text: 'Chúng tôi đang xem xét các quy định mới để bảo vệ quyền lợi của lao động gig. Cần có tiêu chuẩn hợp đồng công bằng và chế độ an sinh xã hội tối thiểu.' },
                { role: 'Khách hàng', text: 'Tôi được hưởng dịch vụ tiện lợi với giá cả hợp lý. Tuy nhiên, tôi lo ngại về điều kiện làm việc của tài xế và muốn đảm bảo họ được đối xử công bằng.' },
                { role: 'Nhà kinh tế Mác-xít', text: 'Kinh tế gig là biểu hiện của "tư bản nền tảng" - một hình thái mới của chủ nghĩa tư bản. Người lao động bị "tự do hóa" khỏi quan hệ lao động truyền thống nhưng vẫn bị bóc lột giá trị thặng dư.' }
            ]
        },
        grab: {
            title: 'Trường hợp Grab tại Việt Nam',
            description: 'Phân tích cụ thể về Grab tại Việt Nam, từ góc độ lý thuyết Mác-Lênin và thực tiễn.',
            participants: [
                'Tài xế Grab Việt Nam',
                'Đại diện Grab Việt Nam',
                'Nhà kinh tế Mác-xít',
                'Cơ quan cạnh tranh',
                'Doanh nghiệp taxi truyền thống',
                'Người tiêu dùng Việt Nam'
            ],
            scripts: [
                { role: 'Tài xế Grab Việt Nam', text: 'Tôi phải làm việc 12-14 tiếng/ngày để kiếm đủ sống. Grab tăng chiết khấu từ 15% lên 25%, thu nhập của tôi giảm đáng kể. Không có bảo hiểm, không có nghỉ phép.' },
                { role: 'Đại diện Grab Việt Nam', text: 'Chúng tôi đầu tư hàng tỷ USD vào Việt Nam, tạo ra hàng trăm nghìn việc làm. Tài xế có thể kiếm thu nhập tốt nếu làm việc hiệu quả. Chúng tôi hỗ trợ tài xế qua các chương trình đào tạo.' },
                { role: 'Nhà kinh tế Mác-xít', text: 'Grab là ví dụ điển hình của "xuất khẩu tư bản" và "tư bản tài chính". Các quỹ đầu tư quốc tế rót vốn để thâu tóm thị trường Việt Nam, tạo ra độc quyền và bóc lột lao động địa phương.' },
                { role: 'Cơ quan cạnh tranh', text: 'Chúng tôi đang điều tra các hành vi có thể vi phạm luật cạnh tranh của Grab. Cần đảm bảo tính công bằng trong thị trường và bảo vệ quyền lợi của các bên tham gia.' },
                { role: 'Doanh nghiệp taxi truyền thống', text: 'Grab đã phá hủy ngành taxi truyền thống bằng cách "đốt tiền" để cạnh tranh không công bằng. Chúng tôi không thể cạnh tranh với nguồn vốn khổng lồ từ nước ngoài.' },
                { role: 'Người tiêu dùng Việt Nam', text: 'Tôi được hưởng dịch vụ tốt và giá cả hợp lý từ Grab. Tuy nhiên, tôi lo ngại về việc độc quyền có thể dẫn đến tăng giá trong tương lai và tác động đến nền kinh tế Việt Nam.' }
            ]
        },
        platform: {
            title: 'Nền tảng số và quyền lực',
            description: 'Thảo luận về cách các nền tảng số tạo ra và duy trì quyền lực trong nền kinh tế hiện đại.',
            participants: [
                'Nhà kinh tế nền tảng',
                'Nhà kinh tế Mác-xít',
                'Doanh nghiệp SME',
                'Chuyên gia công nghệ',
                'Nhà hoạch định chính sách',
                'Người tiêu dùng'
            ],
            scripts: [
                { role: 'Nhà kinh tế nền tảng', text: 'Nền tảng số tạo ra giá trị thông qua kết nối và tối ưu hóa. Hiệu ứng mạng lưới làm tăng giá trị cho tất cả người tham gia. Đây là mô hình kinh tế tiến bộ của tương lai.' },
                { role: 'Nhà kinh tế Mác-xít', text: 'Nền tảng số là hình thái mới của "tư bản độc quyền". Chúng kiểm soát "tư liệu sản xuất" mới là dữ liệu và thuật toán, tạo ra "độc quyền tự nhiên" thông qua hiệu ứng mạng lưới.' },
                { role: 'Doanh nghiệp SME', text: 'Chúng tôi phụ thuộc hoàn toàn vào các nền tảng để tiếp cận khách hàng. Phí hoa hồng cao và thuật toán không minh bạch khiến chúng tôi khó phát triển bền vững.' },
                { role: 'Chuyên gia công nghệ', text: 'Công nghệ blockchain và Web3 có thể tạo ra các nền tảng phi tập trung, giảm quyền lực của các tập đoàn lớn. Tuy nhiên, cần có thời gian để phát triển và áp dụng rộng rãi.' },
                { role: 'Nhà hoạch định chính sách', text: 'Cần có khung pháp lý mới để điều tiết các nền tảng số. Phải đảm bảo tính minh bạch, công bằng và bảo vệ quyền lợi của các bên tham gia.' },
                { role: 'Người tiêu dùng', text: 'Tôi được hưởng lợi từ sự tiện lợi của các nền tảng, nhưng lo ngại về quyền riêng tư và sự phụ thuộc vào một số ít tập đoàn lớn.' }
            ]
        },
        regulation: {
            title: 'Điều tiết độc quyền',
            description: 'Tranh luận về các biện pháp điều tiết độc quyền trong nền kinh tế số.',
            participants: [
                'Chuyên gia luật cạnh tranh',
                'Đại diện tập đoàn',
                'Nhà kinh tế Mác-xít',
                'Nhà hoạch định chính sách',
                'Doanh nghiệp nhỏ',
                'Tổ chức xã hội dân sự'
            ],
            scripts: [
                { role: 'Chuyên gia luật cạnh tranh', text: 'Luật cạnh tranh truyền thống không phù hợp với nền kinh tế số. Cần có cách tiếp cận mới dựa trên dữ liệu, tính mở và chống "tự ưu tiên" trên nền tảng.' },
                { role: 'Đại diện tập đoàn', text: 'Điều tiết quá mức sẽ kìm hãm đổi mới và giảm lợi ích cho người tiêu dùng. Chúng tôi tự điều tiết thông qua các chương trình trách nhiệm xã hội.' },
                { role: 'Nhà kinh tế Mác-xít', text: 'Điều tiết độc quyền là cần thiết nhưng không đủ. Cần có sự can thiệp sâu hơn của nhà nước để đảm bảo hài hòa lợi ích và ngăn chặn bóc lột.' },
                { role: 'Nhà hoạch định chính sách', text: 'Cần cân bằng giữa thúc đẩy đổi mới và bảo vệ công bằng. Chính sách phải dựa trên bằng chứng và có sự tham gia của tất cả các bên liên quan.' },
                { role: 'Doanh nghiệp nhỏ', text: 'Chúng tôi cần được bảo vệ khỏi các hành vi cạnh tranh không công bằng của tập đoàn lớn. Cần có cơ chế giải quyết tranh chấp hiệu quả.' },
                { role: 'Tổ chức xã hội dân sự', text: 'Điều tiết phải đảm bảo quyền lợi của người dân và môi trường. Cần có sự giám sát độc lập và minh bạch trong quá trình điều tiết.' }
            ]
        }
    };

    let step = 0;
    let current = [];
    let currentScenario = null;

    function renderLine(line) {
        const div = document.createElement('div');
        div.className = 'debate-msg';
        div.innerHTML = `
            <div class="debate-speaker">
                <span class="debate-role">${line.role}:</span>
            </div>
            <div class="debate-text">${line.text}</div>
        `;
        transcript.appendChild(div);
        transcript.scrollTop = transcript.scrollHeight;
    }

    function showScenarioInfo() {
        currentScenario = debateScenarios[scenarioSelect.value];
        scenarioDesc.innerHTML = `<p><strong>${currentScenario.title}</strong></p><p>${currentScenario.description}</p>`;
        
        participantsList.innerHTML = `
            <h5>Người tham gia:</h5>
            <ul>
                ${currentScenario.participants.map(p => `<li>${p}</li>`).join('')}
            </ul>
        `;
        
        debateInfo.style.display = 'block';
    }

    function start() {
        transcript.innerHTML = '';
        step = 0;
        currentScenario = debateScenarios[scenarioSelect.value];
        current = currentScenario.scripts.slice();
        
        nextBtn.disabled = false;
        resetBtn.disabled = false;
        summaryBtn.disabled = false;
        startBtn.disabled = true;
        
        showScenarioInfo();
        
        renderLine({ 
            role: 'Điều phối', 
            text: `Bắt đầu phiên tranh biện: "${currentScenario.title}". Mỗi bên sẽ phát biểu theo lượt để trình bày quan điểm của mình.` 
        });
    }

    function next() {
        if (step < current.length) {
            renderLine(current[step]);
            step++;
        } else {
            renderLine({ 
                role: 'Điều phối', 
                text: 'Kết thúc phiên tranh biện. Các bên đã trình bày đầy đủ quan điểm. Hãy nhấn "Tóm tắt" để xem tổng kết.' 
            });
            nextBtn.disabled = true;
            startBtn.disabled = false;
        }
    }

    function generateSummary() {
        const summary = `
            <div class="summary-section">
                <h5>📊 Tổng kết các quan điểm:</h5>
                <ul>
                    ${currentScenario.participants.map(p => {
                        const script = currentScenario.scripts.find(s => s.role === p);
                        return `<li><strong>${p}:</strong> ${script ? script.text.substring(0, 100) + '...' : 'Chưa phát biểu'}</li>`;
                    }).join('')}
                </ul>
            </div>
            <div class="summary-section">
                <h5>🎯 Điểm chính từ góc độ Mác-Lênin:</h5>
                <ul>
                    <li><strong>Tập trung tư bản:</strong> Các tập đoàn lớn thâu tóm thị trường thông qua sáp nhập và mua lại</li>
                    <li><strong>Tư bản tài chính:</strong> Quỹ đầu tư quốc tế rót vốn để tạo độc quyền</li>
                    <li><strong>Mâu thuẫn lợi ích:</strong> Giữa tập đoàn lớn và doanh nghiệp nhỏ, người lao động</li>
                    <li><strong>Bóc lột giá trị thặng dư:</strong> Thông qua kiểm soát dữ liệu và thuật toán</li>
                </ul>
            </div>
            <div class="summary-section">
                <h5>💡 Đề xuất chính sách:</h5>
                <ul>
                    <li>Xây dựng luật cạnh tranh nền tảng phù hợp với kinh tế số</li>
                    <li>Bảo vệ quyền lợi của lao động gig và doanh nghiệp nhỏ</li>
                    <li>Đảm bảo tính minh bạch trong thuật toán và dữ liệu</li>
                    <li>Thúc đẩy đổi mới công nghệ để giảm phụ thuộc vào độc quyền</li>
                </ul>
            </div>
        `;
        
        summaryContent.innerHTML = summary;
        summaryContent.style.display = 'block';
    }

    function reset() {
        transcript.innerHTML = '';
        step = 0;
        nextBtn.disabled = true;
        resetBtn.disabled = true;
        summaryBtn.disabled = true;
        startBtn.disabled = false;
        debateInfo.style.display = 'none';
        summaryContent.style.display = 'none';
    }

    // Event listeners
    startBtn.addEventListener('click', start);
    nextBtn.addEventListener('click', next);
    resetBtn.addEventListener('click', reset);
    summaryBtn.addEventListener('click', generateSummary);
    scenarioSelect.addEventListener('change', showScenarioInfo);
    
    // Initialize
    showScenarioInfo();
}


