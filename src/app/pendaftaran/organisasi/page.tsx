'use client';

import { useState } from "react";
import HeaderUserOrganisasi from "@/component/global/header-organisasi";
import Router from "next/navigation";

export default function PendaftaranOrganisasi() {
    // States for general organization/contact info
    const [nama, setNama] = useState('');
    const [jenisKelamin, setJenisKelamin] = useState('');
    const [alamat, setAlamat] = useState('');
    // Renamed jenisProfesi to indukOrganisasi for clarity based on UI label
    const [indukOrganisasi, setIndukOrganisasi] = useState('');
    const [tempat_lahir, setTempatLahir] = useState('');
    const [tanggal_lahir, setTanggalLahir] = useState('');
    const [jumlahAnggota, setJumlahAnggota] = useState<number | undefined>();

    // New states for file uploads
    const [fotoKtp, setFotoKtp] = useState<File | null>(null); // State for KTP photo
    const [foto3x4, setFoto3x4] = useState<File | null>(null); // State for 3x4 photo

    const router = Router.useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // **IMPORTANT: This is where you would send data to your backend.**
        // For file uploads, you typically use FormData.
        // Example (uncomment and adapt for your API):
        /*
        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('jenisKelamin', jenisKelamin);
        formData.append('alamat', alamat);
        formData.append('indukOrganisasi', indukOrganisasi); // Use the correct state name
        formData.append('tempat_lahir', tempat_lahir);
        formData.append('tanggal_lahir', tanggal_lahir);
        if (jumlahAnggota !== undefined) {
            formData.append('jumlahAnggota', jumlahAnggota.toString());
        }
        if (fotoKtp) {
            formData.append('fotoKtp', fotoKtp);
        }
        if (foto3x4) {
            formData.append('foto3x4', foto3x4);
        }

        try {
            // Replace '/api/register-organization' with your actual backend endpoint
            const response = await fetch('/api/register-organization', {
                method: 'POST',
                body: formData,
                // Do NOT set Content-Type header when sending FormData;
                // the browser sets it automatically with the correct boundary.
            });

            if (!response.ok) {
                // Handle non-2xx responses from the server
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register organization');
            }

            const result = await response.json();
            console.log('Registration successful:', result);
            alert('Data berhasil dikirim!');
            router.push('/verifikasi_daftar'); // Navigate after successful submission
        } catch (error) {
            console.error('Error during registration:', error);
            alert(`Terjadi kesalahan saat mengirim data: ${error.message}`);
        }
        */

        // For now, just logging the data
        console.log({
            nama,
            jenisKelamin,
            alamat,
            indukOrganisasi, // Log the renamed state
            tempat_lahir,
            tanggal_lahir,
            jumlahAnggota,
            fotoKtp, // Will show File object
            foto3x4 // Will show File object
        });
        alert('Data berhasil dikirim!');
        // Uncomment the line below to navigate after successful console log (for testing frontend flow)
        // router.push('/verifikasi_daftar');
    };

    return (
        <>
            <HeaderUserOrganisasi />
            <main className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
                <h1 className="text-2xl font-bold mb-6 text-center">Pendaftaran KTA Organisasi</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama Organisasi / Perwakilan */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Organisasi / Perwakilan</label>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Tempat, Tanggal Lahir (for representative) */}
                    <div>
                        <label className="block mb-1 font-medium">Tempat, Tanggal Lahir Perwakilan</label>
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

                    {/* Jenis Kelamin (for representative) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Jenis Kelamin Perwakilan</label>
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

                    {/* Alamat Organisasi */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Alamat Organisasi</label>
                        <textarea
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>

                    {/* Induk Organisasi */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Induk Organisasi</label>
                        <input
                            type="text"
                            value={indukOrganisasi} // Use the renamed state here
                            onChange={(e) => setIndukOrganisasi(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Jumlah Anggota */}
                    <div>
                        <label htmlFor="jumlahAnggota" className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah Anggota
                        </label>
                        <input
                            type="number"
                            id="jumlahAnggota"
                            name="jumlahAnggota"
                            value={jumlahAnggota || ''} // Handle undefined for controlled input
                            onChange={(e) => setJumlahAnggota(Number(e.target.value))}
                            min="1"
                            required
                            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: 10"
                        />
                    </div>

                    {/* Foto KTP Perwakilan */}
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
                            <p className="text-xs text-gray-500 mt-1">File terpilih: {fotoKtp.name}</p>
                        )}
                    </div>

                    {/* Foto 3x4 Perwakilan */}
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
                            <p className="text-xs text-gray-500 mt-1">File terpilih: {foto3x4.name}</p>
                        )}
                    </div>

                    <button
                        type="button" 
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Daftar
                    </button>
                </form>
            </main>
        </>
    );
}