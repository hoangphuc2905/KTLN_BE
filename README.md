# KTLN_BE - Backend Hệ Thống Quản Lý Bài Báo Nghiên Cứu Khoa Học

---
<!-- Công nghệ chủ lực -->
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=jsonwebtokens&logoColor=white)
![AI](https://img.shields.io/badge/AI-Vector%20Embeddings-blueviolet?style=flat&logo=brain&logoColor=white)

<!-- Thư viện hỗ trợ -->
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-8DD6F9?style=flat)
![bcrypt](https://img.shields.io/badge/bcrypt-004488?style=flat)
![multer](https://img.shields.io/badge/multer-2D2A2A?style=flat)




## 📝 Tóm tắt dự án Backend

**KTLN_BE** là backend của hệ thống quản lý bài báo nghiên cứu khoa học, phục vụ cho việc lưu trữ, tìm kiếm, xét duyệt và gợi ý bài báo một cách thông minh, hiện đại. Hệ thống được xây dựng với các công nghệ chủ lực như **Node.js**, **Express.js**, **MongoDB** và tích hợp AI (Vector Embeddings) để hỗ trợ tìm kiếm ngữ nghĩa và gợi ý tham khảo tự động.  
Bên cạnh việc quản lý bài báo, backend còn hỗ trợ xác thực người dùng, phân quyền, quản lý đóng góp tác giả theo từng năm học và thống kê dữ liệu phục vụ công tác nghiên cứu.

### 🔑 Điểm nổi bật:
- **API RESTful mạnh mẽ, dễ mở rộng** cho quản lý bài báo, người dùng, đóng góp, phê duyệt…
- **Tích hợp AI & Vector Search:**  
  *Tìm kiếm ngữ nghĩa, gợi ý bài báo tham khảo dựa trên chủ đề, từ khóa, tác giả…*
- **Bảo mật hiện đại:**  
  *Sử dụng JWT cho xác thực, phân quyền rõ ràng.*
- **Quản lý đóng góp, thống kê linh hoạt:**  
  *Theo năm học, tác giả và nhiều tiêu chí khác.*
- **Dễ dàng tích hợp với frontend (React.js) và hệ thống khác.**

---

## 🏗️ Công nghệ sử dụng

- **Node.js** & **Express.js** – Xây dựng API backend
- **MongoDB** – Lưu trữ dữ liệu linh hoạt, mở rộng tốt
- **AI & Vector Embeddings** – Tìm kiếm thông minh, gợi ý tự động
- **JWT** – Xác thực và bảo mật API
- **Thư viện hỗ trợ:** Mongoose, dotenv, bcrypt, multer,...

---

## 📦 Chức năng chính

- Đăng ký, đăng nhập, xác thực & phân quyền người dùng
- Quản lý bài báo, tác giả, chủ đề, từ khóa
- Tìm kiếm, lọc, đề xuất bài báo nghiên cứu theo tiêu chí thông minh
- Quản lý quy trình xét duyệt, thống kê đóng góp, báo cáo
- Hỗ trợ tải lên, quản lý tệp bài báo và các tài liệu liên quan

---

## 📂 Cấu trúc backend

```plaintext
src/
├── controllers/    # Xử lý logic API
├── models/         # Định nghĩa dữ liệu & kết nối DB
├── routes/         # Định tuyến endpoint
├── middlewares/    # Xác thực, kiểm tra quyền, xử lý lỗi
├── services/       # Xử lý nghiệp vụ, AI, tìm kiếm ngữ nghĩa
└── utils/          # Hàm tiện ích, cấu hình chung
```

---

## 🚀 Khởi động nhanh

```bash
git clone https://github.com/hoangphuc2905/KTLN_BE.git
cd KTLN_BE
npm install
cp .env.example .env    # Cấu hình biến môi trường
npm run dev             # Hoặc yarn dev
```
Server mặc định chạy tại: `http://localhost:5000`

---
## 👨‍💻 Liên hệ & đóng góp

- **Sinh viên thực hiện:**  
  1. Huỳnh Hoàng Phúc - 21036541  
  2. Nguyễn Duy Thanh - 21040431  
- **Giảng viên hướng dẫn:** TS. Nguyễn Thị Hạnh

Mọi đóng góp, ý kiến vui lòng gửi issue hoặc pull request trên GitHub.  
---
