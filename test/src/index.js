var Web3 = require("web3");

var erc20TokenAddress = "0x573648EdCd11fc7202CC057b151bF657BBca8AA9";
var EIP712ForwarderAddress = "0x40FE63939720687081040F4F145CE7f85284c790";

let signer;
var jsonInterfaceOfMint = {
  name: "mint",
  type: "function"
};

function getDomainData(contractName, signatureVersion) {
  return {
    name: contractName,
    version: signatureVersion
  };
}
const domains = {};
domains.getForwaderDomainData = function() {
  return getDomainData("Forwarder", "1");
};
//console.log(domains.getDomainData("0x214sdflj"));
const schemas = {};

//The schema of every contract that supports EIP712Domain

schemas.domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" }
];
schemas.MetaTransaction = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "chainId", type: "uint256" },
  { name: "replayProtection", type: "address" },
  { name: "nonce", type: "bytes" },
  { name: "data", type: "bytes" },
  { name: "innerMessageHash", type: "bytes32" },
  { name: "value", type: "uint256" }
];

const generators = {};

function getRequestData(domainDataFn, messageTypeName, messageSchema, message) {
  const domainData = domainDataFn();
  // console.log("domainData:"+ JSON.stringify(domainData));
  // console.log("DOMAIN_SEPARATOR: " + web3.utils.sha3(JSON.stringify(domainData)));
  const types = {
    EIP712Domain: schemas.domain
  };
  types[messageTypeName] = messageSchema;
  return {
    types: types,
    domain: domainData,
    primaryType: messageTypeName,
    message: message
  };
}

generators.getMetaTransaction = function(
  from,
  to,
  value,
  chainId,
  replayProtection,
  nonce,
  data,
  innerMessageHash
) {
  const message = {
    from: from,
    to: to,
    value: value,
    chainId: chainId,
    replayProtection: replayProtection,
    nonce: nonce,
    data: data,
    innerMessageHash: innerMessageHash
  };
  return getRequestData(
    domains.getForwaderDomainData,
    "MetaTransaction",
    schemas.MetaTransaction,
    message
  );
};

var main = async function() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    let accounts = await ethereum.enable();
    signer = accounts[0];
  }
  var mintFunctionSignature = await web3.eth.abi.encodeFunctionSignature(
    "mint()"
  );
  //  console.log(mintFunctionSignature);
  var erc20TokenContract = new web3.eth.Contract(
    erc20TokenAbi,
    erc20TokenAddress
  );
  var EIP712ForwarderContract = new web3.eth.Contract(
    EIP712ForwarderAbi,
    EIP712ForwarderAddress
  );
  var from = signer;
  var to = erc20TokenAddress;
  var value = 0;
  var chainId = await web3.eth.net.getId();
  var replayProtection = EIP712ForwarderAddress;
  console.log(chainId);
  var batchId = 1;
  var batchNonce = await EIP712ForwarderContract.methods
    .getNonce(signer, batchId)
    .call();
  var value1 = batchId * Math.pow(2, 128) + batchNonce;
  var valueBn = new web3.utils.BN(value1);
  var nonce = await web3.eth.abi.encodeParameter("uint256", valueBn);
  // var decoded = await web3.eth.abi.decodeParameter("uint256", nonce);
  // console.log(decoded);
  var data = mintFunctionSignature;
  var innerMessageHash = web3.utils.sha3("just simple");
  var signatureData = generators.getMetaTransaction(
    from,
    to,
    value,
    chainId,
    replayProtection,
    nonce,
    data,
    innerMessageHash
  );
  console.log(signatureData);
  var sigString = JSON.stringify(signatureData);
  console.log(sigString);
  web3.providers.HttpProvider.prototype.sendAsync =
    web3.providers.HttpProvider.prototype.send;

  web3.currentProvider.sendAsync(
    {
      method: "eth_signTypedData_v4",
      params: [signer, sigString],
      from: signer
    },
    function(err, result) {
      if (err) {
        return console.error(err);
      }
      var forwardMessage = [
        from,
        to,
        chainId,
        replayProtection,
        nonce,
        data,
        innerMessageHash
      ];
      console.log(forwardMessage);
      var signatureType = 1;
      const signature = result.result;
      console.log(signature);

      EIP712ForwarderContract.methods
        .forward(forwardMessage, signatureType, signature)
        .send({ from: signer }, (err, res) => {
          if (err) console.log(err);
          else console.log(res);
        });
    }
  );

  // console.log(value);
  // console.log(valueBn.toString());
  // console.log(batchNonce);
  // console.log(nonce);

  // console.log(erc20TokenContract);
  // var tnxObject = {
  //   from: signer,
  //   to: erc20TokenAddress,
  //   data: mintFunctionSignature
  // };
  // await web3.eth.sendTransaction(tnxObject);
  // console.log(await erc20TokenContract.methods.balances(signer).call());
};
main();

