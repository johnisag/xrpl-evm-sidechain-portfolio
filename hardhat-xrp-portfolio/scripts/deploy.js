const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const url = process.env.XRP_EVM_DEV_URL;
  console.log(url);

  let artifacts = await hre.artifacts.readArtifact("Portfolio");

  const provider = new ethers.getDefaultProvider(url);

  //console.log(provider);

  let privateKey = process.env.PRIVATE_KEY;

  let wallet = new ethers.Wallet(privateKey, provider);

  // Create an instance of the xrp dev contract
  let factory = new ethers.ContractFactory(
    artifacts.abi,
    artifacts.bytecode,
    wallet
  );

  let portfolioContract = await factory.deploy();

  console.log("Portfolio Contract address:", portfolioContract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
