const express = require("express");
const resourcesRouter = require("./resourceRoutes/resource");
const authRouter = require("./auth/authRoute");

const router = express.Router();

// Use both routers
router.use("/api", resourcesRouter);
router.use("/api/auth", authRouter);

module.exports = router;
