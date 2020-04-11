const EIP712Forwarder = artifacts.require("EIP712Forwarder");
const ERC20Token = artifacts.require("ERC20Token");

module.exports = async function(deployer, networks, accounts) {
  let EIP712ForwarderContract = await deployer.deploy(EIP712Forwarder);

  let ERC20TokenContract = await deployer.deploy(
    ERC20Token,
    EIP712Forwarder.address
  );
};
