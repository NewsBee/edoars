"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from 'next/image';
import { toast } from 'react-toastify';

const FormLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res && res.error) {
      toast.error(res.error, {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex items-center rounded-lg p-4 mb-4 bg-white bg-opacity-20">
        <svg className="w-6 h-6 text-black mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-transparent w-full outline-none text-lg text-white"
          placeholder="Username"
        />
      </div>
      <div className="flex items-center rounded-lg p-4 mb-4 bg-white bg-opacity-20">
        <Image src="/images/icon/icon-password.png" alt="Password Icon" width={24} height={24} className="mr-2" />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-transparent w-full outline-none text-lg text-white"
          placeholder="Password"
        />
      </div>
      <div className="flex items-center mb-4">
        <input type="checkbox" id="rememberMe" className="mr-2" />
        <label htmlFor="rememberMe" className="text-white">Remember me</label>
      </div>
      <button type="submit" className="w-full py-3 rounded-lg text-lg text-white transition duration-300" style={{ background: 'linear-gradient(90deg, #605DFF 0%, #5DA8FF 100%)' }}>Log In</button>
    </form>
  );
};

export default FormLogin;
