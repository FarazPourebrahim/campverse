const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const fileupload = require("express-fileupload");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const app = express();

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging
if (process.env.NODE_ENV === "development") {
  app.use(logger);
}

// File uploading
app.use(fileupload());

// Security middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Parameter pollution protection
app.use(hpp());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Route files (mounted last)
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
