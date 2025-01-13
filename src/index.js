import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import SecondPage from './Pages/SecondPage';

const AppWrapper = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<App navigate={navigate} />} />
      <Route path="/Secondpage" element={<SecondPage />} />
    </Routes>
  );
};

export default AppWrapper;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
