import { WiFiLocation } from '../types';

export const seedWiFiLocations: Omit<WiFiLocation, 'id' | 'status' | 'lastChecked' | 'createdAt'>[] = [
  {
    nama: "Kantor Pusat Bandung",
    alamat: "Jl. Asia Afrika No. 8, Sumur Bandung, Kota Bandung",
    latitude: -6.9175,
    longitude: 107.6191,
    ipPublik: "203.142.67.10"
  },
  {
    nama: "Cabang Dago",
    alamat: "Jl. Ir. H. Djuanda No. 15, Dago, Coblong, Kota Bandung",
    latitude: -6.8951,
    longitude: 107.6133,
    ipPublik: "203.142.67.11"
  },
  {
    nama: "Cabang Cihampelas",
    alamat: "Jl. Cihampelas No. 160, Cipaganti, Coblong, Kota Bandung",
    latitude: -6.8998,
    longitude: 107.6089,
    ipPublik: "203.142.67.12"
  },
  {
    nama: "Cabang Pasteur",
    alamat: "Jl. Dr. Djunjunan No. 143, Pasteur, Sukajadi, Kota Bandung",
    latitude: -6.8876,
    longitude: 107.5707,
    ipPublik: "203.142.67.13"
  },
  {
    nama: "Cabang Setiabudhi",
    alamat: "Jl. Dr. Setiabudhi No. 229, Isola, Sukasari, Kota Bandung",
    latitude: -6.8719,
    longitude: 107.5914,
    ipPublik: "203.142.67.14"
  },
  {
    nama: "Cabang Buah Batu",
    alamat: "Jl. Buah Batu No. 212, Cijagra, Lengkong, Kota Bandung",
    latitude: -6.9434,
    longitude: 107.6321,
    ipPublik: "203.142.67.15"
  },
  {
    nama: "Cabang Antapani",
    alamat: "Jl. Terusan Jakarta No. 88, Antapani Tengah, Antapani, Kota Bandung",
    latitude: -6.9147,
    longitude: 107.6516,
    ipPublik: "203.142.67.16"
  },
  {
    nama: "Cabang Cicendo",
    alamat: "Jl. Pajajaran No. 52, Pamoyanan, Cicendo, Kota Bandung",
    latitude: -6.9039,
    longitude: 107.5986,
    ipPublik: "203.142.67.17"
  },
  {
    nama: "Cabang Dipatiukur",
    alamat: "Jl. Dipatiukur No. 35, Lebakgede, Coblong, Kota Bandung",
    latitude: -6.8947,
    longitude: 107.6063,
    ipPublik: "203.142.67.18"
  },
  {
    nama: "Cabang Kopo",
    alamat: "Jl. Kopo Permai Raya No. 1, Situsaeur, Bojongloa Kidul, Kota Bandung",
    latitude: -6.9647,
    longitude: 107.5654,
    ipPublik: "203.142.67.19"
  }
];