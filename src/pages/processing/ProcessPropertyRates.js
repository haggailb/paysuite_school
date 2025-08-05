import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Container, Button, Card, Form, Row, Col, Modal } from "react-bootstrap";
import { FaDownload, FaFileImport, FaInfoCircle } from "react-icons/fa";
import Select from "react-select";
import CurrentDate from "../../_utils/formatCurrentDate";
import { getLocations } from '../../_services/locationServices';
import { getTypes } from '../../_services/propertyTypeServices';
import { processRates } from '../../_services/bulkProcessingServices';
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const today = <CurrentDate />;

const ProcessPropertyRates = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showMessageModal } = useMessageModal();
  const [error, setError] = useState('');

  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const currentYear = new Date().getFullYear();
  const [halfYear, setHalfYear] = useState(1);
  const [year, setYear] = useState(currentYear);
  const [locationId, setLocationId] = useState(0);
  const [propertyTypeId, setPropertyTypeId] = useState(0);
      
  const fetchLocations = async () => {
    try {
      const result = await getLocations(); 
      setLocations(result.rows);
    } catch (err) {
      showMessageModal({
        heading: 'failed to retrieve locations!',
        message: `Error: ${err.message || 'Something went wrong.'}`,
        messageType: 'error',
      });
    }
  };
  
  const fetchPropertyTypes = async () => {
    try {
      const result = await getTypes(); 
      setPropertyTypes(result.rows);
    } catch (err) {
      showMessageModal({
        heading: 'failed to retrieve property types!',
        message: `Error: ${err.message || 'Something went wrong.'}`,
        messageType: 'error',
      });
    }
  };
  
  useEffect(() => {
    setLoading(true);
    fetchLocations();
    fetchPropertyTypes();
    setLoading(false);
  }, []);

  const downloadFile = async (fileUrl, fileName) => {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
  
  const handleSubmit = async (e) => {
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
      const processParameters = {
        period: halfYear,
        year: year,
        locationId:locationId,
        propertyTypeId:propertyTypeId
      };
      const result = await processRates(processParameters);
      if (result.status === 200){
        showMessageModal({
          heading: 'Processing Complete!',
          message: result.message,
          messageType: 'success',
        });
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const invalidLogFile = `${backendUrl}${result.invalidLogFile}`;
        const skippedLogFile = `${backendUrl}${result.skippedLogFile}`;
        try {
          await Promise.all([
            downloadFile(invalidLogFile, 'InvalidProperties.csv'),
            downloadFile(skippedLogFile, 'SkippedProperties.csv'),
          ]);
        } catch (error) {
          console.error('File download error:', error.message);
          // showMessageModal({
          //   heading: 'File download failed!',
          //   message: `Error: ${error.message}`,
          //   messageType: 'error',
          // });
        }
      }else{
        showMessageModal({
          heading: 'Processing failed!',
          message: `Error: ${result.message}`,
          messageType: 'error',
        });
      }
    } catch (error) {
      showMessageModal({
        heading: 'Processing failed!',
        message: `${error.message}`,
        messageType: 'error',
      });
      // console.error("❌ Error submitting form:", error.message);
    }
    setLoading(false);
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
        <h2 className="page-title text-center mb-4">Process Property Rates</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={{ span: 6, offset: 3 }} className="mb-3">
              <Card className="h-100 mb-3 shadow">
                <Card.Header>Pick your options</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-sm-3">
                        <Form.Label>Choose Period</Form.Label>
                        <select
                          name="period"
                          className="form-select"
                          value={halfYear}
                          onChange={(e) => setHalfYear(e.target.value)}
                          required
                        >
                          <option value="1">January - June</option>
                          <option value="2">July - December</option>
                        </select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-sm-3">
                        <Form.Label>Choose Year</Form.Label>
                        <select
                          className="form-select"
                          value={year}
                          required
                          onChange={(e) => setYear(e.target.value)}
                        >
                          <option value={currentYear - 1}>{currentYear - 1}</option>
                          <option value={currentYear}>{currentYear}</option>
                          <option value={currentYear + 1}>{currentYear + 1}</option>
                        </select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="divider-with-text text-danger">
                    <span>Advanced Options</span>
                  </div>
                  <Form.Group className="my-3">
                    <Form.Label>Location</Form.Label>
                    <Select
                      required
                      options={[
                        { locationId: 0, locationName: "All" },
                        ...locations,
                      ]}
                      defaultValue={{ locationId: 0, locationName: "All" }}
                      getOptionLabel={(e) => e.locationName}
                      getOptionValue={(e) => e.locationId}
                      onChange={(e) => setLocationId(e.locationId)}
                      placeholder="-- Select Location --"
                    />
                  </Form.Group>
                  <Form.Group className="my-3">
                    <Form.Label>Property Type</Form.Label>
                    <Select
                      required
                      options={[
                        { propertyTypeId: 0, propertyTypeName: "All" },
                        ...propertyTypes,
                      ]}
                      defaultValue={{ propertyTypeId: 0, propertyTypeName: "All" }}
                      getOptionLabel={(e) => e.propertyTypeName}
                      getOptionValue={(e) => e.propertyTypeId}
                      onChange={(e) => setPropertyTypeId(e.propertyTypeId)}
                      placeholder="-- Select Property Type --"
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6} className="">
                      <Button type="submit" className="bg-primary hoverable w-100">Process</Button>
                    </Col>
                    <Col md={6} className="">
                      <Link to='/import-property-process-list' type="button" className=" shadow w-100 mt-2">Upload file to process</Link>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="text-muted text-center">
                  <small> <FaInfoCircle /> processing rates can slow your computer and may take long depending on your dataset.</small>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default ProcessPropertyRates;
