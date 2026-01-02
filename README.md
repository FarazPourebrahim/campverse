# CampVerse Backend API

CampVerse is a RESTful API for managing bootcamps, courses, reviews, and users.  
It’s built with **Node.js**, **Express**, and **MongoDB**, providing full CRUD functionality, authentication, and advanced query features such as filtering, pagination, and field selection.

---

## 🚀 Features

### Bootcamps
- List all bootcamps with pagination, filtering, field selection, and limits  
- Get a single bootcamp  
- Create new bootcamp *(publishers/admins only; one bootcamp per publisher)*  
- Upload bootcamp photo *(owner only)*  
- Update or delete bootcamp *(owner only)*  
- Calculate average cost and average rating for a bootcamp  

### Courses
- List all courses or courses by bootcamp  
- Get a single course  
- Create, update, or delete a course *(owner/admin only)*  
- Full support for filtering and pagination  

### Reviews
- List all reviews or reviews by bootcamp  
- Get, create, update, or delete a review *(user/admin only)*  
- Average rating calculation integrated with bootcamps  

### Users & Authentication
- JWT authentication with cookies (30-day expiry)  
- Register as `user` or `publisher`  
- Login / Logout  
- Forgot/reset password with email token  
- Update user info and password  
- Admin-only user management (CRUD)  

---

## 🧰 Tech Stack

- **Node.js** + **Express** – backend framework  
- **MongoDB** + **Mongoose** – database & ORM  
- **JWT** – authentication and authorization  
- **bcryptjs** – password hashing  
- **Multer / express-fileupload** – photo uploads  
- **Nodemailer** – password reset email service  
- **Helmet, HPP, XSS Sanitizer, Mongo Sanitize, Rate Limit** – security middleware  
- **dotenv** – environment configuration  

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campverse.git
   cd campverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**  
   Create a `.env` file in the project root and add:

   ```bash
   NODE_ENV=development
   PORT=5000

   MONGO_URI=your_mongodb_connection_string
   FILE_UPLOAD_PATH=./public/uploads
   MAX_FILE_UPLOAD=1000000

   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30

   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_EMAIL=your_smtp_email
   SMTP_PASSWORD=your_smtp_password
   FROM_EMAIL=noreply@campverse.com
   FROM_NAME=CampVerse
   ```

4. **Run the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

---

## 📘 API Documentation

Full API documentation and usage examples are available in the project’s `index.html` documentation file.

---

## 📂 Project Structure

```
campverse/
├── controllers/        # Route controllers
├── models/             # Mongoose models
├── routes/             # API routes
├── middleware/         # Custom middleware (auth, error handler, etc.)
├── utils/              # Utility functions (email, geocoder, etc.)
├── public/uploads/     # Uploaded files
├── server.js           # Main entry point
├── package.json
└── .env.example
```

---

## 🧑‍💻 Author

Created by **Faraz Pourebrahim**

---

## 📜 License

This project is licensed under the **MIT License**.

---

### ⭐️ If you like this project, consider giving it a star on GitHub!
