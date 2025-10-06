import Icon from "@mdi/react";
import ActionButton from "../components/ActionButton";
import InputField from "../components/InputField";
import { mdiEyeOffOutline, mdiEyeOutline, mdiSecurity } from "@mdi/js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HandlePopUp } from "../EventsHandler/HandlePopUp";
import Popup from "../Utilities/Popup";

const Login = () => {
  const {
    popType,
    setPopupType,
    popupMsg,
    setPopupMsg,
    pShowHide,
    setPShowHide,
    Notify,
  } = HandlePopUp();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/isloggedin/`, {
        withCredentials: true,
      })
      .then(() => {
        navigate("/admin");
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (username.trim() === "") {
        Notify("Username cannot be empty", "pWarn");
        return;
      }
      if (password.trim() === "") {
        Notify("Password cannot be empty", "pWarn");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login/`,
        { username, password },
        { withCredentials: true }
      );
      if (response.status == 200) {
        if (import.meta.env.VITE_LOGGING) {
          console.log(response.data);
        }
        navigate("/admin");
      } else if (response.status == 401) {
        Notify("Invalid Credentials", "pError");
        if (import.meta.env.VITE_LOGGING) {
          console.log("Invalid Credentials");
        }
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          Notify("Invalid credentials", "pError");
        } else if (status === 403) {
          Notify("You are not authorized", "pError");
        } else if (status === 500) {
          Notify("Server error, please try again later", "pError");
        } else {
          Notify(`Error: ${status}`, "pError");
        }
        if (import.meta.env.VITE_LOGGING) {
          console.log("Server response error:", error.response.data);
        }
      } else if (error.request) {
        Notify("No response from server. Check your network", "pWarn");
        if (import.meta.env.VITE_LOGGING) {
          console.log("No response:", error.request);
        }
      } else {
        Notify("Something went wrong :(", "pError");
        if (import.meta.env.VITE_LOGGING) {
          console.log("Error:", error.message);
        }
      }
    }
  };

  return (
    <>
      <Popup msg={popupMsg} popupType={popType} visible={pShowHide} />
      <div className="loginContainer">
        <form method="post" className="loignForm" onSubmit={handleLogin}>
          <h1>Admin Login</h1>
          <Icon path={mdiSecurity} size={3} color="#2962ff" />
          <InputField
            type="text"
            fieldName="Username"
            name="username"
            inputFunc={(e) => setUsername(e.target.value)}
            value={username}
          />
          <div
            className={
              isFocused
                ? "passwordContainer passwordContainerButtonFocused"
                : "passwordContainer"
            }
          >
            <InputField
              type={showPassword ? "text" : "password"}
              fieldName="Password"
              name="password"
              inputFunc={(e) => setPassword(e.target.value)}
              value={password}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
            />
            <ActionButton
              btnText={
                <Icon
                  path={showPassword ? mdiEyeOutline : mdiEyeOffOutline}
                  size={1}
                />
              }
              btnHType="button"
              btnType="inactive"
              btnFun={() => {
                setShowPassword(!showPassword);
              }}
            />
          </div>
          <ActionButton btnText="Login" btnHType="submit" btnType="active" />
        </form>
      </div>
    </>
  );
};

export default Login;
