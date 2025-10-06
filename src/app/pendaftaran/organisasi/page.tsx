'use client';

import { useState } from "react";
import HeaderUserOrganisasi from "@/component/global/header-organisasi";
import { Controller, SubmitHandler, useForm } from "react-hook-form";


// type FormValue = {
//     nomor_induk?: string;
//     nama: string;
//     tempat_lahir: string;
//     tanggal_lahir: string;
//     jenis_kelamin: string;
//     alamat: string;
//     induk_organisasi: string;
//     jumlahAnggota?: number;
//     fotoKtp?: File | null;
//     foto3x4?: File | null;
//     keterangan?: string;
// };
type FormValue = {
    tertanda: {
        nama: string,
        tanda_tangan: string,
        jabatan: string,
        nip: string,
        pangkat: string
    },
    keterangan: string,
    induk_organisasi: string,
    nomor_induk: string,
    jumlah_anggota: string,
    daerah: string,
    berlaku_dari: number
    berlaku_sampai: number,
    nama: string,
    tanggal_lahir: string,
    jenis_kelamin: string,
    alamat: string,
    profesi: string,
    dibuat_di: string
 };

export default function PendaftaranOrganisasi() {
    const [step, setStep] = useState(1);
    const [fotoKtp, setFotoKtp] = useState<File | null>(null);
    const [foto3x4, setFoto3x4] = useState<File | null>(null);
    const [proses, setProses] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { control, handleSubmit, trigger, getValues, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            // Memberikan nilai default untuk menghindari uncontrolled input warnings
            nomor_induk: '',
            nama: '',
            tempat_lahir: '',
            tanggal_lahir: '',
            jenis_kelamin: '',
            alamat: '',
            induk_organisasi: '',
            jumlahAnggota: 1,
            keterangan: '',
        }
    });

    // Pindah ke langkah berikutnya setelah validasi
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
            // Keterangan diabaikan karena optional
        ];

        const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

        if (isValid) {
            setStep(2);
            setErrorMessage(null); // Clear error message when moving to the next step
        } else {
            // Opsional: Atur pesan error jika validasi gagal
            setErrorMessage("Mohon lengkapi semua field wajib di Langkah 1.");
        }
    };

    // Kembali ke langkah sebelumnya
    const prevStep = () => {
        setStep(1);
        setErrorMessage(null);
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        setErrorMessage(null);

        // Validasi file di langkah terakhir sebelum submit
        if (!fotoKtp || !foto3x4) {
            setErrorMessage("Mohon lengkapi upload Foto KTP dan Foto 3x4.");
            return;
        }
        

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const username = process.env.NEXT_PUBLIC_API_USERNAME;
        const password = process.env.NEXT_PUBLIC_API_PASSWORD;

        if (!username || !password) {
            console.error('API username or password not found in environment variables.');
            setErrorMessage("Kesalahan konfigurasi API. Tidak dapat melanjutkan.");
            return;
        }

        const credentials = `${username}:${password}`;
        const encodedCredentials = btoa(credentials);

        // Catatan: Dalam implementasi nyata, Anda akan menggunakan FormData
        // untuk mengupload file secara benar ke backend, bukan JSON.stringify.
        // Di sini, kita hanya mengirim metadata form karena objek File tidak bisa di-serialize
        // langsung dalam JSON.
        const formData = {
            nomor_induk: data.nomor_induk || '',
            nama: data.nama,
            tempat_tanggal_lahir: `${data.tempat_lahir}, ${data.tanggal_lahir}`,
            jenis_kelamin: data.jenis_kelamin,
            alamat: data.alamat,
            induk_organisasi: data.induk_organisasi,
            jumlah_anggota: data.jumlah_anggota,
            keterangan: data.keterangan || '',
            // Simulasi pengiriman file, dalam dunia nyata ini harus diubah
            // fotoKtp: fotoKtp.name, 
            // foto3x4: foto3x4.name,
        };

        try {
            setProses(true);

            // SIMULASI FETCH: Ganti dengan logic pengiriman file (misalnya FormData)
            const response = await fetch(`${apiUrl}/pengajuan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`,
                },
                body: JSON.stringify(formData) // Hanya metadata form,
            });

            

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                console.error(`Error: ${response.status} - ${JSON.stringify(errorData)}`);
                setErrorMessage(`Gagal mengirim data: ${errorData.message || response.statusText}`);
                return;
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);
            setErrorMessage("Pendaftaran Berhasil Dikirim!"); // Pesan sukses

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
                                    label="Nomor Induk Ketua"
                                    name="nomor_induk"
                                    control={control}
                                    type="text"
                                    placeholder="Masukkan nomor induk ketua (NIK/SIM/KITAS)"
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
                                    <label htmlFor="jumlahAnggota" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Anggota</label>
                                    <Controller
                                        name="jumlah_anggota"
                                        control={control}
                                        rules={{
                                            required: "Jumlah anggota wajib diisi",
                                            min: { value: 1, message: "Jumlah anggota minimal 1" }
                                        }}
                                        render={({ field }) => (
                                            <input
                                                id="jumlahAnggota"
                                                {...field}
                                                type="number"
                                                // Pastikan nilai diubah ke number saat onChange
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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

                                {/* Navigation Button Step 1 */}
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={proses}
                                    className="w-full bg-blue-600 text-white py-3 mt-4 rounded-lg hover:bg-blue-700 transition duration-300 font-bold shadow-lg disabled:bg-blue-300"
                                >
                                    Lanjut ke Langkah 2 (Upload Dokumen)
                                </button>
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
                                        disabled={proses || !fotoKtp || !foto3x4}
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

// Komponen Pembantu untuk Step Indicator
const StepIndicator = ({ number, title, isActive }: { number: number, title: string, isActive: boolean }) => (
    <div className="flex flex-col items-center z-10">
        <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg border-4 transition-colors duration-300 ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
            {number}
        </div>
        <div className={`text-xs mt-2 font-medium text-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{title}</div>
    </div>
);

// Komponen Pembantu untuk Input Form
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
                    // Khusus untuk number input, pastikan nilai diubah
                    onChange={(e) => field.onChange(type === 'number' ? parseInt(e.target.value) || undefined : e.target.value)}
                />
            )}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
);