import './App.css';

import { Route, Routes } from 'react-router-dom';

import Footer from './Components/footer.jsx';
import Homepage from './Pages/HomePage.jsx';
import AboutUs from './Pages/AboutUs.jsx';
import NotFound from './Pages/NotFound.jsx';
import Signup from './Pages/Signup.jsx';


function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Homepage/>}></Route>
          <Route path="/about" element={<AboutUs/>}></Route>

          <Route path="/signup" element={<Signup/>}></Route>

          <Route path='*' element={<NotFound/>} ></Route>
      </Routes>
    </>
  )
}

export default App;
