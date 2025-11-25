-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2025 at 08:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `adoptmeow-kila`
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

--
-- Dumping data for table `adopsi`
--

INSERT INTO `adopsi` (`id_adopsi`, `id_shelter`, `headline`, `lokasi`, `informasi`, `status_verifikasi`, `status_adopsi`, `jenis_kucing`, `jenis_kelamin`, `kondisi_kucing`, `usia`, `foto_adopsi`) VALUES
(3, 1, 'Kucing Oren Lucu', 'Bandung', 'Kucing sehat, aktif, dan jinak', 'Menerima Formulir Adopsi', 'Belum Diadopsi', 1, 1, 1, 2, 'cat1.png'),
(4, 1, 'Kucing Putih Anggora', 'Jakarta', 'Anggora jinak dan cocok untuk rumah', 'Menerima Formulir Adopsi', 'Belum Diadopsi', 3, 2, 1, 1, 'cat2.png');

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
(1, 1, 'Rudi Santoso', 'Pecinta kucing', '081234567890', 'Bandung', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `donasi`
--

CREATE TABLE `donasi` (
  `id_donasi` int(11) NOT NULL,
  `id_shelter` int(11) DEFAULT NULL,
  `headline` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `target_donasi` int(11) DEFAULT NULL,
  `foto_donasi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `nama_kucing` varchar(100) DEFAULT NULL,
  `id_adopter` int(11) NOT NULL,
  `id_jenis_kucing` int(11) DEFAULT NULL,
  `id_jenis_kelamin` int(11) DEFAULT NULL,
  `id_kondisi_kucing` int(11) DEFAULT NULL,
  `id_sifat` int(11) NOT NULL,
  `usia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kucing`
--

INSERT INTO `kucing` (`id_kucing`, `nama_kucing`, `id_adopter`, `id_jenis_kucing`, `id_jenis_kelamin`, `id_kondisi_kucing`, `id_sifat`, `usia`) VALUES
(1, NULL, 1, 1, 1, 1, 1, 2),
(2, NULL, 1, 2, 2, 2, 3, 1),
(3, NULL, 1, 3, 1, 1, 2, 3);

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

--
-- Dumping data for table `kucing_aktivitas`
--

INSERT INTO `kucing_aktivitas` (`id_aktivitas`, `id_kucing`, `judul`, `deskripsi`, `tanggal`, `waktu`, `alarm`) VALUES
(1, 1, 'Kontrol Dokter', 'Cek kesehatan bulanan', '2025-02-20', '10:00:00', 1),
(2, 1, 'Main Laser', 'Aktivitas bermain harian', '2025-02-21', '16:00:00', 0),
(3, 2, 'Mandikan Kucing', 'Mandi rutin 2 minggu sekali', '2025-02-22', '09:30:00', 1),
(4, 3, 'Cukur Bulu', 'Perawatan grooming', '2025-02-25', '14:00:00', 0);

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

--
-- Dumping data for table `kucing_pengingat`
--

INSERT INTO `kucing_pengingat` (`id_pengingat`, `id_kucing`, `judul`, `waktu`, `frekuensi`, `status`) VALUES
(1, 1, 'Makan Pagi', '08:00:00', 'harian', 1),
(2, 1, 'Minum Vitamin', '09:00:00', 'mingguan', 0),
(3, 2, 'Ganti Pasir', '07:30:00', 'harian', 1),
(4, 3, 'Makan Malam', '18:00:00', 'harian', 1);

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
  `nominal` int(11) DEFAULT NULL
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
  `foto` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shelter`
--

INSERT INTO `shelter` (`id_shelter`, `id_user`, `nama_shelter`, `bio`, `phone`, `lokasi`, `foto`) VALUES
(1, 1, 'Shelter kila', 'Shelter percobaan', '08123456789', 'Bandung', 'default-shelter.png');

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
(1, 'tes@123', 'tes@123', '$2b$10$OdkKP2hxP7aS8ltpzj5Nw.hs1FmbflZSsUWKseaYFs.pzO9cOAJMi', 'adopter');

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
-- Dumping data for table `user_point_history`
--

INSERT INTO `user_point_history` (`id_history`, `id_user`, `id_poin`, `deskripsi`, `poin`, `tanggal`) VALUES
(1, 1, 1, 'Melakukan donasi ke shelter A', 50, '2025-11-24 12:28:04'),
(2, 1, 2, 'Berhasil mengadopsi kucing', 150, '2025-11-24 12:28:04'),
(3, 1, 3, 'Melapor kucing membutuhkan bantuan', 100, '2025-11-24 12:28:04'),
(4, 1, 1, 'Donasi kedua ke shelter B', 50, '2025-11-24 12:28:04'),
(5, 1, 3, 'Melapor kucing terlantar', 100, '2025-11-24 12:28:04');

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
-- Dumping data for table `user_point_total`
--

INSERT INTO `user_point_total` (`id_user`, `total_poin`) VALUES
(1, 450);

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
  ADD KEY `id_metode` (`id_metode`);

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
  MODIFY `id_adopsi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `adopter`
--
ALTER TABLE `adopter`
  MODIFY `id_adopter` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `donasi`
--
ALTER TABLE `donasi`
  MODIFY `id_donasi` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_kucing` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kucing_aktivitas`
--
ALTER TABLE `kucing_aktivitas`
  MODIFY `id_aktivitas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kucing_pengingat`
--
ALTER TABLE `kucing_pengingat`
  MODIFY `id_pengingat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lapor`
--
ALTER TABLE `lapor`
  MODIFY `id_lapor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id_shelter` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sifat_kucing`
--
ALTER TABLE `sifat_kucing`
  MODIFY `id_sifat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_point_history`
--
ALTER TABLE `user_point_history`
  MODIFY `id_history` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  ADD CONSTRAINT `fk_kucing_adopter` FOREIGN KEY (`id_adopter`) REFERENCES `adopter` (`id_adopter`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kucing_jenis` FOREIGN KEY (`id_jenis_kucing`) REFERENCES `jenis_kucing` (`id_jenis_kucing`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kucing_kelamin` FOREIGN KEY (`id_jenis_kelamin`) REFERENCES `jenis_kelamin` (`id_jenis_kelamin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kucing_kondisi` FOREIGN KEY (`id_kondisi_kucing`) REFERENCES `kondisi_kucing` (`id_kondisi_kucing`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kucing_sifat` FOREIGN KEY (`id_sifat`) REFERENCES `sifat_kucing` (`id_sifat`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `fk_bayar_metode` FOREIGN KEY (`id_metode`) REFERENCES `metode_pembayaran` (`id_metode`) ON UPDATE CASCADE;

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
