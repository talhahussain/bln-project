import React from 'react'
import Ride from '../../ethereum/ride'
import factory from '../../ethereum/factory'
import Navbar from '../Navbar/navbar';
import web3 from '../../ethereum/web3';
import axios from '../../api/api'

class Manager extends React.Component {

     state = { items: [], loc: []}

     async componentDidMount() {

          const response = await factory.methods.getDeployedRide().call();
          
          const items = response.map( async (element) => {
               const rideInstance =  Ride(element);
               const ride = await rideInstance.methods.getRideDetails().call();
               return ride;
          });
          let details = await Promise.all(items);
          
          let loc= [];
          const rideDetails = details.map( (elem, i) => {

               const p = elem[4].split(',');
               const d = elem[5].split(',');
               
               loc.push({
                    pickup: [parseFloat(p[0]), parseFloat(p[1])],
                    dropoff: [parseFloat(d[0]), parseFloat(d[1])],
                    
               })
               return {

                    driver: elem[0],
                    passenger: elem[1],
                    fare: web3.utils.fromWei(elem[2], 'ether'),
                    distance: elem[3],
                    pickup: elem[4],
                    dropoff: elem[5],
                    completed: elem[6],
                    satisfactory: elem[7],
                    depAddress: response[i]
               }
          })
          console.log(loc)

          const res = await axios.post('/location/location', loc);
          console.log(res.data)
          this.setState({items: rideDetails, loc: res.data.location})
          
     }
     sendMoney = async (address, role) => {
          console.log(address, role)
          const accounts = await web3.eth.getAccounts();
          
          const depRide = Ride(address);
          await depRide.methods.transferMoney(role).send({
               from: accounts[0],

          })
     }
     renderRides = () => {

          return this.state.items.map( (elem, i) => {

               return (
                    <div className="border p-4 mt-2" key={i} >
                         <p><span style={{fontWeight: 'bold'}}>Driver: </span>{elem.driver}</p>
                         <p><span style={{fontWeight: 'bold'}}>Passenger: </span>{elem.passenger}</p>
                         <p><span style={{fontWeight: 'bold'}}>Fare: </span>{elem.fare} ether</p>
                         <p><span style={{fontWeight: 'bold'}}>Distance: </span>{elem.distance} meters</p>
                         <p><span style={{fontWeight: 'bold'}}>Pickup: </span>{this.state.loc[i].pickup ? this.state.loc[i].pickup: 'My location' }</p>
                         <p><span style={{fontWeight: 'bold'}}>Dropoff: </span>{this.state.loc[i].dropoff}</p>
                         <p><span style={{fontWeight: 'bold'}}>Completed: </span>{elem.completed ? 'true': 'false'}</p>
                         <p><span style={{fontWeight: 'bold'}}>Satisfactory: </span>{elem.satisfactory ? 'true': 'false'}</p>
                         {
                              !elem.completed 
                              ? (
                                   <div>
                                        <button onClick={ () => this.sendMoney(elem.depAddress, 'driver')} className="mr-2 btn btn-success">Driver</button>
                                        <button onClick={ () => this.sendMoney(elem.depAddress, 'passenger')} className="btn btn-danger">Passenger</button>
                                        
                                   </div>
                              )
                              : <div></div>
                         }
                    </div>
               )
          })

     }
     
     render() {

          return(


               <>
                    <Navbar name="manager" />
                    <div className="container mt-4">
                         <h2>All Rides</h2>
                         {this.renderRides()}
                    </div>
               </>
          )
     }
}

export default Manager;