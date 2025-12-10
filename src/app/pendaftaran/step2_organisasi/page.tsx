'use client'
import { useState, FormEvent } from "react";
import { getCookie } from "@/component/lib/cookie";
import { useRouter } from "next/navigation";
// Catatan: Pastikan Anda menyesuaikan path import untuk 'getCookie' jika Anda memindahkannya.

// Interface untuk data form (Tetap)
interface FormData {
    nama_file: string;
    file: File | null;
    form_uuid: string;
}

// Definisikan Props untuk Komponen
interface PendaftaranOrganisasiFormProps {
    /** Fungsi callback yang dipanggil setelah formulir berhasil disubmit/file terupload. */
    onSuccess?: () => void;
    /** UUID draft/formulir yang sudah ada (Opsional). */
    initialDraftId?: string | null;
    /** State awal langkah (Default: 1). Jika di halaman luar hanya memanggil langkah 2, bisa diatur ke 2. */
    initialStep?: number;
}

// Komponen Utama
export default function PendaftaranOrganisasiForm({
    onSuccess,
    initialDraftId = null,
    initialStep = 1,
}: PendaftaranOrganisasiFormProps) {
    const [step, setStep] = useState(initialStep); // Menggunakan initialStep dari props
    const [fotoKtp, setFotoKtp] = useState<File | null>(null);
    const [foto3x4, setFoto3x4] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [proses, setProses] = useState(false);
    
    // FormData yang TIDAK dipakai di Step 2, tapi tetap dipertahankan karena ada di kode asli
    const [formData, setFormData] = useState<FormData>({ nama_file: '', file: null, form_uuid: '' });

    const router = useRouter();

    // Komponen Pembantu untuk Step Indicator (Dipindahkan ke dalam komponen utama)
    const StepIndicator = ({ number, title, isActive }: { number: number, title: string, isActive: boolean }) => (
        <div className="flex flex-col items-center z-10">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg border-4 transition-colors duration-300 ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                {number}
            </div>
            <div className={`text-xs mt-2 font-medium text-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{title}</div>
        </div>
    );

    // Simple handleSubmit helper (Tetap)
    // const handleSubmit = (cb: (e?: FormEvent) => void) => {
    //     return (e: FormEvent) => {
    //         e.preventDefault();
    //         cb(e);
    //     };
    // }

    // const onSubmitStep2 = async (e?: FormEvent) => {
    //     // Cek apakah kedua file sudah diunggah
    //     if (!fotoKtp || !foto3x4) {
    //         setErrorMessage("Mohon unggah kedua dokumen (Foto KTP dan Foto 3x4) sebelum submit.");
    //         return;
    //     }

    //     setProses(true);
    //     await uploadFiles(); // Mengubah nama fungsi uploadFile
    //     setProses(false);
    // };

    const prevStep = () => setStep((s) => Math.max(1, s - 1));
    const nextStep = () => setStep((s) => Math.min(2, s + 1)); // Tambahkan fungsi nextStep (walaupun tidak digunakan di langkah 1, berguna untuk struktur)

    const uploadFiles = async ({ nama_file, form_uuid, file }: any) => {
        // console.log(nama_file, form_uuid, file_fotoKtp, foto3x4); // Anda mungkin masih ingin melihat foto3x4

        // Asumsi: foto3x4, initialDraftId, onSuccess, getCookie, setErrorMessage, dan process.env 
        // masih tersedia dalam scope (misalnya, sebagai variabel/state di luar fungsi atau diimpor).

        try {
            // --- Validasi Input ---
            if (!nama_file || !form_uuid || !file) {
                // Logika untuk menampilkan pesan error jika ada parameter yang hilang
                const missing = [];
                if (!nama_file) missing.push('nama_file');
                if (!form_uuid) missing.push('form_uuid');
                if (!file) missing.push('file');
                const errorMsg = `Parameter hilang: ${missing.join(', ')}.`;
                setErrorMessage(errorMsg);
                console.error(errorMsg);
                return; // Hentikan eksekusi jika input tidak lengkap
            }
            // ----------------------

            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const submissionData = new FormData();

            // Menggunakan parameter yang baru
            submissionData.append('nama_file', nama_file);
            // Menggunakan form_uuid dari parameter
            submissionData.append('form_uuid', form_uuid);
            // submissionData.append('form_uuid', initialDraftId ? initialDraftId : 'uuid tidak terdeteksi'); // Baris asli (jika masih diperlukan)


            // Append file Foto KTP dari parameter
            // Asumsi: file_fotoKtp adalah objek File
            submissionData.append('file', file, file.name);

            // Append file Foto 3x4 (tetap menggunakan variabel lama jika masih dibutuhkan)
            if (foto3x4) {
                submissionData.append('file', foto3x4, foto3x4.name);
            }

            const token = getCookie('token');
            const response = await fetch(`${API_URL}/pengajuan/upload-file`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Perhatian: Jangan set 'Content-Type': 'multipart/form-data' secara manual. 
                    // Browser akan melakukannya dengan benar, termasuk boundary, saat Anda menggunakan objek FormData.
                },
                body: submissionData
            });

            if (!response.ok) {
                // Coba ambil pesan error dari response server jika ada
                const errorDetails = await response.json().catch(() => ({}));
                throw new Error(`Server error saat upload file: ${errorDetails.message || response.statusText}`);
            }

            // Jika berhasil, panggil callback onSuccess
            if (onSuccess) {
                onSuccess();
            }
            setErrorMessage(null); // Clear error

        } catch (err) {
            console.error(err);
            setErrorMessage('Gagal mengupload file: ' + err);
        }
    };

    // Handler untuk File Input
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'ktp' | '3x4') => {
        const file = e.target.files ? e.target.files[0] : null;
        if (fileType === 'ktp') {
            setFotoKtp(file);
        } else if (fileType === '3x4') {
            setFoto3x4(file);
        }
        setErrorMessage(null);

        // Catatan: Logika "uploadFile()" di onChange fotoKtp pada kode asli dihilangkan karena lebih baik diupload saat tombol submit
        // Jika Anda ingin mengaktifkan upload per file, pindahkan logika `uploadFiles` ke sini (dengan penyesuaian).
    };


    // --- Tampilan Komponen ---
    return (
        // HANYA konten formulir, tanpa div layout halaman (min-h-screen dll.)
        <div className="p-6 bg-white shadow-xl rounded-xl border border-gray-200">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-800">Pendaftaran KTA Organisasi</h1>
            <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-800">{initialDraftId || "tidak ada uuid dari response sebelumya"}</h1>

            {/* Step Indicators */}
            <div className="flex justify-around items-center mb-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 z-0 mx-8">
                    <div className={`h-1 bg-blue-600 transition-all duration-500 ${step === 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <StepIndicator number={1} title="Data Diri" isActive={step >= 1} />
                <StepIndicator number={2} title="Upload Dokumen" isActive={step >= 2} />
            </div>

            {/* Konten Formulir (Hanya menampilkan Step 2 karena Step 1 tidak ada di kode asli) */}
            <form className="space-y-6">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                        Langkah {step}: {step === 1 ? 'Data Diri' : 'Upload Dokumen Wajib'}
                    </h2>

                    {errorMessage && (
                        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm font-medium">
                            🛑 Error: {errorMessage}
                        </div>
                    )}

                    {/* Logika untuk menampilkan Step 1 atau Step 2 */}
                    {step === 1 && (
                        // Placeholder untuk Step 1 (Karena Step 1 tidak ada di kode asli, saya buatkan placeholder)
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 italic">
                                Konten untuk Langkah 1 (Data Diri) akan ditempatkan di sini.
                                Tombol "Lanjut" akan memanggil `setStep(2)`.
                            </p>
                            {/* Tombol Lanjut ke Step 2 (Untuk simulasi) */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 font-bold shadow-md"
                                >
                                    Lanjut &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <>
                            <p className="text-sm text-gray-600">Mohon siapkan dan unggah file gambar (JPG/PNG) untuk KTP dan foto 3x4.</p>

                            {/* Foto KTP */}
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                                <label htmlFor="fotoKtp" className="block text-sm font-bold mb-2 text-gray-800">1. Upload Foto KTP (Wajib)</label>
                                <input
                                    type="file"
                                    id="fotoKtp"
                                    accept="image/*"
                                    onChange={(e) => {
                                        // Panggil handleFileUpload terlebih dahulu
                                        handleFileUpload(e, 'ktp');

                                        // --- 1. Ambil File dari Event ---
                                        const file = e.target.files ? e.target.files[0] : null;

                                        if (file) {
                                            // --- 2. Tentukan Nilai Parameter ---
                                            // A. nama_file bisa diambil dari nama file yang diupload
                                            const namaFile = file.name;

                                            // B. form_uuid harus diambil dari tempat penyimpanan ID formulir Anda (misalnya, state atau prop)
                                            // Asumsi: Anda memiliki variabel 'formUuidSaatIni' yang menyimpan UUID formulir.
                                            const formUuidSaatIni = initialDraftId || 'uuid-default-jika-kosong';

                                            // --- 3. Panggil fungsi uploadFiles dengan parameter yang lengkap ---
                                            try {
                                                // Pastikan uploadFiles didefinisikan untuk menerima parameter sebagai objek,
                                                // seperti yang saya tunjukkan di jawaban sebelumnya.
                                                uploadFiles({
                                                    nama_file: namaFile,
                                                    form_uuid: formUuidSaatIni,
                                                    file: file
                                                });
                                                console.log('Upload berhasil setelah pilih file.');
                                            } catch (error) {
                                                console.error('Gagal saat memanggil uploadFiles:', error);
                                            }
                                        } else {
                                            console.log("File tidak terdeteksi.");
                                        }
                                    }}
                                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    required
                                />

                                {/* FILE TERUPLOAD FOTO KTP */}
                                {fotoKtp ? (
                                    <div className="mt-3 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md flex items-center justify-between transition duration-300">
                                        <p className="text-sm font-medium flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                            File Terpilih: <strong className="ml-1 truncate">{fotoKtp.name}</strong>
                                        </p>
                                        <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">TERPILIH</span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-red-500 mt-2">Foto KTP wajib diunggah.</p>
                                )}
                            </div>

                            {/* Foto 3x4 */}
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                                <label htmlFor="foto3x4" className="block text-sm font-bold mb-2 text-gray-800">2. Upload Foto 3x4 (Wajib)</label>
                                <input
                                    type="file"
                                    id="foto3x4"
                                    accept="image/*"
                                    onChange={(e) => {
                                        // Panggil handleFileUpload terlebih dahulu
                                        handleFileUpload(e, '3x4');

                                        // --- 1. Ambil File dari Event ---
                                        const file = e.target.files ? e.target.files[0] : null;

                                        if (file) {
                                            // --- 2. Tentukan Nilai Parameter ---
                                            // A. nama_file bisa diambil dari nama file yang diupload
                                            const namaFile = file.name;

                                            // B. form_uuid harus diambil dari tempat penyimpanan ID formulir Anda (misalnya, state atau prop)
                                            // Asumsi: Anda memiliki variabel 'formUuidSaatIni' yang menyimpan UUID formulir.
                                            const formUuidSaatIni = initialDraftId || 'uuid-default-jika-kosong';

                                            // --- 3. Panggil fungsi uploadFiles dengan parameter yang lengkap ---
                                            try {
                                                // Pastikan uploadFiles didefinisikan untuk menerima parameter sebagai objek,
                                                // seperti yang saya tunjukkan di jawaban sebelumnya.
                                                uploadFiles({
                                                    nama_file: namaFile,
                                                    form_uuid: formUuidSaatIni,
                                                    file: file
                                                });
                                                console.log('Upload berhasil setelah pilih file.');
                                            } catch (error) {
                                                console.error('Gagal saat memanggil uploadFiles:', error);
                                            }
                                        } else {
                                            console.log("File tidak terdeteksi.");
                                        }
                                    }}
                                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    required
                                />

                                {/* FILE TERUPLOAD FOTO 3X4 */}
                                {foto3x4 ? (
                                    <div className="mt-3 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md flex items-center justify-between transition duration-300">
                                        <p className="text-sm font-medium flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                            File Terpilih: <strong className="ml-1 truncate">{foto3x4.name}</strong>
                                        </p>
                                        <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">TERPILIH</span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-red-500 mt-2">Foto 3x4 wajib diunggah.</p>
                                )}
                            </div>

                            {/* Navigation Buttons Step 2 */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300 font-bold shadow-md disabled:opacity-50"
                                    disabled={proses}
                                >
                                    &larr; Kembali
                                </button>
                                <button
                                    type="button"
                                    onClick = {() => router.push('/verifikasi_daftar')}
                                    className="w-1/2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-bold shadow-lg disabled:bg-green-300 disabled:cursor-not-allowed"
                                    disabled={proses || !fotoKtp || !foto3x4}
                                >
                                    {proses ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Mengirim...
                                        </span>
                                    ) : 'Submit Pendaftaran'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}