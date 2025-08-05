//when making api calls
// export const getLocations = async () => {
//     const response = await fetch("https://paysuiteAPIs.kafuecouncil.gov.zm/locations");
//     return await response.json();
//   };
export const getInstitution = { 
  name: "Kafue Town Council", 
  address: "Civic Centre, Luangwa Drive, C5 Estates, Kafue", 
  phone: "123-456-7890", 
  logo:"/images/logo.png" 
};
  
export const getProvinces = () => [
  { name: "Central" },
  { name: "Copperbelt" },
  { name: "Eastern" },
  { name: "Luapula" },
  { name: "Lusaka" },
  { name: "Muchinga" },
  { name: "North-Western" },
  { name: "Nothern" },
  { name: "Southern" },
  { name: "Western" },
];

export const getLocations = () => [
  { locationId: 5001, code: "KT", name: "Kafue Town" },
  { locationId: 5002, code: "KW", name: "Kafue West" },
  { locationId: 5003, code: "SH", name: "Shikoswe" },
  { locationId: 5004, code: "C5", name: "Community 5" }
];

export const getDivisions = () => [
  { id: 5001, code: "Divi", name: "Division i" },
  { id: 5002, code: "Divii", name: "Division ii" },
  { id: 5003, code: "Diviii", name: "Division iii" },
  { id: 5004, code: "Diviv", name: "Division iv" },
  { id: 5005, code: "Coun", name: "Councillors" }
];

export const getDepartments = () => [
  { id: 5001, code: "INS", name: "Institution Administration" },
  { id: 5002, code: "FIN", name: "Finance" },
  { id: 5003, code: "PLN", name: "Planning" },
  { id: 5004, code: "WES", name: "Works and Engineering Services" },
  { id: 5003, code: "ADM", name: "Administration" },
];

  export const getZones = () => [
    { zoneId: 1, code: "LI", name: "Low Income" },
    { zoneId: 2, code: "MI", name: "Middle Income" },
    { zoneId: 3, code: "HI", name: "High Income" }
  ];
  
  export const getMarkets = () => [
    { marketId: 1, code: "C5M", name: "C5 Market", location: "Community 5", zone: "Middle Income" },
    { marketId: 2, code: "C7M", name: "C7 Market", location: "Community 7", zone: "Middle Income"  },
    { marketId: 3, code: "SHM", name: "Shikoswe Market", location: "Shikoswe", zone: "Middle Income"  },
    { marketId: 4, code: "TCM", name: "Town Center", location: "Kafue Town Center", zone: "Hi Income"  },
    { marketId: 5, code: "NGM", name: "Nangongwe Market", location: "Nangongwe", zone: "Low Income"  }
  ];
  
  export const getBusinessTypes = () => [
    { typeId: 1, code: "LiqS", name: "Liquor Store" },
    { typeId: 2, code: "Rest", name: "Restaurant" },
    { typeId: 3, code: "BlMa", name: "Block Making" },
  ];

  export const getBankAccounts = () => [
    { id: 5001, name: "District Fund -ZANACO - Kafue", bankName: "ZANACO", branchName:"Kafue", branchCode:"KAF01", accountName:"District Fund",  accountNumber: "1234567890", balanceEstimate: 10000 },
    { id: 5002, name: "Development - INDO - Kafue", bankName: "INDO", branchName:"Kafue", branchCode:"INDKAF01", accountName:"Development",  accountNumber: "12300067890", balanceEstimate: 1205099.01 },
    { id: 5003, name: "Salaries - ABSA - Kafue", bankName: "ABSA", branchName:"Kafue", branchCode:"ABSAKAF01", accountName:"Salaries",  accountNumber: "5722001025", balanceEstimate: 100012.5 },
  ];
  
  export const getBusinessCategories = () => [
    { id: 1, code: "ST", name: "Standard", desc:"An average business" },
    { id: 2, code: "MD", name: "Middle", desc:"A middle income busines" },
    { id: 2, code: "CO", name: "Corporate", desc:"A coporate client" }
  ];

// production
// const getClients = async (page = 1, limit = 10) => {
//   const response = await fetch(`/api/clients?page=${page}&limit=${limit}`);
//   return await response.json();
// };

const dummyEmployees = Array.from({ length: 100 }, (_, i) => ({
  empId: `KTC${100000 + i + 1}`,
  firstName: `FirstName${i + 1}`,
  lastName: `LastName${i + 1}`,
  gender: i % 2 === 0 ? "Male" : "Female",
  name: `FirstName${i + 1} LastName${i + 1} (${179119 + i}/25/1)`,
  lastName: `LastName${i + 1}`,
  nationalId: `${179119 + i}/25/1`,
  phoneNumber: `123-456-78${i % 10}`,
  email: `client${i + 1}@example.com`,
  address: `Street ${i + 1}`,
  jobTitle: `Business ${i + 1}`,
  department: i % 2 === 0 ? "Finance" : "Planning",
}));

