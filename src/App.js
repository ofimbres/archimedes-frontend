
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import  { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap';
import * as bootstrap from 'bootstrap';
import NavbarC from './components/Navbar';

function App (){

  return (

    <div className='App'>
      <NavbarC/>
      <div className='flex'>
          <div className='content'>
          </div>
      </div>
    </div>
  )
}
export default App;