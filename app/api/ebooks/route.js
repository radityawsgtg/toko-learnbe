// app/api/ebooks/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Panggil si Asisten Database

// 1. FUNGSI GET (Untuk Mengambil Data)
// Diakses saat Frontend minta daftar buku
export async function GET() {
  // Suruh prisma ambil SEMUA data di tabel 'ebook'
  const semuaEbook = await prisma.ebook.findMany();
  
  // Kirim hasilnya ke Frontend dalam bentuk JSON
  return NextResponse.json(semuaEbook);
}

// 2. FUNGSI POST (Untuk Menambah Data)
// Diakses saat Frontend kirim data buku baru
export async function POST(request) {
  try {
    // Baca data yang dikirim oleh Frontend
    const body = await request.json(); 
    // Isinya misal: { judul: "Belajar Nextjs", penulis: "Budi", harga: 50000 }
    
    console.log('Menerima data:', body);

    // Suruh prisma BUAT data baru
    const ebookBaru = await prisma.ebook.create({
      data: {
        judul: body.judul,
        penulis: body.penulis,
        harga: parseInt(body.harga) // Pastikan harga jadi angka (integer)
      }
    });

    console.log('Data berhasil disimpan:', ebookBaru);
    // Kirim balasan: "Oke, data berhasil dibuat!"
    return NextResponse.json(ebookBaru, { status: 201 });
  } catch (error) {
    console.error('Error saat menyimpan data:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan data', details: error.message },
      { status: 500 }
    );
  }
}