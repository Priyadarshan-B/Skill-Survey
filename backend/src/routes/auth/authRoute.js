const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken'); 
const { findUserByEmail } = require('../../controllers/auth/user');

const router = express.Router();
const client = new OAuth2Client(process.env.CLIENT_ID);
const secretKey = process.env.ENCRYPTION_KEY;
const jwtSecret = process.env.JWT_SECRET; 

const encrypt = (payload) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();
  return ciphertext;
};

router.post('/google/callback', async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const tokenId = authorization.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, picture } = payload;

    const user = await findUserByEmail(email);

    if (user) {
      let tokenData = {
        name: user.name,
        gmail: user.gmail,
        profile: picture,
        role: user.role,
      };

      if (user.role === 2) {
        Object.assign(tokenData, {
          reg_no: user.reg_no,
          department: user.department,
          year: user.year,
        });
      } else if (user.role === 1) {
        Object.assign(tokenData, {
          staff_id: user.staff_id,
        });
      }

      const jwtToken = jwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 60 * 60 }, 
        jwtSecret
      );

      tokenData.token = jwtToken;

      console.log("User data with JWT token:", tokenData);

      const encryptedToken = encrypt(tokenData);

      return res.status(200).json({
        message: 'Login successful',
        d: encryptedToken,
      });
    } else {
      return res.status(401).json({ message: 'User not found in the database' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = router;
