const puppeteer = require("puppeteer");
const url = "https://seanprashad.com/leetcode-patterns/";
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
          document.querySelectorAll("table.table>tbody>tr")
        );

        approach_container.forEach(async (a_c) => {
          
          let approach = a_c.querySelector("td>div.patterns.row");
          let link = a_c.querySelectorAll("td>a.nav-link");

            results.push({
              approach: (approach.textContent=="Arrays")? "Arrays & Hashing": 
              (approach.textContent=="In-place reversal of a linked list") ? "Linked List": 
              (approach.textContent=="Heap") ? "Heap / Priority Queue":
              (approach.textContent=="Trie" || approach.textContent=="Design")? "Tries":
              (approach.textContent=="Graph")? "Graphs":
              approach.textContent,
              url: link.getAttribute("href"),
            });
          
        });
        return results;
      });

      let finals = [];
      let n = 140;
      //let rand = Math.floor(Math.random() * 150);
      for (const data of dataset) {
        if (n < 5) {
          await page.goto(data.url);
          await page.waitForTimeout(4000);

          if ((await page.$("div.css-10o4wqw>div")) !== null) {
            const level = await page.$eval(
              "div.css-10o4wqw>div",
              (el) => el.textContent
            );

            pool.query(
              "INSERT INTO questions(id, link, level, solution) VALUES (" +
                n +
                ",'" +
                url +
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
          }
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
