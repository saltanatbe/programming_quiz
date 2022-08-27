const puppeteer = require("puppeteer");
const { MongoClient } = require("mongodb");

// Connection URI
const uri =
"mongodb+srv://saltanatbekturgan:HelloSaltanat@cluster0.exz1hsr.mongodb.net/?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);
client.connect();
let solved_id = [];

const getProblem = async (req, res)  =>{
  let rand;
  do {
    rand = Math.floor(Math.random() * 141);
  } while (solved_id.includes(rand));
  solved_id.push(rand);
  try {
    await client.connect();
    const database = client.db('programming_quiz');
    const questions = database.collection("questions");
    let query={_id: rand}
    const problem = await questions.findOne(query);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(problem.url);
    // let description = "No description";
    // if(await page.$('div.content__u3I1')){
    //   description = await page.$eval('div.content__u3I1', el=>el.innerHTML);
    // }
    // const full_problem = {...problem, "description":description};
    // console.log("problem in db");
    // console.log(full_problem);
    // res.json(full_problem);
    res.json(problem);
  } finally {
    // Ensures that the client will close when you finish/error
     client.close();
  }
  
}

async function getDescription(problem){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(problem.url);
  const description = page.$eval("div.content__u3I1");
  return {...problem, "description":description};
}


// const getProblem = (req, res) => {
//   let rand;
//   do {
//     rand = Math.floor(Math.random() * 141);
//   } while (solved_id.includes(rand));
//   solved_id.push(rand);
//   pool.query(
//     "SELECT * from questions where id=" + rand + ";",
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       let url = results.link;
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();
//       await page.goto(url, { timeout: 0 });
//       const description = await page.$eval(
//         "div.content__u3I1",
//         (el) => el.innerHTML
//       );
//       pool.end();

//       browser.close();
//       console.log("rows");
//       console.log(results.rows);
//       res.status(200).json({...results.rows, description:description});
//     }
//   );
// };

// const getApproaches = (req, res) => {
//   pool.query(
//     "select solution, description from approaches;",
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       console.log("select solution");
//       res.status(200).json(results.rows);
//     }
//   );
// };

module.exports = {
  getProblem,
  //getApproaches,
};
