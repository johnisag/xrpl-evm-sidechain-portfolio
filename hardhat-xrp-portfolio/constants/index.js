export const TOKEN_CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "addAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "assets",
    outputs: [
      {
        internalType: "bytes8",
        name: "symbol",
        type: "bytes8",
      },
      {
        internalType: "int256",
        name: "size",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes8",
        name: "_bytes",
        type: "bytes8",
      },
    ],
    name: "bytesToString",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "findAsset",
    outputs: [
      {
        components: [
          {
            internalType: "bytes8",
            name: "symbol",
            type: "bytes8",
          },
          {
            internalType: "int256",
            name: "size",
            type: "int256",
          },
        ],
        internalType: "struct Portfolio.Asset",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "hasAsset",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_str",
        type: "string",
      },
    ],
    name: "stringToBytes",
    outputs: [
      {
        internalType: "bytes8",
        name: "",
        type: "bytes8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "int256",
        name: "size",
        type: "int256",
      },
    ],
    name: "updateAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
export const CONTRACT_ADDRESS = "0x1eF8E7a86fA66A14aE8332EC80d3748F4C5E62A1";