export const getEmployees = () => dummyEmployees;

const dummyClients = Array.from({ length: 100 }, (_, i) => ({
    clientId: `KTC${100000 + i + 1}`,
    firstName: `FirstName${i + 1}`,
    lastName: `LastName${i + 1}`,
    gender: i % 2 === 0 ? "Male" : "Female",
    name: `FirstName${i + 1} LastName${i + 1} (${179119 + i}/25/1)`,
    lastName: `LastName${i + 1}`,
    nationalId: `${179119 + i}/25/1`,
    phoneNumber: `123-456-78${i % 10}`,
    email: `client${i + 1}@example.com`,
    address: `Street ${i + 1}`,
    businessName: `Business ${i + 1}`,
    clientCategory: i % 2 === 0 ? "Corporate" : "Individual",
}));

export const getClients = () => dummyClients;

const dummySuppliers = Array.from({ length: 10 }, (_, i) => ({
  supplierId: `KTC${100000 + i + 1}`,
  name: `Business Name ${i + 1}`,
  contactPerson: `Contact Person${i + 1}`,
  mobile: `${260979780442 + i+ 1}`,
  email: `contactperson${i + 1}@supplier.com`,
  address: `Street ${i + 1}, Lusaka`,
  tPIN: `${1254373 + i + 1}`,
  bRN: `BRN${253166554825336 + i + 1}`,
  bank: `Bank ${i + 1}`,
  branch: `Branch ${i + 1}`,
  accountNumber: `${5753258915 + i + 1}`,
  swiftCode: `SWT${26530+i + 1}`,
  sortCode: `SRT${26530+i + 1}`,
}));

