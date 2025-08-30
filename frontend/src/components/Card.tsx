import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionButton from "./ActionButton";
import TagContainer from "./TagContainer";
import {
  faChartLine,
  faCircleQuestion,
  faCopy,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
interface CardProps {
  cardTags: string[];
  cardTitle: string;
  cardDescription: string;
  cardBgImgUrl?: string;
  cardGitLink?: string;
  fromDate?: string;
  isEditing?: boolean;
  controller?: () => void;
  deleteController?: () => void;
  copyController?: () => void;
}
const Card = ({
  cardTags,
  cardTitle,
  cardDescription,
  cardBgImgUrl = "",
  cardGitLink = "#",
  fromDate = "",
  isEditing = false,
  controller,
  deleteController,
  copyController,
}: CardProps) => {
  return (
    <div className="cardContainer">
      <div
        className="cardBgImg"
        style={{
          backgroundImage: cardBgImgUrl ? `url(${cardBgImgUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="cardTagsContainer">
          <TagContainer tagTextArr={cardTags} />
        </div>
      </div>
      <div className="cardOverlay overlayActive"></div>
      <div className="cardContent">
        <div className="cardTitle font-body">{cardTitle}</div>
        <div className="cardDescription font-body">{cardDescription}</div>
        <div className="cardActions">
          <ActionButton
            btnText={"Source Code"}
            btnType={"inactive"}
            btnFun={() => {
              window.open(cardGitLink, "_blank");
            }}
            tooltip={"View source code"}
          />
          {isEditing && (
            <>
              <ActionButton
                btnText={<FontAwesomeIcon icon={faPen} />}
                btnType={"inactive"}
                btnFun={controller}
                tooltip={"Edit Post"}
              />
              <ActionButton
                btnText={<FontAwesomeIcon icon={faTrash} />}
                btnType={"inactive"}
                btnFun={deleteController}
                tooltip={"Delete"}
              />
              <ActionButton
                btnText={<FontAwesomeIcon icon={faChartLine} />}
                btnType={"inactive"}
                tooltip={"Analytics"}
              />
              <ActionButton
                btnText={<FontAwesomeIcon icon={faCopy} />}
                btnType={"inactive"}
                tooltip={"Make copy"}
                btnFun={copyController}
              />
            </>
          )}
        </div>
      </div>

      <div className="cardDateDiv font-ui">
        <span className="from">{fromDate}</span>
        {/* <span className="to">Today</span> */}
      </div>
    </div>
  );
};

export default Card;
