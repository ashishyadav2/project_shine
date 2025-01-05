interface ActionButtonProps {
  btnText: string;
  btnFun?: () => void;
  btnType?: "active" | "inactive";
}
const ActionButton = ({
  btnText,
  btnFun,
  btnType = "inactive",
}: ActionButtonProps) => {
  let clsName = "inactiveActionBtn";
  if (btnType == "active") {
    clsName = "activeActionBtn";
  }
  return <button className={clsName}>{btnText}</button>;
};
export default ActionButton;
