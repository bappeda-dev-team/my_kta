'use client';

import { useState } from "react";
import HeaderUserOrganisasi from "@/component/global/header-organisasi";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type FormValue = {
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    induk_organisasi: string;
    jumlahAnggota?: number;
    fotoKtp?: File | null;
    foto3x4?: File | null;
    keterangan?: string;
};

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
    const [keterangan, setKeterangan] = useState('');

    // New states for file uploads
    const [fotoKtp, setFotoKtp] = useState<File | null>(null); // State for KTP photo
    const [foto3x4, setFoto3x4] = useState<File | null>(null); // State for 3x4 photo

    const { control, handleSubmit } = useForm<FormValue>();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            nama: data.nama,
            tempat_tanggal_lahir: `${data.tempat_lahir}, ${data.tanggal_lahir}`,
            jenis_kelamin: data.jenis_kelamin,
            alamat: data.alamat,
            induk_organisasi: data.induk_organisasi,
            jumlahAnggota: data.jumlahAnggota,
            fotoKtp: fotoKtp,
            foto3x4: foto3x4,
            keterangan: data.keterangan || '',
        };
        console.log('Form Data:', formData);
    }

    return (
        <>
            <HeaderUserOrganisasi />
            <main className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
                <h1 className="text-2xl font-bold mb-6 text-center">Pendaftaran KTA Organisasi</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nama Organisasi */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Organisasi</label>
                        <Controller
                            name="nama"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="nama"
                                    {...field}
                                    type="text"
                                    onChange={(e) => field.onChange(e)}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            )}
                        />
                    </div>

                    {/* Tempat dan Tanggal Lahir */}
                    <div>
                        <label className="block mb-1 font-medium">Tempat, Tanggal Lahir</label>
                        <div className="flex gap-4">
                            <Controller
                                name="tempat_lahir"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        id='tempat_lahir'
                                        {...field}
                                        type="text"
                                        placeholder="Tempat Lahir"
                                        onChange={(e) => field.onChange(e)}
                                        className="w-1/2 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                )}
                            />
                            <Controller
                                name="tanggal_lahir"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        id='tanggal_lahir'
                                        {...field}
                                        type="date"
                                        onChange={(e) => field.onChange(e)}
                                        className="w-1/2 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Jenis Kelamin */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                        <Controller
                            name="jenis_kelamin"
                            control={control}
                            render={({ field }) => (
                                <select
                                    id="jenis_kelamin"
                                    {...field}
                                    onChange={(e) => field.onChange(e)}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">-- Pilih --</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            )}
                        />
                    </div>

                    {/* Alamat Organisasi */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Alamat Organisasi</label>
                        <Controller
                            name="alamat"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    id="alamat"
                                    {...field}
                                    onChange={(e) => field.onChange(e)}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                ></textarea>
                            )}
                        />
                    </div>

                    {/* Induk Organisasi */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Induk Organisasi</label>
                        <Controller
                            name="induk_organisasi"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="induk_organisasi"
                                    {...field}
                                    type="text"
                                    onChange={(e) => field.onChange(e)}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            )}
                        />
                    </div>

                    {/* Jumlah Anggota */}
                    <div>
                        <label htmlFor="jumlahAnggota" className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah Anggota
                        </label>
                        <Controller
                            name="jumlahAnggota"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="jumlahAnggota"
                                    {...field}
                                    type="number"
                                    onChange={(e) => field.onChange(e)}
                                    min="1"
                                    required
                                    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: 10"
                                />
                            )}
                        />
                    </div>

                    {/* Foto KTP */}
                    <div>
                        <label htmlFor="fotoKtp" className="block text-sm font-medium mb-1">Upload Foto KTP</label>
                        <Controller
                            name="fotoKtp"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        type="file"
                                        id="fotoKtp"
                                        accept="image/*" // Restrict to image files
                                        onChange={(e) => setFotoKtp(e.target.files ? e.target.files[0] : null)}
                                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {fotoKtp && (
                                        <p className="text-xs text-gray-500 mt-1">File Terpilih: {fotoKtp.name}</p>
                                    )}
                                </>
                            )}

                        />
                    </div>

                    {/* Foto 3x4 */}
                    <div>
                        <label htmlFor="foto3x4" className="block text-sm font-medium mb-1">Upload Foto 3x4</label>
                        <Controller
                            name="foto3x4"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        type="file"
                                        id="foto3x4"
                                        accept="image/*"
                                        onChange={(e) => setFoto3x4(e.target.files ? e.target.files[0] : null)}
                                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {foto3x4 && (
                                        <p className="text-xs text-gray-500 mt-1">File Terpilih: {foto3x4.name}</p>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Keterangan (Optional)</label>
                        <Controller

                            name="keterangan"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    onChange={(e) => field.onChange(e)}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            )}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Daftar
                    </button>
                </form>
            </main>
        </>
    );
}