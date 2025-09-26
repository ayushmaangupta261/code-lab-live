import express from "express";
import { getEntityCounts } from "../controllers/home.controller.js";


const router = express.Router();

router.route("/get-all-counts").get(getEntityCounts);

export default router;
