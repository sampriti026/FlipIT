import "./Listings.css";
import { useState, useEffect, useContext } from "react";
import { Web3Storage } from "web3.storage";
import { useNavigate, useParams } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Card from "react-bootstrap/Card";
import AuctionContract from "./AuctionContract";



function Listings({ list, setList, setId, id }) {
  
  
  //const [id, setId] = useState();
  //let id = useParams();

  

  const shortenAddress = (address) =>
    `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

  let navigate = useNavigate();
  const routeChange = (path) => {
    //id = path;
    //setId(path);
    //console.log(id)
    navigate(path);
  };

  useEffect(()=>{
    localStorage.setItem('list', JSON.stringify(list))
},[list]);





  const array = [];
  const [show, setShow] = useState();

  useEffect(() => {
    // Update the document title using the browser API
    //listUploads();
    //console.log("list upload was called.");
  }, []);

  const getAccessToken = () => {
    const API =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEViMjQ1OTAwRDI4QzdBMTE3NDRCQzA0Q0Q2MTFjMzVBYTQzODM1YTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc5MDM5OTQ2ODgsIm5hbWUiOiJGbGlwSXQifQ.On-hxqrLFdscacAfLkgzZdkgcdK3QWyq8yZzzBtlCuU";
    return API;
  };

  const makeStorageClient = () => {
    return new Web3Storage({ token: getAccessToken() });
  };

  function makeGatewayURL(cid) {
    return `https://${cid}.ipfs.dweb.link/done`;
  }

  async function getMetadata(cid) {
    const url = await makeGatewayURL(cid);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `error fetching image metadata: [${res.status}] ${res.statusText}`
      );
    }
    const metadata = await res.json();

    return metadata;
  }

  const renderUI = () => {
    // setShow(!show);
    //onClick={() => routeChange(item.account)}
    console.log(list)
    return (
      <div>
        {list.map((item) => (
          <Card>
            {/* <Link to={`/listings/${item.account}`} onClick={()=> setId(item) }>View Listing</Link> */}
            <Card.Subtitle className="mb-2 text-muted text-start">
              {shortenAddress(item.account)}
            </Card.Subtitle>
            <Card.Title className="text-start">
              {item.summary}
            </Card.Title>
            <Card.Body className="text-start">{item.about}</Card.Body>
            <button className="Button" onClick={() => {routeChange(item.account); setId(item)}}>View Listing</button>
          </Card>
        ))}
        <Outlet />
      </div>
    );
  };

  async function listUploads() {
    const client = makeStorageClient();
    for await (const upload of client.list()) {
      console.log(`${upload.name} - cid: ${upload.cid}`);

      const metadata = await getMetadata(upload.cid);

      array.push(metadata);

    }
    setList(array);
    console.log(list, "state");
  }

  return (
    <div>
      <h1 className="h1" style={{fontSize: 28}}>Marketplace of revenue generating content, apps, and other online business...</h1>
      {list !== "" ? renderUI() : null}
      <Button onClick={listUploads}>LIST</Button>
      {/* {show === true ? renderUI() : null} */}
    </div>
  );
}

export default Listings;
