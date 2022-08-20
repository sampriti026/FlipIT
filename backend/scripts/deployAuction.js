const hre = require("hardhat");
async function main() {
    const contract="0xfcd47ab4c757e87b3a0984a2f1dbff9629150b92";
    const auction = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const AuctionFactory = await hre.ethers.getContractFactory("SimpleAuction");
    const auctionContract = await AuctionFactory.deploy(contract);
    await auctionContract.deployed();
    await console.log("Auction Contract Address:", auctionContract.address);
    
      // Call the function.
      let auctionTxn = await auctionContract.bid({ value: ethers.utils.parseEther("0.005") });
      await auctionTxn.wait();
      console.log(
          `Bid, see transaction: ${auctionTxn.hash}`
        );
         auctionTxn = await auctionContract.bid({ value: ethers.utils.parseEther("0.004") });
        await auctionTxn.wait();
      console.log(
          `Bid, see transaction: ${auctionTxn.hash}`
        );

    
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });