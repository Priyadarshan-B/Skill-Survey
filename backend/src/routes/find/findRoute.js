const express = require("express")
const router = express.Router();
const find = require('../../controllers/find/find')

router.post('/find-skill', find.getStudentList)

module.exports = router;
