import './App.css';

import { Route, Routes } from 'react-router-dom';

import Footer from './Components/footer.jsx';
import Homepage from './Pages/HomePage.jsx';
import AboutUs from './Pages/AboutUs.jsx';
import NotFound from './Pages/NotFound.jsx';
import Signup from './Pages/Signup.jsx';
import Login from './Pages/Login.jsx';
import CourseList from './Pages/Course/CourseList.jsx';
import Contact from './Pages/Contact.jsx';
import Denied from './Pages/Denied.jsx';
import CourseDescription from './Pages/Course/CourseDescription.jsx';
import CreateCourse from './Pages/Course/CreateCourse.jsx';
import RequireAuth from './Components/Auth/RequireAuth.jsx';

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Homepage/>}></Route>
          <Route path="/about" element={<AboutUs/>}></Route>

          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/courses" element={<CourseList/>}></Route>
          <Route path="/courses/description/" element={<CourseDescription/>}></Route>
          <Route path="/contact" element={<Contact/>}></Route>
          <Route path="/denied" element={<Denied/>}></Route>

          <Route element={<RequireAuth allowedRoles={["ADMIN"]}/>}>
                <Route path="/courses/create" element={<CreateCourse/>}></Route>
          </Route>

          <Route path='*' element={<NotFound/>} ></Route>
      </Routes>
    </>
  )
}

export default App;
