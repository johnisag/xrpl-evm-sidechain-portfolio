const hre = require("hardhat");

const contractAddress = "0x29BBF5f4f19F7F782a26b51Ae22573B29a9e8C4e";
const contractName = "Portfolio";

function hex_to_ascii(hexStr) {
  hexStr = hexStr.toString();
  var strAscii = "";
  for (var n = 0; n < hexStr.length; n += 2) {
    strAscii += String.fromCharCode(parseInt(hexStr.substr(n, 2), 16));
  }
  return strAscii.replace(/\0/g, "");
}

async function main() {
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  const url = process.env.XRP_EVM_DEV_URL;
  const pk = process.env.PRIVATE_KEY;

  let provider = new ethers.getDefaultProvider(url);
  let walletWithProvider = new ethers.Wallet(pk, provider);

  // attach to the contract
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress,
    walletWithProvider
  );
  // call contract functions
  await contract.updateAsset("BTC", hre.ethers.parseEther("10.3"));

  // sleep 10 seconds for our transaction to reach finality
  // if we do not wait, the getPortfolio() function will get the current blockchain state
  // which does have our changes yet propagated
  await sleep(10000);

  // get portfolio
  let portfolio = await contract.getPortfolio();

  console.log("Portfolio length: ", portfolio.length);

  for (let index = 0; index < portfolio.length; index++) {
    console.log(hex_to_ascii(portfolio[index].symbol));
    console.log(hre.ethers.formatUnits(portfolio[0].size, "ether"));
    console.log("------------------");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
