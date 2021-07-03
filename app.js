var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");

var app = express();

app.use(
  cors({
    origin: ["http://localhost:8080", "https://canary.powerkassa.com"]
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
