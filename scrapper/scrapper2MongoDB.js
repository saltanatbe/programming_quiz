const puppeteer = require("puppeteer");
const url = "https://seanprashad.com/leetcode-patterns/";
const { MongoClient } = require("mongodb");
// Connection URI
const uri =
"mongodb+srv://saltanatbekturgan:HelloSaltanat@cluster0.exz1hsr.mongodb.net/?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);
 client.connect();
const database = client.db('programming_quiz');
const questions = database.collection("questions");
async function dbdelete(){
    //let n = 141;
    try {
    //console.log(query._id);
    client.connect();
    const database = client.db('programming_quiz');
    const questions = database.collection("questions");

    // Query for a movie that has the title 'Back to the Future'
    for(let i=141; i<220; i++){ 
        let query={_id:i}
        await questions.deleteOne(query);
        console.log(i);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

}
async function dbinsert(query, tablename) {
  try {
    console.log(query._id);
    
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
          document.querySelectorAll("table.table>tbody>tr")
        );

        approach_container.forEach(async (a_c) => {
          
          let approach = a_c.querySelector("td>div.patterns");
          let link = a_c.querySelector("td>a.nav-link");

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
      //dataset.splice(0, 1);
      let finals = [];
      let n = 141;
      
      for (const data of dataset) {
       
          await page.goto(data.url);
          await page.waitForTimeout(4000);
          
          if ( (await questions.find({"url": data.url}).toArray().length==0) && (await page.$("div.css-10o4wqw>div")) !== null) {
            
            console.log(n);
            if (n > 103 ) {
            const level = await page.$eval(
              "div.css-10o4wqw>div",
              (el) => el.textContent
            );

            //let approach = (data.approach=="1-D Dynamic Programming" || data.approach=="2-D Dynamic Programming") ? "Dynamic Programming" : data.approach;
            let query={_id:n, "url":data.url, "levyel":level, "solution":data.approach}
            let tablename="questions";
            dbinsert(query, tablename);
            }
            n++;
          }
        //}
      }

      browser.close();
      client.close();
      return resolve(finals);
    } catch (e) {
      return reject(e);
    }
  });
}

run().then(console.log).catch(console.error);
//dbdelete()