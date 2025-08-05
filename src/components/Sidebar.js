import React, { useState, useEffect, useRef } from "react";
import { FaAngleRight, FaWallet, FaTh, FaReceipt, FaTools, FaTachometerAlt, FaUsers, FaFileInvoice, FaChartPie, FaChartBar, FaCog, FaDollarSign, FaBook, FaEdit, FaLock } from "react-icons/fa";
import "./styles/Sidebar.css";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [activeButton, setActiveButton] = useState("Dashboard");
  const [dropdowns, setDropdowns] = useState({});
  const sidebarRef = useRef(null);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const navigate = useNavigate();
  
  const goToLink = (link) => {
    setDropdowns({});
    navigate(link);
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const toggleDropdown = (menu) => {
    setDropdowns((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key) => ({ ...acc, [key]: false }), {}), // Close other dropdowns
      [menu]: !prevState[menu],
    }));
  };

  useEffect(() => { 
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".fab")
      ) {
        setIsSidebarOpen(false);
        setDropdowns({});
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });
  
const menuItems = [
  { 
    disabled: "disabled",
    key: "kyc", 
    icon: <FaUsers />, 
    label: "KYC", 
    links: [
      { name: "Clients", path: "/clients" }, 
      { name: "Business Accounts", path: "/businesses" },
      { name: "Suppliers", path: "/suppliers" }, 
      // { name: "Online Logs", path: "#" }, 
      // { name: "KYC Queries", path: "#" }, 
    ] 
  },
  // { 
  //   disabled: "disabled",
  //   key: "invoices", 
  //   icon: <FaFileInvoice />, 
  //   label: "Invoices", 
  //   links: [
  //     { name: "Billable Items", path: "/invoice-billable" }, 
  //     { name: "Non-Billable ( C.O.A )", path: "/invoice-coa" }, 
  //     { name: "Licencing", path: "/invoice-licencing" }
  //   ] 
  // },
  { 
    disabled: "disabled",
    key: "pos", 
    icon: <FaReceipt />, 
    label: "Point of Sale", 
    links: [
      // { name: "Single Item ( C.O.A )", path: "/pos-single-coa" },
      { name: "Property Rates", path: "/pos-rates" },
      // { name: "Rentals", path: "/pos-single-billable" },
      // { name: "Multiline ( Billable )", path: "/pos-multiline-billable" },
      // { name: "Multiline ( C.O.A )", path: "/pos-multiline-coa" },
      // { name: "Trading Licences", path: "/pos-online" },
      // { name: "Online Payments", path: "/pos-online" },
      // { name: "Existing Invoice", path: "/pos-invoice" },
      // { name: "Grants & Others", path: "/pos-grants" },
    ] 
  },
  // { 
  //   disabled: "disabled",
  //   key: "payments", 
  //   icon: <FaWallet />, 
  //   label: "Expenditure", 
  //   links: [
  //     { name: "New Vouchers ( Suppliers )", path: "/new-voucher-supplier" },
  //     { name: "New Vouchers ( Employee )", path: "/new-voucher-employee" },
  //     { name: "New Vouchers ( Bulk )", path: "/new-voucher-bulk" },
  //     { name: "Payment Vouchers", path: "/vouchers" },
  //     { name: "Voucher Authorization", path: "/voucher-authorization" }
  //   ] 
  // },
  { 
    disabled: "disabled",
    key: "properties", 
    icon: <FaTh />, 
    label: "Properties", 
    links: [
      { name: "Valuation Roll", path: "/valuation-roll" },
      { name: "Rental Properties", path: "/rental-properties" },
      // { name: "Temporal Stands", path: "/temporal-stands" },
      // { name: "Billboards", path: "/billboards" },
      // { name: "Market Stands", path: "/market-stands" },
    ] 
  },
 
  { 
    disabled: "",
    key: "reports", 
    icon: <FaChartPie />, 
    label: "Reports", 
    links: [
      { name: "C.O.A Income", path: "/chart-of-accounts/income" }, 
      { name: "C.O.A Expenditure", path: "/chart-of-accounts/expenditure" }, 
      { name: "Receipts (Ledger)", path: "/receipts-ledger" }, 
      // { name: "Receipts (C.O.A)", path: "#" },
      // { name: "Recepts (Quaterly)", path: "#" },
      // { name: "Payments (Ledger)", path: "#" },
      // { name: "Payments (C.O.A)", path: "#" },
      // { name: "Payments (Quarterly)", path: "#" },
      { name: "Rates Bills", path: "/rates-bills" },
      { name: "Rates Bills With Balances", path: "/rates-bills-with-balances" },
      // { name: "Property Rates (List)", path: "#" },
      // { name: "Property Rates (Bills and Receipts)", path: "#" },
      // { name: "Property Rates (Single Statement)", path: "#" },
      { name: "Rates Statements", path: "/rates-statement" },
      // { name: "Rental Balances (List)", path: "#" },
      // { name: "Rental Balances (Single Statement)", path: "#" },
      // { name: "Rental Balances (Statements)", path: "#" },
      // { name: "Budget Analysis", path: "#" }
    ] 
  },
  { 
    disabled: "disabled",
    key: "cashbooks", 
    icon: <FaBook />, 
    label: "Cash Books", 
    links: [
      { name: "Cash Books", path: "/cashbooks" }, 
    ] 
  },
  { 
    disabled: "",
    key: "configurations", 
    icon: <FaCog />, 
    label: "Configurations", 
    links: [
      { name: "Banks", path: "/configure-banks" }, 
      { name: "Branches", path: "/configure-branches" }, 
      { name: "Bank Accounts", path: "/configure-bank-accounts" },
      { name: "Default Bank Accounts", path: "/default-bank-accounts" },
      { name: "Business Types", path: "/business-types" },
      { name: "Property Types", path: "/property-types" },
      { name: "Areas / Locations", path: "/locations" },
      { name: "Business Zones", path: "/zones" },
      { name: "Markets", path: "/markets" },
      { name: "Recipt Numbering", path: "/configure-receipt-numbering" },
    ] 
  },
  { 
    disabled: "",
    key: "security", 
    icon: <FaLock />, 
    label: "Security", 
    links: [
      { name: "Roles", path: "/user-roles" }, 
      { name: "Users", path: "/users" },
      // { name: "Permissions", path: "/permissions" },
    ] 
  },
  // { 
  //   disabled: "disabled",
  //   key: "fees", 
  //   icon: <FaDollarSign />, 
  //   label: "Fee Structures", 
  //   links: [
  //     { name: "Chat Of Accounts", path: "/coa-fee-structures" }, 
  //     { name: "Licencing", path: "/licencing-categories" }
  //   ] 
  // },
  { 
    disabled: "disabled",
    key: "assetManagement", 
    icon: <FaTools />, 
    label: "Asset Management", 
    links: [
      // { name: "Asset Register", path: "/asset-register" },
      { name: "Property Leases", path: "/property-leases" }
    ] 
  }
];

