'use client';

import { useState } from "react";
import HeaderUserOrganisasi from "@/component/global/header-organisasi";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { parse } from "path";

// Tipe data disesuaikan untuk Step 1
type FormValue = {
    nomor_induk: string;
    nama: string; // Nama Organisasi
    tempat_lahir: string; // Tempat Lahir Ketua
    tanggal_lahir: string; // Tanggal Lahir Ketua
    jenis_kelamin: string; // Jenis Kelamin Ketua
    alamat: string; // Alamat Organisasi
    induk_organisasi: string;
    jumlah_anggota: string; // Diubah ke string untuk form input, lalu di-parse ke number saat submit
    keterangan?: string;
    // Data untuk Step 2 (tidak diisi di Step 1, tapi dibutuhkan untuk onSubmit penuh)
    profesi?: string;
    daerah?: string;
    berlaku_dari?: number;
    berlaku_sampai?: number;
    dibuat_di?: string;
    tertanda?: {
        nama: string,
        tanda_tangan: string,
        jabatan: string,
        nip: string,
        pangkat: string
    }
};

export default function PendaftaranOrganisasi() {
    const [step, setStep] = useState(1);
    const [fotoKtp, setFotoKtp] = useState<File | null>(null);
    const [foto3x4, setFoto3x4] = useState<File | null>(null);
    // Ubah status proses menjadi lebih spesifik
    const [proses, setProses] = useState<boolean>(false); 
    const [prosesSimpanStep1, setProsesSimpanStep1] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [draftId, setDraftId] = useState<string | null>(null); // State untuk menyimpan ID draft/pengajuan jika Step 1 berhasil disimpan

    const { control, handleSubmit, trigger, getValues, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nomor_induk: '',
            nama: '',
            tempat_lahir: '',
            tanggal_lahir: '',
            jenis_kelamin: '',
            alamat: '',
            induk_organisasi: '',
            jumlah_anggota: '', // Dipertahankan sebagai string untuk input type="number"
            keterangan: '',
            // Field optional lainnya...
        }
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const username = process.env.NEXT_PUBLIC_API_USERNAME;
    const password = process.env.NEXT_PUBLIC_API_PASSWORD;

    if (!username || !password) {
        console.error('API username or password not found in environment variables.');
        // Ini mungkin terlalu agresif, tapi pastikan variabel env terkonfigurasi.
        // Biasanya, check ini bisa dilakukan sekali di awal mount.
    }
    const encodedCredentials = username && password ? btoa(`${username}:${password}`) : '';


    // Fungsi baru: Menyimpan data Step 1 (Draft)
    const saveStepOne = async (data: FormValue) => {
        if (!encodedCredentials) {
            setErrorMessage("Kesalahan konfigurasi API. Tidak dapat menyimpan draft.");
            return false;
        }

        const formData = {
            nomor_induk: data.nomor_induk,
            nama: data.nama,
            tempat_tanggal_lahir: `${data.tempat_lahir}, ${data.tanggal_lahir}`,
            jenis_kelamin: data.jenis_kelamin,
            alamat: data.alamat,
            induk_organisasi: data.induk_organisasi,
            // Konversi ke number sebelum kirim
            jumlah_anggota: parseInt(data.jumlah_anggota || '0'), 
            keterangan: data.keterangan || '',
            status: 'draft', // Menandai ini sebagai draft
            // sertakan draftId jika sudah ada (untuk update draft)
            ...(draftId && { id: draftId }),
        };

        setProsesSimpanStep1(true);
        setErrorMessage(null);

        try {
            // Logika disesuaikan: POST untuk buat draft baru, PUT/PATCH untuk update draft
            const method = draftId ? 'PUT' : 'POST'; 
            const url = draftId ? `${apiUrl}/pengajuan/${draftId}` : `${apiUrl}/pengajuan/draft`;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${encodedCredentials}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`Gagal menyimpan draft: ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            // Asumsi: API mengembalikan ID pengajuan yang dibuat/diupdate
            setDraftId(result.id || draftId); 
            setErrorMessage(`Draft Langkah 1 Berhasil Disimpan! ${draftId ? '(Diperbarui)' : ''}`);
            return true;

        } catch (error: any) {
            console.error('Error saving draft:', error);
            setErrorMessage(error.message || 'Terjadi kesalahan saat menyimpan draft. Coba lagi.');
            return false;
        } finally {
            setProsesSimpanStep1(false);
        }
    }


    // Pindah ke langkah berikutnya setelah validasi DAN SIMPAN DRAFT BERHASIL
    const nextStep = async () => {
        // Daftar field yang perlu divalidasi di Step 1
        const fieldsToValidate: (keyof FormValue)[] = [
            'nomor_induk',
            'nama',
            'tempat_lahir',
            'tanggal_lahir',
            'jenis_kelamin',
            'alamat',
            'induk_organisasi',
            'jumlah_anggota'
        ];

        const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

        if (isValid) {
            const data = getValues();
            const saveSuccess = await saveStepOne(data); // Panggil fungsi simpan draft
            
            if (saveSuccess) {
                setStep(2);
                setErrorMessage(null); // Clear error message when moving to the next step
            }
        } else {
            // Opsional: Atur pesan error jika validasi gagal
            setErrorMessage("Mohon lengkapi semua field wajib di Langkah 1 sebelum melanjutkan.");
        }
    };

    // Kembali ke langkah sebelumnya
    const prevStep = () => {
        setStep(1);
        setErrorMessage(null);
    };

    // Fungsi Submit Akhir (Step 2)
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        setErrorMessage(null);

        if (!fotoKtp || !foto3x4) {
            setErrorMessage("Mohon lengkapi upload Foto KTP dan Foto 3x4.");
            return;
        }

        if (!draftId) {
             setErrorMessage("Kesalahan sistem: Draft ID tidak ditemukan. Mohon ulangi dari Langkah 1.");
             return;
        }
        
        if (!encodedCredentials) {
            setErrorMessage("Kesalahan konfigurasi API. Tidak dapat melanjutkan.");
            return;
        }
        
        // Catatan: Dalam implementasi nyata, Anda harus menggunakan FormData
        // untuk mengupload file. Di sini, kita hanya mengirim metadata form 
        // dan *mengasumsikan* backend akan menerima file upload terpisah 
        // atau kita akan mengirim file di request yang berbeda.

        // Simulasikan pengiriman data Step 1 + File Upload Metadata.
        // Di dunia nyata, ini akan menjadi request terpisah atau menggunakan FormData
        const finalData = {
            id: draftId, // Menggunakan ID yang didapat dari Step 1
            nomor_induk: data.nomor_induk,
            nama: data.nama,
            tempat_tanggal_lahir: `${data.tempat_lahir}, ${data.tanggal_lahir}`,
            jenis_kelamin: data.jenis_kelamin,
            alamat: data.alamat,
            induk_organisasi: data.induk_organisasi,
            jumlah_anggota: parseInt(data.jumlah_anggota || '0'),
            keterangan: data.keterangan || '',
            // Simulasi data file. Dalam implementasi nyata, gunakan FormData.
            fotoKtp: fotoKtp.name, 
            foto3x4: foto3x4.name,
            status: 'submitted', // Ubah status menjadi submitted
        };
        
        // TODO: Anda perlu menambahkan logic untuk mengupload fotoKtp dan foto3x4
        // menggunakan FormData ke endpoint yang sesuai (misalnya /pengajuan/upload/draftId)
        // sebelum atau sesudah mengirimkan finalData, tergantung desain API Anda.

        try {
            setProses(true);

            // SIMULASI FETCH SUBMIT AKHIR (mengubah status draft menjadi submitted)
            const response = await fetch(`${apiUrl}/pengajuan/${draftId}/submit`, {
                method: 'POST', // Atau PUT/PATCH, tergantung desain API Anda
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${encodedCredentials}`,
                },
                body: JSON.stringify(finalData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                console.error(`Error: ${response.status} - ${JSON.stringify(errorData)}`);
                setErrorMessage(`Gagal mengirim pendaftaran akhir: ${errorData.message || response.statusText}`);
                return;
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);
            setErrorMessage("Pendaftaran Berhasil Dikirim! Dokumen Anda sedang diproses."); // Pesan sukses

        } catch (error) {
           
            console.error('Error submitting form:', error);
            setErrorMessage('Terjadi kesalahan saat mengirim formulir. Coba lagi.');
        } finally {
            setProses(false);
        }
    }

    return (
        <>
            <HeaderUserOrganisasi />
            <div className="min-h-screen bg-gray-100 py-10">
                <main className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200">
                    <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-800">Pendaftaran KTA Organisasi</h1>

                    {/* Step Indicators */}
                    <div className="flex justify-around items-center mb-8 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 z-0 mx-8">
                            <div className={`h-1 bg-blue-600 transition-all duration-500 ${step === 2 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <StepIndicator number={1} title="Data Diri" isActive={step >= 1} />
                        <StepIndicator number={2} title="Upload Dokumen" isActive={step >= 2} />
                    </div>

                    {errorMessage && (
                        <div className={`p-3 mb-4 rounded-lg text-sm font-medium ${errorMessage.includes('Berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* STEP 1: DATA DIRI & ORGANISASI */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Langkah 1: Informasi Organisasi & Kontak</h2>

                                {/* Nomor Induk Ketua */}
                                <FormInput
                                    label="Nomor Induk Ketua (NIK/SIM/KITAS)"
                                    name="nomor_induk"
                                    control={control}
                                    type="text"
                                    placeholder="Masukkan nomor induk ketua"
                                    error={errors.nomor_induk}
                                    required={true}
                                />

                                {/* Nama Organisasi */}
                                <FormInput
                                    label="Nama Organisasi"
                                    name="nama"
                                    control={control}
                                    type="text"
                                    placeholder="Masukkan nama organisasi"
                                    error={errors.nama}
                                    required={true}
                                />

                                {/* Tempat dan Tanggal Lahir */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Tempat, Tanggal Lahir Ketua</label>
                                    <div className="flex gap-3">
                                        <FormInput
                                            name="tempat_lahir"
                                            control={control}
                                            type="text"
                                            placeholder="Tempat Lahir"
                                            className="w-1/2"
                                            error={errors.tempat_lahir}
                                            required={true}
                                        />
                                        <FormInput
                                            name="tanggal_lahir"
                                            control={control}
                                            type="date"
                                            placeholder=""
                                            className="w-1/2"
                                            error={errors.tanggal_lahir}
                                            required={true}
                                        />
                                    </div>
                                </div>

                                {/* Jenis Kelamin */}
                                <div>
                                    <label htmlFor="jenis_kelamin" className="block text-sm font-medium mb-1 text-gray-700">Jenis Kelamin Ketua</label>
                                    <Controller
                                        name="jenis_kelamin"
                                        control={control}
                                        rules={{ required: "Jenis kelamin wajib diisi" }}
                                        render={({ field }) => (
                                            <select
                                                id="jenis_kelamin"
                                                {...field}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm"
                                                required
                                            >
                                                <option value="">-- Pilih --</option>
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        )}
                                    />
                                    {errors.jenis_kelamin && <p className="text-xs text-red-500 mt-1">{errors.jenis_kelamin.message}</p>}
                                </div>

                                {/* Alamat Organisasi */}
                                <div>
                                    <label htmlFor="alamat" className="block text-sm font-medium mb-1 text-gray-700">Alamat Organisasi</label>
                                    <Controller
                                        name="alamat"
                                        control={control}
                                        rules={{ required: "Alamat organisasi wajib diisi" }}
                                        render={({ field }) => (
                                            <textarea
                                                id="alamat"
                                                {...field}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm"
                                                required
                                                rows={3}
                                            ></textarea>
                                        )}
                                    />
                                    {errors.alamat && <p className="text-xs text-red-500 mt-1">{errors.alamat.message}</p>}
                                </div>

                                {/* Induk Organisasi */}
                                <FormInput
                                    label="Induk Organisasi"
                                    name="induk_organisasi"
                                    control={control}
                                    type="text"
                                    placeholder="Contoh: Pencak Silat, Paguyuban, dll."
                                    error={errors.induk_organisasi}
                                    required={true}
                                />

                                {/* Jumlah Anggota */}
                                <div>
                                    <label htmlFor="jumlah_anggota" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Anggota</label>
                                    <Controller
                                        name="jumlah_anggota"
                                        control={control}
                                        rules={{
                                            required: "Jumlah anggota wajib diisi",
                                            validate: value => (parseInt(value) > 0) || "Jumlah anggota minimal 1"
                                        }}
                                        render={({ field }) => (
                                            <input
                                                id="jumlah_anggota"
                                                {...field}
                                                type="number"
                                                min="1"
                                                required
                                                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm"
                                                placeholder="Contoh: 10"
                                            />
                                        )}
                                    />
                                    {errors.jumlah_anggota && <p className="text-xs text-red-500 mt-1">{errors.jumlah_anggota.message}</p>}
                                </div>

                                {/* Keterangan (Optional) */}
                                <div>
                                    <label htmlFor="keterangan" className="block text-sm font-medium mb-1 text-gray-700">Keterangan (Optional)</label>
                                    <Controller
                                        name="keterangan"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                id="keterangan"
                                                {...field}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm"
                                                rows={2}
                                            ></textarea>
                                        )}
                                    />
                                </div>

                                {/* Navigation & Save Button Step 1 */}
                                <div className="flex gap-4 pt-4">
                                    {/* Tombol Simpan Draft */}
                                    <button
                                        type="button"
                                        onClick={handleSubmit((data) => saveStepOne(data))} // Gunakan handleSubmit untuk validasi sebelum simpan
                                        disabled={prosesSimpanStep1 || proses}
                                        className="w-1/2 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition duration-300 font-bold shadow-lg disabled:bg-yellow-300"
                                    >
                                        {prosesSimpanStep1 ? 'Menyimpan Draft...' : (draftId ? 'Update Draft' : 'Simpan')}
                                    </button>

                                    {/* Tombol Lanjut Step 2 */}
                                    <button
                                        type="button"
                                        onClick={nextStep} // nextStep akan memanggil saveStepOne internal
                                        disabled={prosesSimpanStep1 || proses}
                                        className="w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-bold shadow-lg disabled:bg-blue-300"
                                    >
                                        Lanjut ke Langkah 2 &rarr;
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    *Data harus valid dan berhasil disimpan (draft) sebelum dapat melanjutkan ke Langkah 2.
                                    {draftId && <span className="text-blue-600 font-medium block"> Draft ID: {draftId}</span>}
                                </p>
                            </div>
                        )}

                        {/* =======================================================
                            STEP 2: UPLOAD DOKUMEN
                        ======================================================= */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Langkah 2: Upload Dokumen Wajib</h2>
                                <p className="text-sm text-gray-600">Mohon siapkan dan unggah file gambar (JPG/PNG) untuk KTP dan foto 3x4.</p>

                                {/* Foto KTP */}
                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <label htmlFor="fotoKtp" className="block text-sm font-bold mb-2 text-gray-800">1. Upload Foto KTP (Wajib)</label>
                                    <input
                                        type="file"
                                        id="fotoKtp"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            setFotoKtp(file);
                                            setErrorMessage(null); // Clear error on change
                                        }}
                                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        required
                                    />
                                    {fotoKtp && (
                                        <p className="text-xs text-gray-500 mt-2">File Terpilih: **{fotoKtp.name}**</p>
                                    )}
                                    {!fotoKtp && <p className="text-xs text-red-500 mt-1">Foto KTP wajib diunggah.</p>}
                                </div>

                                {/* Foto 3x4 */}
                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <label htmlFor="foto3x4" className="block text-sm font-bold mb-2 text-gray-800">2. Upload Foto 3x4 (Wajib)</label>
                                    <input
                                        type="file"
                                        id="foto3x4"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            setFoto3x4(file);
                                            setErrorMessage(null); // Clear error on change
                                        }}
                                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        required
                                    />
                                    {foto3x4 && (
                                        <p className="text-xs text-gray-500 mt-2">File Terpilih: **{foto3x4.name}**</p>
                                    )}
                                    {!foto3x4 && <p className="text-xs text-red-500 mt-1">Foto 3x4 wajib diunggah.</p>}
                                </div>

                                {/* Navigation Buttons Step 2 */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="w-1/2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300 font-bold shadow-md"
                                        disabled={proses}
                                    >
                                        &larr; Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-1/2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-bold shadow-lg disabled:bg-green-300"
                                        disabled={proses || !fotoKtp || !foto3x4 || !draftId}
                                    >
                                        {proses ? 'Mengirim...' : 'Submit Pendaftaran'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </main>
            </div>
        </>
    );
}

// Komponen Pembantu untuk Step Indicator (Tidak Berubah)
const StepIndicator = ({ number, title, isActive }: { number: number, title: string, isActive: boolean }) => (
    <div className="flex flex-col items-center z-10">
        <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg border-4 transition-colors duration-300 ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
            {number}
        </div>
        <div className={`text-xs mt-2 font-medium text-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{title}</div>
    </div>
);

// Komponen Pembantu untuk Input Form (Diubah sedikit untuk menangani type="number")
const FormInput = ({ label, name, control, type, placeholder, className = "", error, required = false }: any) => (
    <div className={className}>
        {label && <label htmlFor={name} className="block text-sm font-medium mb-1 text-gray-700">{label}</label>}
        <Controller
            name={name}
            control={control}
            rules={required ? { required: `${label || name} wajib diisi` } : {}}
            render={({ field }) => (
                <input
                    id={name}
                    {...field}
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm"
                    required={required}
                    // Menggunakan value dari field.value, yang harus berupa string untuk input text/number non-controlled
                    // field.onChange akan mengupdate state form dengan nilai string
                />
            )}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
);