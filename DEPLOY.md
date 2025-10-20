# 🚀 Hướng dẫn Deploy Website Mác-Lênin

## Phương pháp 1: GitHub Pages (Khuyến nghị - Miễn phí)

### Bước 1: Tạo GitHub Repository
1. Truy cập [GitHub.com](https://github.com)
2. Đăng nhập hoặc tạo tài khoản
3. Nhấn "New repository"
4. Đặt tên: `mac-lenin-web` (hoặc tên bạn muốn)
5. Chọn "Public"
6. Không tích "Add README" (vì đã có code)
7. Nhấn "Create repository"

### Bước 2: Upload code lên GitHub
```bash
# Trong thư mục dự án
git remote add origin https://github.com/USERNAME/mac-lenin-web.git
git branch -M main
git push -u origin main
```

### Bước 3: Kích hoạt GitHub Pages
1. Vào repository trên GitHub
2. Nhấn tab "Settings"
3. Cuộn xuống phần "Pages"
4. Source: chọn "Deploy from a branch"
5. Branch: chọn "main"
6. Folder: chọn "/ (root)"
7. Nhấn "Save"

### Bước 4: Truy cập website
- URL sẽ là: `https://USERNAME.github.io/mac-lenin-web`
- GitHub sẽ build và deploy tự động

---

## Phương pháp 2: Netlify (Dễ nhất - Miễn phí)

### Cách 1: Drag & Drop
1. Truy cập [Netlify.com](https://netlify.com)
2. Đăng ký/đăng nhập
3. Kéo thả thư mục dự án vào vùng "Deploy manually"
4. Website sẽ có URL ngay lập tức

### Cách 2: Kết nối GitHub
1. Đăng nhập Netlify
2. Nhấn "New site from Git"
3. Chọn GitHub
4. Chọn repository
5. Deploy settings: Build command để trống, Publish directory: `.`
6. Nhấn "Deploy site"

---

## Phương pháp 3: Vercel (Tốt cho React/Next.js)

1. Truy cập [Vercel.com](https://vercel.com)
2. Đăng nhập với GitHub
3. Import project từ GitHub
4. Deploy tự động

---

## Phương pháp 4: Firebase Hosting

```bash
# Cài đặt Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init project
firebase init hosting

# Deploy
firebase deploy
```

---

## ⚠️ Lưu ý quan trọng:

### 1. **Cập nhật đường dẫn AI API**
- File `assets/js/ai.js` đang dùng Cloudflare Worker
- Cần cập nhật URL API thực tế khi deploy

### 2. **CORS Issues**
- Nếu gặp lỗi CORS, cần cấu hình server
- Hoặc sử dụng proxy

### 3. **HTTPS**
- Tất cả các platform trên đều hỗ trợ HTTPS miễn phí
- Website sẽ có URL an toàn

---

## 🎯 Khuyến nghị:

**Cho người mới:** Sử dụng **Netlify** (drag & drop)
**Cho developer:** Sử dụng **GitHub Pages** (tích hợp Git)

Cả hai đều miễn phí và dễ sử dụng!
