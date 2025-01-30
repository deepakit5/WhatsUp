import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    phoneNumber: {
      type: String,
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

    chatsList: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [], // Initialize as an empty array
    }, // Can store both chat and group chat IDs

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
    passwordResetToken: {type: String}, // Token for resetting password
    passwordResetTokenExpires: {type: Date}, // Expiry time for the token
  },
  {
    timestamps: true,
  }
);

// pre hooks -> it execute some provided function before the execution of the event(i.e., save here)
// means-> below fun. encrypt the password before saving the it in mongoDB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next(); //next act as a flag ,it handover the execution to the main flow. since pre hook work as a middleware.
});

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
