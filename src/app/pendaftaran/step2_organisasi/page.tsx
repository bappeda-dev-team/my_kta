'use client'
import HeaderUserOrganisasi from "@/component/global/header-organisasi";
import { useState, FormEvent } from "react";
import { getCookie } from "@/component/lib/cookie";

interface FormData {
    nama_file: string;
    file: string;
    form_uuid: string;
}

export default function PendaftaranOrganisasi() {
    const [step, setStep] = useState(1);
    const [fotoKtp, setFotoKtp] = useState<File | null>(null);
    const [foto3x4, setFoto3x4] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [proses, setProses] = useState(false);
    const [formData, setFormData] = useState<FormData>({ nama_file: '', file: '', form_uuid: '' });
    const [draftId, setDraftId] = useState<string | null>(null);

    // Komponen Pembantu untuk Step Indicator (Tidak Berubah)
    const StepIndicator = ({ number, title, isActive }: { number: number, title: string, isActive: boolean }) => (
        <div className="flex flex-col items-center z-10">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg border-4 transition-colors duration-300 ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                {number}
            </div>
            <div className={`text-xs mt-2 font-medium text-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{title}</div>
        </div>
    );

    // Simple handleSubmit helper to match react-hook-form-like usage in this component
    const handleSubmit = (cb: (e?: FormEvent) => void) => {
        return (e: FormEvent) => {
            e.preventDefault();
            cb(e);
        };
    }

    const onSubmitStep2 = async (e?: FormEvent) => {
        setProses(true);
        await uploadFile();
        setProses(false);
    };
    const prevStep = () => setStep((s) => Math.max(1, s - 1));

    const uploadFile = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const submissionData = new FormData();

            // Append data teks
            submissionData.append('nama_file', formData.nama_file);
            submissionData.append('file', formData.file);
            submissionData.append('form_uuid', draftId ? draftId : '');

            // Append file
            if (fotoKtp) {
                submissionData.append('fotoKtp', fotoKtp, fotoKtp.name);
            }
            if (foto3x4) {
                submissionData.append('foto3x4', foto3x4, foto3x4.name);
            }

            // Example: send to API (uncomment and adapt endpoint when ready)
           const token = getCookie('token');
            await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Menambahkan header Authorization
                    // Tambahkan header lain jika diperlukan, seperti 'Content-Type' jika bukan FormData
                },
                body: submissionData // Asumsi submissionData adalah FormData atau objek lain
            });
            // x    console.log('Prepared submission', submissionData);
        } catch (err) {
            setErrorMessage('Gagal mengupload file');
        }
    };

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
                    <form onSubmit={handleSubmit(onSubmitStep2)} className="space-y-6">
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Langkah 2: Upload Dokumen Wajib</h2>

                            {errorMessage && (
                                <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm font-medium">
                                    🛑 Error: {errorMessage}
                                </div>
                            )}

                            <p className="text-sm text-gray-600">Mohon siapkan dan unggah file gambar (JPG/PNG) untuk KTP dan foto 3x4.</p>

                            {/* Foto KTP */}
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                                <label htmlFor="fotoKtp" className="block text-sm font-bold mb-2 text-gray-800">1. Upload Foto KTP (Wajib)</label>
                                <input
                                    type="file"
                                    id="fotoKtp"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        setFotoKtp(file);
                                        setErrorMessage(null); // Clear error on change
                                        if (file) {
                                            uploadFile();
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
                                        <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">TERUPLOAD</span>
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
                                        const file = e.target.files ? e.target.files[0] : null;
                                        setFoto3x4(file);
                                        setErrorMessage(null); // Clear error on change
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
                                        <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded-full">TERUPLOAD</span>
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
                                    type="submit"
                                    className="w-1/2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-bold shadow-lg disabled:bg-green-300 disabled:cursor-not-allowed"
                                    disabled={proses}
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
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}