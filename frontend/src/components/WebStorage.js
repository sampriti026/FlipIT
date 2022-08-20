import { Web3Storage } from "web3.storage";
import { getFilesFromPath } from "web3.storage";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { inputAdornmentClasses } from "@mui/material";
import { File } from "web3.storage";

function WebStorage() {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [jsonmeta, setJsonmeta] = useState([]);
  const [display, setDisplay] = useState("");
  const [list, setList] = useState([]);

  const listy = [];
  

  const initialValues = {
    website: "",
    business: "",
  };


  const [values, setValues] = useState(initialValues);
  const handleInputChange = (e) => {
    //const name = e.target.name
    //const value = e.target.value
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
    
  };

  const getAccessToken = () => {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return 'paste-your-token-here'

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    const API =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEViMjQ1OTAwRDI4QzdBMTE3NDRCQzA0Q0Q2MTFjMzVBYTQzODM1YTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc5MDM5OTQ2ODgsIm5hbWUiOiJGbGlwSXQifQ.On-hxqrLFdscacAfLkgzZdkgcdK3QWyq8yZzzBtlCuU";
    return API;
  };

  //this token will be used as client to do client.put and generate cid
  const makeStorageClient = () => {
    return new Web3Storage({ token: getAccessToken() });
  };

  //1. stores the userInput in the state.

  async function makeFileObjects() {
    // You can create File objects from a Buffer of binary data
    // see: https://nodejs.org/api/buffer.html
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = values;

    const meta = JSON.stringify(obj);

    //new File([files], 'nameof thefile')
    const files = [new File([meta], "two")];
    await storeData(files);
    return files;
  }

  async function storeData(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    setId(cid);
    const uri = `ipfs://${cid}/two`;

    console.log("stored files with cid:", `https://${cid}.ipfs.dweb.link/two`);
    await getMetadata(cid);

    return { cid, uri };
  }

  async function retrieve(cid) {
    const client = makeStorageClient();
    const res = await client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    const object = await res.files();
    console.log(object);
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`);
    }

    // request succeeded! do something with the response object here...
  }

  function makeGatewayURL(cid) {
    return `https://${cid}.ipfs.dweb.link/two`;
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
    //console.log(metadata);
    const array = Object.values(metadata);
    //console.log(array)
    setJsonmeta(array);
    console.log(metadata)

    return (metadata);
  }

  const render = () => {
    retrieve(id);
  };

  const entries = Object.values(jsonmeta);

  const renderUI = () => {
    return (
      <div>
        {list.map((text) => (
          <li>{text.website}</li>
        ))}
      </div>
    );
  };

  //list all the cids - will be used to fetch all the comments
  async function listUploads() {
    const client = makeStorageClient();
    for await (const upload of client.list()) {
      console.log(`${upload.name} - cid: ${upload.cid}`);

      const metadata = await getMetadata(upload.cid);
      console.log(metadata);
      setData( data => [...data, metadata])
      console.log(data, "data")
      const array =  Object.values(metadata, "metadata");
      console.log(array, "array");
       listy.push(metadata);
       setList((current) => [...current, array]);
      console.log(listy, "list");
      //setDisplay(true);

      // list.map((text) => {
      //   return(
      //     <div>
      //   <Form.Label>text</Form.Label>
      //     </div>
      //   )
      // })
    }
    // console.log(listy, "list");
    setList(listy);
    // console.log(list, "state");
  }

  const renderJson = () => {
    setDisplay(!display);
    console.log(jsonmeta, "jsonmeta");
    console.log(values);
    console.log(listy, "list");
    console.log(list, "state");
  };

  return (
    <>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>About the business</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Describe what the business does. How do you make money? What needs to be done for this business to keep it running? Specify details around the estimated time commitment in hours/per week."
          rows={3}
          name="business"
          value={values.business}
          onChange={handleInputChange}
        />
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="label">
            Enter your URL to start selling
          </Form.Label>
          <Form.Control
            type="url"
            placeholder="mywebsite.com"
            name="website"
            value={values.website}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Form.Group>
      <Button onClick={makeFileObjects}>Console</Button>
      <Button onClick={render}>retrieve</Button>
      <Button onClick={listUploads}>List</Button>
      <Button onClick={renderJson}>JSON</Button>
      <Button onClick={renderUI}>render</Button>
      <Button onClick={() => getMetadata(id)}>getMetaData</Button>
      
      {display ? renderUI() : "hello"}
    </>
  );
}

export default WebStorage;
