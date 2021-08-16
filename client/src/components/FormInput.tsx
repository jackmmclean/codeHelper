import React from "react";
import Form from "react-bootstrap/Form";

interface FormInputProps {
  id: string;
  name?: string;
  type: string;
  className?: string;
  as?: any;
  options?: any;
  style?: any;
  ref?: any;
  minLength?: any;
  maxLength?: any;
  handleChange: (e: any) => any;
}

export default function FormInput({
  id,
  name,
  type,
  as = undefined,
  options = undefined,
  className = "mb-3",
  handleChange,
  minLength,
  maxLength,
  style,
}: FormInputProps) {
  if (name !== undefined) {
    return (
      <Form.Group style={style} id={id} className={className}>
        <Form.Label>{name}</Form.Label>
        <Form.Control
          type={type}
          as={as}
          onChange={(e) => handleChange(e.target.value)}
          required
          minLength={minLength}
          maxLength={maxLength}
        >
          {options &&
            options.map((optionObj: any) => (
              <option value={optionObj.optionValue} key={optionObj.optionText}>
                {optionObj.optionText}
              </option>
            ))}
        </Form.Control>
      </Form.Group>
    );
  }
  return (
    <Form.Group style={style} id={id} className={className}>
      <Form.Control
        type={type}
        as={as}
        onChange={(e) => handleChange(e.target.value)}
        required
      >
        {options &&
          options.map((optionObj: any) => (
            <option value={optionObj.optionValue} key={optionObj.optionText}>
              {optionObj.optionText}
            </option>
          ))}
      </Form.Control>
    </Form.Group>
  );
}
