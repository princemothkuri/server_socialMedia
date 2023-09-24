const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

dotenv.config({ path: "./config.env" });

require("./db/conn");

app.use(express.json()); //converting data into json format and this is also a middleWare

app.use("/api/users", require("./router/login"));
app.use("/api/logout", require("./router/logout"));
app.use("/api/register", require("./router/register"));
app.use("/api/posts", require("./router/posts"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running Successfully at port " + PORT);
});
