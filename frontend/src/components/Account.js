import React, { useEffect } from "react";

import { useParams } from "react-router-dom";


function Account() {
  let params = useParams();
  

  return (
    <div>
       <h2>Account: {params.account}</h2>
      <button>BID</button>
    </div>
  );
}

export default Account;
