const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    // this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

userSchema.methods.genarateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

// userSchema.methods.addMessage = async function (name, email, tel, message) {
//   try {
//     this.messages = this.messages.concat({ name, email, tel, message });
//     await this.save();
//     return this.messages;
//   } catch (err) {
//     console.log(err);
//   }
// };

// userSchema.methods.addPicture = async function (pic) {
//   try {
//     this.images = this.images.concat(pic);
//     await this.save();
//     return this.images;
//   } catch (err) {
//     console.log(err);
//   }
// };

const User = mongoose.model("user", userSchema);

module.exports = User;
