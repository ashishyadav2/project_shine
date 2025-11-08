import React, { useEffect, useState } from "react";
import ActionButton from "../components/ActionButton";
import Card from "../components/Card";
import Header from "../components/Header";
import LinkTag from "../components/LinkTag";
import Navbar from "../components/Navbar";
import TagContainer from "../components/TagContainer";
import Tags from "../components/Tags";
import axios from "axios";

const Homes = () => {
  const [tags, setTags] = useState<string[]>([]);
  const skills = [
    "Code     ",
    "ML models",
    "Design   ",
    "Websites ",
    "Apps     ",
    "Products ",
  ];
  const [currentSkill, setCurrentSkill] = useState(skills[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * skills.length);
      setCurrentSkill(skills[randomIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [skills]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get<string[]>(
          `${import.meta.env.VITE_BACKEND_URL}/api/get_tags/`
        );
        setTags(res.data.map((eachTag) => eachTag.split(" ")[0]));
        // setTags(res.data);
        if (import.meta.env.VITE_LOGGING == "true") {
          console.log(res.data);
        }
      } catch (err) {
        if (import.meta.env.VITE_LOGGING == "true") {
          console.error("Failed to fetch tags:", err);
        }
      }
    };

    fetchTags();
  }, []);
  // let array = [
  //   "MongoDB",
  //   "SQL",
  //   "HTML",
  //   "CSS",
  //   "Python",
  //   "Java",
  //   "ReactJS",
  //   "Node",
  //   "Django",
  //   "Machine Learning",
  //   "Flask",
  // ];
  return (
    <>
      <Header isActive="home" />
      <div id="overlay">
        <div id="blob">
          <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 310 350"
          >
            <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z" />
          </svg>
        </div>
        <div className="homeMiddleDiv">
          <div className="heading">
            Hi, I am Ashish Yadav and I turn ideas into{" "}
            <span className="skillsDiv">
              {/* {skills.map((item, index) => (
                <>
                  <p key={index}>{item}</p>
                </>
              ))} */}
              {currentSkill}
            </span>
          </div>
          <div className="textUnderline"></div>
        </div>
        <div className="homeBottomTags">
          <TagContainer tagTextArr={tags} />
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
