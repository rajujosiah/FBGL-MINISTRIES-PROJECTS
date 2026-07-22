// Sample Data for FBGL Ministry Website
// Updated with Team & Partnership Data from Excel sheet

import { supabase } from '../services/supabaseClient';

export const sampleUsers = [
  {
    "email": "admin@fbglministry.org",
    "password": "asdf1234",
    "role": "admin",
    "profile": {
      "name": "Super Admin",
      "phone": "+91-9876543210",
      "address": "FBGL Ministry Headquarters, Rajahmundry, East Godavari, AP",
      "aadhar_no": "123456789012",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-ADMIN-01",
      "assigned_to": null
    }
  },
  {
    "email": "boardmember1@fbglministry.org",
    "password": "asdf1234",
    "role": "board_member",
    "profile": {
      "name": "Sample Board Member 1",
      "phone": "+91-9876543211",
      "address": "FBGL Headquarters, East Godavari, AP",
      "aadhar_no": "123456789013",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-BOARD-01",
      "assigned_to": null
    }
  },
  {
    "email": "boardmember2@fbglministry.org",
    "password": "asdf1234",
    "role": "board_member",
    "profile": {
      "name": "Sample Board Member 2",
      "phone": "+91-9876543212",
      "address": "FBGL Headquarters, East Godavari, AP",
      "aadhar_no": "123456789014",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-BOARD-02",
      "assigned_to": null
    }
  },
  {
    "email": "mude.rajesh.rajahmundry@fbglministry.org",
    "password": "asdf1234",
    "role": "area_manager",
    "profile": {
      "name": "Mude Rajesh",
      "phone": "+91-8885776832",
      "address": "D.No: 66-15-28/1, Gadilavaddi Nagar, Rajahmundry",
      "aadhar_no": "686568886634",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-AM-01",
      "assigned_to": null
    }
  },
  {
    "email": "panta.satyanarayana.rajahmundry@fbglministry.org",
    "password": "asdf1234",
    "role": "project_manager",
    "profile": {
      "name": "Panta Satyanarayana",
      "phone": "+91-7995422658",
      "address": "1-145, Bommuru Leprosy Colony, Rajahmundry, 533124",
      "aadhar_no": "282983418258",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-PM-01",
      "assigned_to": "area_manager_mude_rajesh_uid"
    }
  },
  {
    "email": "vemana.venkateswara.rao.sudheer.atreyapuram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Vemana Venkateswara Rao (Sudheer)",
      "phone": "+91-9014971125",
      "address": "Peravaram, Govidi Peta, Atreyapuram Mandal, Dr. B.R. Ambedkar Konaseema Dist, 533235, A.P.",
      "aadhar_no": "676154974613",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-01",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "addanki.nooka.raju.atreyapuram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Addanki Nooka Raju",
      "phone": "+91-9133048417",
      "address": "Velicheru, New Colony, Atreyapuram Mandal, Dr. B.R. Ambedkar Konaseema Dist, 533235, AP",
      "aadhar_no": "674436230148",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-02",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "barkula.sreenuvasa.rao.devipatnam@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Barkula Sreenuvasa Rao",
      "phone": "+91-9493264325",
      "address": "S/o Markandeyulu, 1-102 Devipatnam, 533339",
      "aadhar_no": "435007265507",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-03",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "attla.sitaramula.telugu.script.name.devipatnam@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Attla Sitaramula (Telugu Script Name)",
      "phone": "+91-6304485753",
      "address": "Indukurupeta, Devipatnam Mandal",
      "aadhar_no": "613823158418",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-04",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kodi.sunny.babu.devipatnam@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kodi Sunny Babu",
      "phone": "+91-9704937564",
      "address": "1-108, Thoyyeru, Devipatnam (M), 533339",
      "aadhar_no": "579069842898",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-05",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "peduri.moshe.gkmmandal@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Peduri Moshe",
      "phone": "+91-9666770481",
      "address": "George Gopalapuram Village, GKM Mandal",
      "aadhar_no": "123456781005",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-06",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "srimaankulu.vijayachandra.gandepalli@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "SrimaanKulu Vijayachandra",
      "phone": "+91-9989769372",
      "address": "Murari Post, Gandepalli Mandal, Kakinada District",
      "aadhar_no": "254225370481",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-07",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "vadlapati.amseenidhsen.gandepalli@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Vadlapati Amseenidhsen",
      "phone": "+91-9441563587",
      "address": "Gandepalli Post, Kakinada District",
      "aadhar_no": "266777293096",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-08",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kandikatla.chakrapani.daiva.aseervadam.gandepalli@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kandikatla Chakrapani (Daiva Aseervadam)",
      "phone": "+91-7981983183",
      "address": "Murari Post, Gandepalli Mandal, Kakinada District",
      "aadhar_no": "409150688591",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-09",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kommu.veerraju.gandepalli@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kommu Veerraju",
      "phone": "+91-9515779225",
      "address": "Talluru Post, Gandepalli Mandal, Kakinada",
      "aadhar_no": "807021143849",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-10",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "bachala.mahima.raju.gandepalli@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Bachala Mahima Raju",
      "phone": "+91-9705684591",
      "address": "Mallepalli, Gandepalli Mandal",
      "aadhar_no": "123456781010",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-11",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "gudala.madhu.gandepalli@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Gudala Madhu",
      "phone": "+91-9704527959",
      "address": "Gandepalli Mandal, Kakinada Dist",
      "aadhar_no": "123456781011",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-12",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "ladi.srinu.syman.gangavaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Ladi Srinu (Syman)",
      "phone": "+91-8330967769",
      "address": "14-45, Ambedkar Street, Gokavaram, E.G. Dist, Andhra Pradesh",
      "aadhar_no": "419093508446",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-13",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "orlankala.veera.raghavarao.nataniel.gangavaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Orlankala Veera Raghavarao (Nataniel)",
      "phone": "+91-7997178363",
      "address": "Mallikharjuna Nagar, 57-8-63, Near Bethel High School, Rajahmundry - 533105",
      "aadhar_no": "123456781013",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-14",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "maddala.nageswara.rao.rajpal.gokavaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Maddala Nageswara Rao (Rajpal)",
      "phone": "+91-6305745668",
      "address": "Yedurupaka, Gokavaram Mandal",
      "aadhar_no": "123456781014",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-15",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "chirra.prakash.rao.korukonda@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Chirra Prakash Rao",
      "phone": "+91-9949332697",
      "address": "Gadala (Po), Korukonda (Mandal)",
      "aadhar_no": "405421107799",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-16",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "chirra.yakob.posiyya.korukonda@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Chirra Yakob (Posiyya)",
      "phone": "+91-8523097773",
      "address": "Gadala",
      "aadhar_no": "647922636349",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-17",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "chirra.vijaya.babu.korukonda@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Chirra Vijaya Babu",
      "phone": "+91-8317631321",
      "address": "Door No: 2-215, Gadala, Korukonda (MD), E.G. Dt, 533102",
      "aadhar_no": "123456781017",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-18",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "ketha.krishnarjun.elisha.korukonda@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Ketha Krishnarjun [Elisha]",
      "phone": "+91-8106060311",
      "address": "4-82, Gadarada Raja Street, Korukonda Mandalam, East Godavari - 533289",
      "aadhar_no": "492123252433",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-19",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "viswanadhuni.arjuna.rao.korukonda@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Viswanadhuni Arjuna Rao",
      "phone": "+91-7032544121",
      "address": "2-212/1, Srirangapatnam, Korukonda Mandal",
      "aadhar_no": "601860739626",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-20",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kandregula.jayaraju.venkanna.babu.korukonda@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kandregula Jayaraju Venkanna Babu",
      "phone": "+91-9492387294",
      "address": "S/o Venkata Ramana, Ramabhadra Gari Street, Dr. No. 5-135, Dosakayalapalli",
      "aadhar_no": "123456781020",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-21",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "chatla.srinivas.korukonda@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Chatla Srinivas",
      "phone": "+91-9704411569",
      "address": "S/o Chatla Bhushanam, D.No: 4-97, Narsapuram Village, Korukonda Mandal, East Godavari, A.P.",
      "aadhar_no": "386400406263",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-22",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "doddi.daniel.telugu.script.name.korukonda@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Doddi Daniel (Telugu Script Name)",
      "phone": "+91-9381949339",
      "address": "Dosakayalapalli Colony, Korukonda Mandal - 533292",
      "aadhar_no": "220800118800",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-23",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "rev.p.john.victor.paramatichanti.babu.kothapeta@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Rev. P. John Victor (Paramatichanti Babu)",
      "phone": "+91-9866748100",
      "address": "S/o Prakasha Rao (Late), 10-160, Gowthami Nagar, Kothapeta - 533223, Konaseema Dist, AP",
      "aadhar_no": "714083648536",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-24",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "pastor.m.rajasekhar.kovvuru@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Pastor M. Rajasekhar",
      "phone": "+91-7993651337",
      "address": "58-13-16, C.T.R.I. Near Pattapu Chettu Center, Rajahmundry - 533103",
      "aadhar_no": "123456781024",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-25",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "nandika.veerabhadra.rao.moses.mandapeta@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Nandika Veerabhadra Rao (Moses)",
      "phone": "+91-8106600336",
      "address": "S/o Veeraiah, Dwarapudi, Mandapeta, Vemulapalli (A.P)",
      "aadhar_no": "443106070480",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-26",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "jonnakuti.abhishek.nidamarru@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Jonnakuti Abhishek",
      "phone": "+91-7799812004",
      "address": "Adanikolanu, Nidamarru (M), 3-119, 533198",
      "aadhar_no": "790442565983",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-27",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "ch.john.lazarus.purushothapatnam@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Ch. John Lazarus",
      "phone": "+91-9963928694",
      "address": "Purushothapatnam",
      "aadhar_no": "448623999514",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-28",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kengam.ravi.kishore.daniel.rajahmundry@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kengam Ravi Kishore (Daniel)",
      "phone": "+91-9603148162",
      "address": "Dr. No: 44-9-32/3, Chinna Veedhi, Annapurnamma Peta, Rajahmundry, E.G. District, A.P.",
      "aadhar_no": "123456781028",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-29",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "mortha.samuel.rajahmundry@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Mortha Samuel",
      "phone": "+91-8790739077",
      "address": "H.No: 44-15-57, Annapurnamma Peta, Bye-pass Road, Rajamahendravaram",
      "aadhar_no": "496099545977",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-30",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "thigiripalli.param.jyothi.rajahmundryrural@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Thigiripalli Param Jyothi",
      "phone": "+91-8919937761",
      "address": "5-23, SC Colony, Opp New Water tank, Thomedu, Rajahmundry Rural, E.G. Dist, AP - 533293",
      "aadhar_no": "635842385446",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-31",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kothapalli.yeva.raju.rajahmundryrural@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kothapalli Yeva Raju",
      "phone": "+91-9553415679",
      "address": "4-30, SC Colony, Mid Peta, Torredu, Rajahmundry (Rural)",
      "aadhar_no": "565739182120",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-32",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "muppidi.sudhakar.rajahmundryrural@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Muppidi Sudhakar",
      "phone": "+91-9603748267",
      "address": "Satellite City, Block No: 76, Plot No: F2, 5th Street, Rajahmundry Rural - 533107",
      "aadhar_no": "429967821853",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-33",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kollapu.raju.rajanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kollapu Raju",
      "phone": "+91-9154421051",
      "address": "1-282, Ambedkar Street, Diwancheruvu, Rajanagaram, East Godavari - 533296",
      "aadhar_no": "729878709851",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-34",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "viodhi.ananda.rao.rajanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Viodhi Ananda Rao",
      "phone": "+91-9866850715",
      "address": "Diwancheruvu, Rajanagaram Mandal",
      "aadhar_no": "123456781036",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-35",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kappisetha.widower.rajanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kappisetha (Widower)",
      "phone": "+91-9951291739",
      "address": "Srirampuram, 533296, East Godavari, AP",
      "aadhar_no": "123456781037",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-36",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "chirra.nani.babu.rajanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Chirra Nani Babu",
      "phone": "+91-9966965355",
      "address": "S/o Chirra Johnbabu, Door No: 6-11, SC Peta, Surya Raopeta, Rajanagaram Mandalam, East Godavari - 533294 (AP)",
      "aadhar_no": "422226369163",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-37",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "palika.chinnababu.rajanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Palika Chinnababu",
      "phone": "+91-9177283697",
      "address": "Yerushalem Church, Kanavaram Post, Rajanagaram Mandal, E.G. Dt",
      "aadhar_no": "599743306344",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-38",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "jedla.samuel.raju.rajanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Jedla Samuel Raju",
      "phone": "+91-9949026090",
      "address": "Raghudevapuram, Rajanagaram, E. Godavari, AP - 533341",
      "aadhar_no": "200337232661",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-39",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "karri.manga.raju.rajanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Karri Manga Raju",
      "phone": "+91-9989627790",
      "address": "Chandredu, East Godavari, Rajanagaram Mandal",
      "aadhar_no": "123456781041",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-40",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "yandra.prakasam.rajanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Yandra Prakasam",
      "phone": "+91-8897996229",
      "address": "4-30/4, Ambedkar Street, Kalavacherla, Rajanagaram Mandal, E.G. Dist - 533297",
      "aadhar_no": "123456781042",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-41",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "gulli.issau.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "gulli ISSAU",
      "phone": "+91-9100950455",
      "address": "Bobilanka, Prashanth Nagar Colony, Sithanagaram Mandalam, Eluru Dist",
      "aadhar_no": "314211530768",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-42",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "posupo.indira.priya.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Posupo Indira Priya",
      "phone": "+91-8330950772",
      "address": "Sigavaram",
      "aadhar_no": "595342874737",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-43",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "a.sesharaju.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "A. Sesharaju",
      "phone": "+91-9490351725",
      "address": "Katavaram, Sitanagaram (M), E.G. Dist, AP - 533293",
      "aadhar_no": "486243304351",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-44",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "mallineedi.padma.rao.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Mallineedi Padma Rao",
      "phone": "+91-9553905272",
      "address": "S/o Buchi Ramayya, 3-129, Subramanyan Street, Seethanagaram, Raghudevapuram, East Godavari, AP",
      "aadhar_no": "247435746323",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-45",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "sakiri.nageswararao.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Sakiri Nageswararao",
      "phone": "+91-9010331664",
      "address": "S/o Bhimayya, 2-178, SC Peta, Cheepurupalli, Nagampalli, 533290",
      "aadhar_no": "460584773636",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-46",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "gundupalli.yesu.babu.telugu.script.name.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Gundupalli Yesu Babu (Telugu Script Name)",
      "phone": "+91-9133692742",
      "address": "Cheepurupalli, Sitanagaram Mandalam",
      "aadhar_no": "831540286808",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-47",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "dola.nehru.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Dola Nehru",
      "phone": "+91-9951529439",
      "address": "Raghudevapuram",
      "aadhar_no": "123456781049",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-48",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "galinki.rajesh.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Galinki Rajesh",
      "phone": "+91-8522013747",
      "address": "1-130, SC Peta, Vangalapudi, Seethanagaram (Mandal)",
      "aadhar_no": "123456781050",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-49",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kangaroo.annavaram.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kangaroo Annavaram",
      "phone": "+91-9985273024",
      "address": "Raghudevapuram, Sitanagaram",
      "aadhar_no": "340312961041",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-50",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "muvvala.lazaru.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Muvvala Lazaru",
      "phone": "+91-9553675095",
      "address": "SC Peta",
      "aadhar_no": "123456781052",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-51",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "s.vijay.kumar.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "S. Vijay Kumar",
      "phone": "+91-6281985559",
      "address": "Bobilanka, Subbarao Peta, Sitanagaram Mandal, E.G. Dist, AP - 533293",
      "aadhar_no": "974123260605",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-52",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "gondela.jyothi.kumar.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Gondela Jyothi Kumar",
      "phone": "+91-9704335909",
      "address": "Undeshwarapuram, Near Hanuman Junction, Seethanagaram Post, East Godavari Dist",
      "aadhar_no": "123456781054",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-53",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "kovati.sarojini.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Kovati Sarojini",
      "phone": "+91-7286060021",
      "address": "Vangalapudi Village, Seethanagaram Mandal, East Godavari District, AP",
      "aadhar_no": "469054957234",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-54",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "bangarapu.sekhar.babu.seethanagaram@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Bangarapu Sekhar Babu",
      "phone": "+91-7981639933",
      "address": "Raghudevapuram, Seethanagaram",
      "aadhar_no": "536440493854",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-55",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  },
  {
    "email": "khandavalli.salman.raju.generaldata@fbglministry.org",
    "password": "asdf1234",
    "role": "social_worker",
    "profile": {
      "name": "Khandavalli Salman Raju",
      "phone": "+91-8179796662",
      "address": "West Ganugudem Village",
      "aadhar_no": "123456781057",
      "state_code": "AP",
      "district_code": "EG",
      "id_number": "FBGL-AP-EG-SW-56",
      "assigned_to": "project_manager_panta_satyanarayana_uid"
    }
  }
];

export const sampleProjects = [
  {
    "title": "Sample Project 1: Rural Education & Skill Support",
    "description": "Providing educational resources, evening tutoring, and digital skill training for underprivileged children in rural Mandals of East Godavari.",
    "category": "education",
    "area_of_operation": "East Godavari District, Andhra Pradesh",
    "target_beneficiaries": "500 children aged 6-16 years",
    "current_status": "Active",
    "start_date": "2024-01-15",
    "end_date": "2024-12-31",
    "budget": 250000,
    "images": [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600",
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=600"
    ],
    "assigned_to": "FBGL-AP-EG-PM-01"
  },
  {
    "title": "Sample Project 2: Women Empowerment & Vocational Training",
    "description": "Tailoring, sewing machine distribution, and financial literacy workshops for rural women to build independent livelihoods.",
    "category": "economy",
    "area_of_operation": "East Godavari District, Andhra Pradesh",
    "target_beneficiaries": "200 women aged 18-45 years",
    "current_status": "Active",
    "start_date": "2024-02-01",
    "end_date": "2024-11-30",
    "budget": 180000,
    "images": [
      "https://images.unsplash.com/photo-1520263115673-610416f52ab6?q=80&w=600"
    ],
    "assigned_to": "FBGL-AP-EG-PM-01"
  },
  {
    "title": "Sample Project 3: Community Health & Clean Water Initiative",
    "description": "Installation of deep borewells, distribution of clean drinking water, and regular medical checkup camps across rural Mandals.",
    "category": "social",
    "area_of_operation": "East Godavari District, Andhra Pradesh",
    "target_beneficiaries": "1000 rural families",
    "current_status": "Active",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "budget": 120000,
    "images": [
      "https://images.unsplash.com/photo-1541913496-8099cd5353ed?q=80&w=600"
    ],
    "assigned_to": "FBGL-AP-EG-PM-01"
  }
];

export const sampleBlogPosts = [
  {
    "title": "Sample Blog Post 1: Transforming Communities Across East Godavari",
    "content": "Welcome to our sample blog post highlighting the transformative work being conducted by our dedicated team across 17 Mandals in East Godavari. Through collaborative efforts in education, healthcare, and economic empowerment, lives are being uplifted every day.",
    "type": "blog",
    "featured_image": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800",
    "status": "published",
    "author_id": "admin_user_uid"
  },
  {
    "title": "Sample Blog Post 2: Community Health Camp and Water Awareness Success",
    "content": "Our sample blog update on the recent free medical camp and clean water filtration distribution. Over 350 rural residents received health screenings and access to safe drinking water.",
    "type": "blog",
    "featured_image": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800",
    "status": "published",
    "author_id": "admin_user_uid"
  }
];

export const sampleDonations = [
  {
    donor_name: 'Anonymous Donor',
    donor_email: 'donor1@example.com',
    amount: 5000,
    category: 'general',
    payment_method: 'bank_transfer',
    status: 'completed',
    transaction_id: 'TXN001',
    notes: 'General donation for ministry activities'
  }
];

export const populateSampleData = async () => {
  try {
    console.log('Starting to populate sample data...');

    for (const userData of sampleUsers) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        console.error('Error creating user:', userData.email, authError);
        continue;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: userData.email,
            role: userData.role,
            ...userData.profile
          });

        if (profileError) {
          console.error('Error creating profile:', userData.email, profileError);
        }
      }
    }

    await supabase.from('projects').insert(sampleProjects);
    await supabase.from('blog_posts').insert(sampleBlogPosts);
    await supabase.from('donations').insert(sampleDonations);

    console.log('Sample data population completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error populating sample data:', error);
    return { success: false, error };
  }
};

export const clearAllData = async () => {
  try {
    await supabase.from('donations').delete().neq('id', 0);
    await supabase.from('blog_posts').delete().neq('id', 0);
    await supabase.from('projects').delete().neq('id', 0);
    await supabase.from('profiles').delete().neq('id', 0);
    return { success: true };
  } catch (error) {
    console.error('Error clearing data:', error);
    return { success: false, error };
  }
};
