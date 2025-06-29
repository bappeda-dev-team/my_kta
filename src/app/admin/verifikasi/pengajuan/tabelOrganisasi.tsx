const TabelOrganisasi = () => {
  return (
    <div className="overflow-x-auto">
      <p>table organisasi</p>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">No</th>
            <th className="py-2 px-4 border-b">Nama</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* Data rows will be populated here */}
        </tbody>
      </table>
    </div>
  );
}
export default TabelOrganisasi;