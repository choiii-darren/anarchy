import React from 'react';
import PropTypes from 'prop-types';
import styles from './MainRouter.module.css';
import { Route, Routes, BrowserRouter, createBrowserRouter } from "react-router-dom";
import LoginPage from '../LoginPage/LoginPage';
import ChatPage from '../ChatPage/ChatPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/chats/:chatId?',
    Component: ChatPage
  }
])

// const MainRouter = () => {
//   (
//     <div className={styles.MainRouter}>

//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<LoginPage />} />
//           <Route path="/chats" element={<ChatPage />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// MainRouter.propTypes = {};

// MainRouter.defaultProps = {};

export default router;
