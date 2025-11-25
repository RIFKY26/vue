-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2025 at 08:37 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `adoptmeow`
--

-- --------------------------------------------------------

--
-- Table structure for table `adopsi`
--

CREATE TABLE `adopsi` (
  `id_adopsi` int(11) NOT NULL,
  `id_shelter` int(11) NOT NULL,
  `headline` varchar(255) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `informasi` varchar(255) NOT NULL,
  `status_verifikasi` enum('Menerima Formulir Adopsi','Meninjau Formulir Adopsi','Menyetujui Formulir Adopsi','Adopsi Disetujui') NOT NULL DEFAULT 'Menerima Formulir Adopsi',
  `status_adopsi` enum('Belum Diadopsi','Sudah Diadopsi') NOT NULL DEFAULT 'Belum Diadopsi',
  `jenis_kucing` int(11) NOT NULL,
  `jenis_kelamin` int(11) NOT NULL,
  `kondisi_kucing` int(11) NOT NULL,
  `usia` int(11) NOT NULL,
  `foto_adopsi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adopter`
--

CREATE TABLE `adopter` (
  `id_adopter` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `alamat` text DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adopter`
--

INSERT INTO `adopter` (`id_adopter`, `id_user`, `nama`, `bio`, `phone`, `alamat`, `foto`) VALUES
(1, 1, 'Shakila Aulia', NULL, '0812345', NULL, ''),
(2, 4, 'nisrina', 'Pecinta Kucing', '081234', 'KPAD', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `donasi`
--

CREATE TABLE `donasi` (
  `id_donasi` int(11) NOT NULL,
  `id_shelter` int(11) DEFAULT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `target_donasi` int(11) DEFAULT NULL,
  `terkumpul` int(11) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donasi`
--

INSERT INTO `donasi` (`id_donasi`, `id_shelter`, `judul`, `deskripsi`, `target_donasi`, `terkumpul`, `foto`, `created_at`) VALUES
(1, 1, 'Bantu Kucing Pasar', 'Kucing-kucing di pasar membutuhkan makanan dan sterilisasi.', 5000000, 1500000, 'default-donasi.png', '2025-11-24 13:56:40'),
(2, 2, 'Operasi Kaki Si Belang', 'Si Belang tertabrak dan butuh operasi segera.', 2000000, 500000, 'default-donasi.png', '2025-11-24 13:56:40');

-- --------------------------------------------------------

--
-- Table structure for table `jenis_kelamin`
--

CREATE TABLE `jenis_kelamin` (
  `id_jenis_kelamin` int(11) NOT NULL,
  `jenis_kelamin` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jenis_kelamin`
--

INSERT INTO `jenis_kelamin` (`id_jenis_kelamin`, `jenis_kelamin`) VALUES
(1, 'Jantan'),
(2, 'Betina');

-- --------------------------------------------------------

--
-- Table structure for table `jenis_kucing`
--

CREATE TABLE `jenis_kucing` (
  `id_jenis_kucing` int(11) NOT NULL,
  `jenis_kucing` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jenis_kucing`
--

INSERT INTO `jenis_kucing` (`id_jenis_kucing`, `jenis_kucing`) VALUES
(1, 'Domestik'),
(2, 'Persia'),
(3, 'Anggora'),
(4, 'Siam');

-- --------------------------------------------------------

--
-- Table structure for table `kondisi_kucing`
--

CREATE TABLE `kondisi_kucing` (
  `id_kondisi_kucing` int(11) NOT NULL,
  `kondisi_kucing` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kondisi_kucing`
--

INSERT INTO `kondisi_kucing` (`id_kondisi_kucing`, `kondisi_kucing`) VALUES
(1, 'Sehat'),
(2, 'Sakit'),
(3, 'Terluka'),
(4, 'Dalam Perawatan');

-- --------------------------------------------------------

--
-- Table structure for table `kucing`
--

CREATE TABLE `kucing` (
  `id_kucing` int(11) NOT NULL,
  `id_adopter` int(11) NOT NULL,
  `id_jenis_kucing` int(11) DEFAULT NULL,
  `id_jenis_kelamin` int(11) DEFAULT NULL,
  `id_kondisi_kucing` int(11) DEFAULT NULL,
  `id_sifat` int(11) NOT NULL,
  `nama_kucing` varchar(255) NOT NULL,
  `usia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kucing_aktivitas`
--

CREATE TABLE `kucing_aktivitas` (
  `id_aktivitas` int(11) NOT NULL,
  `id_kucing` int(11) NOT NULL,
  `judul` varchar(100) DEFAULT NULL,
  `deskripsi` varchar(200) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `waktu` time DEFAULT NULL,
  `alarm` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kucing_pengingat`
--

CREATE TABLE `kucing_pengingat` (
  `id_pengingat` int(11) NOT NULL,
  `id_kucing` int(11) NOT NULL,
  `judul` varchar(100) DEFAULT NULL,
  `waktu` time DEFAULT NULL,
  `frekuensi` enum('harian','mingguan') DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lapor`
--

CREATE TABLE `lapor` (
  `id_lapor` int(11) NOT NULL,
  `jenis_kucing` int(11) NOT NULL,
  `jenis_kelamin` int(11) NOT NULL,
  `kondisi_kucing` int(11) NOT NULL,
  `usia` int(11) NOT NULL,
  `id_shelter` int(11) DEFAULT NULL,
  `id_adopter` int(11) NOT NULL,
  `headline` varchar(255) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `deskripsi` varchar(255) NOT NULL,
  `status_lapor` enum('Menunggu Tindakan','Dalam Penanganan','Sudah Diselamatkan') NOT NULL DEFAULT 'Menunggu Tindakan',
  `foto_lapor` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lapor`
--

INSERT INTO `lapor` (`id_lapor`, `jenis_kucing`, `jenis_kelamin`, `kondisi_kucing`, `usia`, `id_shelter`, `id_adopter`, `headline`, `lokasi`, `deskripsi`, `status_lapor`, `foto_lapor`) VALUES
(1, 1, 1, 1, 2, NULL, 1, 'Kucing Liar Butuh Pertolongan', 'Jl. Sukajadi No. 45, Bandung', 'Ditemukan kucing oren dengan kondisi lemas di depan minimarket. Sepertinya belum makan berhari-hari.', 'Menunggu Tindakan', 'default-cat.png'),
(2, 1, 2, 1, 3, NULL, 1, 'Tes', 'Utama, Cimahi, West Java, Java, 40534, Indonesia', 'Yang bener', 'Menunggu Tindakan', 'lapor-1763968122373.png');

-- --------------------------------------------------------

--
-- Table structure for table `metode_pembayaran`
--

CREATE TABLE `metode_pembayaran` (
  `id_metode` int(11) NOT NULL,
  `metode_pembayaran` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `metode_pembayaran`
--

INSERT INTO `metode_pembayaran` (`id_metode`, `metode_pembayaran`) VALUES
(1, 'Transfer Bank'),
(2, 'E-Wallet'),
(3, 'QRIS');

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran_donasi`
--

CREATE TABLE `pembayaran_donasi` (
  `id_pembayaran` int(11) NOT NULL,
  `id_adopter` int(11) DEFAULT NULL,
  `id_metode` int(11) DEFAULT NULL,
  `id_donasi` int(11) NOT NULL,
  `nominal` int(11) DEFAULT NULL,
  `nama_donatur` varchar(100) DEFAULT 'Anonim',
  `pesan` text DEFAULT NULL,
  `tanggal_bayar` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengajuan_adopsi`
--

CREATE TABLE `pengajuan_adopsi` (
  `id_pengajuan` int(10) NOT NULL,
  `id_adopsi` int(10) NOT NULL,
  `id_adopter` int(11) NOT NULL,
  `merawat` enum('Pernah','Belum') NOT NULL,
  `penghasilan` enum('Cukup','Tidak') NOT NULL,
  `waktu_luang` enum('Ada','Tidak') NOT NULL,
  `alasan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `poin`
--

CREATE TABLE `poin` (
  `id_poin` int(11) NOT NULL,
  `nama_poin` varchar(100) DEFAULT NULL,
  `jumlah_poin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `poin`
--

INSERT INTO `poin` (`id_poin`, `nama_poin`, `jumlah_poin`) VALUES
(1, 'Donasi', 50),
(2, 'Adopsi', 150),
(3, 'Lapor', 100);

-- --------------------------------------------------------

--
-- Table structure for table `shelter`
--

CREATE TABLE `shelter` (
  `id_shelter` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `nama_shelter` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `lokasi` text DEFAULT NULL,
  `foto` varchar(100) DEFAULT 'default.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shelter`
--

INSERT INTO `shelter` (`id_shelter`, `id_user`, `nama_shelter`, `bio`, `phone`, `lokasi`, `foto`) VALUES
(1, 2, 'Shelter Berkah Abadi', 'Shelter amanah', '0812343', 'Jakarta Utara', 'default.png'),
(2, 3, 'CatLoverz', 'Shelter sayang kucing', '085423123', 'Bandung', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sifat_kucing`
--

CREATE TABLE `sifat_kucing` (
  `id_sifat` int(11) NOT NULL,
  `sifat` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sifat_kucing`
--

INSERT INTO `sifat_kucing` (`id_sifat`, `sifat`) VALUES
(1, 'Manja'),
(2, 'Galak'),
(3, 'Pemalas'),
(4, 'Aktif'),
(5, 'Penakut'),
(6, 'Kalem'),
(7, 'Cuek'),
(8, 'Cerdas'),
(9, 'Berisik');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `username`, `email`, `password`, `role`) VALUES
(1, 'tes@123', 'tes@123', '$2b$10$OdkKP2hxP7aS8ltpzj5Nw.hs1FmbflZSsUWKseaYFs.pzO9cOAJMi', 'adopter'),
(2, 'shelter@123', 'shelter@123', '$2b$10$OdkKP2hxP7aS8ltpzj5Nw.hs1FmbflZSsUWKseaYFs.pzO9cOAJMi', 'shelter'),
(3, 'shelter2@123', 'shelter2@123', '$2b$10$OdkKP2hxP7aS8ltpzj5Nw.hs1FmbflZSsUWKseaYFs.pzO9cOAJMi', 'shelter'),
(4, 'user2@123', 'user2@123', '$2b$10$3KXoSV4fVOvBcFEdkDm34.xM43LAlAEZ.mUrqotTqjEfFh.m8gsCm', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `user_point_history`
--

CREATE TABLE `user_point_history` (
  `id_history` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_poin` int(11) NOT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `poin` int(11) NOT NULL,
  `tanggal` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `user_point_history`
--
DELIMITER $$
CREATE TRIGGER `tambah_poin_otomatis` AFTER INSERT ON `user_point_history` FOR EACH ROW BEGIN
    DECLARE nilai_poin INT;
    SELECT `jumlah_poin` INTO nilai_poin FROM `poin` WHERE `id_poin` = NEW.id_poin;
    INSERT INTO `user_point_total` (`id_user`, `total_poin`)
    VALUES (NEW.id_user, nilai_poin)
    ON DUPLICATE KEY UPDATE `total_poin` = `total_poin` + nilai_poin;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `user_point_total`
--

CREATE TABLE `user_point_total` (
  `id_user` int(11) NOT NULL,
  `total_poin` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adopsi`
--
ALTER TABLE `adopsi`
  ADD PRIMARY KEY (`id_adopsi`),
  ADD KEY `id_shelter` (`id_shelter`),
  ADD KEY `jenis_kucing` (`jenis_kucing`),
  ADD KEY `jenis_kelamin` (`jenis_kelamin`),
  ADD KEY `kondisi_kucing` (`kondisi_kucing`);

--
-- Indexes for table `adopter`
--
ALTER TABLE `adopter`
  ADD PRIMARY KEY (`id_adopter`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `donasi`
--
ALTER TABLE `donasi`
  ADD PRIMARY KEY (`id_donasi`),
  ADD KEY `id_shelter` (`id_shelter`);

--
-- Indexes for table `jenis_kelamin`
--
ALTER TABLE `jenis_kelamin`
  ADD PRIMARY KEY (`id_jenis_kelamin`);

--
-- Indexes for table `jenis_kucing`
--
ALTER TABLE `jenis_kucing`
  ADD PRIMARY KEY (`id_jenis_kucing`);

--
-- Indexes for table `kondisi_kucing`
--
ALTER TABLE `kondisi_kucing`
  ADD PRIMARY KEY (`id_kondisi_kucing`);

--
-- Indexes for table `kucing`
--
ALTER TABLE `kucing`
  ADD PRIMARY KEY (`id_kucing`),
  ADD KEY `id_jenis_kucing` (`id_jenis_kucing`),
  ADD KEY `id_jenis_kelamin` (`id_jenis_kelamin`),
  ADD KEY `id_kondisi_kucing` (`id_kondisi_kucing`),
  ADD KEY `id_sifat` (`id_sifat`),
  ADD KEY `id_adopter` (`id_adopter`);

--
-- Indexes for table `kucing_aktivitas`
--
ALTER TABLE `kucing_aktivitas`
  ADD PRIMARY KEY (`id_aktivitas`),
  ADD KEY `fk_aktivitas_kucing` (`id_kucing`);

--
-- Indexes for table `kucing_pengingat`
--
ALTER TABLE `kucing_pengingat`
  ADD PRIMARY KEY (`id_pengingat`),
  ADD KEY `fk_pengingat_kucing` (`id_kucing`);

--
-- Indexes for table `lapor`
--
ALTER TABLE `lapor`
  ADD PRIMARY KEY (`id_lapor`),
  ADD KEY `id_shelter` (`id_shelter`),
  ADD KEY `id_adopter` (`id_adopter`),
  ADD KEY `fk_lapor_jenis` (`jenis_kucing`),
  ADD KEY `fk_lapor_kelamin` (`jenis_kelamin`),
  ADD KEY `fk_lapor_kondisi` (`kondisi_kucing`);

--
-- Indexes for table `metode_pembayaran`
--
ALTER TABLE `metode_pembayaran`
  ADD PRIMARY KEY (`id_metode`);

--
-- Indexes for table `pembayaran_donasi`
--
ALTER TABLE `pembayaran_donasi`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD KEY `id_adopter` (`id_adopter`),
  ADD KEY `id_metode` (`id_metode`),
  ADD KEY `id_donasi` (`id_donasi`);

--
-- Indexes for table `pengajuan_adopsi`
--
ALTER TABLE `pengajuan_adopsi`
  ADD PRIMARY KEY (`id_pengajuan`),
  ADD KEY `id_adopsi` (`id_adopsi`),
  ADD KEY `id_adopter` (`id_adopter`);

--
-- Indexes for table `poin`
--
ALTER TABLE `poin`
  ADD PRIMARY KEY (`id_poin`);

--
-- Indexes for table `shelter`
--
ALTER TABLE `shelter`
  ADD PRIMARY KEY (`id_shelter`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `sifat_kucing`
--
ALTER TABLE `sifat_kucing`
  ADD PRIMARY KEY (`id_sifat`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `user_point_history`
--
ALTER TABLE `user_point_history`
  ADD PRIMARY KEY (`id_history`),
  ADD KEY `fk_history_user` (`id_user`),
  ADD KEY `fk_history_poin` (`id_poin`);

--
-- Indexes for table `user_point_total`
--
ALTER TABLE `user_point_total`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `fk_total_user` (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adopsi`
--
ALTER TABLE `adopsi`
  MODIFY `id_adopsi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adopter`
--
ALTER TABLE `adopter`
  MODIFY `id_adopter` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `donasi`
--
ALTER TABLE `donasi`
  MODIFY `id_donasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jenis_kelamin`
--
ALTER TABLE `jenis_kelamin`
  MODIFY `id_jenis_kelamin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jenis_kucing`
--
ALTER TABLE `jenis_kucing`
  MODIFY `id_jenis_kucing` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kondisi_kucing`
--
ALTER TABLE `kondisi_kucing`
  MODIFY `id_kondisi_kucing` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kucing`
--
ALTER TABLE `kucing`
  MODIFY `id_kucing` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kucing_aktivitas`
--
ALTER TABLE `kucing_aktivitas`
  MODIFY `id_aktivitas` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kucing_pengingat`
--
ALTER TABLE `kucing_pengingat`
  MODIFY `id_pengingat` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lapor`
--
ALTER TABLE `lapor`
  MODIFY `id_lapor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `metode_pembayaran`
--
ALTER TABLE `metode_pembayaran`
  MODIFY `id_metode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pembayaran_donasi`
--
ALTER TABLE `pembayaran_donasi`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengajuan_adopsi`
--
ALTER TABLE `pengajuan_adopsi`
  MODIFY `id_pengajuan` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `poin`
--
ALTER TABLE `poin`
  MODIFY `id_poin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `shelter`
--
ALTER TABLE `shelter`
  MODIFY `id_shelter` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sifat_kucing`
--
ALTER TABLE `sifat_kucing`
  MODIFY `id_sifat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_point_history`
--
ALTER TABLE `user_point_history`
  MODIFY `id_history` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adopsi`
--
ALTER TABLE `adopsi`
  ADD CONSTRAINT `fk_adopsi_jenis` FOREIGN KEY (`jenis_kucing`) REFERENCES `jenis_kucing` (`id_jenis_kucing`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_adopsi_kelamin` FOREIGN KEY (`jenis_kelamin`) REFERENCES `jenis_kelamin` (`id_jenis_kelamin`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_adopsi_kondisi` FOREIGN KEY (`kondisi_kucing`) REFERENCES `kondisi_kucing` (`id_kondisi_kucing`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_adopsi_shelter` FOREIGN KEY (`id_shelter`) REFERENCES `shelter` (`id_shelter`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `adopter`
--
ALTER TABLE `adopter`
  ADD CONSTRAINT `fk_adopter_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `donasi`
--
ALTER TABLE `donasi`
  ADD CONSTRAINT `fk_donasi_shelter` FOREIGN KEY (`id_shelter`) REFERENCES `shelter` (`id_shelter`) ON UPDATE CASCADE;

--
-- Constraints for table `kucing`
--
ALTER TABLE `kucing`
  ADD CONSTRAINT `fk_kucing_jenis` FOREIGN KEY (`id_jenis_kucing`) REFERENCES `jenis_kucing` (`id_jenis_kucing`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kucing_kelamin` FOREIGN KEY (`id_jenis_kelamin`) REFERENCES `jenis_kelamin` (`id_jenis_kelamin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kucing_kondisi` FOREIGN KEY (`id_kondisi_kucing`) REFERENCES `kondisi_kucing` (`id_kondisi_kucing`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kucing_sifat` FOREIGN KEY (`id_sifat`) REFERENCES `sifat_kucing` (`id_sifat`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `kucing_ibfk_1` FOREIGN KEY (`id_kucing`) REFERENCES `adopter` (`id_adopter`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kucing_aktivitas`
--
ALTER TABLE `kucing_aktivitas`
  ADD CONSTRAINT `fk_aktivitas_kucing` FOREIGN KEY (`id_kucing`) REFERENCES `kucing` (`id_kucing`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kucing_pengingat`
--
ALTER TABLE `kucing_pengingat`
  ADD CONSTRAINT `fk_pengingat_kucing` FOREIGN KEY (`id_kucing`) REFERENCES `kucing` (`id_kucing`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lapor`
--
ALTER TABLE `lapor`
  ADD CONSTRAINT `fk_lapor_adopter` FOREIGN KEY (`id_adopter`) REFERENCES `adopter` (`id_adopter`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lapor_jenis` FOREIGN KEY (`jenis_kucing`) REFERENCES `jenis_kucing` (`id_jenis_kucing`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lapor_kelamin` FOREIGN KEY (`jenis_kelamin`) REFERENCES `jenis_kelamin` (`id_jenis_kelamin`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lapor_kondisi` FOREIGN KEY (`kondisi_kucing`) REFERENCES `kondisi_kucing` (`id_kondisi_kucing`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lapor_shelter` FOREIGN KEY (`id_shelter`) REFERENCES `shelter` (`id_shelter`) ON UPDATE CASCADE;

--
-- Constraints for table `pembayaran_donasi`
--
ALTER TABLE `pembayaran_donasi`
  ADD CONSTRAINT `fk_bayar_adopter` FOREIGN KEY (`id_adopter`) REFERENCES `adopter` (`id_adopter`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bayar_metode` FOREIGN KEY (`id_metode`) REFERENCES `metode_pembayaran` (`id_metode`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pembayaran_donasi_program` FOREIGN KEY (`id_donasi`) REFERENCES `donasi` (`id_donasi`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pengajuan_adopsi`
--
ALTER TABLE `pengajuan_adopsi`
  ADD CONSTRAINT `fk_pengajuan_adopsi` FOREIGN KEY (`id_adopsi`) REFERENCES `adopsi` (`id_adopsi`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pengajuan_adopter` FOREIGN KEY (`id_adopter`) REFERENCES `adopter` (`id_adopter`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shelter`
--
ALTER TABLE `shelter`
  ADD CONSTRAINT `fk_shelter_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `user_point_history`
--
ALTER TABLE `user_point_history`
  ADD CONSTRAINT `fk_history_poin` FOREIGN KEY (`id_poin`) REFERENCES `poin` (`id_poin`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_point_total`
--
ALTER TABLE `user_point_total`
  ADD CONSTRAINT `fk_total_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
