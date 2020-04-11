var EIP712ForwarderAbi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "replayProtection",
            type: "address"
          },
          {
            internalType: "bytes",
            name: "nonce",
            type: "bytes"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          },
          {
            internalType: "bytes32",
            name: "innerMessageHash",
            type: "bytes32"
          }
        ],
        internalType: "struct Forwarder.Message",
        name: "message",
        type: "tuple"
      },
      {
        internalType: "enum Forwarder.SignatureType",
        name: "signatureType",
        type: "uint8"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "forward",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        internalType: "struct EIP712Forwarder.Call[]",
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "batch",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "nonce",
        type: "bytes"
      }
    ],
    name: "checkAndUpdateNonce",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address"
      },
      {
        internalType: "uint128",
        name: "batchId",
        type: "uint128"
      }
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  }
];
