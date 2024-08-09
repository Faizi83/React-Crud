import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Form from './Components/Form';
import UpdateForm from './Components/UpdateForm';
import Alldata from './Components/Alldata';
import 'bootstrap/dist/css/bootstrap.min.css';

// Basic functional component
const App = () => {
  return (
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Form/>} />
        <Route path="/data" element={<Alldata/>} />
         <Route path="/update-product/:productId" element={<UpdateForm />} />
        {/* Add other routes here */}
      </Routes>

  </Router>
  );
};

export default App;
