import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import "./App.css";
import Home from './components/Containers/Home';
import Signin from './components/Containers/Signin';
import Signup from './components/Containers/Signup';
import PrivateRoute from './components/HOC/PrivateRoute'
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute exact path='/' component={Home}/>
          <Route exact path='/signin' component={Signin}/>
          <Route exact path='/signup' component={Signup}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
