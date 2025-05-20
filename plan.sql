-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 12:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12


-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS `plan`;

-- Utilisation de la base de données
USE `plan`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `plan`
--

-- --------------------------------------------------------

--
-- Table structure for table `besoin`
--

CREATE TABLE `besoin` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantite` int(11) NOT NULL,
  `satisfait` bit(1) NOT NULL,
  `type` varchar(255) NOT NULL,
  `unite` varchar(255) NOT NULL,
  `fournisseur_id` bigint(20) DEFAULT NULL,
  `projet_id` bigint(20) NOT NULL,
  `date_besoin` date NOT NULL,
  `priorite` varchar(255) NOT NULL,
  `statut` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `besoin`
--

INSERT INTO `besoin` (`id`, `description`, `quantite`, `satisfait`, `type`, `unite`, `fournisseur_id`, `projet_id`, `date_besoin`, `priorite`, `statut`) VALUES
(3, 'Ciment Portland', 5000, b'0', 'Matériau', 'Sac', 4, 38, '2025-06-15', 'Haute', 'En attente'),
(4, 'Semences de blé', 1500, b'1', 'Agricole', 'Kg', 5, 39, '2025-05-01', 'Moyenne', 'Livré'),
(5, 'Portes et fenêtres', 200, b'0', 'Construction', 'Unité', 6, 40, '2025-06-10', 'Haute', 'En cours'),
(6, 'Présentoirs', 50, b'0', 'Équipement', 'Unité', 7, 41, '2025-07-20', 'Moyenne', 'En attente'),
(7, 'Matelas hôteliers', 100, b'1', 'Mobilier', 'Unité', 8, 42, '2025-06-05', 'Basse', 'Livré'),
(8, 'Foreuses industrielles', 5, b'0', 'Équipement', 'Unité', 9, 43, '2025-08-15', 'Haute', 'En cours'),
(9, 'Kit de reboisement', 2000, b'1', 'Environnement', 'Unité', 10, 44, '2025-05-30', 'Moyenne', 'Livré'),
(10, 'Grues portuaires', 2, b'0', 'Équipement lourd', 'Unité', 11, 45, '2025-09-01', 'Haute', 'En attente'),
(11, 'Serveurs informatiques', 10, b'1', 'Informatique', 'Unité', 12, 46, '2025-04-15', 'Haute', 'Livré'),
(12, 'Convoyeurs automatisés', 15, b'0', 'Équipement', 'Mètre', 13, 47, '2025-07-10', 'Moyenne', 'En cours');

-- --------------------------------------------------------

--
-- Table structure for table `employe`
--

CREATE TABLE `employe` (
  `id` bigint(20) NOT NULL,
  `date_embauche` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `fonction` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `numero_telephone` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `taux_journalier` double NOT NULL,
  `projet_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employe`
--

INSERT INTO `employe` (`id`, `date_embauche`, `email`, `fonction`, `nom`, `numero_telephone`, `prenom`, `taux_journalier`, `projet_id`) VALUES
(22, '2024-05-10', 'rachid.elhadri@mail.com', 'Ingénieur civil', 'El Hadri', '0661234567', 'Rachid', 800, 39),
(23, '2024-06-15', 'amal.kaddouri@mail.com', 'Agronome', 'Kaddouri', '0662345678', 'Amal', 650, 39),
(24, '2024-03-20', 'hamid.taoufik@mail.com', 'Architecte', 'Taoufik', '0663456789', 'Hamid', 750, 40),
(25, '2024-07-05', 'sara.moutawakil@mail.com', 'Responsable marketing', 'Moutawakil', '0664567890', 'Sara', 700, 41),
(26, '2024-04-12', 'kamal.ouazzani@mail.com', 'Directeur hôtelier', 'Ouazzani', '0665678901', 'Kamal', 900, 42),
(27, '2024-08-01', 'souad.bennani@mail.com', 'Ingénieure des mines', 'Bennani', '0666789012', 'Souad', 850, 43),
(28, '2024-09-15', 'younes.lahlou@mail.com', 'Biologiste', 'Lahlou', '0667890123', 'Younes', 600, 44),
(29, '2024-02-28', 'jamila.sekkat@mail.com', 'Ingénieure maritime', 'Sekkat', '0668901234', 'Jamila', 820, 45),
(30, '2024-05-25', 'mehdi.berrada@mail.com', 'Développeur informatique', 'Berrada', '0669012345', 'Mehdi', 780, 46),
(31, '2024-07-18', 'houda.mansouri@mail.com', 'Responsable logistique', 'Mansouri', '0660123456', 'Houda', 720, 47),
(32, '2025-05-19', 'w2@gmail.com', 'tt', 'tt', '0000', 'tt', 100, 38);

-- --------------------------------------------------------

--
-- Table structure for table `fournisseur`
--

CREATE TABLE `fournisseur` (
  `id` bigint(20) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `type_produit` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fournisseur`
