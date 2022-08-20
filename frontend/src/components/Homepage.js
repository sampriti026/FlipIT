import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Token from "../utils/Token.json";
import Navbar from "./Navbar";
import "./Homepage.css";
import { bytecode } from "./Bytecode";

const Homepage = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const shortenAddress = (address) =>
    `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

  const checkIfWalletIsConnected = async () => {
    // First make sure we have access to window.ethereum

    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    //Check if we're authorized to access the user's wallet

    const accounts = await ethereum.request({ method: "eth_accounts" });

    // User can have multiple authorized accounts, we grab the first one if its there!

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      //Fancy method to request access to account.

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const generateToken = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const factory = new ethers.ContractFactory(Token.abi, bytecode, signer);
        const tokenGeneratorContract = await factory.deploy(name, symbol);

        await console.log("Token Address:", tokenGeneratorContract.address);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          Token.abi,
          bytecode,
          signer
        );
        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet}>Connect to Wallet</button>
  );

  const renderMintUI = () => (
    <button className="button-27" onClick={generateToken}>
      Generate Token
    </button>
  );

  return (
    <div>
      
      {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
      <input
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
      ></input>
      <input
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="symbol"
      ></input>
    </div>
  );
};

export default Homepage;