// // var jsonInterfaceOfbiconomyTry = {
// //   name: "biconomyTry",
// //   type: "function",
// //   inputs: [
// //     {
// //       internalType: "uint256",
// //       name: "_a",
// //       type: "uint256"
// //     },
// //     {
// //       internalType: "address",
// //       name: "_b",
// //       type: "address"
// //     }
// //   ]
// // };
// var jsonInterFaceOfquote = {
//   name: "quote",
//   type: "function",
//   inputs: [
//     {
//       internalType: "uint256",
//       name: "amountA",
//       type: "uint256"
//     },
//     {
//       internalType: "uint256",
//       name: "reserveA",
//       type: "uint256"
//     },
//     {
//       internalType: "uint256",
//       name: "reserveB",
//       type: "uint256"
//     }
//   ]
// };
// var jsonInterFaceOfgetAmountsOut = {
//   name: "getAmountsOut",
//   type: "function",
//   inputs: [
//     {
//       internalType: "uint256",
//       name: "amountIn",
//       type: "uint256"
//     },
//     {
//       internalType: "address[]",
//       name: "path",
//       type: "address[]"
//     }
//   ]
// };
// var jsonInterFaceOfSwapExactTokensForTokens = {
//   name: "swapExactTokensForTokens",
//   type: "function",
//   inputs: [
//     {
//       internalType: "uint256",
//       name: "amountIn",
//       type: "uint256"
//     },
//     {
//       internalType: "uint256",
//       name: "amountOutMin",
//       type: "uint256"
//     },
//     {
//       internalType: "address[]",
//       name: "path",
//       type: "address[]"
//     },
//     {
//       internalType: "address",
//       name: "to",
//       type: "address"
//     },
//     {
//       internalType: "uint256",
//       name: "deadline",
//       type: "uint256"
//     }
//   ]
// };
//
// const justTrying = async () => {
//   var contractAbi = gaslessRouterAbi;
//   const contract = new web3.eth.Contract(contractAbi, routerAddress);
//   var amountA = 1000;
//   // var reserveA;
//   // var reserveB;
//   var daiAddress = mDAIAddress;
//   var WETHAddress = mETHAddress;
//   var path = [daiAddress, WETHAddress];
//
//   var reserveA = 200;
//   var reserveB = 200;
//
//   var quoteFunctionSignature = web3.eth.abi.encodeFunctionCall(
//     jsonInterFaceOfquote,
//     [amountA, reserveA, reserveB]
//   );
//   let accounts = await web3.eth.getAccounts();
//   signer = accounts[0];
//   var swapExactTokensForTokensFunctionSignature = web3.eth.abi.encodeFunctionCall(
//     jsonInterFaceOfSwapExactTokensForTokens,
//     [100, 1, [mDAIAddress, mETHAddress], signer, 12345678911110]
//   );
//   console.log(swapExactTokensForTokensFunctionSignature);
//   // var getAmountOutFunctionSignature = web3.eth.abi.encodeFunctionCall(
//   //   jsonInterFaceOfgetAmountsOut,
//   //   [amountA, path]
//   // );
//
//   // var swapExactTokensForTokensFunctionSignature = web3.eth.abi.encodeFunctionCall(
//   //   jsonInterFaceOfSwapExactTokensForTokens,
//   //   [amountA, 900, path, ethereum.selectedAddress, 12345678911110]
//   // );
//   // let WETHAddress = await contract.methods.WETH().call();
//   // let accounts = await web3.eth.getAccounts();
//   // let signer = accounts[0];
//   let chainId = await web3.eth.net.getId();
//   console.log(chainId);
//   let nonce = await contract.methods.getNonce(signer).call();
//
//   let signatureData = generators.getMetaTransaction(
//     routerAddress,
//     chainId,
//     nonce,
//     signer,
//     quoteFunctionSignature
//   );
//   let sigString = JSON.stringify(signatureData);
//
//   web3.providers.HttpProvider.prototype.sendAsync =
//     web3.providers.HttpProvider.prototype.send;
//   web3.currentProvider.sendAsync(
//     {
//       method: "eth_signTypedData_v4",
//       params: [signer, sigString],
//       from: signer
//     },
//     function(err, result) {
//       if (err) {
//         return console.error(err);
//       }
//       console.log(result);
//       const signature = result.result.substring(2);
//       const sigR = "0x" + signature.substring(0, 64);
//       const sigS = "0x" + signature.substring(64, 128);
//       const sigV = parseInt(signature.substring(128, 130), 16);
//
//       contract.methods
//         .executeMetaTransaction(
//           signer,
//           swapExactTokensForTokensFunctionSignature,
//           sigR,
//           sigS,
//           sigV
//         )
//         .send({ from: signer }, (err, res) => {
//           if (err) console.log(err);
//           else console.log(res);
//         });
//     }
//   );
// };
