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
    console.log(list)
    return (
      <div>
        {list.map((item) => (
          <Card>
            <Link to={`/listings/${item.account}`} onClick={()=> setId(item) }>{item.account}</Link>
            <Card.Title onClick={() => routeChange(item.account)}>
              {item.summary}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {item.account}
            </Card.Subtitle>
            <Card.Body>Asking Price: {item.price}</Card.Body>
            <Button>Auction</Button>
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
      <h1>Listings</h1>
      {list !== "" ? renderUI() : null}
      <Button onClick={listUploads}>LIST</Button>
      {/* {show === true ? renderUI() : null} */}
      <Card>
        <Card.Title>
          Newsletter with 4,600+ subscribers that features the most useful
          websites from around the web.
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          0xfcd47ab4c757e87b3a0984a2f1dbff9629150b92
        </Card.Subtitle>
        <Card.Body>Asking Price: $25000</Card.Body>
        <Button>Auction</Button>
        <Card.Title>
          Newsletter with 4,600+ subscribers that features the most useful
          websites from around the web.
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          0xfcd47ab4c757e87b3a0984a2f1dbff9629150b92
        </Card.Subtitle>
        <Card.Body>Asking Price: $25000</Card.Body>
        <Button>Auction</Button>
      </Card>
    </div>
  );
}

export default Listings;
