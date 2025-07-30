import Tags from "./Tags";

interface TagContainerProps {
  tagTextArr: string[];
}

const TagContainer = ({ tagTextArr }: TagContainerProps) => {
  if (!Array.isArray(tagTextArr)) return null;
  return (
    <>
      {tagTextArr.map((item, index) => (
        <Tags key={index} tagText={item} />
      ))}
    </>
  );
};

export default TagContainer;
