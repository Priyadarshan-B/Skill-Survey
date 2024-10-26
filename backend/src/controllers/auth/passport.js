const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findUserByEmail } = require('./user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const user = await findUserByEmail(email);

        if (user) {
          return done(null, user); 
        } else {
          return done(null, false, { message: "User not found in the database" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserByEmail(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;



// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const { query } = require('./db_utils'); // Import the query function from db_utils
// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: process.env.CALLBACK,
//       scope: ["profile", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         const profilePhoto = profile.photos[0]?.value;

//         // Query to find the user in the faculty table
//         const mentorQuery = "SELECT id, name, gmail, role FROM faculty WHERE gmail = ?";
//         let results = await query(mentorQuery, [email]); // Use the query function

//         if (results.length > 0) {
//           const user = { ...results[0], profilePhoto };
//           return done(null, user);
//         }

//         // Query to find the user in the students table
//         const studentQuery = "SELECT id, name, gmail, reg_no, role FROM students WHERE gmail = ?";
//         results = await query(studentQuery, [email]); // Use the query function

//         if (results.length > 0) {
//           const user = { ...results[0], profilePhoto };
//           return done(null, user);
//         }

//         return done(null, false, { message: "User not found" });
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (gmail, done) => {
//   try {
//     const queryText = `
//       SELECT id, name, gmail, NULL AS reg_no, staff_id, role 
//       FROM faculty
//       WHERE gmail = ? 
//       UNION  
//       SELECT id, name, gmail, reg_no, NULL AS staff_id, role
//       FROM students
//       WHERE gmail = ?
//     `;
//     const results = await query(queryText, [gmail, gmail]); // Use the query function

//     if (results.length > 0) {
//       return done(null, results[0]);
//     } else {
//       return done(null, false);
//     }
//   } catch (error) {
//     return done(error);
//   }
// });

// module.exports = passport;
