const { query } = require('../../config/query');

const findUserByEmail = async (email) => {
  try {
    const facultyQuery = "SELECT id, name, gmail, role FROM faculty WHERE gmail = ?";
    let users = await query(facultyQuery, [email]);
    console.log(users)
    if (users.length > 0) {
      return users[0];
    }

    const studentQuery = "SELECT id, name, gmail, reg_no, role FROM students WHERE gmail = ?";
    users = await query(studentQuery, [email]);

    if (users.length > 0) {
      return users[0];
    }

    return null; 
  } catch (error) {
    throw new Error('Error finding user by email');
  }
};

module.exports = { findUserByEmail };
