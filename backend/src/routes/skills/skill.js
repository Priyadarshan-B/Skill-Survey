const express = require("express")
const skill = require('../../controllers/skills/skill')
const router = express.Router();

router.get("/skill", skill.getSkillTitle)
router.post('/stu-skill', skill.postSkill)
router.post('student-skills', skill.getSkills)

module.exports = router;