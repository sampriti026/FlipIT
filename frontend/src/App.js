/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import "./App.css";

import Landingpage from "./components/Landingpage";
import Navbar from "./components/Navbar";
import Sellingform from "./components/Sellingform";
import { useState  } from "react";
import { Routes, Route  } from "react-router-dom";
import { ListContextProvider } from "./components/Context";
import AuctionContract from "./components/AuctionContract";
import Listings from "./components/Listings";
import Chat from "./components/Chat";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [list, setList] = useState(JSON.parse(localStorage.getItem('list')) || []);

  const [id, setId] = useState(JSON.parse(localStorage.getItem('id')) || []);

  
  
    
  
  return (
    <ListContextProvider>
      <div className="App">
        <Navbar
          currentAccount={currentAccount}
          setCurrentAccount={setCurrentAccount}
        />
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route
            path="sell"
            element={
              <Sellingform
                currentAccount={currentAccount}
                contractAddress={contractAddress}
                setContractAddress={setContractAddress}
              />
            }
          />
  
          <Route path="listings" element={<Listings list={list} setList={setList} id={id} setId={setId}/>}/>
          <Route path='listings/:account' exact element={<AuctionContract list={list} id={id} currentAccount={currentAccount}/>}/>
          
          {/* <Route
            path="auction"
            element={<AuctionContract contractAddress={contractAddress} list={list} />}
          /> */}

        <Route path="chat" element={<Chat currentAccount={currentAccount} id={id}/>}/>
        </Routes>
      </div>
    </ListContextProvider>
  );
}

export default App;
