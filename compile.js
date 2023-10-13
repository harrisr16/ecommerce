const path = require('path');
const fs = require('fs');
const solc = require('solc');

const EcommercePath = path.resolve(__dirname, 'contracts', 'Ecommerce.sol');
const source = fs.readFileSync(EcommercePath, 'utf8');
//console.log(source);

let input = {
  language: "Solidity",
  sources: {
    "Ecommerce.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};
//console.log(JSON.stringify(input))
//console.log(solc.compile(JSON.stringify(input)));
const output = JSON.parse(solc.compile(JSON.stringify(input)));
//console.log(output);
//console.log(output.contracts["Ecommerce.sol"].Ecommerce);
const contracts = output.contracts["Ecommerce.sol"];
const contract=contracts['Ecommerce'];
console.log(contract);
module.exports= {"abi":contract.abi,"bytecode":contract.evm.bytecode.object};