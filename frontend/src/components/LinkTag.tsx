import { useSearchBar } from "./SearchBarContext";

interface LinkTagProps {
  linkText: string;
  target?: string;
  cls?: "categoryTag" | "linkTag" | string;
}
const LinkTag = ({ linkText, target = "#", cls = "linkTag" }: LinkTagProps) => {
  const { handleTags, selectedTags, isSearchMode } = useSearchBar();
  let isTagPresent = selectedTags.includes(linkText);
  // console.log(isTagPresent);
  return (
    <a
      href={target}
      className={`${cls} ${isTagPresent ? "categoryTagSelected" : ""}`}
      onClick={(e) => {
        // console.log(isSearchMode);
        if (isSearchMode) {
          e.preventDefault();
          // console.log("okay");
          handleTags(linkText);
        }
      }}
    >
      {linkText}
    </a>
  );
};

export default LinkTag;
