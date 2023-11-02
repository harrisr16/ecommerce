import web3 from "./web3"
import abi from "./abi"

const byteInterface = abi.abi;
const address = 0xBcdfA66E96B92c3082CcA5D50868232cb9fbAd56;
const ecommerce = new web3.eth.Contract(byteInterface, address);
export default ecommerce;