export const getSuppliers = () => dummySuppliers;

  const dummyBusinesses = Array.from({ length: 50 }, (_, i) => ({
    businessId: `BUS${1000 + i + 1}`,
    name: `Business ${i + 1}`,
    owner: `Owner ${i + 1}`,
    location: i % 3 === 0 ? "Kafue Town" : "C5 Estates",
    address: `Address ${i + 1}`,
    zone: `Zone ${i % 5 + 1}`,
    market: `Market ${i % 3 + 1}`,
    businessType: i % 2 === 0 ? "Liquor Store" : "Pharmacy",
    mobile: `${260979780441 + i}`,
    category: i % 3 === 0 ? "Standard" : "Corporate",
  }));
  
  export const getBusinesses = () => dummyBusinesses;

  const dummyBanks = Array.from({ length: 7 }, (_, i) => ({
    bankId: `BNK${100 + i + 1}`,
    bankName: `Bank ${i + 1}`,
    bankCodeName: `CODE${i + 1}`,
  }));
  
  export const getBanks = () => dummyBanks;

  const dummyBranches = Array.from({ length: 7 }, (_, i) => ({
    branchId: `BRN${100 + i + 1}`,
    bankId: `BRN${100 + i + 1}`,
    bankName: `Bank ${i + 1}`,
    name: `Name ${i + 1}, Branch ${i + 1}`,
    branchCode: `BRNCH${i + 1}`,
    branchName: i % 3 === 0 ? "Kafue" : "Lusaka Main",
    sortCode: `SRT${i + 1}`,
    swiftCode: `SWT${i + 1}`,
  }));
  
  export const getBranches = () => dummyBranches;

  export const getPropertyTypes = () => [
    { id: 5001, code: "COM", name: "Commercial", poundage: 0.003 },
    { id: 5002, code: "RES", name: "Residential", poundage: 0.0025 },
    { id: 5003, code: "IND", name: "Industrial", poundage: 0.004 },
    { id: 5004, code: "STS", name: "Site and Service", poundage: 0 },
    { id: 5004, code: "RENT", name: "Rental Property", poundage: 0 },
  ];

  export const getValuationRoll = () => [
    { id: 5001, clientId: 2001, stand: "L/1052/m/1000", desc: "dwelling house and premise", type: "Residential", location: "Chalala", owner:"Some Owner", nationalId:"197117/18/1", mobile: "260968670330", area:3.0110, landValue:3109200.00, improvements: 290000, trv:3399200.00, poundage:0.0025, isExempted:"False", comment:""},
    { id: 5002, clientId: 2002, stand: "L/1052/m/1001", desc: "Lodge", type: "Hospitality", location: "Kafue Town", owner:"Another Owner", nationalId:"197117/19/1", mobile: "260968670330", area:0.0110, landValue:109200.00, improvements: 90000, trv:399200.00, poundage:0.003, isExempted:"False", comment:"" },
    { id: 5003, clientId: 2003, stand: "L/1052/m/1002", desc: "Bare Land", type: "Residential", location: "Shikoswe", owner:"New Person", nationalId:"197117/20/1", mobile: "260968670330", area:1.0110, landValue:45200.00, improvements: 500000, trv:545200.00, poundage:0.0025, isExempted:"False", comment:"" },
    { id: 5004, clientId: 2004, stand: "L/1052/m/1003", desc: "plant and machinery and premise", type: "Industrial", location: "Lilayi", nationalId:"197117/21/1", mobile: "260968670330", owner:"Another Person", area:5.0110, landValue:13109200.00, improvements: 1290000, trv:4499200.00, poundage:0.0025, isExempted:"False", comment:"" },
    { id: 5005, clientId: 2005, stand: "L/1052/m/1004", desc: "Bar and restaurant", type: "Commercial", location: "Nangongwe", owner:"Some One", nationalId:"197117/22/1", mobile: "260968670330", area:3.0110, landValue:3109200.00, improvements: 290000, trv:3399200.00, poundage:0.0025, isExempted:"True", comment:"Is exempted from billing" },
  ];

  export const getAllProperties = () => [
    { id: 5001, clientId: 2001, name: "L/1052/m/1000, 'Residential', 'Some Owner'", stand: "L/1052/m/1000", desc: "dwelling house and premise", type:"Residential", location: "Chalala", owner:"Some Owner", nationalId:"197117/18/1", mobile: "260968670330"},
    { id: 5002, clientId: 2002, name: "L/1052/m/1001, 'Billboard', 'Another Owner'", stand: "L/1052/m/1001", desc: "Lodge", type:"Billboard", location: "Kafue Town", owner:"Another Owner", nationalId:"197117/19/1", mobile: "260968670330" },
    { id: 5003, clientId: 2003, name: "L/1052/m/1002, 'Rental', 'New Person'", stand: "L/1052/m/1002", desc: "Bare Land", type:"Rental",  location: "Shikoswe", owner:"New Person", nationalId:"197117/20/1", mobile: "260968670330"},
  ];

  export const getRentalProperties = () => [
    { id: 5001, stand: "RENT/C5/001", desc: "Retail Shop", type: "Commercial", location: "C5 Estates", market:"C5 Market", zone:"Middle Income", area:5, rent:2500, isVacant:"false"},
    { id: 5002, stand: "RENT/C5/002", desc: "Retail Shop", type: "Commercial", location: "C5 Estates", market:"C5 Market", zone:"Middle Income", area:5, rent:2500, isVacant:"false"},
    { id: 5003, stand: "RENT/C5/003", desc: "Retail Shop", type: "Commercial", location: "C5 Estates", market:"C5 Market", zone:"Middle Income", area:5, rent:2500, isVacant:"false"},
   ];

   export const getTemporalStands = () => [
    { id: 5001, clientId: 2001, stand: "BTH/C5/001", desc: "Booth", type: "Commercial", location: "C5 Estates", zone:"Middle Income", owner:"Owner 1", nationalId:"197117/18/1", mobile:"260968670330", lease:600},
    { id: 5002, clientId: 2002, stand: "CW/KT/002", desc: "Car Wash", type: "Commercial", location: "Town Center", zone:"High Income", owner:"Owner 2", nationalId:"197117/19/1", mobile:"260968670331", lease:1000},
    { id: 5003, clientId: 2003, stand: "BTH/SH/003", desc: "Booth", type: "Commercial", location: "Shikoswe", zone:"Middle Income", owner:"Owner 3", nationalId:"197117/20/1", mobile:"260968670332", lease:1500},
   ];

   export const getBillboardCats = () => [
    { id: 5001, category: "Less Than 1m Sq", lease:500},
    { id: 5001, category: "1m Sq to 4.5m Sq", lease:2500},
    { id: 5001, category: "4.5m Sq and Above", lease:5000},
  ];
  
   export const getBillboards = () => [
    { id: 5001, clientId: 2001, stand: "BLB/001", desc: "1m x 0.5m double sided", type: "Banner", location: "C5 Estates", owner:"Owner 1", nationalId:"197117/18/1", mobile:"260968670330", occupier:"SDA Church Propgram", address:"Near C5 market", category:"Less Than 1m Sq", sides:"1", lease:500},
    { id: 5002, clientId: 2002, stand: "BLB/002", desc: "2m x 2m single sided", type: "Billboard", location: "Town Center", owner:"Owner 2", nationalId:"197117/19/1", mobile:"260968670331", occupier:"Mega Bakery", address:"Opposite Mega Bakery", category:"1m Sq to 4.5m Sq", sides:"2", lease:1000},
    { id: 5003, clientId: 2003, stand: "BLB/003", desc: "2m x 5m double sided", type: "Billboard", location: "Shikoswe", owner:"Owner 3", nationalId:"197117/20/1", mobile:"260968670332", occupier:"Trade Kings", address:"Near the railway crossing", category:"4.5m Sq and Above", sides:"2", lease:500},
   ];
   export const getOnlineRecepts = () => [
    {id:100001, clientId:2001, client:"Some Client", naration:"Property Rates for L/1052/M/1002", due:25000, paid:20500, balance:4500, bank:"ZANACO - Salaries 52489000129",reference:"safsaf-asfas-asavcv", date:"19/03/2025"}
   ];

   export const getPaymentMethods = () => [
    { id: 5001, name: "Bank Deposit" },
    { id: 5002, name: "Bank Transfer" },
    { id: 5003, name: "Cheque" },
    { id: 5004, name: "Mobile Money" }
  ];
  
  export const getCOA = () => [
    { code: 153001, name: "Occupancy Licence" },
    { code: 153002, name: "Liquor Licence" },
    { code: 153003, name: "Firearm and ammunition licence" },
    { code: 153005, name: "Petroleum Storage Licence" }
  ];
  
  export const getIncomeCOA = () => [
    { code: 153001, name: "Occupancy Licence" },
    { code: 153002, name: "Liquor Licence" },
    { code: 153003, name: "Firearm and ammunition licence" },
    { code: 153005, name: "Petroleum Storage Licence" }
  ];
  
  export const getExpenseCOA = () => [
    { code: 153001, name: "Occupancy Licence" },
    { code: 153002, name: "Liquor Licence" },
    { code: 153003, name: "Firearm and ammunition licence" },
    { code: 153005, name: "Petroleum Storage Licence" }
  ];
  
  export const getCoaCategories = () => [
    { id:1, code: 153001, name: "Occupancy Licence", category: "Standard", amount:3500 },
    { id:2, code: 153002, name: "Liquor Licence", category: "Standard", amount:833 },
    { id:3, code: 153003, name: "Firearm and ammunition licence", category: "Standard", amount:600 },
    { id:4, code: 153005, name: "Petroleum Storage Licence", category: "500Ltrs to 1,000Ltrs", amount:1500 }
  ];
  
  export const getLicencingCategories = () => [
    { id:2, code: 153002, name: "Liquor Licence", category: "Standard", amount:833 },
    { id:2, code: 153002, name: "Business Levy", category: "Corporate", amount:1111 },
    { id:4, code: 155009, name: "Fire Certificate", category: "Standard", amount:850 },
    { id:4, code: 155009, name: "Fire Certificate", category: "Corporate", amount:3500 },
    { id:4, code: 155001, name: "Health Permit", category: "Corporate", amount:3000 }
  ];

  export const getPayments = () => [
    {
      id:9098,
      prNo:"WES25001",
      pvNo:"CDF9098", 
      beneficiary:"Diden Solutions Ltd", 
      naration:"Construction of a 1 X 2 classroom block in chikupi", 
      reference:"full payment",
      coaName:"AUC-Schools", 
      coaCode:229104,
      amountDue:395686.87,
      amountPaid:395686.87,
      balance:0, 
      bank:"ZANACO-Kafue-57532689109", 
      paidTo:"FNB-Lusaka Main-001235849675",
      date:"2025-03-31",
      prepared:"Chisambi Kaeza",
      checked:"Maria Maswau",
      verified:"Patson Musonda",
      authorized:"Brenden Machila",
      approved:"Bupe Mutanya",
      receivedBy:"Dickson Tembo"
    },
    {
      id:9099,
      prNo:"ADM25037",
      pvNo:"DF25021", 
      beneficiary:"Thompson Suppliers", 
      naration:"Stationery as perattached memo", 
      reference:"Part payment", 
      coaName:"Computer and Peripheral Costs", 
      coaCode:221050,
      amountDue:155000,
      amountPaid:100000,
      balance:55000, 
      bank:"ZANACO-Kafue-57532689109", 
      paidTo:"ZANACO-Kafue Main-001235849675",
      date:"2025-03-31",
      prepared:"Chisambi Kaeza",
      checked:"Maria Maswau",
      verified:"Patson Musonda",
      authorized:"Brenden Machila",
      approved:"Bupe Mutanya",
      receivedBy:"Thompson"
    }
  ]