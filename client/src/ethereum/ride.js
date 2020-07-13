import web3 from './web3'
import Ride from './build/Ride.json'

export default (address) => {

     return new web3.eth.Contract(
          JSON.parse(Ride.interface),
          address
     )
}