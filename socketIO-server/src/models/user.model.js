import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
  {
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
      required: [true, "Password is required"],
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },

    avatar: {
      type: String, // cloudinary url
      required: true,
      default: "", // URL of profile picture
    },

    about: {
      type: String,
      default: "Hey there! I am using WhatsApp.",
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

    contacts: [
      {
        contactId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        nickname: String, // Optional nickname for contact
      },
    ],

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model("User", userSchema);
