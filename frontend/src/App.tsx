import ActionButton from "./components/ActionButton";
import Header from "./components/Header";
import LinkTag from "./components/LinkTag";
import Navbar from "./components/Navbar";
import TagContainer from "./components/TagContainer";
import Tags from "./components/Tags";

function App() {
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
      {/* <ActionButton btnText="Home" btnType="active" />
      <ActionButton btnText="Project" btnType="inactive" /> */}
      {/* <LinkTag linkText="click here" /> */}
      <div id="overlay">
        <Header />
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
    </>
  );
}
export default App;
