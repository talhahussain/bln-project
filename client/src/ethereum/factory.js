import web3 from './web3'
import compiledRideFactory from './build/RideFactory.json'


const instance = new web3.eth.Contract(
     JSON.parse(compiledRideFactory.interface),
     '0x5e75E55664F3b819d5C978c662e9e5d6A279D898'
)

export default instance;