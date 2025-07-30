import { useState } from "react";

export const HandlePopUp = () => {
  const [popType, setPopupType] = useState("pInfo");
  const [popupMsg, setPopupMsg] = useState("");
  const [pShowHide, setPShowHide] = useState(false);
  const Notify = (pMsg: string, pClsType: string = "pInfo") => {
    setPopupMsg(pMsg);
    setPopupType(pClsType);
    setPShowHide(true);
    setTimeout(() => {
      setPShowHide(false);
    }, 3000);
  };
  return {
    popType,
    setPopupType,
    popupMsg,
    setPopupMsg,
    pShowHide,
    setPShowHide,
    Notify,
  };
};
