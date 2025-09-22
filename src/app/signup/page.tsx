'use client'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

interface FormValue {
  nama: string;
  password: string;
  nomor: string;
  role: { value: string; label: string } | null;
}


const SignUpPage=()=> {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<FormValue>();

  const DynamicSelect = dynamic(() => import('react-select'), {
    ssr: false,
  });

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    const formData = {
      nama: data.nama,
      password: data.password,
      nomor: data.nomor,
      role: data.role?.value || '',
    };
    console.log('Form Data:', formData);

  }

  const options = [
    { value: 'Pelaku_seni', label: 'Pelaku Seni' },
    { value: 'Organisasi', label: 'Organisasi' },
  ];



  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Registrasi</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="">
            <Controller
              name="nama"
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    {...field}
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nama Lengkap Anda" />
                </div>
              )}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input {...register('password', { required: true })}
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
            <input {...register('nomor', { required: true })}
              type="number"
              id="nomor"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan Nomor Anda"
            />
          </div>

          <div>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (

                <DynamicSelect
                  {...field}
                  options={options}
                  className="w-full"
                  placeholder="Pilih Peran Anda"
                  isClearable
                />
              )}
            />
          </div>  

          <button
            type="submit"
            // onClick={() => router.push('/verifikasi_akun')}
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
export default SignUpPage;