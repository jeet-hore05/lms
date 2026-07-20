import './App.css';

import { Route, Routes } from 'react-router-dom';

import Footer from './Components/footer.jsx';
import Homepage from './Pages/HomePage.jsx';


function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Homepage/>}></Route>
      </Routes>
    </>
  )
}

export default App;
