// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// using hardhat console log
import "hardhat/console.sol";

contract Portfolio {

    // 
    struct Asset {
        bytes8 symbol;
        int256 size;   
    }

    // out contract deployer
    address public owner;

    // keep track of portfolios per user
    mapping(address => Asset[]) public assets;

    // emitted when users operate on assets
    event AssetOperation(string indexed symbol, string indexed action, int256 amount, uint timestamp);

    constructor() {
        owner = msg.sender;
    }

    /** 
    * @dev Get Portofolio for user
    */
    function getPortfolio() public view returns(Asset[] memory){
        Asset[] memory userAssets = assets[msg.sender];

		return userAssets;
    }

    /** 
    * @dev Add Asset for the user with init value
    */
    function addAsset(string memory symbol) public {
        // ensure asset not with user already
        if(hasAsset(symbol) == false){
            assets[msg.sender].push(Asset(stringToBytes(symbol), 0));

            // Emit event with creation entry
            emit AssetOperation(symbol, "create", 0, block.timestamp);
        }
    }

    /** 
    * @dev Properly Removing asset from user portfolio by shifting elements
    */
    function removeAsset(string memory symbol) public {
        // find asset symbol
        uint256 assetIndex = findAssetIndex(symbol);

        // user does not have asset
        require(assetIndex != 999999, "user does not have asset");

        // properly remove element froma array
        for (uint i = assetIndex; i < assets[msg.sender].length - 1; i++) {
            assets[msg.sender][i] = assets[msg.sender][i + 1];
        }

        assets[msg.sender].pop();

        // Emit event with creation entry
        emit AssetOperation(symbol, "delete", 0, block.timestamp);
    }

    /** 
    * @dev Update Asset Size; new asset will be created for user if it does not exists 
    */
    function updateAsset(string memory symbol, int256 size) public {
        // ensure asset not with user already
        uint256 assetIndex = findAssetIndex(symbol);

        if(assetIndex != 999999){
            assets[msg.sender][assetIndex].size += size;

            // ensure size is always 0
            if(assets[msg.sender][assetIndex].size < 0 ){
                assets[msg.sender][assetIndex].size = 0;
            }
        }
        else{ // add asset if it does not exists 
            
            // Emit event with creation entry
            emit AssetOperation(symbol, "create", 0, block.timestamp);

            assets[msg.sender].push(Asset(stringToBytes(symbol), size));
        }

        // Emit event with update entry
        emit AssetOperation(symbol, "update", size, block.timestamp);
    }

    /** 
    * @dev Find asset for the user; return default if it does not exists
    */
    function findAsset(string memory symbol) public view returns(Asset memory){
        uint256 assetIndex = findAssetIndex(symbol);

        if(assetIndex != 999999){
            return assets[msg.sender][assetIndex];
        }

		return Asset("", 0);
    }

    /** 
    * @dev Check if user has asset
    */
    function hasAsset(string memory symbol) public view returns(bool){
		uint256 assetIndex = findAssetIndex(symbol);

		if(assetIndex == 999999) return false; 

		return true; 
    }

    /** 
    * @dev Find asset index for the user; return -1 if it does not exists
    */
    function findAssetIndex(string memory symbol) internal view returns(uint256){
        Asset[] memory userAssets = assets[msg.sender];
        bytes8 symbolBytes = stringToBytes(symbol);

		for(uint256 index = 0; index < userAssets.length; index++){
			if(userAssets[index].symbol == symbolBytes){
				return index;
			}
		}

        // just return something very big
		return 999999;
    }

    /** 
    * @dev Convert a string (coin symbol) to 8 bytes
    */
    function stringToBytes(string memory _str) public pure returns (bytes8) {
        return bytes8(abi.encodePacked(_str));
    }

    /** 
    * @dev Convert 8 bytes var to string (coin symbol) 
    */
    function bytesToString(bytes8 _bytes) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 8 && _bytes[i] != 0) {
            i++;
        }

        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 8 && _bytes[i] != 0; i++) {
            bytesArray[i] = _bytes[i];
        }
        return string(bytesArray);
    }
}

