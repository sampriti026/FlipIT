// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20.sol";

contract TokenGenerator{ 
    
    function mintToken(string memory name, string memory symbol) public returns(address){
        Token token = new Token(name, symbol);
        address myAddress = address(token);
        return myAddress;
    }

    
}