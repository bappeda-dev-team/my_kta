'use client'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Registrasi</h1>

        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan Nama Lengkap Anda"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan Email Anda"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
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

          <div>
            <label htmlFor="nomor" className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon / WhatsApp
            </label>
            <input
              type="number"
              id="nomor"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan Nomor Anda"
            />
          </div>

           <div>
        <label className="block mb-1 font-medium">Pilihan</label>
        <select
          className="w-full border px-3 py-2 rounded-md"
          required
        >
            <option value="">-- Pilih --</option>
            <option value="Pelaku_seni">Pelaku Seni</option>
            <option value="Organisasi">Organisasi</option>
        </select>
      </div>

          <button
            type="button"
            onClick={() => router.push('/verifikasi_akun')}
            className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-800 transition"
          >
            Buat Akun
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Apakah sudah memiliki Akun?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Masuk Sekarang
          </a>
        </p>
      </div>
    </main>
  );
}
