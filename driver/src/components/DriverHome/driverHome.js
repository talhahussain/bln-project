import React from 'react'
import Navbar from '../Navbar/navbar';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client'
import axios from '../../api/api'

let socket;
class Home extends React.Component {

     state = {
          pickup: "", 
          dropoff: "", 
          upcommingRide: null, 
          acceptRide: false,
          pickupName: "",
          dropoffName: ""
     }
     
     componentDidMount() {

          const ENDPOINT = 'localhost:5000'

          socket = io(ENDPOINT);

          socket.emit('joinDriver', JSON.parse(localStorage.getItem("driver")), (message) => {

               console.log(message)

          })

          socket.on('ride', (user, callBack)=>{

               this.setState({upcommingRide: user})
               setTimeout(() => {
                    this.setState({upcommingRide: null})
               }, 5000)

          })
          socket.on('riderAccepted', (message, callBack) => {
               console.log("message",message);
               this.setState({acceptRide: true})
          })

     }
     acceptRide = (e) => {

          e.preventDefault();
          this.setState({upcommingRide: null})
          const ENDPOINT = 'localhost:5000'
          socket = io(ENDPOINT)
          socket.emit('accepted', JSON.parse(localStorage.getItem("driver")), (message)=> {

               console.log(message)
          })


     }
     completeRide = (e) => {

          e.preventDefault();
          const ENDPOINT = 'localhost:5000'
          socket = io(ENDPOINT)
          socket.emit('completed', (message)=> {

               console.log(message)
            
          })
          this.setState({acceptRide: false, upcommingRide: null})

     }
     fetchLocation = async (loc) => {

          const response = await axios.post('/location/location', loc);

          this.setState({
               pickupName: response.data.location[0].pickup ? response.data.location[0].pickup : 'My location',
               dropoffName: response.data.location[0].dropoff
          })

     }
     renderCard = () => {

          const p = this.state.upcommingRide.pickup.split(',');
          const d = this.state.upcommingRide.dropoff.split(',');

          const loc = [

               {
                    pickup: [parseFloat(p[0]), parseFloat(p[1])],
                    dropoff: [parseFloat(d[0]), parseFloat(d[1])],
                    
               }
          ]

          this.fetchLocation(loc)

          return (

               <div className="card" style={{width: "18rem"}}>
                    <div className="card-body">
                         <h5 className="card-title">{this.state.upcommingRide.name}</h5>
                         {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                         <p className="card-text">
                              <span style={{fontWeight: 'bold'}}>Pickup:</span> {this.state.pickupName}
                              <br />
                              <span style={{fontWeight: 'bold'}}>Dropoff:</span> {this.state.dropoffName}
                              <br />
                              <span style={{fontWeight: 'bold'}}>Fare:</span> {this.state.upcommingRide.fare}
                              <br />
                              <span style={{fontWeight: 'bold'}}>Distance:</span> {this.state.upcommingRide.distance}
                         </p>
                         <button onClick={this.acceptRide} className="card-link btn">Accept</button>
                    </div>
               </div>
          )
     }

     render() {

          if(!localStorage.getItem("driverToken"))
               return <Redirect to="/" />
               
          return(

               <>
                    <Navbar name={JSON.parse(localStorage.getItem("driver")).name} />
                    <div className="container mt-5">
                         {
                              this.state.upcommingRide === null && !this.state.acceptRide
                              ? (
                                   <h4>Searching for the rider</h4>
                              )
                              : (
                                    
                                   this.state.acceptRide 
                                   ? (
                                        <div>
                                             <h4>Ride Started</h4>
                                             <button onClick={this.completeRide} className="btn btn-danger">
                                                  Complete Ride
                                             </button>
                                        </div>
                                   )
                                   : this.renderCard()
                              )
                               
                               
                         }
                    </div>

               </>
               
          )
     }
}

export default Home;