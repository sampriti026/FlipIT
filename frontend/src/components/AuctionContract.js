import React, { useEffect } from "react";
import { useState } from "react";
import Auction from "../utils/Auction.json";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./AuctionContract.css";
import Card from "react-bootstrap/Card";

function AuctionContract({ id, currentAccount }) {
  const [bidAmount, setBidAmount] = useState();
  const [balance, setBalance] = useState();
  const [highestbid, setHighestbid] = useState();
  const [ended, setEnded] = useState(false);
  let params = useParams();

  useEffect(() => {
    localStorage.setItem("id", JSON.stringify(id));
  }, [id]);

  useEffect(() => {
    getBalance();
    console.log(balance, "balance");
  }, []);

  const shortenAddress = (address) =>
    `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

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

        let auctionTxn = await connectedContract.bid({
          value: ethers.utils.parseEther(bidAmount),
        });
        await auctionTxn.wait();
        console.log(`Bid, see transaction: ${auctionTxn.hash}`);
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
        console.log(`Auction ended, see transaction: ${auctionTxn.hash}`);
        setEnded(true);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        console.log(`Delivery Confirmed, see transaction: ${auctionTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const numStr = await provider.getBalance(id.contract);
        const weiValue = parseInt(numStr).toString();
        const ethValue = ethers.utils.formatEther(weiValue);
        setBalance(ethValue);
        const contract = new ethers.Contract(
          id.contract,
          ["function highestBid() public view returns (uint256)"],
          provider
        );

        let bid = await contract.highestBid();
        let weiBid = parseInt(bid).toString();
        bid = ethers.utils.formatEther(weiBid);

        //  bid = bid.toString()

        setHighestbid(bid);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const withdraw = async () => {
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

        let auctionTxn = await connectedContract.withdraw();
        await auctionTxn.wait();
        console.log(`Withdraw Confirmed, see transaction: ${auctionTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderEndAuction = () => {
    if(ended === false){
    return (
      <div>
        <button className="button-end" onClick={endAuction}>
          End Auction
        </button>
      </div>
    );
    }
  };

  const renderConfirmDelivery = () => {
    return (
      <div>
        <button className="button-confirm" onClick={confirmDelivery}>
          Confirm Delivery
        </button>
      </div>
    );
  };

  const renderWithdraw = () => {
    return (
      <div>
        <button className="button-confirm" onClick={withdraw}> 
          Withdraw
        </button>
      </div>
    )
  }

  return (
    <div className="card-style">
      <div className="card-style">
        <h6
          style={{ fontSize: 20 }}
          className="text-start mb-2 text-muted account"
        >
          Seller: {shortenAddress(id.account)}
        </h6>
        <h3 className="text-start summary">{id.summary}</h3>
        <h5 className="text-start summary">{id.website}</h5>
        <p className="text-start summary">{id.about}</p>
        <h5 className="text-start summary">Profit</h5>
        <h6 className="text-start summary">${id.profit}</h6>
        <h5 className="text-start summary">Annual Revenue</h5>
        <h6 className="text-start summary">${id.revenue}</h6>
        <h5 className="text-start summary">Assets for Sale</h5>
        <h6 className="text-start summary">{id.deal}</h6>
        <h6 className="text-start summary">Monetization Methods</h6>
        <h6 className="text-start summary">{id.sources}</h6>
        <h6 className="text-start summary">Primary Expenses</h6>
        <h6 className="text-start summary">{id.expenses}</h6>
        <h6 className="text-start summary"> Asking Price: {id.price}</h6>
        <h6 className="text-start summary"> Contract: {id.contract}</h6>
        {id.contract === !null ? (
          <h6
            style={{ fontSize: 20 }}
            className="text-start mb-2 text-muted account"
          >
            Auction Contract Address: {shortenAddress(id.contract)}
          </h6>
        ) : null}
      </div>

      <div style={{ display: "flex" }}>
        <Card className="card-size" style={{ width: "28rem" }}>
          <Card.Body>
            <Card.Title className="text-start">
              Enter Bidding amount in Matic:
            </Card.Title>
            <input onChange={(e) => setBidAmount(e.target.value)} />
            <button className="button-bid" onClick={bid}>
              BID
            </button>
            {id.account === currentAccount
              ? renderEndAuction()
              : renderConfirmDelivery()}
            {ended === true ? renderWithdraw() : null}

            <Card.Subtitle className="mb-2 text-muted">
              Contract Balance: {balance} MATIC
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              Highest Bid: {highestbid} MATIC
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default AuctionContract;
