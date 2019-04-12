CREATE DATABASE IF NOT EXISTS annotQDB;
-- CREATE USER 'aqua' IDENTIFIED BY 'aquaDBpw';
-- GRANT ALL PRIVILEGES ON annotQDB.* TO 'aqua'@'%' IDENTIFIED BY 'aquaDBpw';
-- FLUSH PRIVILEGES;

USE annotQDB;

--
-- Table structure for table `seqtype`
--
CREATE TABLE IF NOT EXISTS `seqtype` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `sample`
--
CREATE TABLE IF NOT EXISTS `sample` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `species` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `seqgroup`
--
CREATE TABLE IF NOT EXISTS `seqgroup` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `avlength` float DEFAULT NULL,
  `n50length` int unsigned DEFAULT NULL,
  `maxlength` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `sample_ingroups__seqgroup_fromsamples`
--
CREATE TABLE IF NOT EXISTS `sample_ingroups__seqgroup_fromsamples` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `sample_inGroups` int unsigned NOT NULL,
  `seqgroup_fromSamples` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`sample_inGroups`, `seqgroup_fromSamples`),
  FOREIGN KEY (`sample_inGroups`) REFERENCES sample (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`seqgroup_fromSamples`) REFERENCES seqgroup (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `sequence`
--
CREATE TABLE IF NOT EXISTS `sequence` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `annotNote` varchar(255) DEFAULT NULL,
  `length` int unsigned DEFAULT NULL,
  `belongsGroup` int unsigned NOT NULL,
  `isSample` int unsigned NOT NULL,
  `isType` int unsigned NOT NULL,
  `extLink` varchar(255) DEFAULT NULL,
  `extLinkLabel` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  FOREIGN KEY (`belongsGroup`) REFERENCES seqgroup (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`isSample`) REFERENCES sample (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`isType`) REFERENCES seqtype (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `seqstring`
--
CREATE TABLE IF NOT EXISTS `seqstring` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fromSeq` int unsigned NOT NULL,
  `theString` longtext NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`fromSeq`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `seqrelation`
--
CREATE TABLE IF NOT EXISTS `seqrelation` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `parentSeq` int unsigned NOT NULL,
  `childSeq` int unsigned NOT NULL,
  `strand` tinyint(1) DEFAULT NULL,
  `pStart` int unsigned NOT NULL,
  `pEnd` int unsigned NOT NULL,
  `cStart` int unsigned NOT NULL,
  `cEnd` int unsigned NOT NULL,
  `method` varchar(255) DEFAULT NULL,
  `score` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`parentSeq`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`childSeq`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX (`parentSeq`, `pStart`, `pEnd`),
  INDEX (`childSeq`, `cStart`, `cEnd`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `seqrelpart`
--
CREATE TABLE IF NOT EXISTS `seqrelpart` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fromSeqRel` int unsigned NOT NULL,
  `pStart` int unsigned NOT NULL,
  `pEnd` int unsigned NOT NULL,
  `cStart` int unsigned NOT NULL,
  `cEnd` int unsigned NOT NULL,
  `strand` tinyint(1) DEFAULT NULL,
  `score` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`fromSeqRel`) REFERENCES seqrelation (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `alignedannot`
--
CREATE TABLE IF NOT EXISTS `alignedannot` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `onSequence` int unsigned NOT NULL,
  `start` int unsigned NOT NULL,
  `end` int unsigned NOT NULL,
  `strand` tinyint(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `annotation` varchar(255) DEFAULT NULL,
  `species` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `score` varchar(255) DEFAULT NULL,
  `belongsGroup` int unsigned DEFAULT NULL,
  `isSample` int unsigned DEFAULT NULL,
  `isSequence` int unsigned DEFAULT NULL,
  FOREIGN KEY (`onSequence`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`isSequence`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (`belongsGroup`) REFERENCES seqgroup (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (`isSample`) REFERENCES sample (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  PRIMARY KEY (`id`),
  INDEX (`onSequence`, `start`, `end`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `alignpart`
--
CREATE TABLE IF NOT EXISTS `alignpart` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fromAlignment` int unsigned NOT NULL,
  `start` int unsigned NOT NULL,
  `end` int unsigned NOT NULL,
  `strand` tinyint(1) DEFAULT NULL,
  `score` varchar(255) DEFAULT NULL,
  FOREIGN KEY (`fromAlignment`) REFERENCES alignedannot (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `geneprediction`
--
CREATE TABLE IF NOT EXISTS `geneprediction` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `onSequence` int unsigned NOT NULL,
  `start` int unsigned NOT NULL,
  `end` int unsigned NOT NULL,
  `strand` tinyint(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `score` float DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `isCdsSequence` int unsigned DEFAULT NULL,
  `isProtSequence` int unsigned DEFAULT NULL,
  FOREIGN KEY (`onSequence`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`isCdsSequence`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (`isProtSequence`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  PRIMARY KEY (`id`),
  INDEX (`onSequence`, `start`, `end`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `genepart`
--
CREATE TABLE IF NOT EXISTS `genepart` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fromGenePred` int unsigned NOT NULL,
  `start` int unsigned NOT NULL,
  `end` int unsigned NOT NULL,
  `strand` tinyint(1) DEFAULT NULL,
  `partType` varchar(255) DEFAULT NULL,
  `readingFrame` int unsigned DEFAULT NULL,
  `score` float DEFAULT NULL,
  FOREIGN KEY (`fromGenePred`) REFERENCES geneprediction (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `repeatannot`
--
CREATE TABLE IF NOT EXISTS `repeatannot` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `onSequence` int unsigned NOT NULL,
  `start` int unsigned NOT NULL,
  `end` int unsigned NOT NULL,
  `strand` tinyint(1) DEFAULT NULL,
  `annotation` varchar(255) NOT NULL,
  `method` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`onSequence`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `alignerrun`
--
CREATE TABLE IF NOT EXISTS `alignerrun` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `software` varchar(255) NOT NULL,
  `version` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `inputs` varchar(255) DEFAULT NULL,
  `parameters` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `window`
--
CREATE TABLE IF NOT EXISTS `window` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `onSequence` int unsigned NOT NULL,
  `winStart` int unsigned NOT NULL,
  `winEnd` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`onSequence`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX (`onSequence`, `winStart`, `winEnd`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `readsinwindow`
--
CREATE TABLE IF NOT EXISTS `readsinwindow` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `isSample` int unsigned NOT NULL,
  `inWindow` int unsigned NOT NULL,
  `readCount` int unsigned NOT NULL,
  `fromAlignerRun` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`inWindow`) REFERENCES window (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`isSample`) REFERENCES sample (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`fromAlignerRun`) REFERENCES alignerrun (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `snp`
--
CREATE TABLE IF NOT EXISTS `snp` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `onSequence` int unsigned NOT NULL,
  `coord` int unsigned NOT NULL,
  `snpBase` varchar(1) NOT NULL,
  `refBase` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`onSequence`) REFERENCES sequence (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX (`onSequence`, `coord`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `readsonsnp`
--
CREATE TABLE IF NOT EXISTS `readsonsnp` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `isSample` int unsigned NOT NULL,
  `onSNP` int unsigned NOT NULL,
  `readsMatchSNP` int unsigned NOT NULL,
  `readsNotSNP` int unsigned NOT NULL,
  `fromAlignerRun` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`onSNP`) REFERENCES snp (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`isSample`) REFERENCES sample (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`fromAlignerRun`) REFERENCES alignerrun (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Database project details
--
CREATE TABLE IF NOT EXISTS `project` (
  integrity_keeper ENUM('') NOT NULL PRIMARY KEY,
  `shortTitle` varchar(255) NOT NULL,
  `longTitle` varchar(255) NOT NULL,
  `description` varchar(255),
  `contacts` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Totals table
--
CREATE TABLE IF NOT EXISTS `totals` (
  integrity_keeper ENUM('') NOT NULL PRIMARY KEY,
  `sample` int unsigned NOT NULL,
  `seqgroup` int unsigned NOT NULL,
  `sequence` int unsigned NOT NULL,
  `seqrelation` int unsigned NOT NULL,
  `alignedannot` int unsigned NOT NULL,
  `geneprediction` int unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Run to update totals table
--
INSERT INTO totals 
  (sample, 
  seqgroup, 
  sequence, 
  seqrelation, 
  alignedannot, 
  geneprediction)
VALUES (
  (SELECT COUNT(*) FROM sample ),
  (SELECT COUNT(*) FROM seqgroup ),
  (SELECT COUNT(*) FROM sequence ),
  (SELECT COUNT(*) FROM seqrelation ),
  (SELECT COUNT(*) FROM alignedannot ),
  (SELECT COUNT(*) FROM geneprediction )
);

