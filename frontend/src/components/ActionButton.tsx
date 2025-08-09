import { useState } from "react";

interface ActionButtonProps {
  btnText: React.ReactNode;
  btnFun?: (arg: any) => void;
  btnType?: "active" | "inactive";
  btnHType?: "button" | "submit" | "reset" | undefined;
  tooltip?: string | "";
  id?: string | "";
}
const ActionButton = ({
  btnText,
  btnFun,
  btnType = "inactive",
  btnHType,
  tooltip,
  id,
}: ActionButtonProps) => {
  let clsName = "inactiveActionBtn";
  if (btnType == "active") {
    clsName = "activeActionBtn";
  }
  const [tooltipp, setToolTip] = useState<string | undefined>("");
  return (
    <>
      <button
        id={id}
        className={clsName}
        type={btnHType ? btnHType : "button"}
        onClick={btnFun}
        // title={tooltipp ? tooltipp : ""}
        onMouseOver={() => {
          setToolTip(tooltip);
        }}
      >
        {btnText}
        <div className="tooltip">{tooltipp ? tooltipp : ""}</div>
      </button>
    </>
  );
};
export default ActionButton;
