import React, { useEffect } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Sidebar.module.css';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [chats, setChats] = useState([])
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    //fetch user chats, should i make separate tab for shared chats??? i guess that works right
    let response = [{
      'title': 'one', 'id': "1"
    }, { 'title': 'two', 'id': "2" }, { 'title': 'three', 'id': "3" }]
    setChats(response);
    // console.log(chats);
  }, []);

  function navigateChat(chatId) {
    navigate(`/chats/${chatId}`)
    handleClose()
  }

  return (
    <div className={styles.Sidebar}>
      <Button className={styles.sidebar} variant="primary" onClick={handleShow}>
        <FontAwesomeIcon icon="fa-solid fa-comment" />
      </Button>

      <Offcanvas className={styles.Sidebar} show={show} onHide={handleClose}>
        <Offcanvas.Header className={styles.offcanvasHeader} closeButton>
          <Offcanvas.Title>Chats</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            {/* <ListGroup.Item>item 1</ListGroup.Item>

            <ListGroup.Item>item 1</ListGroup.Item>

            <ListGroup.Item>item 1</ListGroup.Item> */}
            {chats.map((chat) => {
              return <ListGroup.Item className={styles.listItem} key={chat.id} action onClick={() => navigateChat(chat.id)}>{chat.title}</ListGroup.Item>
            })}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

Sidebar.propTypes = {};

Sidebar.defaultProps = {};

export default Sidebar;
