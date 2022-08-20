const hre = require("hardhat");
async function main() {
    const TokenGeneratorFactory = await hre.ethers.getContractFactory("TokenGenerator");
    const TokenGenerator = await TokenGeneratorFactory.deploy("Sampriti", "IRA");
    await TokenGenerator.deployed();
    console.log("Token minted to:", TokenGenerator.address);
    
      // Call the function.
      let txn = await TokenGenerator._mint();
      // // Wait for it to be mined.
      await txn.wait()
    
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });