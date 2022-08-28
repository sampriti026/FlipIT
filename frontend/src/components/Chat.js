import React, { useEffect } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';



function Chat({id}) {
 
  

  return (
    <div>
    <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          Default
        </InputGroup.Text>
        <Form.Control type="text" placeholder="Normal text" />
 </InputGroup>
    </div>
  );
}

export default Chat;
