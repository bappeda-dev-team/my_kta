'use client';

import { useState } from 'react';
import HeaderUser from '@/component/global/header-seni';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { noSSR } from 'next/dynamic';


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

export default function PendaftaranSeniman() {
    // State untuk melacak langkah formulir saat ini (1 atau 2)
    const [step, setStep] = useState(1);

    // State terpisah untuk menampung data file
    const [fotoKtp, setFotoKtp] = useState<File | null>(null);
    const [foto3x4, setFoto3x4] = useState<File | null>(null);

    const {
        control,
        handleSubmit,
        trigger, // Digunakan untuk validasi langkah sebelum beralih
        getValues, // Untuk mendapatkan nilai form saat ini tanpa me-render ulang
        formState: { errors }
    } = useForm<FormValue>({
        // Default values untuk memastikan semua field terkontrol
        defaultValues: {
            nomor_induk: '',
            nama: '',
            tempat_lahir: '',
            tanggal_lahir: '',
            jenis_kelamin: '',
            alamat: '',
            profesi: '',
            keterangan: '',
        },
    });

    // --- LOGIC FORM SUBMISSION AKHIR ---
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        // Cek kembali apakah file sudah diunggah di Langkah 2
        if (!fotoKtp || !foto3x4) {
            // Ini seharusnya tidak terpanggil jika tombol submit sudah di-disable, tapi baik untuk pencegahan
            alert('Mohon lengkapi unggahan dokumen di Langkah 2 sebelum menyelesaikan pendaftaran.');
            return;
        }

        // Gabungkan semua data (termasuk file dari state) untuk pengiriman akhir
        const formData = {
            nomor_induk: data.nomor_induk || '',
            nama: data.nama,
            tempat_tanggal_lahir: `${data.tempat_lahir}, ${data.tanggal_lahir}`,
            jenis_kelamin: data.jenis_kelamin,
            alamat: data.alamat,
            jenis_profesi: data.profesi,
            // File diambil dari state terpisah
            fotoKtp: fotoKtp.name, // Mengirim nama file saja untuk contoh log
            foto3x4: foto3x4.name, // Mengirim nama file saja untuk contoh log
            keterangan: data.keterangan || 'Tidak ada keterangan tambahan',
        };


        console.log('Final Form Data (Siap dikirimkan ke backend):', formData);
        alert('Pendaftaran Berhasil! Data formulir telah dikumpulkan dan siap diproses. Lihat detail di console log.');

        // Di sini Anda akan menambahkan logika POST data (termasuk file) ke API server
    };

    // --- LOGIC NAVIGASI ANTAR LANGKAH ---

    // Pindah ke Langkah Berikutnya (dari Step 1 ke Step 2)
    const handleNext = async () => {
        if (step === 1) {
            // Validasi bidang-bidang wajib di Langkah 1
            const fieldsToValidate: (keyof FormValue)[] = [
                'nomor_induk',
                'nama',
                'tempat_lahir',
                'tanggal_lahir',
                'jenis_kelamin',
                'alamat',
                'profesi'
            ];

            // Trigger validasi untuk field yang spesifik
            const isStep1Valid = await trigger(fieldsToValidate);

            if (isStep1Valid) {
                setStep(2);
            }
        }
    };

    // Kembali ke Langkah Sebelumnya (dari Step 2 ke Step 1)
    const handleBack = () => {
        setStep(1);
    };

    // Kelas bantuan untuk indikator langkah
    const stepClass = (step: number) => {
        const base = 'w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all duration-300 border-2';
        if (step >= step) {
            return `${base} bg-blue-600 text-white border-blue-600 shadow-lg`;
        }
        return `${base} bg-white text-gray-500 border-gray-300`;
    };

    // --- RENDER LANGKAH 1 (DATA DIRI) ---
    const Step1 = (
        <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Langkah 1: Data Pribadi</h2>

            {/* Nomor Induk */}
            <div>
                <label htmlFor='nomor_induk' className="block text-sm font-medium mb-1 text-gray-700">Nomor Induk (KTP/SIM/Paspor)</label>
                <Controller
                    name="nomor_induk"
                    control={control}
                    rules={{ required: 'Nomor induk wajib diisi' }}
                    render={({ field }) => (
                        <input
                            id='nomor_induk'
                            {...field}
                            type="text"
                            placeholder="Masukkan Nomor Induk Anda"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        />
                    )}
                />
                {errors.nomor_induk && <p className="text-red-500 text-xs mt-1">{errors.nomor_induk.message}</p>}
            </div>

            {/* Nama */}
            <div>
                <label htmlFor='nama' className="block text-sm font-medium mb-1 text-gray-700">Nama Lengkap</label>
                <Controller
                    name="nama"
                    control={control}
                    rules={{ required: 'Nama wajib diisi' }}
                    render={({ field }) => (
                        <input
                            id='nama'
                            {...field}
                            type="text"
                            placeholder="Masukkan Nama Lengkap Anda"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        />
                    )}
                />
                {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama.message}</p>}
            </div>

            {/* Tempat dan Tanggal Lahir */}
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Tempat, Tanggal Lahir</label>
                <div className="flex gap-3">
                    <div className='w-1/2'>
                        <Controller
                            name="tempat_lahir"
                            control={control}
                            rules={{ required: 'Tempat lahir wajib diisi' }}
                            render={({ field }) => (
                                <input
                                    id='tempat_lahir'
                                    {...field}
                                    type="text"
                                    placeholder="Tempat Lahir"
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                                />
                            )}
                        />
                        {errors.tempat_lahir && <p className="text-red-500 text-xs mt-1">{errors.tempat_lahir.message}</p>}
                    </div>

                    <div className='w-1/2'>
                        <Controller
                            name="tanggal_lahir"
                            control={control}
                            rules={{ required: 'Tanggal lahir wajib diisi' }}
                            render={({ field }) => (
                                <input
                                    id='tanggal_lahir'
                                    type="date"
                                    {...field}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                                />
                            )}
                        />
                        {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{errors.tanggal_lahir.message}</p>}
                    </div>
                </div>
            </div>

            {/* Jenis Kelamin */}
            <div>
                <label htmlFor='jenis_kelamin' className="block text-sm font-medium mb-1 text-gray-700">Jenis Kelamin</label>
                <Controller
                    name="jenis_kelamin"
                    control={control}
                    rules={{ required: 'Jenis kelamin wajib diisi' }}
                    render={({ field }) => (
                        <select
                            id='jenis_kelamin'
                            {...field}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 bg-white"
                        >
                            <option value="">-- Pilih --</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    )}
                />
                {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin.message}</p>}
            </div>

            {/* Alamat */}
            <div>
                <label htmlFor='alamat' className="block text-sm font-medium mb-1 text-gray-700">Alamat Lengkap Sesuai KTP</label>
                <Controller
                    name="alamat"
                    control={control}
                    rules={{ required: 'Alamat wajib diisi' }}
                    render={({ field }) => (
                        <textarea
                            id='alamat'
                            {...field}
                            rows={3}
                            placeholder="Contoh: Jl. Sudirman No. 12, RT 01/RW 02, Kel. Menteng..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        ></textarea>
                    )}
                />
                {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat.message}</p>}
            </div>

            {/* Jenis Profesi */}
            <div>
                <label htmlFor='jenis_profesi' className="block text-sm font-medium mb-1 text-gray-700">Jenis Profesi Seni</label>
                <Controller
                    name="profesi"
                    control={control}
                    rules={{ required: 'Jenis profesi wajib diisi' }}
                    render={({ field }) => (
                        <input
                            id='jenis_profesi'
                            {...field}
                            type="text"
                            placeholder="Contoh: Seniman Tari, Pelukis, Musisi"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        />
                    )}
                />
                {errors.profesi && <p className="text-red-500 text-xs mt-1">{errors.profesi.message}</p>}
            </div>


            {/* Keterangan dipindahkan ke Step 1, tapi jika mau tetap di sini juga tidak masalah */}
            <div>
                <label htmlFor='keterangan' className="block text-sm font-medium mb-1 text-gray-700">Keterangan Tambahan (Opsional)</label>
                <Controller
                    name="keterangan"
                    control={control}
                    render={({ field }) => (
                        <textarea
                            id='keterangan'
                            {...field}
                            rows={2}
                            placeholder="Tambahkan keterangan atau portofolio singkat jika ada"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        ></textarea>
                    )}
                />
            </div>

            {/* Tombol Navigasi */}
            <div className='flex justify-end pt-4'>
                <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-blue-600 text-white py-3 px-8 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-md shadow-blue-300/50 flex items-center justify-center"
                >
                    Selanjutnya (Dokumen)
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>
        </div>
    );

    // --- RENDER LANGKAH 2 (UPLOAD DOKUMEN) ---
    const Step2 = (
        <div className='space-y-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Langkah 2: Unggah Dokumen</h2>

            {/* Foto KTP */}
            <div className='p-5 border border-blue-200 bg-blue-50 rounded-xl shadow-inner'>
                <label htmlFor="fotoKtp" className="text-sm font-bold mb-2 text-blue-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.863-1.294A2 2 0 019.464 4h4.072a2 2 0 011.664.89l.863 1.294a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Upload Foto KTP <span className='text-red-500 ml-1'>*</span>
                </label>
                <p className='text-xs text-blue-700 mb-3'>Maks. 2MB. Pastikan foto KTP jelas, tidak buram, dan seluruh bagian kartu terlihat.</p>
                <input
                    type="file"
                    id="fotoKtp"
                    accept="image/jpeg,image/png"
                    onChange={(e) => {
                        const selectedFile = e.target.files ? e.target.files[0] : null;
                        console.log('File KTP yang dipilih:', selectedFile); 
                        setFotoKtp(selectedFile);
                        if (e.target.files){
                            alert('uploaded');
                        }
                    }}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition duration-150 cursor-pointer"
                    required
                />
                {fotoKtp && (
                    <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        File KTP dipilih: **{fotoKtp.name}** ({Math.round(fotoKtp.size / 1024)} KB)
                    </p>
                )}
                {!fotoKtp && <p className="text-red-500 text-xs mt-2 font-medium">Wajib mengunggah Foto KTP.</p>}
            </div>

            {/* Foto 3x4 */}
            <div className='p-5 border border-blue-200 bg-blue-50 rounded-xl shadow-inner'>
                <label htmlFor="foto3x4" className="text-sm font-bold mb-2 text-blue-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Upload Pas Foto 3x4 <span className='text-red-500 ml-1'>*</span>
                </label>
                <p className='text-xs text-blue-700 mb-3'>Maks. 1MB. Gunakan pas foto formal dengan latar belakang polos (merah/biru).</p>
                <input
                    type="file"
                    id="foto3x4"
                    accept="image/jpeg,image/png"
                    onChange={(e) => setFoto3x4(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition duration-150 cursor-pointer"
                    required
                />
                {foto3x4 && (
                    <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        File Foto 3x4 dipilih: **{foto3x4.name}** ({Math.round(foto3x4.size / 1024)} KB)
                    </p>
                )}
                {!foto3x4 && <p className="text-red-500 text-xs mt-2 font-medium">Wajib mengunggah Foto 3x4.</p>}
            </div>


            {/* Tombol Navigasi */}
            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-300 text-gray-800 py-3 px-8 rounded-xl hover:bg-gray-400 transition duration-200 font-semibold shadow-md flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Kembali
                </button>
                <button
                    type="submit"
                    className="bg-green-600 text-white py-3 px-8 rounded-xl hover:bg-green-700 transition duration-200 font-semibold shadow-md shadow-green-300/50 flex items-center justify-center disabled:bg-gray-400 disabled:shadow-none"
                    // Tombol submit hanya aktif jika kedua file sudah dipilih
                    disabled={!fotoKtp || !foto3x4}
                >
                    Selesaikan Pendaftaran
                </button>
            </div>
        </div>
    );

    // --- KOMPONEN UTAMA RENDER ---
    return (
        <>
            <HeaderUser />
            <main className="min-h-screen pt-4 pb-12 bg-gray-50">
                <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-2xl">
                    <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-800">Pendaftaran KTA Pelaku Seni</h1>

                    {/* Indikator Langkah (Step Indicator) */}
                    <div className="flex justify-center items-center mb-10 relative">
                        {/* Garis Progres */}
                        <div className='absolute w-full px-16 top-1/2 transform -translate-y-1/2'>
                            <div className='h-1 bg-gray-200 rounded-full'>
                                <div className='h-1 bg-blue-600 rounded-full transition-all duration-300'
                                    style={{ width: step === 2 ? '100%' : '0%' }}>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full justify-around z-10">
                            {/* Step 1: Data Diri */}
                            <div className="flex flex-col items-center">
                                <div className={stepClass(1)}>1</div>
                                <span className={`text-sm mt-2 font-semibold text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Data Diri</span>
                            </div>

                            {/* Step 2: Dokumen */}
                            <div className="flex flex-col items-center">
                                <div className={stepClass(2)}>2</div>
                                <span className={`text-sm mt-2 font-semibold text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Dokumen</span>
                            </div>
                        </div>
                    </div>

                    {/* Konten Formulir */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && Step1}
                        {step === 2 && Step2}
                    </form>
                </div>
            </main>
        </>
    );
}
