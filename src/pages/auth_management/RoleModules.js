import React, { useEffect, useState } from 'react';
import { useParams, useLocation  } from "react-router-dom";
import { addRoleModule, deleteRoleModule, getModules, getRoleModules } from '../../_services/authServices';
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";

function RoleModules (){
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [modules, setModules] = useState([]);
const [assigned, setAssigned] = useState([]);

  const location = useLocation();
  const { roleId, roleName } = location.state || {};
    
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const result = await getModules(); 
        setModules(result.rows);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRoleModules = async () => {
      try {
        const result = await getRoleModules(roleId); 
        setAssigned(result.rows.map(m => m.moduleId));
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchModules();
    fetchRoleModules();
  }, []);
  
  const handleToggle = async (moduleId, isChecked) => {
    if (isChecked) {
      try {
        await addRoleModule(roleId, moduleId); 
        setAssigned(prev => [...prev, moduleId]);
      } catch (err) {
        alert(err.message || 'Something went wrong.');
        setError(err.message || 'Something went wrong.');
      }
    } else {
      try {
        await deleteRoleModule(roleId, moduleId); 
        setAssigned(prev => prev.filter(id => id !== moduleId));
      } catch (err) {
        alert(err.message || 'Something went wrong.');
        setError(err.message || 'Something went wrong.');
      }
    }
  };

  return (
    <div className="form-container mb-5">
      <h2 className="page-title text-center mb-4">System Modules for { roleName}'s Access</h2>
      <Table striped bordered hover className="data-table" responsive>
        <thead className="table-dark">
          <tr>
            <th>Module</th>
            <th>Access</th>
          </tr>
        </thead>
        <tbody>
          {modules.map(mod => (
            <tr key={mod.moduleId}>
              <td>{mod.moduleName}</td>
              <td>
                <input
                  type="checkbox"
                  checked={assigned.includes(mod.moduleId)}
                  onChange={(e) => handleToggle(mod.moduleId, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default RoleModules;
