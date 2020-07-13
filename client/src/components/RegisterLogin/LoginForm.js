import React from 'react'
import axios from '../../api/api';
import { Redirect } from 'react-router-dom';


class LoginForm extends React.Component {

     state = {
          email: "",
          password: "",
          errorMessage: ""
     }

     onSubmit = async (e) => {
          e.preventDefault();


          try{


               const body = {email: this.state.email, password: this.state.password}
               const response = await axios.post('/user/login', {...body});

               localStorage.setItem("token", response.data.token)
               localStorage.setItem("user", JSON.stringify(response.data.user))
               this.setState({errorMessage: ""})
          

          }
          catch(err){

               this.setState({errorMessage: "please provide valid email or password"})
          }
     }

     render() {

          if(localStorage.getItem("token"))
               return <Redirect to='/home' />
          
           
          return(

               <div className="align-items-center">
                    <h2 className="text-center my-5">Login</h2>
                    <form className="px-4" onSubmit= {this.onSubmit}>
                         <div className="form-group row">
                              <label htmlFor="email" className="col-md-2 col-form-label">Email</label>
                              <div className="col-md-10">
                                   <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        placeholder="email@example.com"
                                        onChange = { e => this.setState({ email: e.target.value})}
                                        value= {this.state.email} 
                                   />
                              </div>
                         </div>
                         <div className="form-group row">
                              <label htmlFor="inputPassword" className="col-md-2 col-form-label">Password</label>
                              <div className="col-md-10">
                                   <input 
                                        type="password" 
                                        className="form-control" 
                                        id="inputPassword" 
                                        placeholder="Password"
                                        onChange = {e => this.setState({ password : e.target.value})}
                                        value = {this.state.password} 
                                   />
                              </div>
                         </div>
                         <small className="text-danger">{this.state.errorMessage}</small>
                         <br />
                         <button type="submit" className="btn btn-primary">Login</button>
                    </form>
               </div>
          )

     }


}
export default LoginForm