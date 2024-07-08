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
let backendUrl = process.env.REACT_APP_DEV_ENV === "TRUE" ? "http://127.0.0.1:8000/" : ""

const ChatPage = () => {
  let params = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetch(backendUrl + 'api/token_ping', { credentials: 'include' }).then(async (response) => {
      if (response.ok) {
        const data = await response.json()
        // Cookies.set('csrftoken', data.token)
      }
    })
  }, []);

  const getUserDetails = async (accessToken) => {
    const options = {
      method: "POST",
      headers: {
        "X-CSRFToken": Cookies.get('csrftoken'),
      },
      credentials: 'include',
      body: JSON.stringify({
        'accessToken': accessToken
      })
    }
    // console.log(headers)
    fetch(
      backendUrl + 'api/authenticate', options
    )
      .then(async (response) => {
        if (response.ok) {
          //send back user details?
          const data = await response.json();
          setUserDetails(data);
          // console.log(userDetails)
        }
        else {
          navigate('/')
          Cookies.remove('oauth_token');
        }
      }
      )
  };

  // const sendMessage = () => {

  // }

  const addMessage = () => {
    const jwtToken = Cookies.get('jwt')
    const options = {
      headers: {
        'authorization': "Bearer " + jwtToken,
        "X-CSRFToken": Cookies.get('csrftoken'),
      },
      credentials: "include"
    }

    //if params.chatid is undefined, send post req to method to create new chat, then add message
    if (params.chatId == undefined) {
      options.method = 'POST'
      options.body = JSON.stringify({
        "message": text
      })
    }
    else {
      options.method = 'PUT'
      options.body = JSON.stringify({
        "message": text,
        "chatId": params.chatId
      })
    }

    try {
      fetch(backendUrl + 'api/add_message', options)
        .then(async (response) => {
          if (response.ok) {
            //get the string from the returned body 
            //append to messages array
            console.log(messages)
            const newMessages = await response.json()
            // setMessages([...messages, newMessages])
            setMessages((currentMessages) => ([...currentMessages, ...newMessages]))
            if (options.method == "POST") {
              navigate(newMessages[0].chat)
            }
            console.log(messages)
            console.log(newMessages)
          }
        })
    }
    catch (error) {
      console.log(error)
    }
    setText('')
  };

  useEffect(() => { //get chat messages
    const chatId = params.chatId;
    const jwtToken = Cookies.get('jwt')
    const options = {
      headers: {
        'authorization': "Bearer " + jwtToken,
        "X-CSRFToken": Cookies.get('csrftoken'),
      },
      credentials: "include",
      method: "GET",
    }
    try {
      fetch(backendUrl + 'api/chat_messages/' + String(chatId), options)
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json()
            setMessages(data)
          }
        })
    }
    catch (error) {

    }
  }, [params.chatId])

  useEffect(() => {
    const accessToken = Cookies.get("oauth_token");
    const jwtToken = Cookies.get('jwt')
    // fetch('http://localhost:8000/api/token_ping')

    if (!accessToken && !jwtToken) {
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
          <Col xs={8}>{params.chatId == undefined ? <h2 style={{ textAlign: 'center' }}>Type in the box to make a new chat!</h2> :
            <Chat messages={messages} />}</Col>
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
                  <Form.Control onChange={(e) => setText(e.target.value)} value={text} type="text" placeholder="Message the Bot" />
                  <Form.Text style={{ color: "#B4B4B4" }}>
                    Enjoy random letters!
                  </Form.Text>
                </Form.Group>
              </Form>
            </Col>
            <Col xs={1}>
              <Button onClick={addMessage}><FontAwesomeIcon icon="fa-solid fa-arrow-up" inverse /> </Button>
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

// ChatPage.defaultProps = {};

export default ChatPage;
