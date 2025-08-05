import React, { useState } from "react";
import { Card, Form, Row, Col, Button} from "react-bootstrap";

const EditBusinessCategory = ({ category = {}  }) => {
  const [validated, setValidated] = useState(false);
  const [newBusinessTypes, setNewBusinessTypes] = useState({
    code: "",
    name: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      console.log(newBusinessTypes);
    } else {
      setValidated(false);
  };
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBusinessTypes({ ...newBusinessTypes, [name]: value });
  };
  
  if (!category) return null;

  return (
    <div >
    <Card>
      <Card.Header><i>Press enter to submit.</i></Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}><h3> Current Details</h3> </Col> 
          <Col md={6}><h3> New Details</h3> </Col> 
        </Row>
        <Row>
          <Col md={6}>
            <p><strong>Code:</strong><br></br> {category?.code}</p>
          </Col> 
          <Col md={6}>
            <Form.Group className="my-3">
              <Form.Control type="text" placeholder="Enter new code" />
            </Form.Group>
          </Col> 
        </Row>
        <Row>
          <Col md={6}>
            <p><strong>Name:</strong> <br></br> {category?.name}</p>
          </Col> 
          <Col md={6}>
            <Form.Group className="my-3">
              <Form.Control type="text" placeholder="Enter new name" />
            </Form.Group>
          </Col> 
        </Row>
        <Row>
          <Col md={6}>
            <p><strong>Description:</strong> <br></br> {category?.desc}</p>
          </Col> 
          <Col md={6}>
            <Form.Group className="my-3">
              <Form.Control type="text" placeholder="Enter new description" />
            </Form.Group>
          </Col> 
        </Row>
      </Card.Body>
    </Card>
    </div>
  );
};

export default EditBusinessCategory;
