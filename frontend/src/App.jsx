import {Login} from './component/login.jsx';
import { Signup } from './component/Signup.jsx';
import{BrowserRouter,Routes,Route} from 'react-router-dom';
import { WelcomeUser } from './component/WelcomeUser.jsx';
import { PurchasedCourses } from './component/PurchasedCourses.jsx';
import { Cancel } from './component/Cancel.jsx';
import { Success } from './component/Success.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
         <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/Welcome" element={<WelcomeUser></WelcomeUser>}></Route>
          <Route path="/purchases" element={<PurchasedCourses></PurchasedCourses>}></Route>
          <Route path="/succaess" element={<Success/>}></Route>
          <Route path="/cancel" element={<Cancel/>}></Route>
         </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
