import fetch from "node-fetch";
import React, { useEffect } from "react";
import {useState} from "react";
import Auction from "../utils/Auction.json";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";


function AuctionContract({  id, currentAccount }) {
  const [bidAmount, setBidAmount] = useState();
  let params = useParams();
  
  useEffect(()=>{
    localStorage.setItem('id', JSON.stringify(id))
},[id]);

  

  

  const bid = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          id.contract,
          Auction.abi,
          signer
        );

        let auctionTxn = await connectedContract.bid({ value: ethers.utils.parseEther(bidAmount) });
        await auctionTxn.wait();
        console.log(
            `Bid, see transaction: ${auctionTxn.hash}`
          );

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const endAuction = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          id.contract,
          Auction.abi,
          signer
        );

        let auctionTxn = await connectedContract.auctionEnd();
        await auctionTxn.wait();
        console.log(
            `Auction ended, see transaction: ${auctionTxn.hash}`
          );

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }

  }

  const confirmDelivery = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          id.contract,
          Auction.abi,
          signer
        );

        let auctionTxn = await connectedContract.confirm_Delivery();
        await auctionTxn.wait();
        console.log(
            `Delivery Confirmed, see transaction: ${auctionTxn.hash}`
          );

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }

  }

  const renderEndAuction = () => {
    return(
      <div>
        <Button onClick={endAuction}>End Auction</Button>
      </div>
    )
  }

  const renderConfirmDelivery = () => {
    
    return(
      <div>
        <Button onClick={confirmDelivery}>Confirm Delivery</Button>
      </div>
    )
  }


  return (
    <div>
      
      <input onChange={(e) => setBidAmount(e.target.value)}/>
      <button onClick={bid}>BID</button>
      <h2>Account: {params.account}</h2>
      {id.account === currentAccount ? renderEndAuction() : renderConfirmDelivery()}
      {renderConfirmDelivery()}
      <h1>{id.contract}</h1>
    </div>
  );
}

export default AuctionContract;
