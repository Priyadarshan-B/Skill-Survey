const { query } = require('../../config/query');

exports.getSkillTitle = async (req, res) => {
    try {
        const sql = `SELECT * FROM skill_title WHERE status = ?`;
        const skilltitle = await query(sql, ['1']);

        if (skilltitle.length === 0) {
            return res.status(404).json({ message: "No active skill titles found" });
        }

        res.json(skilltitle);
    } catch (err) {
        console.error("Error fetching skill title:", err.message);
        res.status(500).json({ error: "An error occurred while fetching skill titles." });
    }
};

exports.postSkill = async (req, res) => {
    const { student, skill, p_title, p_description, p_image, s_skill } = req.body;

    if (!student || !skill || !p_title || !p_description || !s_skill) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const sql = `
            INSERT INTO stu_skills(student, skill, p_title, p_description, p_images, s_skill, date)
            VALUES (?, ?, ?, ?, ?, ?,CURRENT_TIMESTAMP)
        `;
        const result = await query(sql, [student, skill, p_title, p_description, p_image, s_skill]);

        if (result.affectedRows === 1) {
            res.status(201).json({ message: "Skill successfully added.", skillId: result.insertId });
        } else {
            res.status(500).json({ error: "Failed to insert skill." });
        }
    } catch (err) {
        console.error("Error inserting skill:", err.message);
        res.status(500).json({ error: "An error occurred while inserting the skill." });
    }
};

exports.getSkills = async(req, res)=>{
    const{student} = req.body
    if(!student ){
        return res.status(400).json({error:'student is requied...'})
    }
    try{
        const sql = `
        SELECT * FROM stu_skills WHERE student = ? AND status = ?
        `
        const skills = await query(sql,[student, '1'])
        res.status(200).json(skills)
    }
    catch (err) {
        console.error("Error fetching skill:", err.message);
        res.status(500).json({ error: "An error occurred while fetching the skill." });
    }
}
