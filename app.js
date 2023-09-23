const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

dotenv.config({ path: "./config.env" });

require("./db/conn");

// const User = require("./models/userSchema");

app.use(express.json()); //converting data into json format and this is also a middleWare

// app.use(require("./router/auth")); //this is a middleWare
app.use("/api/users", require("./router/login"));
app.use("/api/logout", require("./router/logout"));
app.use("/api/register", require("./router/register"));
app.use("/api/posts", require("./router/posts"));

const PORT = process.env.PORT;

// const middleware = (req, res, next) => {
//   console.log("MiddleWare is working...");
//   next();
// };

// app.get("/", (req, res) => {
//   res.send("home page");
// });

// app.get("/about", middleware, (req, res) => {
//   console.log("Exit of MiddleWare...");
//   res.send("about page");
// });

// app.get("/contact", (req, res) => {
//   res.send("contact us page");
// });

// global.nam = "";
// global.phone = "";
// global.mail = "";
// global.pass = "";
// // global.imgfile = "";
// global.vOtp = "";

// app.post("/verify", async (req, res) => {
//   const { name, tel, email, password } = req.body;

//   global.nam = name;
//   global.phone = tel;
//   global.mail = email;
//   global.pass = password;
//   // global.imgfile = imageFile;

//   // if (!name || !tel || !email || !password || !cpassword || !imageFile) {
//   //   return res.status(422).json({ error: "Enter all the fields!" });
//   // }

//   try {
//     const userExist = await User.findOne({ email: global.mail });
//     if (userExist) {
//       return res.status(422).json({ error: "Email already exists!" });
//     } // else if (password != cpassword) {
//     //   return res.status(422).json({ error: "Enter same password!" });
//     // }

//     // --------------OTP Generator---------------------------

//     global.vOtp = Math.floor(Math.random() * 9000 + 1000);

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: process.env.EMAIL_PORT,
//       secure: process.env.SECURE,
//       auth: {
//         user: process.env.USER,
//         pass: process.env.PASS,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: "prince",
//       to: global.mail,
//       subject: "Verification of Authentication application",
//       html: `<h1>Your otp is ${global.vOtp}</h1>`,
//     });
//     console.log("Message sent: " + info.messageId);
//     return res
//       .status(201)
//       .json({ message: "Successfully OTP sent to your Email!" });
//   } catch (err) {
//     console.log(err);
//   }
// });

app.listen(PORT, () => {
  console.log("Server is running Successfully at port " + PORT);
});
