import Form from "react-bootstrap/Form";
import "./Sellingform.css";
import Button from "react-bootstrap/Button";
import { useState, useContext, useEffect } from "react";
import { Web3Storage } from "web3.storage";
import { File } from "web3.storage";
import { ListContext } from "./Context";
import { ethers } from "ethers";
import Auction from "../utils/Auction.json";
import { bytecode } from "../utils/Bytecode";

function Sellingform({ currentAccount, contractAddress, setContractAddress}) {
  const [show, setShow] = useState("");
  //const [contractAddress, setContractAddress] = useState("");
  const [id, setId] = useState("");
  const [list, setList] = useState([]);

  let contract;
  const listCtx = useContext(ListContext);

  const initialValues = listCtx.initialValues;

  const values = listCtx.values;
  const setValues = listCtx.setValues;
  



  const handleInputChange = (e) => {
    //const name = e.target.name
    //const value = e.target.value
    const { name, value } = e.target;

    
   
    setValues(prev => ({
      ...prev,
      [name]: value,
      account: currentAccount,
      
    }));
    
  };

  const setAccount = async () => {
    await startAuction();
    await makeFileObjects();
   
  };

  const getAccessToken = () => {
    const API =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEViMjQ1OTAwRDI4QzdBMTE3NDRCQzA0Q0Q2MTFjMzVBYTQzODM1YTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc5MDM5OTQ2ODgsIm5hbWUiOiJGbGlwSXQifQ.On-hxqrLFdscacAfLkgzZdkgcdK3QWyq8yZzzBtlCuU";
    return API;
  };

  const makeStorageClient = () => {
    return new Web3Storage({ token: getAccessToken() });
  };

  async function makeFileObjects() {
    // You can create File objects from a Buffer of binary data
    // see: https://nodejs.org/api/buffer.html
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = values;

    const meta = JSON.stringify(obj);

    //new File([files], 'nameof thefile')
    const files = [new File([meta], "done")];
    await storeData(files);
    return files;
  }
  async function storeData(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    setId(cid);
    const uri = `ipfs://${cid}/done`;

    console.log("stored files with cid:", `https://${cid}.ipfs.dweb.link/done`);
    await getMetadata(cid);

    return { cid, uri };
  }
  function makeGatewayURL(cid) {
    return `https://${cid}.ipfs.dweb.link/done`;
  }

  
  const startAuction = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const factory = new ethers.ContractFactory(Auction.abi, bytecode, signer);
        const auctionContract = await factory.deploy(currentAccount);
        //await setContractAddress(auctionContract.address);
        await auctionContract.deployed();
        await console.log("Auction Contract Address:", auctionContract.address);
        contract = await auctionContract.address;
        
        setContractAddress(contract)
        setValues(prev => ({...prev, contract: contract}))
        
        // await setContractAddress(contract);
        // await console.log(contractAddress);

        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
     
  };

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

  const renderPrice = () => {
    setShow(!show);
    
  };

  const renderPriceUI = () => (
    <>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label className="label">What assets are you offering to the buyer?</Form.Label>
        <Form.Control
          placeholder="Domain, Social Media Access, After-Sale Support"
          name="deal"
          value={values.deal}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Label className="label">Starting price for Auction in USD</Form.Label>
      <Form.Control
        placeholder="290"
        name="price"
        value={values.price}
        onChange={handleInputChange}
      />

      <button className="done-button" onClick={setAccount}>Done and Start Auction</button>
      
    </>
  );

  return (
    <>
      <h1>What are you selling?</h1>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="label">
            Do you have a website for your business? 
          </Form.Label>
          <Form.Control
            name="website"
            placeholder="mywebsite.com"
            value={values.website}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>About the business</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Describe what the business does. How do you make money? What needs to be done for this business to keep it running? Specify details around the estimated time commitment in hours/per week."
            rows={3}
            name="about"
            value={values.about}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="label">Summary of the business</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="A 10-year old web-based watermarking tool that works directly in your browser. Highly profitable and easy to run."
            name="summary"
            value={values.summary}
            onChange={handleInputChange}
          />
        </Form.Group>
        {/* <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>
            Select an image to show off your business. To be displayed on the
            listing page.
          </Form.Label>
          <Form.Control type="file" />
        </Form.Group> */}
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="label">Enter annual revenue in USD.</Form.Label>
          <Form.Control
            placeholder="1800"
            name="revenue"
            onChange={handleInputChange}
            value={values.revenue}
          />
        </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="label">Enter annual net profit in USD.</Form.Label>
          <Form.Control
            placeholder="1400"
            name="profit"
            onChange={handleInputChange}
            value={values.profit}
          />
        </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="label">What are your monetization methods?</Form.Label>
          <Form.Control
            placeholder="Ads, Affiliate Sales, Print-on-demand...etc. "
            name="sources"
            onChange={handleInputChange}
            value={values.sources}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="label">What are your Primary Expenses?</Form.Label>
          <Form.Control
            placeholder="Shipping, Web Hosting. "
            name="expenses"
            onChange={handleInputChange}
            value={values.expenses}
          />
        </Form.Group>
      </Form>
      
      {renderPriceUI()}
    </>
  );
}

export default Sellingform;
