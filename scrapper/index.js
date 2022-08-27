// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args));

// const PORT = 8080;
// const axios = require("axios");
// const cheerio = require("cheerio");
// const express = require("express");
// const url = "https://leetcode.com/";
// //const url = "https://neetcode.io";
// const app = express();

// axios(url, {
//   maxRedirects: 100,
// })
//   .then((response) => {
//     const html = response.data;
//     console.log(html);
//     const $ = cheerio.load(html);

//     const problems_url = []; /*
//   $(".table-text", html).each(function () {
//     console.log("table test");
//     const url = $(this).attr("href");
//     problems_url.push(url);
//     console.log(url);
//   });*/
//   })
//   .catch((err) => console.log(err));

// app.listen(PORT, () => console.log(`server running on PPORT ${PORT}`));
