
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Accordion } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';

const BlankTemplate = () => {
  const { setPageTitle, setBackUrl } = usePage();
  useEffect(() => {
    setPageTitle('Blank Template Page');
    setBackUrl('/');
  }, []);

  return (
    <>
      <h1> Blank bage </h1>
    </>
  );
};

export default BlankTemplate;
