require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  // defaultNetwork: 'localhost'
  networks: {
    xrpl: {
      // https://rpc-evm-sidechain.xrpl.org
      url: process.env.XRP_EVM_DEV_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1440002,
    },
  },
};
