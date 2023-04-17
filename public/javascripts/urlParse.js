const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const xml2js = require("xml2js");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const pdpUrls = async (url) => {
  const response = await fetch(url);
  const data = await response.text();
  const parsedData = await xml2js.parseStringPromise(data);
  const locArr = await parsedData.sitemapindex.sitemap;
  const locUrls = locArr.map((entry) => entry.loc[0]);
  const filteredUrls = locUrls.filter((url) => url.includes("pdp"));

  return filteredUrls;
};

const totalUrlArr = async (urlArr) => {
  let totalUrlList = [];
  for (let pdp of urlArr) {
    const response = await fetch(pdp);
    const pdpUrlData = await response.text();
    const parsedData = await xml2js.parseStringPromise(pdpUrlData);
    const pdpUrlList = parsedData.urlset.url;

    for (let url of pdpUrlList) {
      totalUrlList.push(url.loc[0]);
    }
  }

  return totalUrlList;
};

const scrapeProductPage = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let priceValue;
  try {
    await page.goto(url);
    await page.waitForSelector('span[data-qaid="pdpProductPriceRegular"]');
    const element = await page.$('span[data-qaid="pdpProductPriceRegular"]');
    const price = await element.getProperty("textContent");
    priceValue = await price.jsonValue();
    console.log(priceValue);
  } catch (err) {
    console.log("no price info");
  }

  await browser.close();

  // const test = $("[id='product-name__p']").text();
  // const test = $("span[data-qaid='pdpProductPriceRegular']").text();

  const productName = $("#product-name__p").text();
  const productCategory = $("#product-category").text().trim();
  const productDescription = $("#product-description").text().trim();
  const productImages = $(".product-detail-hero-image")
    .map(function () {
      return $(this).attr("src");
    })
    .get();
  const productPrice = $('span[data-qaid="pdpProductPriceSale"]').text();
  const regProductPrice = $('span[data-qaid="pdpProductPriceRegular"]').text();
  const productAvailability = $('.product-info [itemprop="availability"]').attr(
    "content"
  );
  const productReviews = $(".reviews .review")
    .map(function () {
      const rating = $(this).find(".rating-stars").attr("data-rating");
      const author = $(this).find(".review-author").text().trim();
      const text = $(this).find(".review-text").text().trim();
      return { rating, author, text };
    })
    .get();

  const infoObject = {
    priceValue,
    productName,
    productCategory,
    productDescription,
    productImages,
    productPrice,
    regProductPrice,
    productAvailability,
    productReviews,
  };

  return infoObject;
};

module.exports = { pdpUrls, totalUrlArr, scrapeProductPage };