--

INSERT INTO `fournisseur` (`id`, `adresse`, `email`, `nom`, `telephone`, `type_produit`) VALUES
(4, 'Zone industrielle, Casablanca', 'contact@materiaux-pro.ma', 'Matériaux Pro', '0522123456', 'Matériaux de construction'),
(5, 'Quartier industriel, Marrakech', 'info@agriseeds.ma', 'AgriSeeds', '0524234567', 'Semences et engrais'),
(6, 'Rue des artisans, Rabat', 'contact@meublesmaroc.ma', 'Meubles Maroc', '0537345678', 'Mobilier et décoration'),
(7, 'Avenue Hassan II, Tanger', 'commercial@equipcom.ma', 'EquipCom', '0539456789', 'Équipements commerciaux'),
(8, 'Boulevard Mohammed V, Agadir', 'reservation@hotelequip.ma', 'HotelEquip', '0528567890', 'Équipements hôteliers'),
(9, 'Zone industrielle, Khouribga', 'ventes@miningtools.ma', 'Mining Tools', '0523678901', 'Équipements miniers'),
(10, 'Centre ville, Ifrane', 'contact@ecoforest.ma', 'EcoForest', '0535789012', 'Matériel forestier'),
(11, 'Port de Tanger Med', 'info@marinequip.ma', 'MarinEquip', '0539890123', 'Équipements maritimes'),
(12, 'Technopole, Rabat', 'sales@techinnovate.ma', 'TechInnovate', '0537901234', 'Équipements informatiques'),
(13, 'Zone logistique, Fès', 'contact@logimove.ma', 'LogiMove', '0535012345', 'Équipements logistiques');

-- --------------------------------------------------------

--
-- Table structure for table `presence`
--

