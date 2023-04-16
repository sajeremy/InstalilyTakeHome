const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const xml2js = require("xml2js");
const cheerio = require("cheerio");

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

  const productName = $("#product-name__p").text().trim();
  const productCategory = $(".breadcrumbs a").last().text().trim();
  const productDescription = $(".product-info .description").text().trim();
  const productImages = $(".product-detail-hero-image")
    .map(function () {
      return $(this).attr("src");
    })
    .get();
  const productPrice = $('.product-info [itemprop="price"]').attr("content");
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
    productName,
    productCategory,
    productDescription,
    productImages,
    productPrice,
    productAvailability,
    productReviews,
  };

  return infoObject;
};

module.exports = { pdpUrls, totalUrlArr, scrapeProductPage };
