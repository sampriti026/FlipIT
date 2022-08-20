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
  let params = useParams();

  useEffect(() => {
    localStorage.setItem("id", JSON.stringify(id));
  }, [id]);

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

  const renderEndAuction = () => {
    return (
      <div>
        <Button className="button-bid" onClick={endAuction}>End Auction</Button>
      </div>
    );
  };

  const renderConfirmDelivery = () => {
    return (
      <div>
        <Button className="button-bid" onClick={confirmDelivery}>Confirm Delivery</Button>
      </div>
    );
  };

  return (
    <div>
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
      <h6 className="text-start summary">{id.profit}</h6>
      <h5 className="text-start summary">Assets for Sale</h5>
      <h6 className="text-start summary">{id.deal}</h6>
      <h6 className="text-start summary"> Asking Price: {id.price}</h6>
      {id.contract === !null ? (
        <h6
          style={{ fontSize: 20 }}
          className="text-start mb-2 text-muted account"
        >
          Auction Contract Address: {shortenAddress(id.contract)}
        </h6>
      ) : null}
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title className="text-start">
            Enter Bidding amount in Matic:
          </Card.Title>
          <input onChange={(e) => setBidAmount(e.target.value)} />
          <Button className="button-bid" onClick={bid}>
            BID
          </Button>
          {id.account === currentAccount
            ? renderEndAuction()
            : renderConfirmDelivery()}
          {renderConfirmDelivery()}

          <Card.Subtitle className="mb-2 text-muted">
            Card Subtitle
          </Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AuctionContract;
