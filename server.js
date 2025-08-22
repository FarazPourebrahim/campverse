const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

const app = express();

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

if (process.env.NODE_ENV === "development") {
  app.use(logger);
}

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
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
