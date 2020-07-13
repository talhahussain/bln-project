import React from 'react'
import Navbar from '../Navbar/navbar';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client'
import axios from '../../api/api'
import factory from '../../ethereum/factory'
import Ride from '../../ethereum/ride'
import web3 from '../../ethereum/web3';

let socket;
let ENDPOINT = 'localhost:5000';

class Home extends React.Component {

     state = {
               pickup: "", 
               dropoff: "", 
               locations: [], 
               myLocation:"", 
               rideStarted: false,
               fare: 0,
               distance: 0,
               driverName: "",
               driverAddress: null,
               waiting: false,
               deployedRide: null,
               done: false,
               location: []
          }

     ride = (e) => {

          e.preventDefault();

          this.setState({waiting: true})
          const ride = {
               
               name: JSON.parse(localStorage.getItem("user")).name,
               pickup: this.state.pickup,
               dropoff: this.state.dropoff,
               fare: this.state.fare,
               distance: this.state.distance
          }
          
          socket.emit('joinRider', ride, (message) => {
               console.log(message);
          })
          
          setTimeout(() => {

               this.setState({waiting: false})
          }, 5000)
     }
     loadData = async () => {

          try{
               const response = await axios.get('/location/getLocations')
               this.setState({locations: response.data.data})
               
               this.getMyLocation();
          }
          catch(err) {
               console.log("err")
          }
     }
     constructor(props) {
          super(props);
          
          this.loadData();

     }
     componentDidMount() {

          socket = io(ENDPOINT)
          let rideAddress;
          socket.on('rideAccepted', async (message, callback) => {

               if(message){
                    
                    const accounts = await web3.eth.getAccounts();

                    await factory.methods
                    .createRide(message.address, this.state.pickup, this.state.dropoff, Math.ceil(this.state.distance))
                    .send({
                         from: accounts[0],
                    })
                    rideAddress = await factory.methods.newDeployedRide().call();
                    const depRide = Ride(rideAddress);
                    await depRide.methods.calculateFare().send({
                         from: accounts[0],
                         value: web3.utils.toWei(this.state.fare.toString(), 'ether')
                    })
                    socket.emit('acceptedRider', 'CalculationDone', () => {
                         console.log('ok')
                    })
                    this.setState({
                         rideStarted: true,
                         driverName: message.name,
                         waiting: false,
                         deployedRide: rideAddress, 
                         driverAddress: message.address
                    })
               }

          })
          socket.on("done", (message, callback) => {

               this.setState({rideStarted: false, done: true})

          })
          

     }

     getMyLocation = () => {

          navigator.geolocation.getCurrentPosition( position => {

               const myLoc = position.coords.longitude + "," +position.coords.latitude;
               this.setState({myLocation: myLoc})
          });
          
     }
     calculateFare = async (e) => {

          e.preventDefault();

          var temp = this.state.pickup.split(',')
          var pickupCoords = [0,0];

          pickupCoords[0] = parseFloat(temp[0])
          pickupCoords[1] = parseFloat(temp[1])
          
          var temp2 = this.state.dropoff.split(',')
          var dropoffCoords = [0,0];

          dropoffCoords[0] = parseFloat(temp2[0])
          dropoffCoords[1] = parseFloat(temp2[1])
          
          const response = await axios.post('/location/getFare', {pickupCoords, dropoffCoords});
          const loc = [
               {
                    pickup: pickupCoords,
                    dropoff: dropoffCoords
               }
          ]
          const response2 = await axios.post('/location/location', loc);
          this.setState({location: response2.data.location})
          
          
          this.setState({fare: response.data.fare, distance: response.data.distance})
     }
     yes = async (e) => {

          e.preventDefault();

          this.setState({done: false})
          const accounts = await web3.eth.getAccounts();
          const depRide = Ride(this.state.deployedRide);
          
          depRide.methods.completeRide(true, true).send({
               from: accounts[0],

          })

     }
     No = (e) => {

          e.preventDefault();
          this.setState({done: false})
     }
     render() {


          if(!localStorage.getItem("token"))
               return <Redirect to="/" />

          return(

               
               <>
               <Navbar name={JSON.parse(localStorage.getItem("user")).name} />

               {
                    this.state.done ? 
                    <div>
                         <h2>Are you satisfied with the ride...??</h2>
                         <button type="button" className="btn btn-success mx-2" onClick={this.yes}>Yes</button>
                         <button type="button" className="btn btn-danger" onClick={this.No}>No</button>
                    </div>
                    : this.state.rideStarted
                    ? (
                         <div className="container mt-4">
                              <h4>Ride Started</h4>
                              <p className="border p-5" >
                                   <span style={{fontWeight: 'bold'}}>Driver: </span> {this.state.driverName}
                                   <br />
                                   <span style={{fontWeight: 'bold'}}>Pickup: </span> {this.state.location[0].pickup ? this.state.location[0].pickup :'My location' }
                                   <br />
                                   <span style={{fontWeight: 'bold'}}>Dropoff: </span> {this.state.location[0].dropoff}
                                   <br />
                                   <span style={{fontWeight: 'bold'}}>Fare: </span> {this.state.fare}
                                   <br />
                                   <span style={{fontWeight: 'bold'}}>Distance: </span> {this.state.distance}
                              </p>
                         </div>
                    )
                    :(
                         <div className="container mt-5">
                              <div className="form-group">
                                   <label htmlFor="pickup">pickup location</label>
                                   <select 
                                        className="form-control" id="pickup"
                                        onChange={e => this.setState({pickup: e.target.value})}
                                        value = {this.state.pickup}
                                   >
                                        <option key="select location">Select pickup location</option>
                                        <option key="my location" value={this.state.myLocation}>My location</option>
                                        {
                                             this.state.locations.map( loc => {
                                                  const val = loc.loc.coordinates[0] + "," + loc.loc.coordinates[1]
                                                  return <option key={loc.name} value={val}>{loc.name}</option>
                                             })
                                        }
                                   </select>
                              </div>
                              
                              <div className="form-group">
                                   <label htmlFor="pickup">pickup location</label>
                                   <select 
                                        className="form-control" id="pickup"
                                        onChange={e => this.setState({dropoff: e.target.value})}
                                        value = {this.state.dropoff}
                                   >
                                        <option key="select location">Select dropoff location</option>
                                        {
                                             this.state.locations.map( loc => {
                                                  const val = loc.loc.coordinates[0] + "," + loc.loc.coordinates[1]
                                                  return <option key={loc.name} value={val}>{loc.name}</option>
                                             })
                                        }
                                   </select>
                              </div>

                              <div>
                                   <span>Distance : {this.state.distance} meteres</span>
                                   <br />
                                   <span>Fare : {this.state.fare} ether</span>
                              </div>
                              <button className="btn btn-warning my-2" onClick={this.calculateFare}>
                                   calculate Fare
                              </button>
                              <br />
                              {
                                   this.state.waiting 
                                   ? (
                                        <div className="spinner-border"></div>
                                   )
                                   : <button className="btn btn-primary" onClick={this.ride}>Go!</button>

                              }
                              
                         </div>
                    )
               }
                    
               
               </>
               
          )
     }
}

export default Home;