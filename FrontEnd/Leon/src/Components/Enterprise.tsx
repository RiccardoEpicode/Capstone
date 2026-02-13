import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import "../Style/styles.css";
import "../Style/enterpriseform.css";
import Footer from "./Nav/Footer";
const Enterprise = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    country: "",
    city: "",
    postalCode: "",
    message: "",
  });
  const [validated, setValidated] = useState(false);

  const handleShowForm = (plan: string) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setValidated(false);
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phoneNumber: "",
      country: "",
      city: "",
      postalCode: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      console.log("Form submitted successfully!");
    }
  };

  return (
    <main className="enterprise-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="logo-wrapper mb-4">
                <div className="logo-circle">
                  <img src="/Leon.png" alt="Leon Logo" className="about-logo" />
                </div>
              </div>
              <h1 className="about-title mb-4">LEON for Enterprise</h1>
              <p className="about-lead">
                Scalable IT service management solutions tailored for growing
                businesses and large organizations.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="about-section features-grid-section">
        <Container>
          <div className="text-center mb-5">
            <div className="section-badge mb-3">Our Plans</div>
            <h2 className="section-heading mb-3">
              Find the Perfect Plan for Your Business
            </h2>
            <p className="section-subtitle">
              Choose from our flexible options, designed to meet your specific
              needs.
            </p>
          </div>
          <Row className="g-4 align-items-stretch">
            <Col lg={4} md={6}>
              <Card className="pricing-card h-100">
                <Card.Header className="pricing-card-header">Basic</Card.Header>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="pricing-card-title">
                    $49/month
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    <ul className="list-unstyled pricing-features">
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Up to 10 agents
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Basic ticket management
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Email support
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Standard analytics dashboard
                      </li>
                      <li>
                        <i className="fas fa-times-circle me-2 text-danger"></i>{" "}
                        Phone support
                      </li>
                      <li>
                        <i className="fas fa-times-circle me-2 text-danger"></i>{" "}
                        SLA management
                      </li>
                      <li>
                        <i className="fas fa-times-circle me-2 text-danger"></i>{" "}
                        Custom integrations
                      </li>
                    </ul>
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleShowForm("Basic")}
                  >
                    Contact Us
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="pricing-card h-100 featured-plan">
                <Card.Header className="pricing-card-header">Pro</Card.Header>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="pricing-card-title">
                    $99/month
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    <ul className="list-unstyled pricing-features">
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Up to 50 agents
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Advanced ticket management
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Priority email and phone support
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Advanced analytics & reporting
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        SLA management
                      </li>
                      <li>
                        <i className="fas fa-times-circle me-2 text-danger"></i>{" "}
                        Custom integrations
                      </li>
                      <li>
                        <i className="fas fa-times-circle me-2 text-danger"></i>{" "}
                        Dedicated account manager
                      </li>
                    </ul>
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleShowForm("Pro")}
                  >
                    Contact Us
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="pricing-card h-100">
                <Card.Header className="pricing-card-header">
                  Enterprise
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="pricing-card-title">
                    Contact Us
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    <ul className="list-unstyled pricing-features">
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Unlimited agents
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        24/7 dedicated support
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        On-premise deployment options
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Custom integrations
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Dedicated account manager
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Advanced security features
                      </li>
                      <li>
                        <i className="fas fa-check-circle me-2 text-success"></i>{" "}
                        Custom development & training
                      </li>
                    </ul>
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleShowForm("Enterprise")}
                  >
                    Contact Us
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <div className="cta-card">
            <Row className="align-items-center">
              <Col lg={8}>
                <h2 className="cta-title mb-3">Ready to Elevate Your IT?</h2>
                <p className="cta-description mb-0">
                  Get in touch with our sales team to discuss custom enterprise
                  solutions.
                </p>
              </Col>
              <Col lg={4} className="text-lg-end mt-4 mt-lg-0">
                <Button
                  variant="primary"
                  className="btn-modern btn-primary btn-lg"
                  onClick={() => handleShowForm("General Inquiry")}
                >
                  <span>Contact Us</span>
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                    />
                  </svg>
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <Footer />

      {/* Contact Form Modal */}
      <Modal
        show={showForm}
        onHide={handleCloseForm}
        centered
        className="enterprise-contact-form-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Contact Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="form-description">
            Fill up the form below to send us a message about the{" "}
            {selectedPlan !== "General Inquiry"
              ? `${selectedPlan} Plan`
              : "your inquiry"}
            .
          </p>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            action="https://api.web3forms.com/submit"
            method="POST"
          >
            <input
              type="hidden"
              name="access_key"
              value="YOUR_ACCESS_KEY_HERE"
            />
            <input
              type="hidden"
              name="subject"
              value={`New Submission from LEON - ${selectedPlan} Plan Inquiry`}
            />
            <input
              type="checkbox"
              name="botcheck"
              id=""
              style={{ display: "none" }}
            />

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your first name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Doe"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your last name.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Company Inc."
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your company name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@company.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="+1 (555) 1234-567"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your phone number.
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your country.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your city.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formPostalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your postal code.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Label>Your Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your message.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCloseForm}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Send Message
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default Enterprise;
