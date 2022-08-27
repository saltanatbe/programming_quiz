import React from "react";
import "./../../App.css"
import logo from '../../assets/images/icon.png';
import {ReactComponent as Github} from '../../assets/svg/github.svg';

const NavBar = () => {
  return (
    <header className="header">
      <nav>
        <a href="#">Programming quiz</a>
        <a className="questions" href="#">Questions</a>
      </nav>
      <img src={logo} className="logo"/>
      <a href="https://github.com/saltanatbe">
        <Github className="github"/>
      </a>
      
    </header>
    
  );
};

export default NavBar;
