/// Indian States and Districts mapping for FBGL Ministries
/// Used in registration forms and assignment filtering

const Map<String, String> indianStates = {
  'AP': 'Andhra Pradesh',
  'AR': 'Arunachal Pradesh',
  'AS': 'Assam',
  'BR': 'Bihar',
  'CG': 'Chhattisgarh',
  'GA': 'Goa',
  'GJ': 'Gujarat',
  'HR': 'Haryana',
  'HP': 'Himachal Pradesh',
  'JH': 'Jharkhand',
  'KA': 'Karnataka',
  'KL': 'Kerala',
  'MP': 'Madhya Pradesh',
  'MH': 'Maharashtra',
  'MN': 'Manipur',
  'ML': 'Meghalaya',
  'MZ': 'Mizoram',
  'NL': 'Nagaland',
  'OD': 'Odisha',
  'PB': 'Punjab',
  'RJ': 'Rajasthan',
  'SK': 'Sikkim',
  'TN': 'Tamil Nadu',
  'TS': 'Telangana',
  'TR': 'Tripura',
  'UP': 'Uttar Pradesh',
  'UK': 'Uttarakhand',
  'WB': 'West Bengal',
};

const Map<String, List<String>> stateDistricts = {
  'AP': ['ANT', 'CHT', 'EG', 'GUN', 'KAD', 'KRN', 'KUR', 'NLR', 'PKM', 'SPS', 'SRI', 'VIZ', 'VSK', 'WG', 'YSR'],
  'AR': ['TAW', 'WKA', 'EKA', 'PAP', 'KUR', 'LSD', 'LOW', 'NTI', 'CHA', 'UPP', 'WES', 'EAS', 'SIA', 'DIM', 'LHO', 'ANG'],
  'AS': ['BAK', 'BAR', 'BON', 'CHA', 'DAR', 'DHE', 'DHU', 'DIB', 'GOA', 'GOL', 'HAI', 'JOR', 'KAM', 'KAR', 'KOK', 'LAK', 'MOR', 'NAG', 'NAL', 'SIB', 'SON', 'TIN', 'UDA'],
  'BR': ['ARA', 'AUR', 'BAN', 'BEG', 'BHA', 'BHO', 'BUX', 'DAR', 'GAY', 'GOP', 'JAM', 'JEH', 'KAI', 'KAT', 'KHA', 'KIS', 'LAK', 'MAD', 'MUN', 'MUZ', 'NAL', 'NAW', 'PAT', 'PUR', 'ROH', 'SAH', 'SAM', 'SAR', 'SHE', 'SIT', 'SIW', 'SUP', 'VAI', 'WCH'],
  'CG': ['BAL', 'BIL', 'BIS', 'DAN', 'DHA', 'DUR', 'JAG', 'JAS', 'KAN', 'KAW', 'KON', 'KOR', 'MAH', 'MUN', 'NAR', 'RAI', 'RAJ', 'RAG', 'SUR', 'SUK'],
  'GA': ['NGA', 'SGA'],
  'GJ': ['AHM', 'AMR', 'ANA', 'ARV', 'BAN', 'BHA', 'BOT', 'CHH', 'DAH', 'DAN', 'DEV', 'GAN', 'GIR', 'JAM', 'JUN', 'KAC', 'KHE', 'MAH', 'MEH', 'MOR', 'NAR', 'NAV', 'PAN', 'PAT', 'POR', 'RAJ', 'SAB', 'SUR', 'TAP', 'VAD', 'VAL'],
  'HR': ['AMB', 'BHI', 'CHA', 'FAR', 'FAT', 'GUR', 'HIS', 'JHA', 'JIN', 'KAI', 'KAR', 'KUR', 'MAH', 'NUH', 'PAL', 'PAN', 'PAN', 'REW', 'ROH', 'SIR', 'SON', 'YAM'],
  'HP': ['BIL', 'CHA', 'HAM', 'KAN', 'KIN', 'KUL', 'LAH', 'MAN', 'SHI', 'SIR', 'SOL', 'UNA'],
  'JH': ['BOK', 'CHA', 'DEO', 'DHA', 'DUM', 'EAS', 'GAR', 'GIR', 'GOD', 'GUM', 'HAZ', 'JAM', 'KHA', 'KOD', 'LAT', 'LOH', 'PAK', 'PAL', 'RAM', 'RAN', 'SAH', 'SER', 'SIM', 'WES'],
  'KA': ['BAG', 'BLR', 'BLU', 'BEL', 'BID', 'CHA', 'CHK', 'CHT', 'DKA', 'DAV', 'DHA', 'GAD', 'GUL', 'HAS', 'HAV', 'KAL', 'KOD', 'KOL', 'KOP', 'MAN', 'MYS', 'RAI', 'RAM', 'SHI', 'TUM', 'UDU', 'UTK', 'VIJ', 'YAD'],
  'KL': ['ALA', 'ERN', 'IDU', 'KAN', 'KAS', 'KOL', 'KOT', 'KOZ', 'MAL', 'PAL', 'PAT', 'THI', 'THR', 'WAY'],
  'MP': ['AGR', 'ALI', 'ANU', 'ASH', 'BAL', 'BAR', 'BET', 'BHI', 'BHO', 'BUR', 'CHH', 'CHI', 'DAM', 'DAT', 'DEW', 'DHA', 'DIN', 'GUN', 'GWA', 'HAR', 'HOS', 'IND', 'JAB', 'JHA', 'KAT', 'KHA', 'MAN', 'MOR', 'NAR', 'NEE', 'PAN', 'RAI', 'RAJ', 'RAT', 'REW', 'SAG', 'SAT', 'SEH', 'SEO', 'SHA', 'SHE', 'SHI', 'SID', 'SIN', 'TIK', 'UJJ', 'UMA', 'VID'],
  'MH': ['AHM', 'AKO', 'AMR', 'AUR', 'BEE', 'BHA', 'BUL', 'CHA', 'DHL', 'GAD', 'GON', 'HIN', 'JAL', 'JNA', 'KOL', 'LAT', 'MUM', 'NAG', 'NAN', 'NAS', 'OSM', 'PAL', 'PAR', 'PUN', 'RAI', 'RAT', 'SAN', 'SAT', 'SIN', 'SOL', 'THA', 'WAR', 'WAS', 'YAV'],
  'MN': ['BIS', 'CHA', 'CHU', 'IMP', 'JIR', 'KAK', 'KAN', 'SEH', 'TAM', 'TEN', 'THO', 'UKH'],
  'ML': ['EGA', 'EKH', 'JAI', 'RIB', 'SGH', 'WGA', 'WJH', 'WKH'],
  'MZ': ['AIZ', 'CHA', 'KOL', 'LAW', 'LUN', 'MAM', 'SAI', 'SER'],
  'NL': ['DIM', 'KIP', 'KOH', 'LON', 'MOK', 'MON', 'PER', 'PHE', 'TUE', 'WOK', 'ZUN'],
  'OD': ['ANG', 'BAL', 'BAR', 'BHA', 'BOU', 'CUT', 'DEB', 'DHE', 'GAJ', 'GAN', 'JAG', 'JAJ', 'JHA', 'KAL', 'KAN', 'KEN', 'KHO', 'KOR', 'MAL', 'MAY', 'NAB', 'NAY', 'NUA', 'PUR', 'RAY', 'SAM', 'SOH', 'SUB', 'SUN'],
  'PB': ['AMR', 'BAR', 'BAT', 'FAR', 'FAT', 'FIR', 'GUR', 'HOS', 'JAL', 'KAP', 'LUD', 'MAN', 'MOG', 'MUK', 'NAW', 'PAT', 'RUP', 'SAH', 'SAN', 'SAS', 'TAR'],
  'RJ': ['AJM', 'ALW', 'BAN', 'BAR', 'BHA', 'BIK', 'BUN', 'CHI', 'CHU', 'DAU', 'DHA', 'DUN', 'HAN', 'JAI', 'JAL', 'JHU', 'JOD', 'KAR', 'KOT', 'NAG', 'PAL', 'PRA', 'RAJ', 'SAW', 'SIK', 'SIR', 'TON', 'UDA'],
  'SK': ['EAS', 'NOR', 'SOU', 'WES'],
  'TN': ['ARY', 'CHE', 'COI', 'CUD', 'DHA', 'DIN', 'ERO', 'KAN', 'KAR', 'KRI', 'MAD', 'NAG', 'NAM', 'NKL', 'PER', 'PUD', 'RAM', 'RAN', 'SAL', 'SIV', 'TEN', 'THA', 'THE', 'THI', 'TIR', 'TRU', 'TUT', 'VEL', 'VIL', 'VIR'],
  'TS': ['ADI', 'BHA', 'HYD', 'JAG', 'JAN', 'KAM', 'KAR', 'KHA', 'KOM', 'MAH', 'MAU', 'MED', 'NAG', 'NAL', 'NIR', 'NIZ', 'PED', 'RAJ', 'RAN', 'SAN', 'SID', 'SUR', 'VIK', 'WAN', 'WAR', 'YAD'],
  'TR': ['DHA', 'GOM', 'KHO', 'NOR', 'SEP', 'SOU', 'UNA', 'WES'],
  'UP': ['AGR', 'ALI', 'ALA', 'AMB', 'AME', 'AUR', 'AZA', 'BAD', 'BAG', 'BAH', 'BAL', 'BAN', 'BAR', 'BAS', 'BIJ', 'BUD', 'BUL', 'CHA', 'CHI', 'DED', 'ETH', 'ETA', 'FAI', 'FAR', 'FAT', 'FIR', 'GAU', 'GHA', 'GON', 'GOR', 'HAM', 'HAP', 'HAR', 'HAS', 'JAL', 'JAU', 'KAN', 'KAS', 'KAU', 'KUS', 'LAK', 'LAL', 'LUC', 'MAH', 'MAN', 'MAT', 'MAU', 'MIR', 'MOD', 'MOR', 'MUZ', 'PIL', 'PRA', 'RAE', 'RAM', 'SAH', 'SAN', 'SHA', 'SHR', 'SID', 'SIT', 'SON', 'SUL', 'UNN', 'VAR'],
  'UK': ['ALM', 'BAG', 'CHA', 'CHM', 'DEH', 'HAR', 'NAN', 'PAU', 'PIT', 'RUD', 'TEH', 'UDH', 'USN'],
  'WB': ['ALI', 'BAN', 'BIR', 'COO', 'DAR', 'DIN', 'HOO', 'HOW', 'JAL', 'JHR', 'KAL', 'KOL', 'MAL', 'MUR', 'NAD', 'NOR', 'PAS', 'PUR', 'SOU', 'UTD'],
};

String getStateName(String code) {
  return indianStates[code.toUpperCase()] ?? code;
}

List<String> getDistrictsForState(String stateCode) {
  return stateDistricts[stateCode.toUpperCase()] ?? [];
}

List<MapEntry<String, String>> get stateEntries => indianStates.entries.toList()..sort((a, b) => a.value.compareTo(b.value));
