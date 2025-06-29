'use client'

import { useRouter } from 'next/navigation'
import HeaderRegistrasiKTA from './header'

export default function PengajuanPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <HeaderRegistrasiKTA />
      <h1 className="text-3xl font-bold mb-6">Verifikasi Data Registrasi</h1>

      <div className="flex gap-6">
        <button
          onClick={() => router.push('/pengajuan/pelaku-seni')}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Pelaku Seni
        </button>
        
        <button
          onClick={() => router.push('/pengajuan/organisasi')}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Organisasi
        </button>
      </div>
    </div>
  )
}
