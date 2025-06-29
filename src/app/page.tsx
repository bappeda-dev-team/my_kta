// app/page.tsx (jika Anda menggunakan 'use client' di halaman utama)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
      router.push('/login');
  }, [router]);

  return (
    <div>
      <h1>Selamat Datang di Halaman Utama!</h1>
      {/* Konten halaman utama */}
    </div>
  );
}