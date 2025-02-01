const hre = require("hardhat");

const contractAddress = "0x29BBF5f4f19F7F782a26b51Ae22573B29a9e8C4e";
const contractName = "Portfolio";

async function main() {
  const url = process.env.XRP_EVM_DEV_URL;

  let provider = new ethers.getDefaultProvider(url);

  // attach to the mycontract
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress,
    provider
  );

  // call a contract functions
  const msg = await contract.stringToBytes("BTC");

  console.log("String to bytes: ", msg);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
