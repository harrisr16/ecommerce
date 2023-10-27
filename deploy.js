const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'notable child question panel acquire silly language elder pepper mammal model mixture',
  // remember to change this to your own phrase!
  'https://goerli.infura.io/v3/2ac8acc85c5846dab223331aec2c1bbf'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  ecommerce = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [] })
    .send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000});

  console.log('Contract deployed to', ecommerce.options.address);
  provider.engine.stop();
};
deploy();
