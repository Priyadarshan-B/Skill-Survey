const express = require('express');
const passport = require('../../controllers/auth/passport');
const { findUserByEmail } = require('../../controllers/auth/user');
const { OAuth2Client } = require('google-auth-library'); 

const router = express.Router();
const client = new OAuth2Client(process.env.CLIENT_ID); 

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
    const { email } = payload; 

    const user = await findUserByEmail(email);

    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'User not found in the database' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = router;
