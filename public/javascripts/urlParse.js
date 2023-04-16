const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const xml2js = require("xml2js");

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

module.exports = { pdpUrls, totalUrlArr };
