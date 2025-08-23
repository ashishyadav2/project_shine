import React from "react";
import ActionButton from "../components/ActionButton";
import Card from "../components/Card";
import Header from "../components/Header";
import LinkTag from "../components/LinkTag";
import Navbar from "../components/Navbar";
import TagContainer from "../components/TagContainer";
import Tags from "../components/Tags";

const Homes = () => {
  let array = [
    "MongoDB",
    "SQL",
    "HTML",
    "CSS",
    "Python",
    "Java",
    "ReactJS",
    "Node",
    "Django",
    "Machine Learning",
    "Flask",
  ];
  return (
    <>
      <Header isActive="home" />
      <div id="overlay">
        <div className="homeMiddleDiv">
          <p className="heading">
            Transforming challenges into solutions through technology
          </p>
          <div className="textUnderline"></div>
        </div>
        <div className="homeBottomTags">
          <TagContainer tagTextArr={array} />
        </div>
      </div>
      {/* <div className="cardPageContainer">
        <div className="cardPageContainerTop">
          <p>Projects</p>
        </div>
        <div className="cardPageContainerBtm">
          <Card
            cardTags={["Hello world", "hi", "world"]}
            cardTitle={"Some title"}
            cardDescription={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem repudiandae corrupti atque omnis neque dolorum?"
            }
          />
          <Card
            cardTags={["Hello world", "hi", "world"]}
            cardTitle={"Some title"}
            cardDescription={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem repudiandae corrupti atque omnis neque dolorum?"
            }
          />
          <Card
            cardTags={["Hello world", "hi", "world"]}
            cardTitle={"Some title"}
            cardDescription={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem repudiandae corrupti atque omnis neque dolorum?"
            }
          />
          <Card
            cardTags={["Hello world", "hi", "world"]}
            cardTitle={"Some title"}
            cardDescription={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem repudiandae corrupti atque omnis neque dolorum?"
            }
          />
        </div>
      </div> */}
    </>
  );
};

export default Homes;
