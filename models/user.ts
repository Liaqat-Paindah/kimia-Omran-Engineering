import bcrypt from "bcryptjs";
import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      default: "user",
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default models.User || model("User", UserSchema);
