import React, { useState } from "react";
import { Card, Form, Button} from "react-bootstrap";

const NewBusinessCategory = () => {
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

  return (
    <div >
      <Card>
        <Card.Header><i className="text-danger">All fields are mandatory</i></Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Code</Form.Label>
              <Form.Control type="text" placeholder="Enter code" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Enter description" />
            </Form.Group>
            <div md={6} className="">
              <Button onClick={handleSubmit} type="submit" className="bg-primary hoverable">Register</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewBusinessCategory;
