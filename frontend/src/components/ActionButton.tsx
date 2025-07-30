interface ActionButtonProps {
  btnText: React.ReactNode;
  btnFun?: (arg: any) => void;
  btnType?: "active" | "inactive";
  btnHType?: "button" | "submit" | "reset" | undefined;
}
const ActionButton = ({
  btnText,
  btnFun,
  btnType = "inactive",
  btnHType,
}: ActionButtonProps) => {
  let clsName = "inactiveActionBtn";
  if (btnType == "active") {
    clsName = "activeActionBtn";
  }
  return (
    <button className={clsName} type={btnHType} onClick={btnFun}>
      {btnText}
    </button>
  );
};
export default ActionButton;
