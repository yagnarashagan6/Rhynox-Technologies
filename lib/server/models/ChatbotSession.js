import mongoose from 'mongoose';
const schema = new mongoose.Schema({ sessionId: { type: String, index: true }, startedAt: { type: Date, default: Date.now }, endedAt: Date, messageCount: { type: Number, default: 0 }, leadCaptured: { type: Boolean, default: false }, contactInfo: { name: String, email: String, phone: String }, transcriptSummary: String }, { timestamps: true, collection: 'chatbot_sessions' });
export default mongoose.models.ChatbotSession || mongoose.model('ChatbotSession', schema);
