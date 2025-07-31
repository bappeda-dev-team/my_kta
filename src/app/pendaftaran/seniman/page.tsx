'use client';

import { useState } from 'react';
import HeaderUser from '@/component/global/header-seni';
import Router from 'next/navigation';


export default function PendaftaranSeniman() {
    const [nama, setNama] = useState('');
    const [jenisKelamin, setJenisKelamin] = useState('');
    const [alamat, setAlamat] = useState('');
    const [jenisProfesi, setJenisProfesi] = useState('');
    const [tempat_lahir, setTempatLahir] = useState('');
    const [tanggal_lahir, setTanggalLahir] = useState('');
    const [fotoKtp, setFotoKtp] = useState<File | null>(null); // New state for KTP photo
    const [foto3x4, setFoto3x4] = useState<File | null>(null); // New state for 3x4 photo

    const router = Router.useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically create a FormData object to send to your backend
        // const formData = new FormData();
        // formData.append('nama', nama);
        // formData.append('jenisKelamin', jenisKelamin);
        // formData.append('alamat', alamat);
        // formData.append('jenisProfesi', jenisProfesi);
        // formData.append('tempat_lahir', tempat_lahir);
        // formData.append('tanggal_lahir', tanggal_lahir);
        // if (fotoKtp) formData.append('fotoKtp', fotoKtp);
        // if (foto3x4) formData.append('foto3x4', foto3x4);

        // Kirim data ke backend (belum ditambahkan)
        console.log({ nama, jenisKelamin, alamat, jenisProfesi, tempat_lahir, tanggal_lahir, fotoKtp, foto3x4 });
        alert('Data berhasil dikirim!');
        // In a real application, after successful submission, you would navigate:
        // router.push('/verifikasi_daftar');
    };

    return (
        <>
            <HeaderUser />
            <main className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
                <h1 className="text-2xl font-bold mb-6 text-center">Pendaftaran KTA Pelaku Seni</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama</label>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Tempat, Tanggal Lahir</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Tempat Lahir"
                                value={tempat_lahir}
                                onChange={(e) => setTempatLahir(e.target.value)}
                                className="w-1/2 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="date"
                                value={tanggal_lahir}
                                onChange={(e) => setTanggalLahir(e.target.value)}
                                className="w-1/2 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Jenis Kelamin */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                        <select
                            value={jenisKelamin}
                            onChange={(e) => setJenisKelamin(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Pilih --</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>

                    {/* Alamat */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Alamat</label>
                        <textarea
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>

                    {/* Jenis Profesi */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Jenis Profesi</label>
                        <input
                            type="text"
                            value={jenisProfesi}
                            onChange={(e) => setJenisProfesi(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Foto KTP */}
                    <div>
                        <label htmlFor="fotoKtp" className="block text-sm font-medium mb-1">Upload Foto KTP</label>
                        <input
                            type="file"
                            id="fotoKtp"
                            accept="image/*" // Restrict to image files
                            onChange={(e) => setFotoKtp(e.target.files ? e.target.files[0] : null)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {fotoKtp && (
                            <p className="text-xs text-gray-500 mt-1">File selected: {fotoKtp.name}</p>
                        )}
                    </div>

                    {/* Foto 3x4 */}
                    <div>
                        <label htmlFor="foto3x4" className="block text-sm font-medium mb-1">Upload Foto 3x4</label>
                        <input
                            type="file"
                            id="foto3x4"
                            accept="image/*" // Restrict to image files
                            onChange={(e) => setFoto3x4(e.target.files ? e.target.files[0] : null)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {foto3x4 && (
                            <p className="text-xs text-gray-500 mt-1">File selected: {foto3x4.name}</p>
                        )}
                    </div>

                    <button
                        type="button"
                       onClick={() => router.push('/verifikasi_daftar')}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Daftar
                    </button>
                </form>
            </main>
        </>
    );
}