const allowedModules = JSON.parse(sessionStorage.getItem("allowedModules") || "[]");

return (    
  <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? "open" : ""} bg-primary`}>
    <button 
        className={`sidebar-button hoverable shadow ${activeButton === "Dashboard" ? "active" : ""}`} 
        onClick={() => handleButtonClick("Dashboard")}
      >
        <Link to="/dashboard" className="sidebar-button">
        <FaTachometerAlt /> Dashboard
        </Link>
      </button>
    {menuItems.map(({ key, icon, label, links, disabled }) => (
      <div key={key}>
        {
          allowedModules.includes(label) ? (
            <>
              <button className="sidebar-button hoverable shadow" onClick={() => toggleDropdown(key)} disabled={false}>
                {icon} {label} <FaAngleRight />
              </button>
              {dropdowns[key] && (
                <div className={`dropdown-menu ${dropdowns[key] ? "show" : ""}`}>
                  {links.map(({ name, path }, index) => (
                    <button key={index} className="sidebar-dropdown-item" onClick={() => goToLink(path)}  >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <button className="sidebar-button hoverable shadow" onClick={() => toggleDropdown(key)} disabled={true}>
                {icon} {label} <FaAngleRight />
              </button>
              {dropdowns[key] && (
                <div className={`dropdown-menu ${dropdowns[key] ? "show" : ""}`}>
                  {links.map(({ name, path }, index) => (
                    <button key={index} className="sidebar-dropdown-item" onClick={() => goToLink(path)}  >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </>
          )
        }
      </div>
    ))}

  </aside>
);

};

export default Sidebar;
