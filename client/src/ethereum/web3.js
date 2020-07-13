const Web3 = require('web3')


let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){

     // we are in the browser and user has metamask installed
     web3 = new Web3(window.web3.currentProvider);
}
else{
     
     // We are in the server and user do not have metamask installed 
     const provider = new Web3.providers.HttpProvider(
          'https://rinkeby.infura.io/v3/90747e60d9f947e4a9013fcefe6d5511'

     )
     web3 = new Web3(provider)
}

export default web3;