'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MenungguVerifikasiPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulasi redirect otomatis setelah beberapa detik (opsional)
    // setTimeout(() => router.push('/login'), 10000);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Terima Kasih Telah Mendaftar!</h1>
        <p className="text-gray-600 mb-6">
          Akun Anda sedang dalam proses verifikasi oleh admin. Harap tunggu maksimal 1x24 jam.
          Anda akan mendapatkan notifikasi setelah akun Anda aktif.
        </p>

        <button
          onClick={() => router.push('/login')}
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-700 transition"
        >
          Kembali ke Halaman Login
        </button>
      </div>
    </main>
  );
}
