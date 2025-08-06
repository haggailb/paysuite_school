// pages/Classes.js
import React, { useState } from 'react';
import { Table, Pagination, Card, Container, Row, Col } from 'react-bootstrap';
// import './styles/Classes.css';

const classData = [
  'Computer Science', 'Business Administration', 'Accounting',
  'Nursing', 'Marketing', 'Mechanical Engineering',
  'Electrical Engineering', 'Law', 'Economics', 'Information Technology',
  'Psychology', 'Biology', 'Chemistry', 'Physics', 'Mathematics'
];

const Classes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 5;

  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = classData.slice(indexOfFirstClass, indexOfLastClass);
  const totalPages = Math.ceil(classData.length / classesPerPage);

  return (
    <Container fluid className="classes-page">
      <h2 className="mb-4">🎓 Class List</h2>
      <Row className="g-4">
        {currentClasses.map((className, index) => (
          <Col key={index} md={6} lg={4}>
            <Card className="class-card shadow-sm">
              <Card.Body>
                <Card.Title className="text-primary">{className}</Card.Title>
                <Card.Text>Class ID: {indexOfFirstClass + index + 1}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Container>
  );
};

export default Classes;