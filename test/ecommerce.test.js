const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, bytecode } = require('../compile');

class MyTest {
    constructor() {
        this.prodNames = ['tv', 'laptop', 'notebook', 'phone'];
        this.prices = [400, 500, 200, 700];
        this.quantities = [5, 10, 15, 20];
    }

    changeProductName(id, newString) {
        this.prodNames[id] = newString;
        return "Name changed to: " + newString;
    }

    changePrice(id, newPrice) {
        this.prices[id] = newPrice;
        return "Price changed to: " + newPrice;
    }
}

beforeEach(() => {
    myTest = new MyTest();
});

describe("Example Test", () => {
    //Change price test
    it("Can change price.", () => {
        assert.equal(myTest.changePrice(0, 10), "Price changed to: 10");
    });
    //Change name test
    it("Can change name.", () => {
        assert.equal(myTest.changeProductName(0, "watch"), "Name changed to: watch");
    });
});

let accounts;
let ecommerce;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    ecommerce = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: [],
        })
        .send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
});

describe("Ecommerce", () => {
    //Contract deploy test
    it("Deploys a contract", () => {
        assert.ok(ecommerce.options.address);
    });
    //Constructor test
    it("Create the constructor", async () => {
        const ownerName = await ecommerce.methods.ownerName().call();
        assert.equal(ownerName, "Randy");
    });
    //Add product test
    it("Add a product", async () => {
        await ecommerce.methods.addProduct(0, "TV", 30, 400).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        const prodList = await ecommerce.methods.getProductList().call();
        assert.equal(prodList.length, 1);
    });
    //Purchase item test
    it("Purchase an item", async () => {
        const ownerAddress = await ecommerce.methods.owner().call();
        const initialBalance = await web3.eth.getBalance(ownerAddress);
        await ecommerce.methods.addProduct(0, "TV", 30, 400).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        await ecommerce.methods.purchaseItem(0, 1).send({ from: accounts[1], value: 400, gasPrice: 8000000000, gas: 4700000 });
        const finalBalance = await web3.eth.getBalance(ownerAddress);
        const finalBalanceExpected = BigInt(initialBalance) + BigInt(400);
        assert.equal(BigInt(finalBalance) + BigInt(1023280000000000), finalBalanceExpected);
    });
    //Return item test
    it("Return item", async () => {
        const ownerAddress = await ecommerce.methods.owner().call();
        const initialBalance = await web3.eth.getBalance(ownerAddress);
        await ecommerce.methods.addProduct(0, "TV", 29, 400).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        await ecommerce.methods.returnItem(0, 1, accounts[2]).send({ from: ownerAddress, value: 400, gasPrice: 8000000000, gas: 4700000 });
        const finalBalance = await web3.eth.getBalance(ownerAddress);
        const finalBalanceExpected = BigInt(initialBalance) - BigInt(400);
        assert.equal(BigInt(finalBalance) + BigInt(1524336000000000), finalBalanceExpected);
    });
    //Change price test
    it("Change price", async () => {
        await ecommerce.methods.addProduct(0, "TV", 30, 400).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        await ecommerce.methods.changePrice(0, 500).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        const prodList = await ecommerce.methods.getProductList().call();
        assert.equal(prodList[0].unitCost, 900);
    });
    //Get Balance
    it("Get balance", () => {
        assert.ok(ecommerce.methods.getBalance().call());
    });
});

// describe("Ecommerce Test", () => {
//     //Contract test
//     it("Deploys ecommerce.", () => {
//         assert.ok(ecommerce.options.address);
//     });
//     //Constructor test
//     //Add product test
//     //Purchase item test
//     //Return item test
//     //Change price test
//     //Get Balance
// });

// Example testing Structure
//==============================================
// beforeEach(() => {
//     car = new Car();
// });
//
// describe("Car", () => {
//     it("can park", () => {
//         car = new Car();
//         assert.equal(car.park(), "stopped");
//     });
// });
