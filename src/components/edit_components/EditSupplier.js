import React, { useState } from "react";
import { Card, Form, Row, Col, Button} from "react-bootstrap";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import { updateSupplier } from "../../_services/supplierServices";
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const EditSupplier = ({ supplier = {}  }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();

  const selectedSupplier = supplier;
  
  const handleFieldUpdate = async (e, supplierId, fieldName, newValue) => {
    e.preventDefault();
    setLoading(true);
      try {
        const result = await updateSupplier(supplierId, fieldName, newValue);
        showMessageModal({
          heading: 'Success',
          message: `${result.message || 'Update Successful'}`,
          messageType: 'success',
        });
      } catch (err) {
          showMessageModal({
            heading: 'Server Error!',
            message: `Error: ${err.message || 'An error occured while performing update.'}`,
            messageType: 'error',
          });
      }
      setLoading(false);
  };

  const onFieldKeyDown = (fieldName) => (e) => {
    if (e.key === 'Enter') {
      handleFieldUpdate(e, selectedSupplier.supplierId, fieldName, e.target.value);
    }
  };
  
  if (!supplier) return null;

  return (
    <div >
    <Form>
    <Row>
      <Col lg={6}>
        <Card className="mb-3">
          <Card.Header>Company Details</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Supplier ID:</strong><br></br> {selectedSupplier.supplierId}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    defaultValue={selectedSupplier.supplierId} 
                    disabled 
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Business Name:</strong> <br></br> {selectedSupplier.bName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Enter new name"
                    defaultValue={selectedSupplier.bName}
                    onKeyDown={onFieldKeyDown('bName')}
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Contact Person:</strong> <br></br> {selectedSupplier.contactPerson}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Enter new name"
                    defaultValue={selectedSupplier.contactPerson}
                    onKeyDown={onFieldKeyDown('contactPerson')}
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Address:</strong> <br></br> {selectedSupplier.physicalAddress}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Enter new address" 
                    defaultValue={selectedSupplier.physicalAddress}
                    onKeyDown={onFieldKeyDown('physicalAddress')}
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Mobile Number:</strong> <br></br> {formatMobileNumber(selectedSupplier.mobileNumber)}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Enter new address" 
                    defaultValue={selectedSupplier.mobileNumber}
                    onKeyDown={onFieldKeyDown('mobileNumber')}
                  />
                </Form.Group>
              </Col>  
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>TPIN:</strong> <br></br> {selectedSupplier.tpin}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Enter new TPIN" 
                    defaultValue={selectedSupplier.tpin}
                    onKeyDown={onFieldKeyDown('tpin')}
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>BRN:</strong> <br></br> {selectedSupplier.brn}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Enter new BRN" 
                    defaultValue={selectedSupplier.brn}
                    onKeyDown={onFieldKeyDown('brn')}
                  />
                </Form.Group>
              </Col> 
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={6}>
        <Card>
          <Card.Header>Bank Details</Card.Header>
          <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Bank Name:</strong> <br></br> {selectedSupplier.bankName}</p>
            </Col> 
            <Col md={6}>
              <Form.Group className="my-3">
                <Form.Control 
                  type="text" 
                  placeholder="Enter new bank" 
                  defaultValue={selectedSupplier.bankName}
                  onKeyDown={onFieldKeyDown('bankName')}
                />
              </Form.Group>
            </Col> 
          </Row>
          <Row>
            <Col md={6}>
              <p><strong>Branch :</strong> <br></br> {selectedSupplier.branchName}</p>
            </Col> 
            <Col md={6}>
              <Form.Group className="my-3">
                <Form.Control 
                  type="text" 
                  placeholder="Enter new branch" 
                  defaultValue={selectedSupplier.branchName}
                  onKeyDown={onFieldKeyDown('branchName')}
                />
              </Form.Group>
            </Col> 
          </Row>
          <Row>
            <Col md={6}>
              <p><strong>Sort Code:</strong> <br></br> {selectedSupplier.sortCode}</p>
            </Col> 
            <Col md={6}>
              <Form.Group className="my-3">
                <Form.Control 
                  type="text" 
                  placeholder="Enter new code" 
                  defaultValue={selectedSupplier.sortCode}
                  onKeyDown={onFieldKeyDown('sortCode')}
                />
              </Form.Group>
            </Col> 
          </Row>
          <Row>
            <Col md={6}>
              <p><strong>Swift Code:</strong> <br></br> {selectedSupplier.swiftCode}</p>
            </Col> 
            <Col md={6}>
              <Form.Group className="my-3">
                <Form.Control 
                  type="text" 
                  placeholder="Enter new code" 
                  defaultValue={selectedSupplier.swiftCode}
                  onKeyDown={onFieldKeyDown('swiftCode')}
                />
              </Form.Group>
            </Col> 
          </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </Form>
    </div>
  );
};

export default EditSupplier;
