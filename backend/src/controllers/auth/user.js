const { query } = require('../../config/query');

const findUserByEmail = async (email) => {
  try {
    const facultyQuery = "SELECT id, name, gmail, role, staff_id FROM faculty WHERE gmail = ?";
    let users = await query(facultyQuery, [email]);
    if (users.length > 0) {
      return { ...users[0], userType: 'faculty' };
    }

    const studentQuery = "SELECT id, name, gmail, reg_no, department, year, role FROM students WHERE gmail = ?";
    users = await query(studentQuery, [email]);

    if (users.length > 0) {
      return { ...users[0], userType: 'student' };
    }

    return null;
  } catch (error) {
    throw new Error('Error finding user by email');
  }
};

module.exports = { findUserByEmail };
