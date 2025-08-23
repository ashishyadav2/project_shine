import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import Header from "../components/Header";
import { useProjectPageData } from "../EventsHandler/HandleProjectsPage";

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  function showHideSearchBar() {
    setIsVisible(!isVisible);
  }
  const { projectData, loading, error, getProjectData } = useProjectPageData();

  useEffect(() => {
    getProjectData(); // fetch data on mount
  }, []);
  return (
    <>
      <Header isActive="projects" />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="cardContainerProject">
        <div className="cardPageContainerTop">
          <p>Projects</p>
        </div>
        <div className="cardPageContainerBtm">
          {projectData.map((item, index) => (
            <Card
              key={index}
              cardTags={item.card_tags}
              cardTitle={item.card_title}
              cardDescription={item.card_desc}
              cardBgImgUrl={item.card_img_url ? item.card_img_url : ""}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
