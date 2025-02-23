import ActionButton from "./ActionButton";
import TagContainer from "./TagContainer";

interface CardProps {
  cardTags: string[];
  cardTitle: string;
  cardDescription: string;
}
const Card = ({ cardTags, cardTitle, cardDescription }: CardProps) => {
  return (
    <div className="cardContainer">
      <div className="cardContent">
        <div className="cardTagsContainer">
          <TagContainer tagTextArr={cardTags} />
        </div>
        <div className="cardTitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio iusto
          assumenda nesciunt!
        </div>
        <div className="cardDescription">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere soluta
          pariatur quos placeat asperiores modi fuga magnam deserunt deleniti
          quod libero, maxime iste amet est ab qui facilis exercitationem
          necessitatibus, quia nisi officiis, tempore aliquid nulla? Maiores
          ullam obcaecati sit, eos nihil, culpa voluptate adipisci nam fugiat
          quidem incidunt?
        </div>
        <ActionButton btnText={"Learn More"} btnType={"inactive"} />
      </div>
    </div>
  );
};

export default Card;
