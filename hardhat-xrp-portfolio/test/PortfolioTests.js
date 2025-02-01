const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

function hex_to_ascii(hexStr) {
  hexStr = hexStr.toString();
  var strAscii = "";
  for (var n = 0; n < hexStr.length; n += 2) {
    strAscii += String.fromCharCode(parseInt(hexStr.substr(n, 2), 16));
  }
  return strAscii.replace(/\0/g, "");
}

describe("PortfolioTests", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployContractAndSetVariables() {
    const MyContract = await ethers.getContractFactory("Portfolio");
    const mycontract = await MyContract.deploy();

    const [owner] = await ethers.getSigners();

    return { mycontract, owner };
  }

  it("test remove asset", async function () {
    const { mycontract, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // add assets, quickly
    await mycontract.updateAsset("LINK", ethers.parseEther("10.3"));
    await mycontract.updateAsset("BTC", ethers.parseEther("1"));

    //remove assets
    await mycontract.removeAsset("LINK");
    await mycontract.removeAsset("BTC");

    // get portfolio
    let portfolio = await mycontract.getPortfolio();

    // ensure both assets were deleted
    expect(portfolio.length).to.equal(0);
  });

  it("test create, populate and get portfolio", async function () {
    const { mycontract, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // add assets, quickly
    await mycontract.updateAsset("LINK", ethers.parseEther("10.3"));
    await mycontract.updateAsset("BTC", ethers.parseEther("1"));

    // get portfolio
    let portfolio = await mycontract.getPortfolio();

    // expect to find LINK as first asset
    expect(hex_to_ascii(portfolio[0].symbol)).to.equal("LINK");
    expect(ethers.formatUnits(portfolio[0].size, "ether")).to.equal("10.3");

    //console.log(hex_to_ascii(portfolio[0].symbol));
    //console.log(ethers.formatUnits(portfolio[0].size, "ether"));

    // expect to find BTC as second asset
    expect(hex_to_ascii(portfolio[1].symbol)).to.equal("BTC");
    expect(ethers.formatUnits(portfolio[1].size, "ether")).to.equal("1.0");

    //console.log(hex_to_ascii(portfolio[1].symbol));
    //console.log(ethers.formatUnits(portfolio[1].size, "ether"));
  });

  it("test get empty portfolio", async function () {
    const { mycontract, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // get empty portfolio
    let portfolio = await mycontract.getPortfolio();

    // expect empty portfolio
    expect(portfolio.length).to.equal(0);
  });

  it("test add and find asset", async function () {
    const { mycontract, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // add an asset
    await mycontract.addAsset("BTC");

    // find the asset
    let asset = await mycontract.findAsset("BTC");
    let symbolStr = await mycontract.bytesToString(asset.symbol);

    expect(symbolStr).to.equal("BTC");

    // we do not have this asset so empty asset should be returned
    asset = await mycontract.findAsset("XBTC");
    symbolStr = await mycontract.bytesToString(asset.symbol);

    expect(symbolStr).to.equal("");
  });

  it("test has asset", async function () {
    const { mycontract, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // add an asset
    await mycontract.addAsset("BTC");

    let hasAsset = await mycontract.hasAsset("XBTC");
    expect(hasAsset).to.equal(false);

    hasAsset = await mycontract.hasAsset("BTC");
    expect(hasAsset).to.equal(true);
  });

  it("test update asset", async function () {
    const { mycontract, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // create an asset
    await mycontract.addAsset("BTC");

    // update the asset
    let amount = ethers.parseEther("1.5");
    await mycontract.updateAsset("BTC", amount);

    let asset = await mycontract.findAsset("BTC");
    let symbolStr = hex_to_ascii(asset.symbol);

    //console.log("asset symbol: ", symbolStr);
    //console.log("asset size: ", asset.size);
    //console.log("asset size: ", ethers.formatUnits(asset.size, "ether"));

    expect(asset.size).to.equal(ethers.parseEther("1.5"));
  });

  it("test update with create if asset does not exist", async function () {
    const { mycontract, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // update the asset
    let amount = ethers.parseEther("2.5");
    await mycontract.updateAsset("BTC", amount);

    let asset = await mycontract.findAsset("BTC");

    //console.log("asset symbol: ", hex_to_ascii(asset.symbol));
    //console.log("asset size: ", asset.size);
    //console.log("asset size: ", ethers.formatUnits(asset.size, "ether"));

    expect(asset.size).to.equal(ethers.parseEther("2.5"));
  });

  it("test update/reducing asset", async function () {
    const { mycontract, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // create/update the asset
    let amount = ethers.parseEther("1000.123456789");
    await mycontract.updateAsset("XRP", amount);

    // reduce asset size
    let reduceAmount = ethers.parseEther("-500");
    await mycontract.updateAsset("XRP", reduceAmount);

    let asset = await mycontract.findAsset("XRP");

    //console.log("asset symbol: ", hex_to_ascii(asset.symbol));
    //console.log("asset size: ", asset.size);
    //console.log("asset size: ", ethers.formatUnits(asset.size, "ether"));

    expect(asset.size).to.equal(ethers.parseEther("500.123456789"));
  });

  it("test update/reducing asset below zero should set it to zero", async function () {
    const { mycontract, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // create/update the asset
    let amount = ethers.parseEther("100");
    await mycontract.updateAsset("LINK", amount);

    // reduce asset size
    let reduceAmount = ethers.parseEther("-500");
    await mycontract.updateAsset("LINK", reduceAmount);

    let asset = await mycontract.findAsset("LINK");

    //console.log("asset symbol: ", hex_to_ascii(asset.symbol));
    //console.log("asset size: ", asset.size);
    //console.log("asset size: ", ethers.formatUnits(asset.size, "ether"));

    expect(asset.size).to.equal(ethers.parseEther("0"));
  });
});
