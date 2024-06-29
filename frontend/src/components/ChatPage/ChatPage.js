import React from 'react';
import PropTypes from 'prop-types';
import styles from './ChatPage.module.css';
import Sidebar from '../Sidebar/Sidebar';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Chat from '../Chat/Chat';
// import {faArrowUp} 

const ChatPage = () => {
  let params = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [messages, setMessages] = useState([])

  useEffect(() => {
    //fetch messages based on chat id

    console.log(params.chatId)
  }, [params.chatId]);

  const getUserDetails = async (accessToken) => {
    fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
    )
      .then(async (response) => {
        if (response.ok) {
          // console.log(response.json())
          const data = await response.json();
          setUserDetails(data);
        }
        else {
          navigate('/')
          Cookies.remove('access_token');
          // console.log(response.error)
        }
      }
      )
  };

  const sendMessage = () => {

  }

  const addMessage = () => {
    setMessages([...messages, { timeStamp: "YY/MM/DD", body: "new message" }]);
  };

  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      navigate("/");
    }

    getUserDetails(accessToken);
  }, [navigate]);
  return (
    <div className={styles.ChatPage}>
      <Navbar expand="lg" className={styles.navbar}>
        {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
        <Sidebar />
        <Container className='justify-content-end'>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Text>
            <img

              src={userDetails.picture}
              alt={`${userDetails.given_name}'s profile`}
              className="profile-pic"
            />
          </Navbar.Text>
          {/* <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse> */}
        </Container>
      </Navbar>
      <Container className={styles.chatBox}>
        <Row>
          <Col></Col>
          <Col xs={8}>{params.chatId == undefined ? <p style={{ color: "white" }}>boo</p> :
            <Chat mesages={messages} />}</Col>
          <Col></Col>
        </Row>

      </Container>
      <footer className={styles.footer}>
        <Container >
          <Row>
            <Col>
            </Col>
            <Col xs={5}>
              <Form>
                <Form.Group>
                  {/* <Form.Label>Message the Bot</Form.Label> */}
                  <Form.Control type="text" placeholder="Message the Bot" />
                  <Form.Text style={{ color: "#B4B4B4" }}>
                    Enjoy random letters!
                  </Form.Text>
                </Form.Group>
              </Form>
            </Col>
            <Col xs={1}>
              <Button><FontAwesomeIcon icon="fa-solid fa-arrow-up" inverse /> </Button>
            </Col>
            <Col>
            </Col>
          </Row>
        </Container>
      </footer>
    </div >
  );
}

ChatPage.propTypes = {};

ChatPage.defaultProps = {};

export default ChatPage;
