# 🚀 ColorLab Workshop - GitHub Pages Setup

## 🎯 **CÁCH CHẠY TRỰC TIẾP TỪ GITHUB (ĐƠN GIẢN NHẤT)**

### **⚠️ Lưu ý quan trọng:**
Repository hiện tại là **PRIVATE**. Để dùng GitHub Pages miễn phí, cần chuyển thành **PUBLIC**.

---

## 📋 **BƯỚC 1: MAKE REPOSITORY PUBLIC**

### **🔧 Cách 1: Qua GitHub Web Interface**

1. **Truy cập repository:**
   ```
   https://github.com/VBTIEN/ColorLab-Workshop
   ```

2. **Vào Settings:**
   - Click tab **Settings** (cuối cùng trong menu)
   - Scroll xuống cuối trang

3. **Change visibility:**
   - Tìm section **Danger Zone**
   - Click **Change repository visibility**
   - Chọn **Make public**
   - Confirm bằng cách type repository name
   - Click **I understand, change repository visibility**

### **🔧 Cách 2: Qua Command Line**
```bash
cd /home/victus/ColorLab-Workshop
gh repo edit VBTIEN/ColorLab-Workshop --visibility public
```

---

## 📋 **BƯỚC 2: ENABLE GITHUB PAGES**

### **🌐 Setup GitHub Pages:**

1. **Truy cập Pages settings:**
   ```
   https://github.com/VBTIEN/ColorLab-Workshop/settings/pages
   ```

2. **Configure Pages:**
   - **Source**: Deploy from a branch
   - **Branch**: master (hoặc main)
   - **Folder**: / (root)
   - Click **Save**

3. **Đợi deployment:**
   - GitHub sẽ build website (5-10 phút)
   - Bạn sẽ thấy green checkmark khi xong

4. **Truy cập website:**
   ```
   https://vbtien.github.io/ColorLab-Workshop/
   ```

---

## 🎯 **BƯỚC 3: TRUY CẬP WORKSHOP**

### **🌐 URL Structure:**
```
https://vbtien.github.io/ColorLab-Workshop/                    # Homepage
https://vbtien.github.io/ColorLab-Workshop/01-prerequisites/  # Module 1
https://vbtien.github.io/ColorLab-Workshop/02-architecture/   # Module 2
https://vbtien.github.io/ColorLab-Workshop/03-backend-development/  # Module 3
https://vbtien.github.io/ColorLab-Workshop/04-api-gateway/    # Module 4
https://vbtien.github.io/ColorLab-Workshop/05-frontend-development/ # Module 5
https://vbtien.github.io/ColorLab-Workshop/06-s3-integration/ # Module 6
https://vbtien.github.io/ColorLab-Workshop/07-advanced-features/ # Module 7
https://vbtien.github.io/ColorLab-Workshop/08-testing/        # Module 8
```

### **🎨 Features sẽ có:**
- ✅ **Professional Layout**: Giống như https://000001.awsstudygroup.com/
- ✅ **Interactive Navigation**: Sidebar với progress tracking
- ✅ **Search Functionality**: Full-text search
- ✅ **Mobile Responsive**: Tối ưu cho mobile
- ✅ **Syntax Highlighting**: Code examples đẹp
- ✅ **Live Demo Links**: Links đến production system

---

## ⚡ **QUICK SETUP (5 phút)**

### **🚀 Các bước nhanh nhất:**

1. **Make repository public:**
   ```bash
   gh repo edit VBTIEN/ColorLab-Workshop --visibility public
   ```

2. **Enable GitHub Pages:**
   - Go to: https://github.com/VBTIEN/ColorLab-Workshop/settings/pages
   - Source: Deploy from a branch
   - Branch: master
   - Save

3. **Đợi 5-10 phút**

4. **Truy cập:**
   ```
   https://vbtien.github.io/ColorLab-Workshop/
   ```

---

## 🔧 **ALTERNATIVE: KEEP PRIVATE + USE CODESPACES**

### **🏠 Nếu muốn giữ repository private:**

#### **Option 1: GitHub Codespaces**
1. **Truy cập repository:**
   ```
   https://github.com/VBTIEN/ColorLab-Workshop
   ```

