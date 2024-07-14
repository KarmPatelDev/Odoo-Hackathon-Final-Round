import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnect from "./config/dbConnect.js";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";

// Configure ENV
dotenv.config();

// Rest Object
const app = express();

// Database Config
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rest API
app.get("/", (req, res) => {
    res.send("Welcome To Server");
});

// Routers
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);

// PORT
const PORT = process.env.PORT || 8080;

// Run Listen
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.DEV_MODE} at PORT ${PORT}`);
});