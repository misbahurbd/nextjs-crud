"use client";

import axios from "axios";

const LoginPage = () => {
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        const username = e.target.username;
        const password = e.target.password;
        const res = await axios.post(
          "/api/v1/auth/login",
          {
            username: 'alEx-abf1',
            password: 'Hello@1324',
          },
          {
            withCredentials: true,
          }
        );
        console.log({ res });
      }}
    >
      <input name="username" placeholder="username" />
      <input name="password" placeholder="password" />
      <button>Login</button>
    </form>
  );
};
export default LoginPage;
