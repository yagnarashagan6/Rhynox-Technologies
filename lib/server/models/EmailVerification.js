import mongoose from 'mongoose';
const schema = new mongoose.Schema({ email: { type: String, required: true, unique: true }, verificationCode: { type: String, required: true }, isVerified: { type: Boolean, default: false }, createdAt: { type: Date, default: Date.now, expires: 600 } });
export default mongoose.models.EmailVerification || mongoose.model('EmailVerification', schema);
