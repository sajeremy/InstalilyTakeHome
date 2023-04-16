const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const xml2js = require("xml2js");
const path = require("path");
const { pdpUrls, totalUrlArr } = require("./public/javascripts/urlParse");

const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/test", async (req, res) => {
  const jcrewURL = "https://www.jcrew.com/sitemap-wex/sitemap-index.xml";
  const pdpUrlList = await pdpUrls(jcrewURL);
  const jcrewUrlTotal = await totalUrlArr(pdpUrlList);

  return res.json(jcrewUrlTotal);
});

module.exports = app;
