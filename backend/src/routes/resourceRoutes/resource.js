const express = require("express")
const resources = require('../../controllers/resources/resource')
const router = express.Router();

router.post("/resource", resources.get_resource)

module.exports = router;