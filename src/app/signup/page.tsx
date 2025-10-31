'use client'
import React, {useState} from 'react';
import { SubmitHandler, useForm, UseFormRegisterReturn } from 'react-hook-form';
import { User, Mail, Lock, Phone, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import OTP from './comp/OTP';

interface FormValue {
  nama: string;
  username: string;
  email: string;
  password: string;
  nomor_telepon: string;
  tipe_akun: string;
}

// Komponen input kustom dengan ikon
const InputField = React.forwardRef<
  HTMLInputElement,
  { icon: React.ReactNode; label: string; placeholder: string; type: string } & UseFormRegisterReturn
>(({ icon, label, placeholder, type, ...rest }, ref) => (
  <div>
    <label htmlFor={rest.name} className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-lg shadow-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </div>
      <input
        {...rest}
        ref={ref}
        type={type}
        id={rest.name}
        required
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      />
    </div>
  </div>
));

InputField.displayName = 'InputField';


const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [IsSignUp, setIsSignUp] = useState<boolean>(false);

  const [DataForm, setDataForm] = useState<any>(null);

  const [Nama, setNama] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Pass, setPass] = useState<string>("");
  const [NoTelp, setNoTelp] = useState<string>("");
  const [TipeAkin, setTipeAkin] = useState<string>("");

  const USERNAME_API = process.env.NEXT_PUBLIC_API_USERNAME || "-";
  const PASS_API = process.env.NEXT_PUBLIC_API_PASSWORD || "-";
  const router = useRouter();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  const credentials = btoa(`${USERNAME_API}:${PASS_API}`);

  // Tambahkan header Authorization ke objek headers Anda
  const headersWithAuth = {
    ...headers, // Pastikan Anda menyertakan headers lain yang mungkin sudah ada
    'Authorization': `Basic ${credentials}`
  };

  // 2. Inisialisasi useForm dengan field baru
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValue>({
    defaultValues: {
      nama: '',
      username: '',
      email: '',
      password: '',
      nomor_telepon: '62',
      tipe_akun: '',
    }
  });

  // 3. Perbarui onSubmit untuk menangani semua field
  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = {
      nama: data.nama,
      username: data.username,
      email: data.email,
      password: data.password,
      nomor_telepon: data.nomor_telepon,
      tipe_akun: data.tipe_akun,
    };

    // Simulasikan pendaftaran
    // console.log('Form Data Pendaftaran:', formData);
    setDataForm(data);
    console.log(data);
    setIsSignUp(true);
    // try {
    //   const response = await fetch(`${API_URL}/auth/send-otp`, {
    //     method: "POST",
    //     headers: headersWithAuth,
    //     body: JSON.stringify(formData),
    //   });
    //   const result = await response.json();
    //   if (result.statusCode === 200) {
    //     alert("Berhasil menambahkan data");
    //     // console.log(result);
    //     // router.push("/verifikasiOTP");
    //   } else if(result.statusCode === 400) {
    //     alert(result.data);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  }

  if(IsSignUp){
    return(
      <OTP dataRegis={DataForm}/>
    )
  } else {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl transition duration-500 hover:shadow-3xl">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8 border-b pb-4">
            Buat Akun Baru
          </h1>
  
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 1. Nama Lengkap */}
            <InputField
              {...register('nama', { required: true })}
              icon={<User className="h-5 w-5 text-gray-400" />}
              label="Nama Lengkap"
              placeholder="Masukkan Nama Lengkap Anda"
              type="text"
              name="nama"
            />
  
            {/* 2. Username */}
            <InputField
              {...register('username', { required: true })}
              icon={<User className="h-5 w-5 text-gray-400" />}
              label="Username"
              placeholder="Pilih Username Anda"
              type="text"
              name="username"
            />
  
            {/* 3. Email */}
            <InputField
              {...register('email', {
                required: true,
                pattern: /^\S+@\S+\.\S+$/
              })}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              label="Email"
              placeholder="Masukkan Alamat Email Anda"
              type="email"
              name="email"
            />
            {errors.email && errors.email.type === 'pattern' && (
              <p className="text-red-500 text-xs mt-1">Format email tidak valid.</p>
            )}
  
            {/* 4. Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', { required: true, minLength: 8 })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  placeholder="Minimal 8 Karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                >
                  {showPassword ? "Sembunyikan" : "Perlihatkan"}
                </button>
              </div>
              {errors.password && errors.password.type === 'minLength' && (
                <p className="text-red-500 text-xs mt-1">Password minimal harus 8 karakter.</p>
              )}
            </div>
  
            {/* 5. Nomor Telepon / WhatsApp */}
            <InputField
              {...register('nomor_telepon', {
                required: true,
                // minLength: 10,
                // maxLength: 15
              })}
              icon={<Phone className="h-5 w-5 text-gray-400" />}
              label="Nomor Telepon / WhatsApp"
              placeholder="Cth: 08123456789"
              type="tel"
              name="nomor_telepon"
            />
            {errors.nomor_telepon && errors.nomor_telepon.type === 'minLength' && (
              <p className="text-red-500 text-xs mt-1">Nomor telepon terlalu pendek.</p>
            )}
            {errors.nomor_telepon && errors.nomor_telepon.type === 'maxLength' && (
              <p className="text-red-500 text-xs mt-1">Nomor telepon terlalu panjang.</p>
            )}
  
            {/* 6. Tipe Akun (Organisasi */}
            <div>
              <label htmlFor="tipe_akun" className="block text-sm font-semibold text-gray-700 mb-1">
                Tipe Akun
              </label>
              <div className="relative">
                <select
                  {...register('tipe_akun', { required: true })}
                  id="tipe_akun"
                  className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  <option value="" disabled>Pilih Tipe Akun</option>
                  <option value="Organisasi">Organisasi</option>
                  <option value="Pelaku Seni">Pelaku Seni</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
  
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-[1.01] shadow-md hover:shadow-lg"
            >
              Kirim Kode OTP
            </button>
          </form>
  
          <p className="text-sm text-center text-gray-600 mt-6">
            Sudah memiliki Akun?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition">
              Masuk Sekarang
            </a>
          </p>
        </div>
      </main>
    );
  }
}

export default SignUpPage;
