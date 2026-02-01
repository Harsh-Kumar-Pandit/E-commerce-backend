import express from "express";
import { getDashboardStats, getRevenueChart } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/dashboard", adminAuth, getDashboardStats);
router.get("/revenue", adminAuth, getRevenueChart);


export default router;
