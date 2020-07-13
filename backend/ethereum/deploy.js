const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')
const compiledFactory = require('./build/RideFactory.json')


const provider = new HDWalletProvider(

     'alley embody length eyebrow climb bird this muffin wasp work muscle party',
     'https://rinkeby.infura.io/v3/90747e60d9f947e4a9013fcefe6d5511'
)

const web3 = new Web3(provider)

const deploy = async () => {

     const accounts = await web3.eth.getAccounts();

     console.log('Attempting to deploy from account', accounts[0]);

     const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
               .deploy({data: compiledFactory.bytecode})
               .send({from: accounts[0], gas: '1000000'});

     console.log('Contract deployed to', result.options.address);
}
deploy();