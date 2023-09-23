const router = require("express").Router();
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

// -------------Login page using async method------------------------
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(422)
      .json({ status: 422, error: "Pls fill all the details" });
  }

  try {
    const userLogin = await User.findOne({ username: username });

    if (userLogin) {
      const passVerify = await bcrypt.compare(password, userLogin.password);
      if (passVerify) {
        const token = await userLogin.genarateAuthToken();
        // console.log(token);
        //----------method of token expire after some milli seconds--------------
        // res.cookie("jwtoken", token, {
        //   expires: new Date(Date.now + 600000),
        //   httpOnly: true,
        // });

        //----------method of token not expire after some milli seconds--------------
        res.cookie("jwtoken", token);
        return res.status(201).json({
          status: 201,
          message: "Login Successful!",
          id: userLogin._id,
          username: userLogin.username,
        });
      } else {
        return res
          .status(422)
          .json({ status: 422, error: "Invalid email or password" });
      }
    } else {
      return res
        .status(422)
        .json({ status: 422, error: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err);
  }
});

// -------------Login page using async method------------------------
router.put("/reset", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password) {
    return res
      .status(422)
      .json({ status: 422, error: "Pls fill all the details" });
  }

  try {
    const userLogin = await User.findOne({ username: username });

    if (userLogin) {
      if (userLogin.email === email) {
        pass = await bcrypt.hash(password, 12);
        await User.findByIdAndUpdate(
          { _id: userLogin._id },
          { $set: { password: pass } }
        );

        // await userLogin.save();

        return res.status(201).json({
          status: 201,
          message: "Password reset successful!",
        });
      } else {
        return res
          .status(422)
          .json({ status: 422, error: "Invalid email or password" });
      }
    } else {
      return res
        .status(422)
        .json({ status: 422, error: "Invalid email or username" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