CREATE TABLE `presence` (
  `id` bigint(20) NOT NULL,
  `date` date NOT NULL,
  `motif_absence` varchar(255) DEFAULT NULL,
  `present` bit(1) NOT NULL,
  `employe_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projet`
--

CREATE TABLE `projet` (
  `id` bigint(20) NOT NULL,
  `actif` bit(1) NOT NULL,
  `budget` double DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `responsable` varchar(255) DEFAULT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `zone_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projet`
--

INSERT INTO `projet` (`id`, `actif`, `budget`, `date_debut`, `date_fin`, `description`, `nom`, `responsable`, `statut`, `zone_id`) VALUES
(38, b'1', 1500000, '2025-01-15', '2025-12-31', 'Construction d\'un complexe industriel', 'Projet Alpha', 'Mohamed Alami', 'En cours', 29),
(39, b'1', 2300000, '2025-02-10', '2026-03-15', 'Développement agricole durable', 'Projet Green', 'Fatima Benali', 'En cours', 30),
(40, b'1', 800000, '2025-03-01', '2025-09-30', 'Construction de logements sociaux', 'Habitats pour tous', 'Karim Idrissi', 'En cours', 31),
(41, b'1', 1200000, '2025-01-05', '2025-11-20', 'Centre commercial moderne', 'MarketPlace', 'Samira Tazi', 'En planification', 32),
(42, b'0', 3000000, '2024-11-15', '2025-12-31', 'Complexe hôtelier 5 étoiles', 'Sunset Resort', 'Hassan Benjelloun', 'En attente', 33),
(43, b'1', 4500000, '2025-04-01', '2026-08-31', 'Modernisation des installations minières', 'MineTech', 'Nadia Chaoui', 'En cours', 34),
(44, b'1', 750000, '2025-03-15', '2025-10-15', 'Conservation de la biodiversité', 'Projet Cèdre', 'Omar Alaoui', 'En cours', 35),
(45, b'1', 5000000, '2025-02-01', '2026-04-30', 'Extension du terminal portuaire', 'PortEx', 'Leila Berrada', 'En planification', 36),
(46, b'1', 1800000, '2025-01-20', '2025-07-31', 'Incubateur de startups technologiques', 'TechHub', 'Youssef Ziani', 'En cours', 37),
(47, b'0', 2100000, '2025-05-01', '2026-02-28', 'Centre logistique automatisé', 'LogiCenter', 'Amina Sahraoui', 'En attente', 38);

-- --------------------------------------------------------

--
-- Table structure for table `salaire`
--

CREATE TABLE `salaire` (
  `id` bigint(20) NOT NULL,
  `date_paiement` date NOT NULL,
  `montant` double NOT NULL,
  `nombre_jours_travailles` int(11) NOT NULL,
  `employe_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicule`
--

CREATE TABLE `vehicule` (
  `id` bigint(20) NOT NULL,
  `date_acquisition` date DEFAULT NULL,
  `disponible` bit(1) NOT NULL,
  `etat` varchar(255) NOT NULL,
  `immatriculation` varchar(255) NOT NULL,
  `kilometrage` int(11) DEFAULT NULL,
  `marque` varchar(255) DEFAULT NULL,
  `modele` varchar(255) NOT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `projet_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicule`
--

INSERT INTO `vehicule` (`id`, `date_acquisition`, `disponible`, `etat`, `immatriculation`, `kilometrage`, `marque`, `modele`, `statut`, `type`, `projet_id`) VALUES
(3, '2024-01-15', b'0', 'Bon', 'A-123456', 25000, 'Toyota', 'Hilux', 'En service', 'Pick-up', 38),
(4, '2024-02-20', b'0', 'Excellent', 'B-234567', 12000, 'Renault', 'Kangoo', 'En service', 'Utilitaire', 39),
(5, '2024-03-10', b'0', 'Moyen', 'C-345678', 45000, 'Ford', 'Transit', 'En service', 'Camionnette', 40),
(6, '2024-01-05', b'0', 'Bon', 'D-456789', 30000, 'Peugeot', 'Partner', 'En service', 'Utilitaire', 41),
(7, '2023-11-12', b'0', 'Inconnu', 'E-567890', 60000, 'Mercedes', 'Sprinter', 'En réparation', 'Camion', 39),
(8, '2024-04-18', b'0', 'Excellent', 'F-678901', 18000, 'Volkswagen', 'Amarok', 'En service', 'Pick-up', 42),
(9, '2023-10-25', b'0', 'Bon', 'G-789012', 35000, 'Mitsubishi', 'L200', 'En service', 'Pick-up', 43),
(10, '2024-02-08', b'0', 'Excellent', 'H-890123', 15000, 'Iveco', 'Daily', 'En service', 'Camion', 44),
(11, '2023-12-20', b'0', 'Inconnu', 'I-901234', 50000, 'Fiat', 'Ducato', 'En réparation', 'Utilitaire', 46),
(12, '2024-05-02', b'0', 'Neuf', 'J-012345', 5000, 'Dacia', 'Dokker', 'En service', 'Utilitaire', 45);

-- --------------------------------------------------------

--
-- Table structure for table `zone`
--

CREATE TABLE `zone` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) NOT NULL,
  `localisation` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `superficie` double DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zone`
--

INSERT INTO `zone` (`id`, `description`, `localisation`, `nom`, `superficie`, `type`) VALUES
(29, 'Zone industrielle avec plusieurs entrepôts', 'Nord de Casablanca', 'Zone Industrielle Casablanca', 15000, 'Industrielle'),
(30, 'Zone agricole fertile avec accès à l\'eau', 'Sud de Marrakech', 'Plaine du Haouz', 25000, 'Agricole'),
(31, 'Zone résidentielle en développement', 'Est de Rabat', 'Quartier Résidentiel Rabat', 8000, 'Résidentielle'),
(32, 'Zone commerciale avec centres commerciaux', 'Centre de Tanger', 'Zone Commerciale Tanger', 12000, 'Commerciale'),
(33, 'Zone touristique en bord de mer', 'Agadir', 'Zone Balnéaire Agadir', 5000, 'Touristique'),
(34, 'Zone minière avec extraction de phosphates', 'Khouribga', 'Mines de Khouribga', 30000, 'Minière'),
(35, 'Zone forestière protégée', 'Moyen Atlas', 'Forêt de Cèdres', 40000, 'Forestière'),
(36, 'Zone portuaire avec installations maritimes', 'Port de Tanger Med', 'Port Tanger Med', 6000, 'Portuaire'),
(37, 'Zone technologique avec startups', 'Technopole de Rabat', 'Technopark', 4000, 'Technologique'),
(38, 'Zone logistique avec entrepôts', 'Périphérie de Fès', 'Hub Logistique Fès', 18000, 'Logistique');

-- --------------------------------------------------------

--
-- Table structure for table `_user`
--

CREATE TABLE `_user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('USER','ADMIN') DEFAULT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_user`
--

INSERT INTO `_user` (`id`, `email`, `password`, `role`, `username`) VALUES
(1, 'test@gmail.com', 'test123', 'USER', 'test'),
(4, 'ahouzi@gmail.com', '$2a$10$VdT/3CKJ9tsFwbyAII0cEug3A7KT6Y7iG4HsEtFXWZMR8h9AjOeW2', 'USER', 'ahouzi'),
(6, 'hossam@gmail.com', '$2a$10$5NVp1RV59ALGm87Zfsx.LeC4stkEqqBZ7ttV3y2lEf6dspn9/PCYa', 'USER', 'hossam');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `besoin`
--
ALTER TABLE `besoin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKgh14rkokd3b7wkhgvpldqiw6n` (`fournisseur_id`),
  ADD KEY `FKccsevse8ug4tktdyonujoqq1t` (`projet_id`);

--
-- Indexes for table `employe`
--
ALTER TABLE `employe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKe15oud10yksj5x7dgaf0hjoyx` (`projet_id`);

--
-- Indexes for table `fournisseur`
--
ALTER TABLE `fournisseur`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `presence`
--
ALTER TABLE `presence`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6k5ad3t6cw1p3kxhqwly28n91` (`employe_id`);

--
-- Indexes for table `projet`
--
ALTER TABLE `projet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKomndokgny91qsaubjrcn7shpd` (`zone_id`);

--
-- Indexes for table `salaire`
--
ALTER TABLE `salaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKekwfwvdurx7v77c2xqw971p2f` (`employe_id`);

--
-- Indexes for table `vehicule`
--
ALTER TABLE `vehicule`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_df1le5pjiypx9xuwo5d1w6sfk` (`immatriculation`),
  ADD KEY `FKfykj60qiavirjupbeeacft2hv` (`projet_id`);

--
-- Indexes for table `zone`
--
ALTER TABLE `zone`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `_user`
--
ALTER TABLE `_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_k11y3pdtsrjgy8w9b6q4bjwrx` (`email`),
  ADD UNIQUE KEY `UK_nlcolwbx8ujaen5h0u2kr2bn2` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `besoin`
--
ALTER TABLE `besoin`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `employe`
--
ALTER TABLE `employe`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `fournisseur`
--
ALTER TABLE `fournisseur`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `presence`
--
ALTER TABLE `presence`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `projet`
--
ALTER TABLE `projet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `salaire`
--
ALTER TABLE `salaire`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicule`
--
ALTER TABLE `vehicule`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `zone`
--
ALTER TABLE `zone`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `_user`
--
ALTER TABLE `_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `besoin`
--
ALTER TABLE `besoin`
  ADD CONSTRAINT `FKccsevse8ug4tktdyonujoqq1t` FOREIGN KEY (`projet_id`) REFERENCES `projet` (`id`),
  ADD CONSTRAINT `FKgh14rkokd3b7wkhgvpldqiw6n` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseur` (`id`);

--
-- Constraints for table `employe`
--
ALTER TABLE `employe`
  ADD CONSTRAINT `FKe15oud10yksj5x7dgaf0hjoyx` FOREIGN KEY (`projet_id`) REFERENCES `projet` (`id`);

--
-- Constraints for table `presence`
--
ALTER TABLE `presence`
  ADD CONSTRAINT `FK6k5ad3t6cw1p3kxhqwly28n91` FOREIGN KEY (`employe_id`) REFERENCES `employe` (`id`);

--
-- Constraints for table `projet`
--
ALTER TABLE `projet`
  ADD CONSTRAINT `FKomndokgny91qsaubjrcn7shpd` FOREIGN KEY (`zone_id`) REFERENCES `zone` (`id`);

--
-- Constraints for table `salaire`
--
ALTER TABLE `salaire`
  ADD CONSTRAINT `FKekwfwvdurx7v77c2xqw971p2f` FOREIGN KEY (`employe_id`) REFERENCES `employe` (`id`);

--
-- Constraints for table `vehicule`
--
ALTER TABLE `vehicule`
  ADD CONSTRAINT `FKfykj60qiavirjupbeeacft2hv` FOREIGN KEY (`projet_id`) REFERENCES `projet` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
