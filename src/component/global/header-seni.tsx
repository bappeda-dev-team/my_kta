import Router from "next/navigation";

const HeaderUser = () => {
    const router = Router.useRouter();
    return (
        <div className="bg-white shadow p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Portal Pelaku Seni</h1>
            <div className="space-x-2">
                <button
                    onClick={() => router.push('/pendaftaran/seniman')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Pengajuan KTA
                </button>
                <button
                    onClick={() => router.push('/pengajuan')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Pengajuan Izin
                </button>   
            </div>
        </div>
    )
};

export default HeaderUser;

