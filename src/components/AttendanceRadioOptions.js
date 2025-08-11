import React from "react";
import { Form } from "react-bootstrap";

export default function AttendanceRadio({ value, onChange, namePrefix }) {
  const options = ["Present", "Sick", "Absent", "Exempted"];

  return (
    <Form>
      {options.map((option) => (
        <Form.Check
          key={option}
          inline
          type="radio"
          label={option}
          value={option}
          name={namePrefix} // ensures grouping per record
          checked={value === option}
          onChange={(e) => onChange(e.target.value)}
        />
      ))}
    </Form>
  );
}
