import React from 'react';
import PropTypes from 'prop-types';
import styles from './Message.module.css';

const Message = ({ message, isUser }) => {
  return (
    <>
      {isUser == true ? <div className={styles.userMessage}><p>{message}</p></div> : <div className={styles.machineMessage}><p>{message}</p></div>}
    </>
  );
};

// const Message = () => (
//   <div className={styles.Message}>
//     Message Component
//   </div>
// );

Message.propTypes = {};

// Message.defaultProps = {};

export default Message;
