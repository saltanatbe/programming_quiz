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
          // if (a_c.querySelector("a.table-text") !== null) {
          //   pool.query(
          //     "INSERT INTO approaches(solution) VALUES (" +
          //       a_c.querySelector("button.flex-container-row>p") +
          //       "')",
          //     (err, res) => {
          //       console.log(err, res);
          //     }
          //   );
          // }
          let approach = a_c.querySelector("button.flex-container-row>p");
          let links = Array.from(a_c.querySelectorAll("a.table-text"));

          links.forEach((link) => {
            results.push({
              approach: (approach.textContent=="1-D Dynamic Progrmaming" || approach.textContent=="2-D Dynamic Programming")? "Dynamic Programming":approach.textContent,
              url: link.getAttribute("href"),
            });
          });
        });
        return results;
      });

      let finals = [];
      let n = 0;
      //let rand = Math.floor(Math.random() * 150);
      for (const data of dataset) {
        //if (n < 5) {
          await page.goto(data.url);
          await page.waitForTimeout(4000);

          if ((await page.$("div.css-10o4wqw>div")) !== null) {
            const level = await page.$eval(
              "div.css-10o4wqw>div",
              (el) => el.textContent
            );

            // finals.push({
            //   id: n,
            //   url: url,
            //   level:level,
            //   approach: data.approach,
            // });
            // let i = finals.length - 1;
            pool.query(
              "INSERT INTO questions(id, link, level, solution) VALUES (" +
                n +
                ",'" +
                data.url +
                "','" +
                level +
                "','" +
                data.approach+
                "')",
              (err, res) => {
                console.log(err, res);
              }
            );
            n++;
          //}
        }
      }
      pool.end();

      browser.close();
      return resolve(finals);
    } catch (e) {
      return reject(e);
    }
  });
}

run().then(console.log).catch(console.error);
