import { useState, useEffect } from "react";
import { Table, Container, Button, Card, Form, Row, Col, Modal } from "react-bootstrap";
import { FaDownload, FaFileImport } from "react-icons/fa";
import Select from "react-select";
import { uploadTransactions } from "../../_services/valuationRollServices"; 
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const ImportRatesTransactions = () => {
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState(1);

  const { showMessageModal } = useMessageModal();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
   
  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setValidated(true);
      setLoading(true);
      const result = await uploadTransactions(file, transactionType);
      
      !result.success ?
        showMessageModal({
          heading: 'Upload Failed!',
          message: `${result.message}`,
          messageType: 'error',
        })
      :
        showMessageModal({
          heading: 'Upload Complete!',
          message: `${result.message}`,
          messageType: 'success',
        })       
        if (result.skipped > 0) {
          const errorUrl = `${BACKEND_URL}${result.errorFile}`;
          try {
            const response = await fetch(errorUrl);
            if (!response.ok) throw new Error("Failed to fetch error file.");
        
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
        
            const link = document.createElement('a');
            link.href = url;
            link.download = 'property_rates_balances_import_errors.txt';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          } catch (err) {
            console.error("Error downloading file:", err);
            showMessageModal({
              heading: "Download Failed",
              message: "Could not download the error file. Please try again or manually download from the server logs.",
              messageType: "error"
            });
          }
        }
    } catch (err) {
      showMessageModal({
        heading: 'Server Error!',
        message: `Upload failed: ${err.message || 'Something went wrong.'}`,
        messageType: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/templates/paysuite_rates_balances_import_template.xlsx';
    link.download = 'paysuite_rates_balances_import_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={true} />
    </div>
  );

  return (
    <div className="mb-5">
      <Container className="flex-column justify-content-center align-items-center bg-light">
        <h2 className="page-title text-center mb-4">Import Property Rates Balances</h2>
        <Form noValidate validated={validated} onSubmit={handleUpload}>
          <Row>
            <Col md={{ span: 6, offset: 3 }} className="mb-3">
              <Card className="h-100 mb-3 shadow">
                <Card.Header>Select File</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={(e) => setFile(e.target.files[0])}
                      required
                      placeholder="Choose file"
                    />
                    <Form.Control.Feedback type="invalid">
                      Choose a file to upload.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Transaction Type</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        label="Opening Balances"
                        name="transactionType"
                        id="balance"
                        value={2}
                        onChange={(e) => setTransactionType(e.target.value)}
                      />
                      <br></br>
                      <Form.Check
                        inline
                        type="radio"
                        label="Debit / ( Payment / Receipt )"
                        name="transactionType"
                        id="payment"
                        value={1}
                        onChange={(e) => setTransactionType(e.target.value)}
                      />
                      <br></br>
                      <Form.Check
                        inline
                        type="radio"
                        label="Credit / ( Bill / Charge / Invoice )"
                        name="transactionType"
                        id="bill"
                        value={3}
                        onChange={(e) => setTransactionType(e.target.value)}
                      />
                    </div>
                    <Form.Label> <strong>Note:</strong> All negative values will be treated as payments</Form.Label>
                  </Form.Group>
                  <Row>
                  <p className="text-danger">For better performance, limit your imports to 5,000 rows</p>
                    <Col xs={6}>
                      <Button type="submit" className="bg-primary hoverable w-100">
                        <FaFileImport /> Import Balances
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button onClick={handleDownload} className="outline-primary me-2 w-100">
                        Download Template <FaDownload />
                      </Button>
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

export default ImportRatesTransactions;
