import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,

      trim: true,
      // index: true,
      minLength: [3, "Username must caontain at least 3 characters."],
      maxLength: [30, "Username cannot exceed 40 characters."],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      index: true, // it helps/enhance searching with this field
    },

    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
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
