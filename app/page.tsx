'use client'; // Wajib ada karena kita pakai useState & useEffect
import { useState, useEffect, FormEvent } from 'react';

interface Ebook {
  id: number;
  judul: string;
  penulis: string;
  harga: number;
}

export default function Home() {
  // --- BAGIAN 1: STATE (Wadah Data) ---
  const [ebooks, setEbooks] = useState<Ebook[]>([]); // Wadah daftar buku
  const [judul, setJudul] = useState('');   // Wadah input judul
  const [penulis, setPenulis] = useState(''); // Wadah input penulis
  const [harga, setHarga] = useState('');     // Wadah input harga

  // --- BAGIAN 2: FUNGSI AMBIL DATA (READ) ---
  async function ambilData() {
    try {
      const respon = await fetch('/api/ebooks'); // Panggil backend GET
      if (!respon.ok) throw new Error('Gagal mengambil data');
      const data = await respon.json(); // Ubah jadi JSON
      setEbooks(data); // Simpan ke wadah state
    } catch (error) {
      console.error('Error mengambil data:', error);
    }
  }

  // Jalankan ambilData sekali saat halaman pertama dibuka
  useEffect(() => {
    ambilData();
  }, []);

  // --- BAGIAN 3: FUNGSI TAMBAH DATA (CREATE) ---
  async function tambahData(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Mencegah halaman refresh sendiri

    try {
      // Kirim data ke Backend pakai POST
      const response = await fetch('/api/ebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: judul,
          penulis: penulis,
          harga: harga
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error dari server:', error);
        alert('Gagal menyimpan buku: ' + error.details);
        return;
      }

      console.log('Buku berhasil disimpan');
      // Setelah kirim, kosongkan form & ambil data terbaru
      setJudul('');
      setPenulis('');
      setHarga('');
      ambilData(); 
    } catch (error) {
      console.error('Error saat mengirim data:', error);
      alert('Gagal menyimpan buku: ' + (error as Error).message);
    }
  }

  // --- BAGIAN 4: TAMPILAN (HTML/JSX) ---
  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>📚 Gudang E-book Saya</h1>

      {/* FORMULIR INPUT */}
      <form onSubmit={tambahData} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <h3>Tambah Buku Baru</h3>
        <input 
          type="text" placeholder="Judul Buku" 
          value={judul} onChange={e => setJudul(e.target.value)}
          required style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <input 
          type="text" placeholder="Nama Penulis" 
          value={penulis} onChange={e => setPenulis(e.target.value)}
          required style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <input 
          type="number" placeholder="Harga (Rp)" 
          value={harga} onChange={e => setHarga(e.target.value)}
          required style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none' }}>
          Simpan Buku
        </button>
      </form>

      {/* DAFTAR BUKU */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {ebooks.map((item) => (
          <div key={item.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', background: '#f9f9f9' }}>
            <h3 style={{ margin: 0 }}>{item.judul}</h3>
            <p style={{ margin: '5px 0' }}>Penulis: {item.penulis}</p>
            <p style={{ fontWeight: 'bold', color: 'green' }}>Rp {item.harga}</p>
          </div>
        ))}
        
        {ebooks.length === 0 && <p>Belum ada buku. Tambahkan dong!</p>}
      </div>
    </div>
  );
}