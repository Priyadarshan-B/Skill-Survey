const { query } = require('../../config/query');

exports.getApprovals = async(req, res)=>{
    try{
        const sql = `
        SELECT s.name, d.department,ye.year , sk.* FROM stu_skills sk
	LEFT JOIN students s ON s.reg_no = sk.student
	LEFT JOIN departments d ON d.id = s.department
	LEFT JOIN years ye ON ye.id = s.year
         WHERE sk.a_status = ? AND sk.status = ?
        `
        const approvals = await query(sql,['1','1'])
        res.status(200).json(approvals)
    }
    catch(err){
        console.error("Error fetching approvals", err.message);
        res.status(500).json({ error: "An error occurred while fetching approvals" });
    }
}
exports.SkillReject = async(req, res)=>{
    const{student,id, reason} = req.body
    if(!student ||!id || !reason ){
        return res.status(400).json({error:'student is requied...'})
    }
    try{
        const sql = `
        UPDATE stu_skills SET a_status = ?, reason =? WHERE student = ? AND id =? AND status = ?
        `
        const approvals = await query(sql,['3',reason, student,id,'1'])
        res.status(200).json(approvals)
    }
    catch(err){
        console.error("Error fetching approvals", err.message);
        res.status(500).json({ error: "An error occurred while fetching approvals" });
    }
}

exports.SkillApprove = async(req, res)=>{
    const{student,id} = req.body
    if(!student ){
        return res.status(400).json({error:'student is requied...'})
    }
    try{
        const sql = `
        UPDATE stu_skills SET a_status = ? WHERE student = ? AND id =? AND status = ?
        `
        const approvals = await query(sql,['2',student,id,'1'])
        res.status(200).json(approvals)
    }
    catch(err){
        console.error("Error fetching approvals", err.message);
        res.status(500).json({ error: "An error occurred while fetching approvals" });
    }
}

exports.getApprovalsReject = async(req, res)=>{
    try{
        const sql = `
      SELECT s.name, d.department,ye.year , sk.* FROM stu_skills sk
	LEFT JOIN students s ON s.reg_no = sk.student
	LEFT JOIN departments d ON d.id = s.department
	LEFT JOIN years ye ON ye.id = s.year
         WHERE sk.a_status = ? AND sk.status = ?
        `
        const approvals = await query(sql,['3','1'])
        res.status(200).json(approvals)
    }
    catch(err){
        console.error("Error fetching approvals", err.message);
        res.status(500).json({ error: "An error occurred while fetching approvals" });
    }
}

exports.getApprovaledSkills = async(req, res)=>{
    try{
        const sql = `
        SELECT s.name, d.department,ye.year , sk.* FROM stu_skills sk
	LEFT JOIN students s ON s.reg_no = sk.student
	LEFT JOIN departments d ON d.id = s.department
	LEFT JOIN years ye ON ye.id = s.year
         WHERE sk.a_status = ? AND sk.status = ?
        `
        const approvals = await query(sql,['2','1'])
        res.status(200).json(approvals)
    }
    catch(err){
        console.error("Error fetching approvals", err.message);
        res.status(500).json({ error: "An error occurred while fetching approvals" });
    }
}

exports.SkillApprovedStu = async(req, res)=>{
    const{student} = req.body
    if(!student ){
        return res.status(400).json({error:'student is requied...'})
    }
    try{
        const sql = `
       SELECT * FROM stu_skills WHERE a_status = ? AND status = ? 
       ORDER BY a_status AND date
        `
        const approvals = await query(sql,['2','1'])
        res.status(200).json(approvals)
    }
    catch(err){
        console.error("Error fetching approvals", err.message);
        res.status(500).json({ error: "An error occurred while fetching approvals" });
    }
}