import {
  faCircleCheck,
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface popupProps {
  popupType?: "pSuccess" | "pError" | "pInfo" | "pWarn" | string;
  msg: string;
  visible: false | boolean;
}

const popup = ({ popupType = "pInfo", msg, visible }: popupProps) => {
  let clsName = `popUpContainer ${popupType}`;
  return (
    visible && (
      <div className={clsName}>
        <div className="popUpIcon">
          {popupType == "pSuccess" && <FontAwesomeIcon icon={faCircleCheck} />}
          {popupType == "pError" && <FontAwesomeIcon icon={faXmark} />}
          {popupType == "pInfo" && <FontAwesomeIcon icon={faCircleInfo} />}
          {popupType == "pWarn" && (
            <FontAwesomeIcon icon={faTriangleExclamation} />
          )}
        </div>
        <div className="popUpMsg">{msg}</div>
        <span className="popUpIndicator"></span>
      </div>
    )
  );
};

export default popup;
