import "./problem_bar.css";
import React from "react";
// import styled from "styled-components";
import { useState, useEffect } from "react";

// const ButtonGroup = styled.div`
//   display: flex;
// `;

const ProblemBar = () => {
  useEffect(() => {
    //GetApproaches();
    GetProblem();
  }, []);

  const [approaches, setApproaches] = useState([]);
  const [problem, setProblem] = useState({});

  // function GetApproaches() {
  //   axios
  //     .get(url + "approaches")
  //     //.then((res) => res.json())
  //     .then((approach) => {
  //       let id = 0;
  //       if (approaches.length == 0) {
  //         let new_arr = [];
  //         approach.data.forEach((a) => {
  //           new_arr.push({
  //             key: id,
  //             solution: a.solution,
  //             description: a.description,
  //             status: "neutral",
  //           });
  //           id++;
  //         });
  //         setApproaches(new_arr);
  //       }
  //     });
  // }


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

  function resetApproaches() {
    let new_arr = approaches;
          new_arr.forEach((a) => {
            a.status="neutral";
          });
          setApproaches(new_arr);
  }

  function next() {
    GetProblem();
    resetApproaches();
  }

  const checkAnswer = (event) => {
    let need;
    if (event.target.value === problem.solution) {
      need = "right";
    } else {
      need = "wrong";
    }
    setApproaches(
      approaches.map((approach) =>
        approach.solution === event.target.value
          ? { ...approach, status: need }
          : approach
      )
    );
  };

  return (
    <>
      <h1>Problem</h1>
      <div class="container mainContainer">
        <div class="row">
          <div class="col-sm problemContainer">
            {/* <div
              className="content"
              dangerouslySetInnerHTML={{ __html: problem.url }}
            ></div> */}
            <div>
              {problem._id}
            </div>
          </div>
          <div className="col-sm solutions">
            {approaches.map((approach) => (
              <button
                className={
                  approach.status === "right"
                    ? "customButton right-btn"
                    : approach.status === "wrong"
                    ? "customButton wrong-btn"
                    : "customButton default-btn"
                }
                key={approach.id}
                onClick={checkAnswer}
                as="input"
                type="button"
                value={approach.solution}
              >
                {approach.solution}
              </button>
              //<div class="w-100"></div>
            ))}
            {/* <Button
              className="btn btn-block customButton"
              as="input"
              onClick={next}
              type="button"
              value="Next"
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemBar;
