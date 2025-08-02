import { useState } from "react";

interface ActionButtonProps {
  btnText: React.ReactNode;
  btnFun?: (arg: any) => void;
  btnType?: "active" | "inactive";
  btnHType?: "button" | "submit" | "reset" | undefined;
  tooltip?: string | "";
}
const ActionButton = ({
  btnText,
  btnFun,
  btnType = "inactive",
  btnHType,
  tooltip,
}: ActionButtonProps) => {
  let clsName = "inactiveActionBtn";
  if (btnType == "active") {
    clsName = "activeActionBtn";
  }
  const [tooltipp, setToolTip] = useState<string | undefined>("");
  return (
    <button
      className={clsName}
      type={btnHType}
      onClick={btnFun}
      title={tooltipp ? tooltipp : ""}
      onMouseOver={() => {
        setToolTip(tooltip);
      }}
    >
      {btnText}
    </button>
  );
};
export default ActionButton;
