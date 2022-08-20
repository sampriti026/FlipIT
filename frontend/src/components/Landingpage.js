import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { useNavigate } from 'react-router-dom';

import Button from "react-bootstrap/Button";
import './Landingpage.css';



const Landingpage = () => {
  const navigate = useNavigate();

  const renderList = () => {
    navigate('/listings')
 }

  return (
    <div>
           

      <div className='row'>
      <div className='col mt-lg-3'>
      <h1 className='title'>The only marketplace to buy or sell</h1>
            <h1 className='a'> tokenized digital assets</h1>
            </div>
            </div>
            <h5 className="py-3 hero-description">Buy an online business and invest in digital real estate through our escrow-enabled smart auction.</h5>
            <h5 className="py-3 hero-description">Browse the next big online businesses...</h5>
            {/* , revenue generating content, apps, and other online business, . */}
            <Button onClick={renderList}>View Listings</Button>
            
           

           
    </div>
  )
}

export default Landingpage