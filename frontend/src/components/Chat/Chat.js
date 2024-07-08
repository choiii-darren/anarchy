import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Chat.module.css';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Message from '../Message/Message';

const Chat = (props) => {

  // const [messages, setMessages] = useState()

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behaviour: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [props.messages]);

  // const addMessage = () => {
  //   setMessages([...messages, { timeStamp: "YY/MM/DD", body: "new message" }]);
  // };

  return (
    <div className={styles.Chat}>
      <div className={styles.messagesContainer}>
        {props.messages.map((message, index) => (<Message key={message.id} message={message.content} isUser={message.is_user} />))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

Chat.propTypes = {};

// Chat.defaultProps = {};

export default Chat;
