const express = require("express");
const resourcesRouter = require("./resourceRoutes/resource");
const authRouter = require("./auth/authRoute");
const skillRouter = require('./skills/skill')
const approval = require('./approvals/approvals')
const find = require('./find/findRoute')
const router = express.Router();

// Use both routers
router.use("/api", resourcesRouter);
router.use("/api/auth", authRouter);
router.use('/api', skillRouter)
router.use('/api', approval)
router.use('/api', find)

module.exports = router;
