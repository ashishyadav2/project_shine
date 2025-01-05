interface LinkTagProps {
  linkText: string;
  target?: string;
  cls?: "categoryTag" | "linkTag";
}
const LinkTag = ({ linkText, target = "#", cls = "linkTag" }: LinkTagProps) => {
  return (
    <a href={target} className={cls}>
      {linkText}
    </a>
  );
};

export default LinkTag;
