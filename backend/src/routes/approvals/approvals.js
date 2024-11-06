const express = require("express")
const router = express.Router();
const approval = require('../../controllers/approve/approve');

router.get('/approvals', approval.getApprovals)
router.post('/app-reject', approval.SkillReject)
router.post('/skill-approve', approval.SkillApprove)
router.get('/rejected-skills',approval.getApprovalsReject)
router.get('/approved-skills', approval.getApprovaledSkills)
router.post('/approved-skills-stu', approval.SkillApprovedStu)

module.exports = router;
