require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connect = require("./config/connectDB");
const route = require("./routes/index");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { errorHandler } = require("./middleware/error");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middlewares
app.use(morgan("dev"));

app.use(cookieParser());
 app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// connect database
connect();
// router
route(app);
// handleError
app.use(errorHandler);

app.listen(5000, () => {
  console.log("The port is listening on port 5000");
});
