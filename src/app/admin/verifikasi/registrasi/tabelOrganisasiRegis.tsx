import React, { useState, useEffect } from 'react';

// Komponen utama aplikasi
export default function TabelOrganisasiRegis() {
  // Contoh data untuk tabel
  const [data, setData] = useState([
    { id: 1, name: 'Ajinomoto', password: '123456',nomor_hp: '089000000',pilihan: 'Organisasi', status: 'Pending' },
  ]);

  // State untuk melacak status verifikasi per item
  const [verificationStatus, setVerificationStatus] = useState<Record<number, boolean>>({});

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
    // Anda bisa menambahkan logika untuk menyimpan status ini ke backend di sini
  };

  // Fungsi untuk menangani pencetakan halaman (masih mencetak seluruh halaman)
  const handlePrint = () => {
    window.print(); // Memanggil fungsi cetak bawaan browser
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
      {/* Tailwind CSS CDN dan Font Inter - Dipindahkan ke sini untuk memastikan pemuatan */}
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

        {/* Tabel Data */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-center min-w-[50px] text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">ID</th>
                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telepon / WhatsApps</th>                
                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Pilihan</th>
                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Status Verifikasi</th>
                <th scope="col" className="px-6 py-3 text-center min-w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-bl-lg">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.password}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nomor_hp}</td>                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.pilihan}</td>                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      verificationStatus[item.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> 
      </main>
    </div>
  );
}
