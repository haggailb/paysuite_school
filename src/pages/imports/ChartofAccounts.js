import { useState, useEffect } from "react";
import { Table, Container, Button, Card, Form, Row, Col, Modal } from "react-bootstrap";
import { FaDownload, FaFileImport } from "react-icons/fa";
import Select from "react-select"
import CurrentDate from "../../_utils/formatCurrentDate";
import { uploadCoaExcel } from '../../_services/coaServices';
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
  
  const today = <CurrentDate />;

const ImportChartOfAccounts = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [validated, setValidated] = useState(false);
  const { showMessageModal } = useMessageModal();

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    setValidated(true);
    setLoading(true);
    try {
      const result = await uploadCoaExcel(file);
      showMessageModal({
        heading: 'Upload Successful!',
        message: `${result.message}`,
        messageType: 'success',
      });
    } catch (err) {
      showMessageModal({
        heading: 'Upload Failed!',
        message: `Upload failed: ${err.message}`,
        messageType: 'success',
      });
    }
    setLoading(false);
  };
  
const handleDownload = () => {
  const link = document.createElement('a');
  link.href = '/templates/paysuite_coa_import_template.xlsx'; 
  link.download = 'paysuite_coa_import_template.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return (
    // <div className="text-danger text-center p-4">❌ Error: {error}</div>
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={true} />
    </div>
    );
   
  return (
    <div className=" mb-5">

    <Container className="flex-column justify-content-center align-items-center bg-light">
      <h2 className="page-title text-center mb-4"> Import Chart of Accounts</h2>
      <div className="d-flex position-relative">
      </div>
        <Form noValidate validated={validated} onSubmit={handleUpload}>
        <Row>
          <Col md={{ span: 6, offset:3}} className="mb-3">
            <Card className="h-100 mb-3 shadow">
              <Card.Header>Select Chart of Accounts File</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Control type="file" accept=".xlsx, .xls" onChange={handleChange}  placeholder="Choose file" required />
                  <Form.Control.Feedback type="invalid">
                    Choose a file to upload.
                  </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col xs={6}>
                    <Button type="submit" className="bg-primary hoverable w-100"> <FaFileImport/> Import </Button>
                  </Col>
                  <Col xs={6}>
                    <Button onClick={handleDownload} className="outline-primary me-2 w-100"> Download Template <FaDownload/></Button>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="text-muted">
                <small>Note: Only .xlsx and .csv files are allowed.</small> 
                </Card.Footer>
            </Card>
          </Col>
        </Row>
        </Form>
    </Container>
    </div>
  );
};

export default ImportChartOfAccounts;
