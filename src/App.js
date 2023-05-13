import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';
import Login from './Login';
import Signup from './Signup';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Welcome/>}/>
        <Route exact path="/Login" element={<Login/>}/>
        <Route exact path="/Signup" element={<Signup/>}/>
      </Routes>
    </Router>
  );
}
