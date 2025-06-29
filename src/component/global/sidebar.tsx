'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
    const [rekapOpen, setRekapOpen] = useState<boolean>(false);
    const [VerifikasiOpen, setVerifikasiOpen] = useState<boolean>(false);
    const router = useRouter()

    const handleLogout = () => {
        // Simulasikan proses logout
        // Misalnya hapus token dari localStorage atau cookies
        localStorage.removeItem('token') // jika pakai token
        router.push('/login') // arahkan ke halaman login
    }

    return (
        <div className="w-64 h-screen bg-white border-r p-4 shadow-sm font-inter">
            <h2 className="text-xl font-bold text-purple-600 mb-6">Halaman Admin</h2>
            <div>
                <button
                    onClick={() => setVerifikasiOpen(!VerifikasiOpen)}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-purple-500 w-full justify-between">
                    <span>Verifikasi</span>
                    {VerifikasiOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {VerifikasiOpen && (
                    <div className="ml-4 space-y-2">
                        <Link href="/admin/verifikasi/registrasi" className="flex items-center space-x-2 rounded hover:bg-purple-500">
                            Data Registrasi
                        </Link>
                        <Link href="/admin/verifikasi/pengajuan_kta" className="flex items-center space-x-2 rounded hover:bg-purple-500">
                            Pengajuan KTA
                        </Link>
                        <Link href="/admin/verifikasi/pengajuan" className="flex items-center space-x-2 rounded hover:bg-purple-500">
                            Pengajuan Izin Rekomendasi
                        </Link>
                    </div>
                )}
            </div>

            <div>
                <button
                    onClick={() => setRekapOpen(!rekapOpen)}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-purple-500 w-full justify-between"
                >
                    <span>Rekap Data</span>
                    {rekapOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {rekapOpen && (
                    <div className="ml-4 space-y-2">
                        <Link href="/admin/rekap_data/registrasi" className="flex items-center space-x-2 rounded hover:bg-purple-500">
                            Data Registrasi
                        </Link>
                        <Link href="/admin/rekap_data/registrasi" className="flex items-center space-x-2 rounded hover:bg-purple-500">
                            Pengajuan KTA
                        </Link>
                        <Link href="/admin/rekap_data/pengajuan_izin" className="flex items-center space-x-2 rounded hover:bg-purple-500">
                            Pengajuan Izin Rekomendasi
                        </Link>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 mt-6"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    )
}
