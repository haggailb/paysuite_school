import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Modal } from 'react-bootstrap';
import {FaUser, FaFile } from "react-icons/fa";
import './styles/MainNavbar.css';
import { Link } from "react-router-dom";
import ConfirmLogOut from '../pages/auth_management/ConfirmLogOut';

const MainNavbar = () => {
  const [showNewModal, setShowConfirmLogout] = useState(false);
  const handleShowNewModal = () => setShowConfirmLogout(true);
  
  const handleCloseModal = () => {
    setShowConfirmLogout(false);
  };
  
  const allowedModules = JSON.parse(sessionStorage.getItem("allowedModules") || "[]");
  return (
    <Navbar expand="lg" fixed="top" className="dashboard-navbar bg-primary">
      <Container fluid>
        <Navbar.Brand href="/home">
          <img
              src="images/logo-bg.png"
              alt="Logo"
              className="logo"
            />
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <NavDropdown 
              title={<><FaFile style={{ marginRight: "5px" }} /> File</>} 
              id="file-dropdown" className='hoverable'
            >
              <NavDropdown.Item href="./view-institution">Institutional Information</NavDropdown.Item>
              {/* <NavDropdown.Item href="#others">Others</NavDropdown.Item> */}
            </NavDropdown>
              {
                allowedModules.includes("Actions") ? (
                  <>
                    <NavDropdown title="Actions" id="actions-dropdown" className='hoverable'>
                      <NavDropdown.Item href="/import-coa">Import COA</NavDropdown.Item>
                      <NavDropdown.Item href="/import-valuation-roll">Import Valuation Roll</NavDropdown.Item>
                      <NavDropdown.Item href="/import-rates-transactions">Import Bulk Rates Transactions</NavDropdown.Item>
                      {/* <NavDropdown.Item href="#import-clients">Import Clients</NavDropdown.Item>
                      <NavDropdown.Item href="#import-receipts">Import Receipts</NavDropdown.Item>
                      <NavDropdown.Item href="#import-employees">Import Employees</NavDropdown.Item> */}
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <NavDropdown title="Actions" id="actions-dropdown" className='hoverable' disabled>
                      
                    </NavDropdown>
                  </>
                )
              }
              {
                allowedModules.includes("Processing") ? (
                  <>
                  <NavDropdown title="Processing" id="processing-dropdown" className='hoverable'>
                    <NavDropdown.Item href="/process-rates">Property Rates</NavDropdown.Item>
                    {/* <NavDropdown.Item href="#property-rentals">Property Rentals</NavDropdown.Item>
                    <NavDropdown.Item href="#trading-licenses">Trading Licenses</NavDropdown.Item>
                    <NavDropdown.Item href="#waste-management">Waste Management</NavDropdown.Item>
                    <NavDropdown.Item href="#billboards">Billboards</NavDropdown.Item>
                    <NavDropdown.Item href="#market-stands">Market Stands</NavDropdown.Item>
                    <NavDropdown.Item href="#demand-notices">Demand Notices</NavDropdown.Item>
                    <NavDropdown.Item href="#warrant-of-distress">Warrant of Distress</NavDropdown.Item> */}
                  </NavDropdown>
                  </>
                ) : (
                  <>
                  <NavDropdown title="Processing" id="processing-dropdown" className='hoverable' disabled>
                    
                  </NavDropdown>
                  </>
                )
              }
              {
                // allowedModules.includes("Configure") ? (
                //   <>
                //   <NavDropdown title="Configure" id="tools-dropdown" className='hoverable'>
                //     <NavDropdown.Item href="./config-institution">Institutional Information</NavDropdown.Item>
                //     <NavDropdown.Item href="./departments">Departments</NavDropdown.Item>
                //     <NavDropdown.Item href="/units">Units</NavDropdown.Item>
                //     <NavDropdown.Item href="./titles">Job Titles</NavDropdown.Item>
                //     <NavDropdown.Item href="./employees">Employees</NavDropdown.Item>
                //     <NavDropdown.Item href="./documents">Document Setup</NavDropdown.Item>
                //     <NavDropdown.Item href="./signatories">Signatories</NavDropdown.Item>
                //   </NavDropdown>
                //   </>
                // ) : (
                //   <>
                //   <NavDropdown title="Configure" id="tools-dropdown" className='hoverable' disabled>
                    
                //   </NavDropdown>
                //   </>
                // )
              }
              {
                allowedModules.includes("Tools") ? (
                  <>
                  <NavDropdown title="Tools" id="tools-dropdown" className='hoverable'>
                    <NavDropdown.Item href="#database-backup">Database Backup</NavDropdown.Item>
                    <NavDropdown.Item href="#restore-database">Restore Database</NavDropdown.Item>
                  </NavDropdown>
                  </>
                ) : (
                  <>
                  <NavDropdown title="Tools" id="tools-dropdown" className='hoverable' disabled>
                    
                  </NavDropdown>
                  </>
                )
              }
              {
                allowedModules.includes("Audit") ? (
                  <>
                  <NavDropdown title="Audit" id="audit-dropdown" className='hoverable'>
                    {/* <NavDropdown.Item href="#user-access-logs">User Access Logs</NavDropdown.Item>
                    <NavDropdown.Item href="#user-activity">User Activity</NavDropdown.Item>
                    <NavDropdown.Item href="#change-log">Change Log</NavDropdown.Item>
                    <NavDropdown.Item href="#approvals">Approvals</NavDropdown.Item>
                    <NavDropdown.Item href="#activity-flags">Activity Flags</NavDropdown.Item> */}
                  </NavDropdown>
                  </>
                ) : (
                  <>
                  <NavDropdown title="Audit" id="audit-dropdown" className='hoverable' disabled>
                    
                  </NavDropdown>
                  </>
                )
              }
          </Nav>

          {/* Right: User Icon with Dropdown */}
          <Nav className="ms-auto">
            <NavDropdown title={<FaUser size={20} />} id="user-dropdown" align="end">
              {/* <NavDropdown.Item href="#my-profile">My Profile</NavDropdown.Item>
              <NavDropdown.Item href="#access-logs">Access Logs</NavDropdown.Item>
              <NavDropdown.Divider /> */}
              <NavDropdown.Item onClick={handleShowNewModal}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        
        <Modal show={showNewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
          <Modal.Header closeButton className="bg-danger">
            <Modal.Title className="text-center text-white">Confirm Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <ConfirmLogOut />
          </Modal.Body>
        </Modal>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
