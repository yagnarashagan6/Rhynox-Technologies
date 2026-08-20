import mongoose from 'mongoose';
const schema = new mongoose.Schema({ buttonType: { type: String, required: true, unique: true }, count: { type: Number, default: 0 }, updatedAt: { type: Date, default: Date.now } });
export default mongoose.models.ClickAnalytics || mongoose.model('ClickAnalytics', schema);
