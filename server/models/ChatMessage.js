const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      default: 'default',
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
