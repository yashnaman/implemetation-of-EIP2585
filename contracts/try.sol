pragma solidity 0.6.4;
import "./ForwarderReceiverBase.sol";

contract ERC20Token is ForwarderReceiverBase{
    string name;
    mapping(address => uint256) public balances;

    constructor(address forwarder) ForwarderReceiverBase(forwarder) public{}
    function mint() public {
        balances[_getTxSigner()] += 1;
    }
}
