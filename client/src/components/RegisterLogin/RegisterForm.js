import React from 'react'
import axios from '../../api/api'
import web3 from '../../ethereum/web3'

class RegisterForm extends React.Component {

     state = {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          errorMessage: "",
          successMessage: "",
          register: this.props.verification,
          verificationCode: ""
     }
     onSubmit = async (e) => {

          e.preventDefault();

          this.setState({errorMessage: ""})
          try {

               const accounts = await web3.eth.getAccounts();
               console.log(accounts)

               const body = {
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                    role: 'rider',
                    address: accounts[0]
               }

               await axios.post('/user/register', {...body})
               this.setState({ register: false})


          }
          catch (err){

               console.log("error reading account");
               this.setState({errorMessage: "Cannot register! please try with other email"})
          }

     }
     onVerification = async (e) => {

          e.preventDefault();
          this.setState({errorMessage: "", successMessage: ""})

          try{

               await axios.get(`/user/confirmEmail/${this.state.verificationCode}`, this.state.verificationCode)
               this.setState({successMessage: "successfully verified! Please login to get access"})
          }
          catch(err) {

               this.setState({errorMessage: "Cannot verified!"})
          }
     }

     renderRegister = () => {

          return (
               
               <form className="px-4" onSubmit = {this.onSubmit}>
                    <div className="form-group row">
                         <label htmlFor="name" className="col-md-2 col-form-label">Name</label>
                         <div className="col-md-10">
                              <input 
                                   type="text" 
                                   className="form-control" 
                                   id="name" 
                                   placeholder="your name here"
                                   onChange = { e => this.setState({name: e.target.value})}
                                   value = {this.state.name}
                              />
                         </div>
                    </div>
                    <div className="form-group row">
                         <label htmlFor="email" className="col-md-2 col-form-label">Email</label>
                         <div className="col-md-10">
                              <input 
                                   type="email" 
                                   className="form-control" 
                                   id="email" 
                                   placeholder="email@example.com"
                                   onChange = {e => this.setState({email: e.target.value})}
                                   value = {this.state.email} 
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
                                   onChange = {e => this.setState({password: e.target.value})}
                                   value = {this.state.password} 
                              />
                         </div>
                    </div>
                    <div className="form-group row">
                         <label htmlFor="confirmPassword" className="col-md-2 col-form-label">Confirm Password</label>
                         <div className="col-md-10">
                              <input 
                                   type="password" 
                                   className="form-control" 
                                   id="confirmPassword" 
                                   placeholder="Password"
                                   onChange = {e => this.setState({confirmPassword: e.target.value})}
                                   value = {this.state.confirmPassword} 
                              />
                         </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
               </form>
          )

     }
     renderVerifiction = () => {

          return(

               <form className="px-4" onSubmit = {this.onVerification}>
                    <div className="form-group">
                         <label htmlFor="name" className="">VerificationCode</label>
                         <div>
                              <input 
                                   type="text" 
                                   className="form-control" 
                                   id="name" 
                                   placeholder="verification code"
                                   onChange = { e => this.setState({verificationCode: e.target.value})}
                                   value = {this.state.verificationCode}
                              />
                         </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">Submit</button>
               </form>

          )

     }
     render() {

          return(

               <div className="align-items-center">
                    <h2 className="text-center my-5">{this.state.register ? 'Register' : 'Verification'}</h2>
                    {this.state.register ? this.renderRegister() : this.renderVerifiction()}
                    <small className="text-danger">{this.state.errorMessage}</small>
                    <small className="text-success">{this.state.successMessage}</small>
               </div>
               
          )


     }

     
}
export default RegisterForm