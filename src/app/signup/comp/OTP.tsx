'use client'
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { MailCheck } from 'lucide-react';
import Image from 'next/image';

interface DataRegis {
  nama: string;
  username: string;
  email: string;
  password: string;
  nomor_telepon: string;
  tipe_akun: string;
}

interface OTP {
  dataRegis: DataRegis | null;
  response: any;
}

interface FormValue {
  nama: string;
  username: string;
  email: string;
  password: string;
  nomor_telepon: number;
  otp_code: string;
  tipe_akun: string;
  captcha_token: string;
  captcha_code: string;
}

const OTP: React.FC<OTP> = ({ dataRegis, response }) => {
  // useState diberi tipe string array
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [Capca, setCapca] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const USERNAME_API = process.env.NEXT_PUBLIC_API_USERNAME || "-";
  const PASS_API = process.env.NEXT_PUBLIC_API_PASSWORD || "-";

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  const credentials = btoa(`${USERNAME_API}:${PASS_API}`);

  // Tambahkan header Authorization ke objek headers Anda
  const headersWithAuth = {
    ...headers, // Pastikan Anda menyertakan headers lain yang mungkin sudah ada
    'Authorization': `Basic ${credentials}`
  };
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  useEffect(() => {
    console.log(response);
  }, [response])

  // Handler perubahan input dengan tipe yang spesifik dari React
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;

    // Pastikan hanya satu digit angka yang dimasukkan
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Ambil hanya digit terakhir
    setOtp(newOtp);

    // Otomatis pindah ke input berikutnya
    if (value !== '' && index < 6 - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  // Handler penekanan tombol (untuk backspace) dengan tipe yang spesifik dari React
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Jika tombol backspace ditekan pada input kosong, pindah ke input sebelumnya
    if (e.key === "Backspace" && index > 0 && otp[index] === '') {
      e.preventDefault(); // Mencegah default backspace action
      const newOtp = [...otp];
      newOtp[index - 1] = ''; // Kosongkan input sebelumnya
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };
  // Handler verifikasi dengan tipe yang spesifik dari React
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = {
      nama: dataRegis?.nama,
      username: dataRegis?.username,
      email: dataRegis?.email,
      nomor_telepon: dataRegis?.nomor_telepon,
      password: dataRegis?.password,
      tipe_akun: dataRegis?.tipe_akun,
      otp_code: finalOtp,
      captcha_token: response?.key,
      captcha_code: ""
    };

    if (finalOtp.length !== 6) {
      setMessage('Kode OTP harus 6 digit.');
      return;
    } else {
      console.log(formData);
      try {
        const response = await fetch(`${API_URL}/auth/verify-otp-and-signup`, {
          method: "POST",
          headers: headersWithAuth,
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (result.statusCode === 200) {
          alert("Berhasil menambahkan data");
          setMessage('verifikasi berhasil');
        } else if (result.statusCode === 400) {
          alert(result.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleResend = () => {
    setMessage('Mengirim ulang kode OTP...');
    console.log('Mengirim ulang kode OTP...');
    // Logika pengiriman ulang kode OTP
    setTimeout(() => {
      setMessage('Kode OTP baru telah dikirim.');
    }, 1000);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl text-center">
        <MailCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi Akun Anda</h1>

        <p className="text-gray-600 mb-6 text-sm">
          Kami telah mengirimkan kode 6 digit ke email atau nomor WhatsApp Anda.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                // Menggunakan input mode 'numeric' untuk memicu keyboard numerik pada perangkat seluler
                inputMode="numeric"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                // Menetapkan ref ke inputRefs
                ref={(el: HTMLInputElement | null) => {
                  if (el) {
                    inputRefs.current[index] = el;
                  }
                }}
                className="w-10 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
              />
            ))}
          </div>

          {message && (
            <p className={`text-sm ${message.includes('Berhasil') ? 'text-green-600' : message.includes('Mengirim') ? 'text-blue-600' : 'text-red-500'} font-medium`}>
              {message}
            </p>
          )}

          <div className='flex items-center justify-center w-full my-4 gap-4'>
            <Image src={response?.captcha.img} width={180} height={70} alt="Captcha" />
            <input
              id='captcha_code'
              type="text"
              value={Capca}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            // disabled={isSubmitting || otp.join('').length !== 6}
            className={`w-full py-3 px-4 text-white font-bold rounded-lg transition duration-300 ease-in-out ${isSubmitting || otp.join('').length !== 6
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
          >
            {isSubmitting ? 'Memverifikasi...' : 'Verifikasi'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Tidak menerima kode?{" "}
          <button
            onClick={handleResend}
            disabled={isSubmitting}
            className={`font-medium transition ${isSubmitting ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'
              }`}
          >
            Kirim Ulang
          </button>
        </div>
      </div>
    </main>
  );
}

export default OTP;
