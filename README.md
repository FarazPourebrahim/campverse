# CampVerse Backend API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

CampVerse is a RESTful API for managing bootcamps, courses, reviews, and users.
It's built with **Node.js**, **Express**, and **MongoDB**, providing full CRUD functionality, authentication, and advanced query features such as filtering, pagination, and field selection.

---

## 🚀 Features

### Bootcamps
- List all bootcamps with pagination, filtering, field selection, and limits
- Get a single bootcamp
- Create new bootcamp *(publishers/admins only; one bootcamp per publisher)*
- Upload bootcamp photo *(owner/admin only)*
- Update or delete bootcamp *(owner/admin only)*
- Calculate average cost and average rating for a bootcamp

### Courses
- List all courses (`/api/v1/courses`) with full filtering, sorting, field selection, and pagination
- List courses for a specific bootcamp (`/api/v1/bootcamps/:bootcampId/courses`)
- Get a single course
- Create, update, or delete a course *(owner/admin only)*

### Reviews
- List all reviews (`/api/v1/reviews`) with full filtering, sorting, field selection, and pagination
- List reviews for a specific bootcamp (`/api/v1/bootcamps/:bootcampId/reviews`)
- Get, create, update, or delete a review *(owner/admin only)*
- One review per user per bootcamp, enforced at the database level
- Average rating calculation integrated with bootcamps

### Users & Authentication
- JWT authentication with cookies (30-day expiry)
- Register as `user` or `publisher`
- Login / Logout
- Forgot/reset password with email token
- Update user info and password
- Role-based access control across `user`, `publisher`, and `admin` roles
- Admin-only user management (CRUD)

---

## 🧰 Tech Stack

- **Node.js** + **Express** – backend framework
- **MongoDB** + **Mongoose** – database & ORM
- **JWT** – authentication and authorization
- **bcryptjs** – password hashing
- **express-fileupload** – photo uploads
- **Nodemailer** – password reset email service
- **Helmet, HPP, XSS Sanitizer, Mongo Sanitize, Rate Limit** – security middleware
- **dotenv** – environment configuration

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FarazPourebrahim/campverse.git
   cd campverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   Create a `config.env` file inside the `config/` directory and add:

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

4. **Seed the database (optional)**
   ```bash
   # Import sample data
   node seeder -i

   # Delete all data
   node seeder -d
   ```

5. **Run the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

---

## 📘 API Documentation

Full API documentation and usage examples are available in the project's `index.html` documentation file.

---

## 📂 Project Structure

```
campverse/
├── controllers/        # Route controllers
├── models/             # Mongoose models
├── routes/             # API routes
├── middleware/         # Custom middleware (auth, error handler, etc.)
├── utils/              # Utility functions (email, error responses, etc.)
├── config/             # Environment configuration (config.env)
├── public/uploads/     # Uploaded files
├── server.js           # Main entry point
├── package.json
```

---

## 🧑‍💻 Author

Created by **[Faraz Pourebrahim](https://github.com/FarazPourebrahim)**

---

## 📜 License

This project is licensed under the **MIT License**.

---

### ⭐️ If you like this project, consider giving it a star on GitHub!
