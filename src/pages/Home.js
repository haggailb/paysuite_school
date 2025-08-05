import React, { useState, useEffect, useRef } from "react";
import { Link, Routes, Route } from "react-router-dom";
import MainNavbar from '../components/MainNavbar';
import Sidebar from '../components/Sidebar';
import Dashboard from './Dashboard';
import ConfigInstitutionInfo from "./configurations/ConfigInstitutionInfo";
import ViewInstitution from "./ViewInstitutionalInfo";
import '../components/styles/home.css';
import { FaHome, FaTh, FaUserAlt } from "react-icons/fa";
import Departments from "./configurations/Departments";
import Units from "./configurations/Units";
import JobTitles from "./configurations/Jobtitles";
import EmployeeRegistration from "./EmployeeRegistration";
import UserRegistration from "./auth_management/UserRegistration";
import DocumentSetup from "./configurations/DocumentSetup";
import SignatoryAssignment from "./auth_management/SignatoryAssignment";
import NewClient from "../components/new_components/NewClient";
import Clients from "./kyc/clients";
import Businesses from "./kyc/Businesses";
import BankAccounts from "./configurations/bankAccounts";
import Banks from "./configurations/banks";
import PropertyTypes from "./configurations/PropertyTypes";
import Locations from "./configurations/Locations";
import Zones from "./configurations/Zones";
import BusinessTypes from "./configurations/BusinessTypes";
import Markets from "./configurations/Markets";
import ValuationRoll from "./properties/ValuationRoll";
import RentalProperties from "./properties/RentalProperties";
import TemporalStands from "./properties/TemporalStands";
import Billboards from "./properties/Billboards";
import PosPropertyRates from "./pos/PosPropertyRates";
import PosSingleCOA from "./pos/PosSingleCOA";
import CoaCategories from "./configurations/CoaCategories";
import PosMultilineBillable from "./pos/PosMultilineBillable";
import PosMultilineCOA from "./pos/PosMultilineCOA";
import PosOnline from "./pos/PosOnline";
import PosGrants from "./pos/PosGrants";
import LicencingCategories from "./configurations/ConfigureLicencing";
import BusinessCategories from "./configurations/BusinessCategories";
import InvoiceBillable from "./invoicing/InvoiceBillable";
import InvoiceCOA from "./invoicing/InvoiceCOA";
import InvoiceLicencing from "./invoicing/InvoiceLicencing";
import Suppliers from "./kyc/Suppliers";
import NewVoucherSupplier from "./expenditure/NewVoucherSupplier";
import NewVoucherEmployee from "./expenditure/NewVoucherEmployee";
import NewVoucherBulk from "./expenditure/NewVoucherBulk";
import PaymentVouchers from "./expenditure/PaymentVouchers";
import VoucherAuthorization from "./expenditure/VoucherAuthorization";
import IncomeJournal from "./cashbooks/IncomeJournal";
import ExpenseJournal from "./cashbooks/ExpenseJournal";
import ImportChartOfAccounts from "./imports/ChartofAccounts";
import CashbookLedger from "./cashbooks/Ledger";
import CashbookSummary from "./cashbooks/Summary";
import CashbooksDashboard from "./CashbooksDashboard";
import Brances from "./configurations/Branches";
import ChartOfAccounts from "./reports/RptChartOfAccounts";
import UserRoles from "./auth_management/userRoles";
import Users from "./auth_management/Users";
import RoleModules from "./auth_management/RoleModules";
import ProtectedRoute from "./auth_management/ProtectedRoute";
import UnauthorizedAccess from "./auth_management/UnauthorizedAccess";
import { useNavigate } from 'react-router-dom';
import ForgotPassword from "./auth_management/ForgotPassword";
import ImportValuationRoll from "./imports/ImportValuationRoll";
import ProcessPropertyRates from "./processing/ProcessPropertyRates";
import ImportPropertyProcessList from "./imports/ImportPropertyProcessList";
import RatesBills from "./reports/RptRatesBills";
import RatesBillsWithBalances from "./reports/RptRatesBillsWithBalances";
import PropertyRatesStatement from "./reports/RptRatesStatement";
import ReceiptsLedger from "./reports/RptReceiptsLedger";
import Tenancy from "./asset_management/PropertyLeases";
import PropertyLeases from "./asset_management/PropertyLeases";
import ImportRatesTransactions from "./imports/ImportPropertyRatesBalances";
import DefaultBankAccounts from "./configurations/defaultAccounts";
import ConfigureReceiptNumbering from "./configurations/serializer";
import PropertyStatementClientView from "./client_access/PropertyStatement";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);  //navigate


  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <MainNavbar />

      <div className="body">
        {/* Sidebar */}
      <div >
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

        {/* Main Content Area */}
        <main className="main-container">
          <div className="main-body">
            <Routes>
              <Route path="/unauthorized" element={<UnauthorizedAccess />} />
              <Route path="/home" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cashbooks" element={<CashbooksDashboard />} />

              {/* CLIENT ACCESS */}
              <Route path="/property-statement/:propertyId" element={<PropertyStatementClientView />} />


              {/* Configurations */}
              <Route 
                path="/config-institution"
                element={<ProtectedRoute element={<ConfigInstitutionInfo />} requiredModule="Configurations" />}
              />
              <Route path="/view-institution" element={<ViewInstitution />} />
              <Route 
                path="/departments"
                element={<ProtectedRoute element={<Departments />} requiredModule="Configurations" />}
              />
              <Route 
                path="/units"
                element={<ProtectedRoute element={<Units />} requiredModule="Configurations" />}
              />
              <Route 
                path="/titles"
                element={<ProtectedRoute element={<JobTitles />} requiredModule="Configurations" />}
              />
              <Route 
                path="/employees"
                element={<ProtectedRoute element={<EmployeeRegistration />} requiredModule="Configurations" />}
              />
              <Route 
                path="/documents"
                element={<ProtectedRoute element={<DocumentSetup />} requiredModule="Configurations" />}
              />
              <Route 
                path="/signatories"
                element={<ProtectedRoute element={<SignatoryAssignment />} requiredModule="Configurations" />}
              />

              {/* Auth Management */}
              <Route 
                path="/system-modules"
                element={<ProtectedRoute element={<RoleModules />} requiredModule="Security" />}
              />
              <Route 
                path="/user-roles"
                element={<ProtectedRoute element={<UserRoles />} requiredModule="Security" />}
              />
              <Route 
                path="/role-modules/:roleName"
                element={<ProtectedRoute element={<RoleModules />} requiredModule="Security" />}
              />
              <Route
                path="/users"
                element={<ProtectedRoute element={<Users />} requiredModule="Security" />}
              />

              {/* KYC Routes */}
              <Route 
                path="/new-client"
                element={<ProtectedRoute element={<NewClient />} requiredModule="KYC" />}
              />
              <Route 
                path="/clients"
                element={<ProtectedRoute element={<Clients />} requiredModule="KYC" />}
              />
              <Route 
                path="/businesses"
                element={<ProtectedRoute element={<Businesses />} requiredModule="KYC" />}
              />
              <Route 
                path="/suppliers"
                element={<ProtectedRoute element={<Suppliers />} requiredModule="KYC" />}
              />
              
              {/* SETTINGS ROUTES */}
              <Route path="/configure-banks" element={<ProtectedRoute element={<Banks />} requiredModule="Settings" />} />
              <Route path="/configure-branches" element={<ProtectedRoute element={<Brances />} requiredModule="Settings" />} />
              <Route path="/configure-bank-accounts" element={<ProtectedRoute element={<BankAccounts />} requiredModule="Settings" />} />
              <Route path="/default-bank-accounts" element={<ProtectedRoute element={<DefaultBankAccounts />} requiredModule="Settings" />} />
              <Route path="/property-types" element={<ProtectedRoute element={<PropertyTypes />} requiredModule="Settings" />} />
              <Route path="/locations" element={<ProtectedRoute element={<Locations />} requiredModule="Settings" />} />
              <Route path="/zones" element={<ProtectedRoute element={<Zones />} requiredModule="Settings" />} />
              <Route path="/business-types" element={<ProtectedRoute element={<BusinessTypes />} requiredModule="Settings" />} />
              <Route path="/business-categories" lement={<ProtectedRoute element={<BusinessCategories />} requiredModule="Settings" />} />
              <Route path="/markets" element={<ProtectedRoute element={<Markets />} requiredModule="Settings" />} />
              <Route path="/configure-receipt-numbering" element={<ProtectedRoute element={<ConfigureReceiptNumbering />} requiredModule="Settings" />} />
              

              {/* PROPERTY ROUTES */}
              <Route 
                path="/valuation-roll"
                element={<ProtectedRoute element={<ValuationRoll />} requiredModule="Properties" />}
              />
              <Route 
                path="/rental-properties"
                element={<ProtectedRoute element={<RentalProperties />} requiredModule="Properties" />}
              />
              <Route 
                path="/temporal-stands"
                element={<ProtectedRoute element={<TemporalStands />} requiredModule="Properties" />}
              />
              <Route 
                path="/billboards"
                element={<ProtectedRoute element={<Billboards />} requiredModule="Properties" />}
              />

              {/* Fee Structures */}
              <Route 
                path="/coa-fee-structures"
                element={<ProtectedRoute element={<CoaCategories />} requiredModule="Fee Structures" />}
              />
              <Route 
                path="/licencing-categories"
                element={<ProtectedRoute element={<LicencingCategories />} requiredModule="Fee Structures" />}
              />

              {/* POS Routes */}
              <Route 
                path="/pos-rates"
                element={<ProtectedRoute element={<PosPropertyRates />} requiredModule="Point of Sale" />}
              />
              <Route 
                path="/pos-single-coa"
                element={<ProtectedRoute element={<PosSingleCOA />} requiredModule="Point of Sale" />}
              />
              <Route 
                path="/pos-multiline-billable"
                element={<ProtectedRoute element={<PosMultilineBillable />} requiredModule="Point of Sale" />}
              />
              <Route 
                path="/pos-multiline-coa"
                element={<ProtectedRoute element={<PosMultilineCOA />} requiredModule="Point of Sale" />}
              />
              <Route 
                path="/pos-online"
                element={<ProtectedRoute element={<PosOnline />} requiredModule="Point of Sale" />}
              />
              <Route 
                path="/pos-grants"
                element={<ProtectedRoute element={<PosGrants />} requiredModule="Point of Sale" />}
              />

              {/* Invoicing Routes */}
              <Route 
                path="/invoice-billable"
                element={<ProtectedRoute element={<InvoiceBillable />} requiredModule="Invoices" />}
              />
              <Route 
                path="/invoice-coa"
                element={<ProtectedRoute element={<InvoiceCOA />} requiredModule="Invoices" />}
              />
              <Route 
                path="/invoice-licencing"
                element={<ProtectedRoute element={<InvoiceLicencing />} requiredModule="Invoices" />}
              />

              {/* Payment Voucher routes */}
              <Route 
                path="/new-voucher-supplier"
                element={<ProtectedRoute element={<NewVoucherSupplier />} requiredModule="Expenditure" />}
              />
              <Route 
                path="/new-voucher-employee"
                element={<ProtectedRoute element={<NewVoucherEmployee />} requiredModule="Expenditure" />}
              />
              <Route path="/new-voucher-bulk"element={<ProtectedRoute element={<NewVoucherBulk />} requiredModule="Expenditure" />}/>
              <Route ath="/vouchers"element={<ProtectedRoute element={<PaymentVouchers />} requiredModule="Expenditure" />}/>
              <Route path="/voucher-authorization"element={<ProtectedRoute element={<VoucherAuthorization />} requiredModule="Expenditure" />}/>

              {/* Cashbook routes */}
              <Route path="/cashbooks/:id"element={<ProtectedRoute element={<CashbookLedger />} requiredModule="Cash Books" />}/>
              <Route path="/cashbooks/:id/income-journal"element={<ProtectedRoute element={<IncomeJournal />} requiredModule="Cash Books" />}/>
              <Route path="/cashbooks/:id/expenditure-journal"element={<ProtectedRoute element={<ExpenseJournal />} requiredModule="Cash Books" />}/>
              <Route path="/cashbooks/:id/cashbook-ledger"element={<ProtectedRoute element={<CashbookLedger />} requiredModule="Cash Books" />}/>
              <Route path="/cashbooks/:id/cashbook-summary"element={<ProtectedRoute element={<CashbookSummary />} requiredModule="Cash Books" />}/>

              {/* ACTIONS */}
              <Route path="/import-coa"element={<ProtectedRoute element={<ImportChartOfAccounts />} requiredModule="Actions" />}/>
              <Route path="/import-valuation-roll"element={<ProtectedRoute element={<ImportValuationRoll />} requiredModule="Actions" />}/>
              <Route path="/import-rates-transactions"element={<ProtectedRoute element={<ImportRatesTransactions />} requiredModule="Actions" />}/>

              {/* PROCESSING ROUTES */}
              <Route path="/process-rates"element={<ProtectedRoute element={<ProcessPropertyRates />} requiredModule="Processing" />}/>
              <Route path="/import-property-process-list"element={<ProtectedRoute element={<ImportPropertyProcessList />} requiredModule="Processing" />}/>

              {/* REPORTS */}
              <Route path="/chart-of-accounts/:accountType"element={<ProtectedRoute element={<ChartOfAccounts />} requiredModule="Reports" />}/>
              <Route path="/receipts-ledger" element={<ProtectedRoute element={<ReceiptsLedger />} requiredModule="Reports" />} />
              <Route path="/rates-bills" element={<ProtectedRoute element={<RatesBills />} requiredModule="Reports" />} />
              <Route path="/rates-bills-with-balances" element={<ProtectedRoute element={<RatesBillsWithBalances />} requiredModule="Reports" />} />
              <Route path="/rates-statement" element={<ProtectedRoute element={<PropertyRatesStatement />} requiredModule="Reports" />} />

              {/* ASSET MANAGEMENT */}
              <Route path="/property-leases" element={<ProtectedRoute element={<PropertyLeases />} requiredModule="Asset Management" />} />
            </Routes>
          </div>
          <button className="fab" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaTh />
          </button>
          <Link to={"/home"}>
          <button className="home">
            <FaHome />
          </button></Link>
          <Link to={"/profile"}>
          <button className="btn-profile">
            <FaUserAlt />
          </button></Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
