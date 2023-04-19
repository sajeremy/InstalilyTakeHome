const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const xml2js = require("xml2js");
const path = require("path");
const {
  pdpUrls,
  totalUrlArr,
  scrapeProductPage,
} = require("./public/javascripts/urlParse");

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

  let totalInfo = [];

  for (let url of jcrewUrlTotal) {
    const scrapedInfo = await scrapeProductPage(url);
    totalInfo.push(scrapedInfo);
    if (totalInfo.length > 10) break;
  }

  return res.json(totalInfo);
});

app.get("/scrapepage", async (req, res) => {
  const url1 = "https://www.jcrew.com/p/BB117";
  const url2 =
    "https://www.jcrew.com/p/boys/categories/clothing/graphics-shop/graphic-t-shirts/boys-now-or-never-t-shirt/AV603";
  const url3 =
    "https://www.jcrew.com/p/girls/categories/accessories/jewelry/bracelets/girls-glitter-braid-bracelet/64022";
  const url4 =
    "https://www.jcrew.com/p/home/categories/bedding-and-bath/accessories/apotheke-charcoal-lotion/M9536";
  const scrapedInfo1 = await scrapeProductPage(url1);
  const scrapedInfo2 = await scrapeProductPage(url2);
  const scrapedInfo3 = await scrapeProductPage(url3);
  const scrapedInfo4 = await scrapeProductPage(url4);

  return res.json({ scrapedInfo1, scrapedInfo2, scrapedInfo3, scrapedInfo4 });
  // return res.json(scrapedInfo1);
});

module.exports = app;
