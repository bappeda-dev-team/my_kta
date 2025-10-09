import Link from "next/link";


export default function Pendaftaran() {
  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Pendaftaran</h1>
        <div className="flex gap-6 justify-center">
          <Link href="/pendaftaran/organisasi">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition">
              Pengajuan KTA
            </button>
          </Link>
          <Link href="/pendaftaran/organisasi">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition">
              Pengajuan Izin
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

