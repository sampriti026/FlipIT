import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { ethers } from "ethers";
import Token from "../utils/Token.json";
import { bytecode } from "./Bytecode";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function NavbarComponent({ currentAccount, setCurrentAccount }) {
  const navigate = useNavigate();

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
      const rinkebyChainId = "0x137";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Polygon Test Network!");
      }

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const shortenAddress = (address) =>
    `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

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
    <Nav.Link onClick={connectWallet}>Connect Wallet</Nav.Link>
  );

  const renderAccount = () => (
    <h1 className="font d-inline-block text-white font-weight-bold mr-3 deco-none text-nowra">
      {shortenAddress(currentAccount)}
    </h1>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderForm = () => {
    navigate("/sell");
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand className="mr-4" href="/">
            FlipIt
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Explore" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              {currentAccount === ""
                ? renderNotConnectedContainer()
                : renderAccount()}
            </Nav>
            <Nav>
              <button className="button" onClick={renderForm}>
                Sell Now
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavbarComponent;
