const puppeteer = require("puppeteer");
const url = "https://neetcode.io";
const { MongoClient } = require("mongodb");

// Connection URI
const uri =
"mongodb+srv://saltanatbekturgan:HelloSaltanat@cluster0.exz1hsr.mongodb.net/?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);

async function dbinsert(query, tablename) {
  try {
    console.log(query._id);
    
    const database = client.db('programming_quiz');
    const questions = database.collection(tablename);
    // Query for a movie that has the title 'Back to the Future'
    await questions.insertOne(query);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

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
      //dataset.splice(0, 1);
      let finals = [];
      let n = 0;
      
      for (const data of dataset) {
       
          await page.goto(data.url);
          await page.waitForTimeout(4000);
          await client.connect();
          if ((await page.$("div.css-10o4wqw>div")) !== null) {
            
            console.log(n);
            if (n > 103 ) {
            const level = await page.$eval(
              "div.css-10o4wqw>div",
              (el) => el.textContent
            );

            let approach = (data.approach=="1-D Dynamic Programming" || data.approach=="2-D Dynamic Programming") ? "Dynamic Programming" : data.approach;
            let query={_id:n, "url":data.url, "levyel":level, "solution":approach}
            let tablename="questions";
            dbinsert(query, tablename);
            }
            n++;
          }
        //}
      }
      pool.end();

      browser.close();
      client.close();
      return resolve(finals);
    } catch (e) {
      return reject(e);
    }
  });
}

run().then(console.log).catch(console.error);
