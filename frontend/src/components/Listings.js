import "./Listings.css";
import { useEffect } from "react";
import { Web3Storage } from "web3.storage";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Card from "react-bootstrap/Card";

function Listings({ list, setList, setId, id }) {
  const shortenAddress = (address) =>
    `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

  const shortenAbout = (text) => `${text.slice(0, 55)}...`;

  let navigate = useNavigate();
  const routeChange = (path) => {
    //id = path;
    //setId(path);
    //console.log(id)
    navigate(path);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  let array = [];

  useEffect(() => {
    listUploads();
    console.log("i fire once");
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
    console.log(list);
    return (
      <div>
        {list.map((item) => (
          <Card>
            {/* <Link to={`/listings/${item.account}`} onClick={()=> setId(item) }>View Listing</Link> */}
            <Card.Subtitle className="mb-2 text-muted text-start">
              {/* {item.account === !null ? <Card.Subtitle className="mb-2 text-muted text-start">shortenAddress(item.account)</Card.Subtitle>: null} */}
              {shortenAddress("afkdjadfjakfdsfkfaslkdjfhaskdhfa")}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted text-end price">
              Asking Price: {item.price}
            </Card.Subtitle>
            <Card.Title className="text-start">{item.summary}</Card.Title>
            <Card.Body className="text-start">{item.about}</Card.Body>
            <button
              className="Button"
              onClick={() => {
                routeChange(item.account);
                setId(item);
              }}
            >
              View Listing
            </button>
          </Card>
        ))}
        <Outlet />
      </div>
    );
  };

  async function listUploads() {
    let start = performance.now();
    const client = makeStorageClient();
    let end = performance.now();
    console.log(`makeStorageClient ${end - start}ms`);
    start = end;
    for await (const upload of client.list()) {
      console.log(`${upload.name} - cid: ${upload.cid}`);

      const metadata = await getMetadata(upload.cid);

      array.push(metadata);
    }
    // end = performance.now()
    // console.log(`client.list ${end - start}ms`)
    // start = end
    setList(array);
    // end = performance.now()
    // console.log(`setList ${end - start}ms`)
    // start = end
    console.log(array, "array");
  }

  return (
    <div>
      <h1 className="h1" style={{ fontSize: 28 }}>
        Marketplace of revenue generating content, apps, and other online
        business...
      </h1>
      {list !== "" ? renderUI() : null}
    </div>
  );
}

export default Listings;
