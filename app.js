const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const xml2js = require("xml2js");
const path = require("path");
const { pdpUrls, pdpData } = require("./public/javascripts/urlParse");

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

  // const response = await fetch(jcrewURL);
  // const data = await response.text();
  // const parsedData = await xml2js.parseStringPromise(data);
  // const locArr = await parsedData.sitemapindex.sitemap;
  // const locUrls = locArr.map((entry) => entry.loc[0]);
  // const pdpUrls = locUrls.filter((url) => url.includes("pdp"));
  // return res.json(pdpUrls);

  const pdpUrlList = await pdpUrls(jcrewURL);
  const test = await pdpData(pdpUrlList);
  const test2 = test.urlset.url;

  let result = [];
  for (let url of test2) {
    result.push(url.loc[0]);
  }

  return res.json(result);
  // return res.json(Object.getOwnPropertyNames(test2[0]));
});

module.exports = app;
