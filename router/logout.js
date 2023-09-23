const router = require("express").Router();

router.get("/", (req, res) => {
  console.log("Logout Successful!");
  res.clearCookie("jwtoken", { path: "/" });
  return res.status(200).json({ message: "Logout Successful!" });
});

module.exports = router;
