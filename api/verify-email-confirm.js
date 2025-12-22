import connectDB from './db.js';
import EmailVerification from './models/EmailVerification.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, code } = req.body;
    
    const verification = await EmailVerification.findOne({ 
      email, 
      verificationCode: code 
    });

    if (!verification) {
      return res.status(400).json({ 
        error: 'Invalid verification code. Please check and try again.' 
      });
    }

    // Mark as verified
    verification.isVerified = true;
    await verification.save();

    res.json({ 
      success: true, 
      message: 'Email verified successfully!' 
    });
  } catch (err) {
    console.error('Error verifying code:', err);
    res.status(500).json({ 
      error: 'Verification failed. Please try again.' 
    });
  }
}
