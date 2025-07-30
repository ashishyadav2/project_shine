import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionButton from "./ActionButton";
import TagContainer from "./TagContainer";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
interface CardProps {
  cardTags: string[];
  cardTitle: string;
  cardDescription: string;
  cardBgImgUrl?: string;
  cardGitLink?: string;
  isEditing?: boolean;
  controller?: () => void;
  deleteController?: () => void;
}
const Card = ({
  cardTags,
  cardTitle,
  cardDescription,
  cardBgImgUrl = "",
  cardGitLink = "#",
  isEditing = false,
  controller,
  deleteController,
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
      ></div>
      <div className="cardOverlay overlayActive"></div>
      <div className="cardContent">
        <div className="cardTagsContainer">
          <TagContainer tagTextArr={cardTags} />
        </div>
        <div className="cardTitle font-body">{cardTitle}</div>
        <div className="cardDescription font-body">{cardDescription}</div>
        <div className="cardActions">
          <ActionButton
            btnText={"Source Code"}
            btnType={"inactive"}
            btnFun={() => {
              window.open(cardGitLink, "_blank");
            }}
          />
          {isEditing && (
            <>
              <ActionButton
                btnText={<FontAwesomeIcon icon={faPen} />}
                btnType={"inactive"}
                btnFun={controller}
              />
              <ActionButton
                btnText={<FontAwesomeIcon icon={faTrash} />}
                btnType={"inactive"}
                btnFun={deleteController}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
