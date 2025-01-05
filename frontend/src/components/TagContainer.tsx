import Tags from "./Tags";

interface TagContainerProps {
  tagTextArr: string[];
}

const TagContainer = ({ tagTextArr }: TagContainerProps) => {
  return (
    <>
      {tagTextArr.map((item, index) => (
        <Tags key={index} tagText={item} />
      ))}
    </>
  );
};

export default TagContainer;
