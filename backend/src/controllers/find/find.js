const { query } = require('../../config/query');

exports.getStudentList = async (req, res) => {
    const { skill } = req.body; // Expecting an array of skills
    if (!skill || !Array.isArray(skill) || skill.length === 0) {
        return res.status(400).json({ error: "Skill is required and should be an array of skill names." });
    }

    try {
        const skillList = skill.join(',');

        const sql = `
        SELECT student, GROUP_CONCAT(DISTINCT skill) AS skills, MAX(date) AS latest_date
        FROM stu_skills
        WHERE (
            (
                SELECT COUNT(*) 
                FROM skill_title 
                WHERE FIND_IN_SET(skill, ?) 
                    AND FIND_IN_SET(skill, stu_skills.skill)
            ) = ?
            AND FIND_IN_SET(skill, ?)
        )
        GROUP BY student
        ORDER BY latest_date DESC;
        `;

        const countSkills = skill.length;
        const students = await query(sql, [skillList, countSkills, skillList]);
        res.json(students);
    } catch (err) {
        console.error("Error fetching Student list:", err.message);
        res.status(500).json({ error: "An error occurred while fetching the student list." });
    }
};
