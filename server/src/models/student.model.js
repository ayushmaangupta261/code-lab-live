import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // userName: {
    //   type: String,
    //   // required: true,
    //   unique: true,
    //   lowercase: true,
    //   trim: true,
    // },
    avatar: {
      type: String, // Cloudinary Url
    },
    accountType: {
      type: String,
      default: "Student",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    accessToken: {
      type: String,
      default: null,
    },
    collegeId: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
    },
    mobileNumber: {
      type: Number,
    },

    questionsSolved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    room: [{ type: Schema.Types.ObjectId, ref: "Room" }],

    // // for instructor
    // questions: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Question",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

// pre method to encrypt the password
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check password is correct or not
studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      // username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate refresh token
studentSchema.methods.generateRefreshToken = function () {
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

export const Student = mongoose.model("Student", studentSchema);
