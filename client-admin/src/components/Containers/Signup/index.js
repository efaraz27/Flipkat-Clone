import React from 'react'
import Layout from '../../Layout';
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Input from '../../UI/Input'
function Signup() {
    return (
        <Layout>
        <Container>
          <Row style={{marginTop:'50px'}}>
            <Col md={{span:6, offset:3 }}>
              <Form>
                  <Row>
                      <Col md={6}>
                        <Input
                            label='First Name'
                            placeholder="First Name"
                            value=""
                            type="text"
                            onChange={()=>{}}
                        />
                      </Col>
                      <Col md={6}>
                      <Input
                            label='Last Name'
                            placeholder="Last Name"
                            value=""
                            type="text"
                            onChange={()=>{}}
                        />
                      </Col>
                  </Row>
                    <Input
                        label='Email'
                        placeholder="Email"
                        value=""
                        type="email"
                        onChange={()=>{}}
                    />
                    <Input
                        label='Password'
                        placeholder="Password"
                        value=""
                        type="password"
                        onChange={()=>{}}
                    />
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Layout>
    )
}

export default Signup