2. **Create Codespace:**
   - Click **Code** button
   - Tab **Codespaces**
   - Click **Create codespace on master**

3. **Run Hugo server:**
   ```bash
   # Trong Codespaces terminal
   hugo server --bind 0.0.0.0 --port 1313
   ```

4. **Access website:**
   - Click port 1313 notification
   - Hoặc vào Ports tab

#### **Option 2: Gitpod**
1. **Open in Gitpod:**
   ```
   https://gitpod.io/#https://github.com/VBTIEN/ColorLab-Workshop
   ```

2. **Run Hugo server:**
   ```bash
   hugo server --bind 0.0.0.0 --port 1313
   ```

---

## 📊 **COMPARISON**

### **🌐 GitHub Pages (Public repo required)**
```
✅ Pros: 
- Hoàn toàn miễn phí
- Stable, fast loading
- Custom domain support
- Auto-deploy on push

❌ Cons:
- Repository phải public
- Build time 5-10 phút
- Limited build minutes

🎯 Best for: Demo, sharing, production
```

### **💻 Codespaces (Works with private)**
```
✅ Pros:
- Works with private repos
- Full development environment
- VS Code interface
- Instant access

❌ Cons:
- Limited free hours (60h/month)
- Requires GitHub account
- Temporary URLs

🎯 Best for: Development, testing
```

---

## 🎯 **RECOMMENDED APPROACH**

### **🥇 For Demo/Sharing: GitHub Pages**
```bash
# Make public and enable Pages
gh repo edit VBTIEN/ColorLab-Workshop --visibility public
# Then enable Pages in settings
```

### **🥈 For Private Development: Codespaces**
```
# Keep private, use Codespaces for development
https://github.com/VBTIEN/ColorLab-Workshop
-> Code -> Codespaces -> Create
```

---

## 🔍 **TROUBLESHOOTING**

### **❌ GitHub Pages not building:**
```
1. Check repository is public
2. Check branch name (master vs main)
3. Wait 10-15 minutes for first build
4. Check Actions tab for build errors
```

### **❌ 404 Error on Pages:**
```
1. Check URL: https://vbtien.github.io/ColorLab-Workshop/
2. Check if index.html exists in root or public/
3. Check config.toml baseURL setting
```

### **❌ Content not showing:**
```
1. Check content/ directory has .md files
2. Check Hugo theme is working
3. Check config.toml syntax
```

---

## 📱 **MOBILE ACCESS**

### **📲 Truy cập từ mobile:**
- GitHub Pages: ✅ Full responsive
- Codespaces: ✅ Mobile browser support
- Touch navigation: ✅ Optimized
- Fast loading: ✅ Static site

---

## 🎓 **FINAL RESULT**

### **🌐 Your workshop will be available at:**
```
https://vbtien.github.io/ColorLab-Workshop/
```

### **📚 With features:**
- **7 Interactive Modules**: Complete curriculum
- **Professional Design**: Clean, educational layout
- **Navigation**: Sidebar with progress tracking
- **Search**: Full-text search functionality
- **Mobile**: Responsive design
- **Fast**: Static site performance

### **🎯 URL pattern like your example:**
```
Your example: https://000001.awsstudygroup.com/1-create-new-aws-account/
ColorLab:     https://vbtien.github.io/ColorLab-Workshop/01-prerequisites/
```

---

## ✅ **READY TO GO!**

### **🚀 Choose your method:**

#### **Method 1: GitHub Pages (Recommended)**
1. Make repo public: `gh repo edit VBTIEN/ColorLab-Workshop --visibility public`
2. Enable Pages: https://github.com/VBTIEN/ColorLab-Workshop/settings/pages
3. Access: https://vbtien.github.io/ColorLab-Workshop/

#### **Method 2: Codespaces (Private repo)**
1. Go to: https://github.com/VBTIEN/ColorLab-Workshop
2. Code → Codespaces → Create
3. Run: `hugo server --bind 0.0.0.0 --port 1313`

**🎨 ColorLab Workshop sẽ chạy trực tiếp từ GitHub!** 🚀

**Chọn method phù hợp và bắt đầu workshop ngay!** ✨
