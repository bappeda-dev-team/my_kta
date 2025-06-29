'use client';

import { useState } from "react";
import HeaderUserOrganisasi from "@/component/global/header-organisasi";
import Router from "next/navigation";

export default function PendaftaranOrganisasi() {
  const [nama, setNama] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [alamat, setAlamat] = useState('');
  const [jenisProfesi, setJenisProfesi] = useState('');
  const [tempat_lahir, setTempatLahir] = useState('');
  const [tanggal_lahir, setTanggalLahir] = useState('');
  const [jumlahAnggota, setJumlahAnggota] = useState<number | undefined>();

  const router = Router.useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kirim data ke backend (belum ditambahkan)
    console.log({ nama, jenisKelamin, alamat, jenisProfesi });
    alert('Data berhasil dikirim!');
  };
  return (
    <>
      <HeaderUserOrganisasi />
      <main className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Pendaftaran KTA Organisasi</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
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
                className="w-1/2 border px-3 py-2 rounded-md"
              // required
              />
              <input
                type="date"
                value={tanggal_lahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="w-1/2 border px-3 py-2 rounded-md"
              // required
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
            // required
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
            // required
            ></textarea>
          </div>

          {/* Induk Organisasi */}
          <div>
            <label className="block text-sm font-medium mb-1">Induk Organisasi</label>
            <input
              type="text"
              value={jenisProfesi}
              onChange={(e) => setJenisProfesi(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
            />
          </div>

          {/* Induk Organisasi */}
          <div>
            <label htmlFor="jumlahAnggota" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Anggota
            </label>
            <input
              type="number"
              id="jumlahAnggota"
              name="jumlahAnggota"
              value={jumlahAnggota}
              onChange={(e) => setJumlahAnggota(Number(e.target.value))}
              min="1"
              required
              className="w-full border px-4 py-2 rounded"
              placeholder="Contoh: 10"
            />
          </div>

          <button
            type="button"
            onClick={() => router.push('/verifikasi_daftar')}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            Daftar
          </button>
        </form>
      </main>
    </>
  );
}
