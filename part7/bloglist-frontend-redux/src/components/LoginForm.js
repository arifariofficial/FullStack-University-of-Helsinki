import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { handleLogin } from "../reducers/loginReducer";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const login = async (event) => {
    event.preventDefault();
    dispatch(
      handleLogin({
        username,
        password,
      })
    );

    setUserName("");
    setPassword("");
    navigate("/");
  };

  return (
    <div>
      <form onSubmit={login}>
        <div>
          username
          <input
            id="username"
            type="text"
            name="Username"
            value={username}
            onChange={({ target }) => setUserName(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
