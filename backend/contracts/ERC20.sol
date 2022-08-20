// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address immutable owner;
    constructor(string memory name, string memory symbol) ERC20(name, symbol) { 
        _mint(msg.sender, 1 * 1000000000000000000);
        owner = msg.sender;
    }
}

