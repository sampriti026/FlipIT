// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleAuction {
    // Parameters of the auction. Times are either
    // absolute unix timestamps (seconds since 1970-01-01)
    // or time periods in seconds.
    address payable public beneficiary;
    address payable public buyer;
    address payable public seller;
    uint256 public balance = address(this).balance;

    // Current state of the auction.
    address payable public  highestBidder;
    uint public highestBid;

    mapping(address => uint) TotalAmount;

       // Defining a enumerator 'State'
    enum State{
         
        // Following are the data members
        await_payment, await_delivery, complete 
    }
  
    // Declaring the object of the enumerator
    State public state;
      
    // Defining function modifier 'instate'
    modifier instate(State expected_state){
          
        require(state == expected_state);
        _;
    }
  
   // Defining function modifier 'onlyBuyer'
    modifier onlyBuyer(){
        require(msg.sender == buyer);
        _;
    }
  
    // Defining function modifier 'onlySeller'
    modifier onlySeller(){
        require(msg.sender == seller);
        _;
    }

    // Allowed withdrawals of previous bids
    mapping(address => uint) public pendingReturns;

    // Set to true at the end, disallows any change
    bool ended;

    // Events that will be fired on changes.
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount, uint balance);

    // The following is a so-called natspec comment,
    // recognizable by the three slashes.
    // It will be shown when the user is asked to
    // confirm a transaction.

    /// Create a simple auction with `_biddingTime`
    /// seconds bidding time on behalf of the
    /// beneficiary address `_beneficiary`.
    constructor(
        
        address payable _seller
 
        
    ) public {
        
        
        
        seller = _seller;
        state = State.await_payment;
        
        
    }

    /// Bid on the auction with the value sent
    /// together with this transaction.
    /// The value will only be refunded if the
    /// auction is not won.
    
    function bid() public payable {
        // No arguments are necessary, all
        // information is already part of
        // the transaction. The keyword payable
        // is required for the function to
        // be able to receive Ether.

        // Revert the call if the bidding
        // period is over.
        require(
            !ended,
            "Auction already ended."
        );

        // If the bid is not higher, send the
        // money back.
        require(
            msg.value > highestBid,
            "There already is a higher bid."
        );

        if (highestBid != 0) {
            // Sending back the money by simply using
            // highestBidder.send(highestBid) is a security risk
            // because it could execute an untrusted contract.
            // It is always safer to let the recipients
            // withdraw their money themselves.
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = payable(msg.sender);
        highestBid = msg.value;
        buyer = highestBidder;
        state = State.await_delivery;
        
        beneficiary = payable(address(this));
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// Withdraw a bid that was overbid.
    function withdraw() public returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                // No need to call throw here, just reset the amount owing
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }
    function showBalance() public returns (uint256) {
         balance = address(this).balance;
         return balance;
    }
    /// End the auction and send the highest bid
    /// to the beneficiary.
    function auctionEnd() public onlySeller  {
    
        // 1. Conditions
        
        require(!ended, "auctionEnd has already been called.");

        // 2. Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid, balance);

        // 3. Interaction
         //(bool sent, bytes memory data ) = buyer.call{value: address(this).balance}("");
         //require(sent, "Failed to send Ether");
        //buyer.transfer(highestBid);
    }

        // Defining function to confirm payment
    // function confirm_payment() onlyBuyer instate(
    //   State.await_payment) public {
      
    //     state = State.await_delivery;
          
    // }
      
    // Defining function to confirm delivery
    function confirm_Delivery() onlyBuyer instate(
      State.await_delivery) public{
        
        (bool sent, ) = seller.call{value: highestBid}("");
         require(sent, "Failed to send Ether");
        //seller.transfer(highestBid);
        state = State.complete;
    }
  
    // Defining function to return payment
    function ReturnPayment() onlySeller instate(
      State.await_delivery)public payable{
        
         
       buyer.transfer(beneficiary.balance);
    }
}
