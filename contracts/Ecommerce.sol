// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

contract Ecommerce {
    int public revenue;
    string public ownerName;
    address public owner;

    struct product {
        uint productNo;
        string prodName;
        int noItem;
        int unitCost;
    }

    struct transaction {
        uint transactionID;
        address customerWallet;
        uint prodID;
        int256 numItems;
    }

    mapping(int => transaction) public transactionMap;

    product[] public productList;
    int public totalProducts;

    constructor() {
        ownerName = "Randy";
        revenue = 0;
        owner = msg.sender;
    }

    function addProduct(uint id, string memory name, int num, int cost) public {
        product memory newProduct;
        newProduct = product(id, name, num, cost);
        productList.push(newProduct);
        totalProducts += 1;
    }

    function getProductList() public view returns (product[] memory) {
        return productList;
    }

    function purchaseItem(
        uint id,
        int quant
    ) public payable returns (bool, bytes memory) {
        int cost;
        bool success;
        bytes memory data;
        cost = productList[id].unitCost * quant;
        require(productList[id].noItem >= quant, "out of stock");
        require(msg.value >= uint(cost), "out of balance");
        (success, data) = owner.call{value: uint(cost)}("");
        productList[id].noItem = productList[id].noItem - quant;
        revenue = revenue + cost;
        return (success, data);
    }

    function returnItem(
        uint id,
        int quant,
        address custAddress
    ) public payable returns (bool, bytes memory) {
        int cost;
        bool success;
        bytes memory data;
        cost = productList[id].unitCost * quant;
        require(msg.sender == owner, "you are not authorized");
        (success, data) = custAddress.call{value: uint(cost)}("");
        productList[id].noItem = productList[id].noItem + quant;
        revenue = revenue - cost;
        return (success, data);
    }

    function donate(int amount) public payable returns (bool, bytes memory) {
        bool success;
        bytes memory data;
        require(msg.value > .01 ether);
        (success, data) = owner.call{value: uint(amount)}("");
        return (success, data);
    }

    function sendDonation(address payable custAddress) public payable{
        require(msg.sender == owner, "you are not authorized");
        custAddress.transfer(address(this).balance);
    }

    function changePrice(uint id, int price) public {
        productList[id].unitCost = productList[id].unitCost + price;
    }

    function addItem(uint id, int quant) public {
        productList[id].noItem = productList[id].noItem + quant;
    }

    function getBalance() public view returns (int) {
        return (int)(owner.balance);
    }
}
