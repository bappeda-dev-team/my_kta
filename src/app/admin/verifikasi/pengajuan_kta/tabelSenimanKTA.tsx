import React, { useState, useEffect, useMemo } from 'react';

// Komponen utama aplikasi
export default function TabelSenimanKTA() {
    // Contoh data untuk tabel
    const [data, setData] = useState([
        { id: 1, name: 'Nahendra Gatotkaca', TTL: 'Madiun, 01-01-1999', jeniskelamin: 'Laki-laki', alamat: 'Madiun', profesi: 'dalang', ktpPhoto: '', threeByFourPhoto: '', status: 'Pending' },
    ]);

    // State untuk melacak status verifikasi per item
    const [verificationStatus, setVerificationStatus] = useState<Record<number, boolean>>({});

    // State untuk melacak URL foto KTP dan 3x4 per item
    const [photos, setPhotos] = useState(() => {
        const initialPhotos: { [key: number]: { ktp: string; threeByFour: string } } = {};
        data.forEach(item => {
            initialPhotos[item.id] = {
                ktp: item.ktpPhoto,
                threeByFour: item.threeByFourPhoto
            };
        });
        return initialPhotos;
    });

    // State untuk data item yang akan dicetak sebagai kartu
    const [itemToPrint, setItemToPrint] = useState<DataItem | null>(null);

    // State untuk modal penolakan
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedItemForRejection, setSelectedItemForRejection] = useState<DataItem | null>(null);

    // State untuk notifikasi (pesan dan tipe: 'success' atau 'error')
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // State for search term
    const [searchTerm, setSearchTerm] = useState('');

    // Mengatur judul dokumen saat komponen dimuat
    useEffect(() => {
        document.title = 'Halaman Tabel Interaktif';
    }, []);

    // Fungsi untuk menangani verifikasi
    const handleVerify = (id: number) => {
        setVerificationStatus(prevStatus => ({
            ...prevStatus,
            [id]: !prevStatus[id] // Toggle status (true/false)
        }));
        // TODO: tambahkan logika untuk menyimpan status ini ke backend di sini
    };

    const handlePhotoChange = (id: string | number, type: any, url: any) => {
        setPhotos(prevPhotos => ({
            ...prevPhotos,
            [id]: {
                ...prevPhotos[Number(id)],
                [type]: url
            }
        }));
        // TODO: tambahkan logika untuk menyimpan URL foto ini ke backend di sini
    };

    // Tipe data untuk item
    type DataItem = {
        id: number;
        name: string;
        TTL: string;
        jeniskelamin: string;
        alamat: string;
        profesi: string;
        ktpPhoto: string;
        threeByFourPhoto: string;
        status: string;
    };

    // Fungsi untuk menangani pencetakan kartu
    const handlePrintCard = (item: DataItem) => {
        setItemToPrint(item); // Set item yang akan dicetak
        // Beri sedikit jeda agar React memiliki waktu untuk merender kartu sebelum mencetak
        setTimeout(() => {
            window.print();
            setItemToPrint(null); // Reset setelah dialog cetak dimulai
        }, 100);
    };

    // Fungsi untuk menampilkan pesan notifikasi
    const showNotification = (msg: string, type: string) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000); // Pesan akan hilang setelah 5 detik
    };

    // Handler untuk menampilkan modal penolakan
    const handleRejectClick = (item: DataItem) => { // Modified to accept item
        setSelectedItemForRejection(item);
        setShowRejectModal(true);
        setRejectionReason(''); // Reset alasan setiap kali modal dibuka
    };

    const submitRejection = async () => {
        if (!rejectionReason.trim()) {
            showNotification('Alasan penolakan tidak boleh kosong!', 'error');
            return;
        }
        if (!selectedItemForRejection) {
            showNotification('Tidak ada item yang dipilih untuk ditolak.', 'error');
            return;
        }
        setIsSubmitting(true);
        // TODO: Add actual rejection logic and API call here
        console.log(`Rejecting item ${selectedItemForRejection.id} with reason: ${rejectionReason}`);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification(`Item ${selectedItemForRejection.name} berhasil ditolak.`, 'success');
        setShowRejectModal(false);
        setIsSubmitting(false);
        setSelectedItemForRejection(null); // Clear selected item
    };

    // Filtered data based on searchTerm
    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return data;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return data.filter(item =>
            item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.TTL.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.alamat.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.profesi.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.jeniskelamin.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [data, searchTerm]);

    return (
        <div className="min-h-screen p-2 font-sans antialiased">
            {/* Tailwind CSS CDN and Inter Font - Moved here to ensure loading */}
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <style>
                {`
          body {
            font-family: 'Inter', sans-serif;
          }
          /* Styling untuk print */
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background-color: #fff;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          }
        `}
            </style>

            <main className="container mx-auto bg-white p-6 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Data Pelaku Seni</h1>

                {/* Notification Message */}
                {message && (
                    <div className={`p-3 mb-4 rounded-md text-white ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {message}
                    </div>
                )}

                {/* Filter Input */}
                <div className="mb-4 no-print">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama, TTL, alamat, atau profesi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Tabel Data */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center min-w-[50px] text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">ID</th>
                                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat, Tanggal Lahir</th>
                                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
                                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Profesi</th>
                                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Foto KTP</th>
                                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Foto 3x4</th>
                                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Status Verifikasi</th>
                                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg no-print">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Use filteredData here */}
                            {filteredData.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-bl-lg">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.TTL}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.jeniskelamin}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.alamat}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.profesi}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="flex flex-col items-center">
                                            {photos[item.id]?.ktp ? (
                                                <img src={photos[item.id].ktp} alt="Foto KTP" className="w-24 h-auto rounded-md object-cover mb-2" onError={(e: any) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x64/E0E0E0/555555?text=KTP'; }} />
                                            ) : (
                                                <img src="https://placehold.co/96x64/E0E0E0/555555?text=KTP" alt="Placeholder KTP" className="w-24 h-auto rounded-md object-cover mb-2" />
                                            )}
                                            <input
                                                type="text"
                                                placeholder="URL Foto KTP"
                                                value={photos[item.id]?.ktp || ''}
                                                onChange={(e) => handlePhotoChange(item.id, 'ktp', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 no-print"
                                            />
                                        </div></td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="flex flex-col items-center">
                                            {photos[item.id]?.threeByFour ? (
                                                <img src={photos[item.id].threeByFour} alt="Foto 3x4" className="w-20 h-20 rounded-md object-cover mb-2" onError={(e: any) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/E0E0E0/555555?text=3x4'; }} />
                                            ) : (
                                                <img src="https://placehold.co/80x80/E0E0E0/555555?text=3x4" alt="Placeholder 3x4" className="w-20 h-20 rounded-md object-cover mb-2" />
                                            )}
                                            <input
                                                type="text"
                                                placeholder="URL Foto 3x4"
                                                value={photos[item.id]?.threeByFour || ''}
                                                onChange={(e) => handlePhotoChange(item.id, 'threeByFour', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 no-print"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${verificationStatus[item.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {verificationStatus[item.id] ? 'Terverifikasi' : 'Belum Terverifikasi'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 no-print">
                                        <button
                                            onClick={() => handleVerify(item.id)}
                                            className={`py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200 ease-in-out shadow-md mr-2
                        ${verificationStatus[item.id] ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
                      `}
                                        >
                                            {verificationStatus[item.id] ? 'Batalkan Verifikasi' : 'Verifikasi'}
                                        </button>
                                        <button
                                            onClick={() => handleRejectClick(item)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mr-2"
                                        >
                                            Tolak
                                        </button>
                                        <button
                                            onClick={() => handlePrintCard(item)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
                                        >
                                            {/* Ikon Printer dari Lucide React atau SVG inline */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                                <rect x="6" y="14" width="12" height="8"></rect>
                                            </svg>
                                            Cetak Kartu
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada data yang cocok dengan pencarian Anda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Kartu yang akan dicetak - Hanya terlihat saat itemToPrint tidak null dan saat dicetak */}
                {itemToPrint && (
                    <div className="print-only-card fixed inset-0 flex items-start justify-right bg-white z-50 p-4">
                        <div className="card-container border border-gray-300 rounded-lg shadow-lg p-6 bg-white flex flex-col items-center justify-center">
                            <h2 className="text-xl font-bold mb-2 text-center">{itemToPrint.name}</h2>
                            <div className="flex justify-center mb-4">
                                {photos[itemToPrint.id]?.threeByFour ? (
                                    <img src={photos[itemToPrint.id].threeByFour} alt="Foto 3x4" className="w-24 h-32 object-cover border-2 border-gray-300" />
                                ) : (
                                    <img src="https://placehold.co/96x128/E0E0E0/555555?text=3x4" alt="Placeholder 3x4" className="w-24 h-32 object-cover border-2 border-gray-300" />
                                )}
                            </div>
                            <div className="text-sm text-gray-700 text-center">
                                <p className="mb-1"><span className="font-semibold">Tempat/Tgl Lahir:</span> {itemToPrint.TTL}</p>
                                <p className="mb-1"><span className="font-semibold">Jenis Kelamin:</span> {itemToPrint.jeniskelamin}</p>
                                <p className="mb-1"><span className="font-semibold">Alamat:</span> {itemToPrint.alamat}</p>
                                <p className="mb-1"><span className="font-semibold">Profesi:</span> {itemToPrint.profesi}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Penolakan */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[9999] p-4">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                            <h3 className="text-2xl font-bold mb-4 text-gray-600">Alasan Penolakan</h3>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-y"
                                placeholder="Masukkan alasan penolakan di sini..."
                            ></textarea>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={submitRejection}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Kirim Penolakan'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
