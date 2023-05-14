import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';
import Login from './Login';
import Signup from './Signup';
import Group from './Group';
import NewGroup from './NewGroup';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Welcome/>}/>
        <Route exact path="/Login" element={<Login/>}/>
        <Route exact path="/Signup" element={<Signup/>}/>
        <Route exact path="/Group" element={<Group/>}/>
        <Route exact path="/NewGroup" element={<NewGroup/>}/>
      </Routes>
    </Router>
  );
}
