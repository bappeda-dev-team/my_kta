'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Pendaftaran from "@/app/pendaftaran/page";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const Router= useRouter();


  const handleSubmit = () => {
    // Di sini Anda bisa tambahkan logika autentikasi
    
    Router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-sm text-blue-600"
              >
                {showPassword ? "Sembunyikan" : "Perlihatkan"}
              </button>

              
            </div>
          </div>

        <button
          type="button"
          onClick={() => Router.push("/pendaftaran/seniman")}
          className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition">
          Login
        </button>
        
        <p className="text-sm text-center text-gray-600">
          Apakah belum memiliki Akun?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Registrasi Sekarang
          </a>
        </p>

      </form>
    </div>
  );
}

