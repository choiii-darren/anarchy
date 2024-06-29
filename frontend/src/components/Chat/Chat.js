import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Chat.module.css';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const Chat = (props) => {
  const [messages, setMessages] = useState([{ timeStamp: "YY/MM/DD", body: "hello" },
  { timeStamp: "YY/MM/DD", human: 'true', body: 'boo' }, { timeStamp: "YY/MM/DD", body: "blah" }])

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behaviour: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = () => {
    setMessages([...messages, { timeStamp: "YY/MM/DD", body: "new message" }]);
  };

  return (
    <div className={styles.Chat}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (<div key={index} className={styles.message}>{message.body}</div>))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

Chat.propTypes = {};

Chat.defaultProps = {};

export default Chat;
