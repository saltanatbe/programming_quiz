import React from "react";
import ProblemBar from "../problem_bar/problem_bar";
import "./../../App.css"
import clock from '../../assets/images/clock.png';

import { useState, useEffect } from "react";

let all=[
  "a","b","c","d","e","f","g","h","i","j","k","l","m","n"
]
const Main = () => {
  useEffect(() => {
    //GetApproaches();
    GetProblem();
  }, []);

  const [approaches, setApproaches] = useState([]);
  const [problem, setProblem] = useState({});

  async function GetProblem() {
    const response = await fetch('http://localhost:5000/problems/');
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const problem = await response.json();
    console.log("problem_bar: ");
    console.log(problem);
    setProblem(problem);
  //}
  }

  return (
    <main className="main">
      <div className="main__div">
        <div className="horizontal">
          <div className="counter">
              <p className="counter__text">1 / 20</p>
          </div>
          <div className="timer">
              <p className="timer__text">00 : 48</p>
              <img className="clock" src={clock}/>
          </div>
        </div>
        <div className="problem">
          <div
              className="content"
              dangerouslySetInnerHTML={{ __html: problem.description }}
            ></div>
        </div>
      </div>
      <div className="transparent-block">
        <p className="plain_text">Choose correct appraoch to solve the problem</p>
        {all.map((approach)=>{
          return(
          <div className="approach">
            {approach}
          </div>)
        })
          
        }
      </div>
      
{/*         
        <ProblemBar/> */}
    </main>    
  );
};

export default Main;
