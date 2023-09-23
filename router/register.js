const router = require("express").Router();
const User = require("../models/userSchema");

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(422)
      .json({ status: 422, error: "Enter all the fields!" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(422)
        .json({ status: 422, error: "Email already exists!" });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();
    return res
      .status(201)
      .json({ status: 201, message: "Successfully Registered!" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
