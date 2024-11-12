"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from 'next/image';
import { toast } from 'react-toastify';

const FormLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Tambahkan state untuk remember me
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      // Kirimkan rememberMe sebagai bagian dari request
      rememberMe: rememberMe,
    });

    setIsLoading(false);

    if (res && res.error) {
      if (res.status === 401) {
        toast.error("Email or password is incorrect", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
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
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-transparent w-full outline-none text-lg text-white"
          placeholder="Email"
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
        <input
          type="checkbox"
          id="rememberMe"
          className="mr-2"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)} // Set rememberMe state berdasarkan checkbox
        />
        <label htmlFor="rememberMe" className="text-white">Remember me</label>
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-lg text-lg text-white transition duration-300"
        style={{ background: 'linear-gradient(90deg, #605DFF 0%, #5DA8FF 100%)' }}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <span></span>
          </div>
        ) : (
          'Log In'
        )}
      </button>
    </form>
  );
};

export default FormLogin;
