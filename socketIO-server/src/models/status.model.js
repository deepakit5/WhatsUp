import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video', 'text'],
    required: true,
  },
  mediaUrl: {type: String, default: ''},
  caption: {type: String, default: ''},
  viewers: [
    {
      viewerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      viewerName: {type: String, default: '--'},
      viewerImg: {type: String, default: '--'},
      viewedAt: {type: Date, default: Date.now},
    },
  ],
  replies: [
    {
      user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      message: {type: String, required: true},
      createdAt: {type: Date, default: Date.now},
    },
  ],
  createdAt: {type: Date, default: Date.now, expires: '24h'},
});

export const Status = mongoose.model('Status', statusSchema);
