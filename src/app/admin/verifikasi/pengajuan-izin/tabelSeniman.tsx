const TabelSeniman = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">No</th>
            <th className="py-2 px-4 border-b">Nama</th>
            <th className="py-2 px-4 border-b">Tempat, Tanggal Lahir</th>
            <th className="py-2 px-4 border-b">Jenis Kelamin</th>
            <th className="py-2 px-4 border-b">Alamat</th>
            <th className="py-2 px-4 border-b">Jenis Profesi</th>
            <th className="py-2 px-4 border-b">Verifikasi</th>
          </tr>
        </thead>
        <tbody>
          {/* Data rows will be populated here */}
        </tbody>
      </table>
    </div>
  );
}
export default TabelSeniman;