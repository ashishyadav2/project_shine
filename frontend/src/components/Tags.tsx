import LinkTag from "./LinkTag";

interface TagsProps {
  tagText: string;
  target?: string;
}
const Tags = ({ tagText, target = "#" }: TagsProps) => {
  return <LinkTag linkText={tagText} target={target} cls="categoryTag" />;
};

export default Tags;
