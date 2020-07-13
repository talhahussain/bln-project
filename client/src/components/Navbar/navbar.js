import React from 'react'
import { Link } from 'react-router-dom';

class Navbar extends React.Component {


     render() {

          return (

               <nav className="navbar navbar-expand-md bg-dark navbar-dark">

                    <div className="container">

                         <Link className="navbar-brand" to="/home">RideApp</Link>
                         <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                              <span className="navbar-toggler-icon"></span>
                         </button>
                         <div className="collapse navbar-collapse" id="collapsibleNavbar">
                              <ul className="navbar-nav ml-auto">
                                   <li className="nav-item mx-2">
                                        <Link className="nav-link" to="/" onClick={ e => e.preventDefault()}>
                                             Hello! {this.props.name}
                                        </Link>
                                   </li>
                                   <li className="nav-item mx-2">
                                        <Link className="nav-link" to="/manager">Your rides</Link>
                                   </li>
                                   <li className="nav-item mx-2">
                                        <Link className="nav-link btn btn-warning text-white" to="/logout">Logout</Link>
                                   </li>
                              </ul>
                         </div>
                    </div>                    
               </nav>
          )
     }
}
export default Navbar;