import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import RegisterLogin from './components/RegisterLogin/RegisterLogin'
import Home from './components/Home/home'
import Manager from './components/Manager/manager'

import Logout from './components/Logout/logout'

const App = () => {

     return(

          <Router>
               <Route path="/" exact component={RegisterLogin} />
               <Route path="/home" component={Home} />
               <Route path="/manager" component={Manager} />
               <Route path="/logout" component={Logout} />
               
          </Router>
     )

}
export default App;
