import './App.css';

import { Route, Routes } from 'react-router-dom';

import Footer from './Components/footer.jsx';
import Homepage from './Pages/HomePage.jsx';
import AboutUs from './Pages/AboutUs.jsx';


function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Homepage/>}></Route>
          <Route path="/about" element={<AboutUs/>}></Route>
      </Routes>
    </>
  )
}

export default App;
