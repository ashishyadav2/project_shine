import Icon from "@mdi/react";
import ActionButton from "../components/ActionButton";
import InputField from "../components/InputField";
import { mdiSecurity, mdiShieldCrown } from "@mdi/js";
import axios from "axios";
const Login = () => {
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:8000/ashish/", {
      uname: "ashish",
      pass: "123d",
    });
    if (response.status == 200) {
      console.log(response.data);
    }
  };
  return (
    <div className="loginContainer">
      <form
        method="post"
        className="loignForm"
        onSubmit={(e) => {
          handleLogin(e);
        }}
      >
        <h1>Admin Login</h1>
        <Icon path={mdiSecurity} size={3} color="#2962ff" />
        <InputField type="text" fieldName="Username" name="uname" />
        <InputField type="password" fieldName="Password" name="pass" />
        <ActionButton btnText="Login" btnHType="submit" btnType="active" />
      </form>
    </div>
  );
};

export default Login;
