import { useState, useEffect } from "react";
import { Table, Container, Button, Card, Form, Row, Col, Modal } from "react-bootstrap";
import { FaDownload, FaFileImport } from "react-icons/fa";
import Select from "react-select";
import { uploadValuationRoll } from "../../_services/valuationRollServices"; 
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const ImportValuationRoll = () => {
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateClient, setUpdateClient] = useState(false);
  const [updateProperty, setUpdateProperty] = useState(false);

  const { showMessageModal } = useMessageModal();
  const [uploadProgress, setUploadProgress] = useState({ processed: 0, total: 0 });
  const [jobId, setJobId] = useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${BACKEND_URL}/api/valuation-roll`;
    
    const pollProgress = (jobId) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${BASE_URL}/progress/${jobId}`);
          if (!res.ok) throw new Error('Progress fetch failed');
          const data = await res.json();
          setUploadProgress(data);
          if (data.processed >= data.total) {
            clearInterval(interval);
            setLoading(false);
            showMessageModal({
              heading: 'Upload Successful!',
              message: `Imported ${data.total} properties.`,
              messageType: 'success',
            });
          }
        } catch (err) {
          clearInterval(interval);
          setLoading(false);
          showMessageModal({
            heading: 'Error',
            message: err.message || 'Failed to get progress.',
            messageType: 'error',
          });
        }
      }, 1000);
    };
    
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
      const result = await uploadValuationRoll(file, updateClient, updateProperty);
      
    // const { jobId } = await result.json();
    // setJobId(jobId);
    // pollProgress(jobId);
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
            link.download = 'ValuationRollImportErrors.txt';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          } catch (err) {
            console.error("Error downloading file:", err);
            showMessageModal({
              heading: "Download Failed",
              message: "Could not download the error file. Please try again or check the server logs.",
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
    link.href = '/templates/paysuite_valuation_roll_import_template.xlsx';
    link.download = 'paysuite_valuation_roll_import_template.xlsx';
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
        <h2 className="page-title text-center mb-4">Import Valuation Roll</h2>
        <Form noValidate validated={validated} onSubmit={handleUpload}>
          <Row>
            <Col md={{ span: 6, offset: 3 }} className="mb-3">
              <Card className="h-100 mb-3 shadow">
                <Card.Header>Select Valuation Roll File</Card.Header>
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

                  {/* ✅ Checkboxes */}
                  <div className="divider-with-text text-danger">
                    <span>Advanced Options</span>
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox" 
                      label="Update client details"
                      checked={updateClient}
                      onChange={(e) => setUpdateClient(e.target.checked)}
                    />
                    <Form.Check 
                      type="checkbox" 
                      label="Update Property Details if Exists"
                      checked={updateProperty}
                      onChange={(e) => setUpdateProperty(e.target.checked)}
                    />
                  </Form.Group>

                  <Row>
                  <p className="text-danger">For better performance, limit your imports to 5,000 rows</p>
                    <Col xs={6}>
                      <Button type="submit" className="bg-primary hoverable w-100">
                        <FaFileImport /> Import
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

export default ImportValuationRoll;
