import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import RegisterLogin from './components/RegisterLogin/RegisterLogin'
import DriverHome from './components/DriverHome/driverHome'

import Logout from './components/Logout/logout'

const App = () => {

     return(

          <Router>
               <Route path="/" exact component={RegisterLogin} />
               <Route path="/home" component={DriverHome} />
               <Route path="/logout" component={Logout} />
               
          </Router>
     )

}
export default App;
