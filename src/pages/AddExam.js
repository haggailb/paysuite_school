
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert, ListGroup } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import Select from "react-select";
import { sampleSchedules} from '../_services/dataServices';
import { useLocation, useParams } from "react-router-dom";
import NewExam from '../components/NewExam';

const AddExam = () => {
  const { examCode } = useParams();
  const location = useLocation();
  const exam = location.state?.exam; 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle, setBackUrl } = usePage();
  const [validated, setValidated] = useState(false);
  
  const [formData, setFormData] = useState({
    userLevel: '',
    modueId: 0,
    mobuleName: '',
  });
  useEffect(() => {
    setPageTitle('Add New Exam');
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (field, selectedValue) => {
    if (!selectedValue) return;
    setFormData(prev => ({
      ...prev,
      [field]: selectedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    setValidated(true);
    setLoading(true);
      
    setLoading(false);
  };

  return (
    <div>
      <Row>
        <Col xl={8} className='offset-xl-2'>
          <NewExam />
        </Col>
      </Row>
    </div>
  );
};

export default AddExam;