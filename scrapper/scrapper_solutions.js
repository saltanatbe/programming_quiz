const puppeteer = require("puppeteer");
const url = "https://neetcode.io";
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "programming_quiz",
  password: "12345",
  port: "5432",
});

pool.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

function run() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { timeout: 0 });

      let dataset = await page.evaluate(() => {
        let results = [];
        let approach_container = Array.from(
          document.querySelectorAll("div.accordion-container")
        );

        approach_container.forEach(async (a_c) => {
          let approach = a_c.querySelector("button.flex-container-row>p");
          let links = Array.from(a_c.querySelectorAll("a.table-text"));

          links.forEach((link) => {
            results.push({
              approach: approach.textContent,
              url: link.getAttribute("href"),
            });
          });
        });
        return results;
      });
      let finals = [];
      let n = 0;

      //finals.forEach((id, title, description, approach) => {
      // for (let i = 0; i < finals.length; i++) {
      //   //let obj = finals[i];
      //   pool.query(
      //     //"Insert Into questions(id, title, description,solution) Values(1, '1', '1', '1') ",
      //     "INSERT INTO questions(id, title, description, solution)VALUES(" +
      //       finals[i].id +
      //       ",'" +
      //       finals[i].title +
      //       "','" +
      //       finals[i].description +
      //       "','" +
      //       finals[i].approach +
      //       "')",
      //     (err, res) => {
      //       console.log(err, res);
      //       pool.end();
      //     }
      //   );
      // }
      //});

      browser.close();
      return resolve(finals);
    } catch (e) {
      return reject(e);
    }
  });
}

run().then(console.log).catch(console.error);
