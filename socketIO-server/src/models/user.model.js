import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema(
  {
    googleId: {type: String}, // For Google OAuth
    username: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      index: true, // it helps/enhance searching with this field
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    avatar: {
      type: String, // cloudinary url
      required: true,
      default: '', // URL of profile picture
    },

    about: {
      type: String,
      default: 'Hey there! I am using WhatsApp.',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: null, // To store socket connection ID
    },

    undeliveredMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],

    chatsList: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [], // Initialize as an empty array
    }, // Can store both chat and group chat IDs
    // remember update user Schema in backend

    contacts: [
      {
        contactId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        nickname: String, // Optional nickname for contact
      },
    ],

    // refreshToken: {
    //   type: String,
    // },
    // passwordResetToken: {type: String}, // Token for resetting password
    // passwordResetTokenExpires: {type: Date}, // Expiry time for the token
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
