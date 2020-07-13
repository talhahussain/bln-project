import React from 'react'
import CarImage from '../../images/car.jpg'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import {Redirect} from 'react-router-dom'

import './registerLogin.css'

class RegisterLogin extends React.Component {

     state = {
          login: true,
          verification: false,
     }

     render() {

          if(localStorage.getItem("token"))
               return <Redirect to='/home' />
          
          return(

               <div className="container-fluid login-container">
                    <div className="row">
                         <div className="col-sm-6 d-none d-sm-block">
                              <div className="image-container">                                   
                                   <img alt="car" src={CarImage} className="car-image" />
                                   <div className="overlay"></div>
                              </div>
                              <div className="register-text text-white text-center container">
                                   <p>Welcome to Ethereum based ride sharing app</p>
                                   <p>If you are new here please Register first</p>
                                   
                                   {
                                        this.state.login ? (
                                             <>
                                             <button onClick={() => this.setState({login: false, verification: false})} 
                                             className="btn btn-secondary btn-small mx-2">
                                                  Register
                                             </button>
                                             <button onClick={() => this.setState({login: false, verification: true})} className="btn btn-secondary btn-small">
                                                  Verification
                                             </button>
                                             </>
                                        ) : (

                                             
                                             <button onClick={() => this.setState({login: true})} className="btn btn-secondary btn-small">
                                                  Login
                                             </button>
                                        )

                                   }
                                   
                              </div>
                         </div>
                         <div className="col-sm-6"> 
                              
                              <div className="container-fluid pl-0">
                              {
                                   this.state.login 
                                   ? <LoginForm

                                    /> 
                                   : <RegisterForm verification={this.state.verification? false: true} />
                              }
                              </div>
                         </div>

                    </div>

               </div>
          )
     }
}
export default RegisterLogin;