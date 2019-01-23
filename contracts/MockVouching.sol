pragma solidity ^0.4.24;

import "zos-vouching/contracts/Vouching.sol";

contract MockVouching is Vouching {
  event Test(uint256 _amount);
  event Test2(uint256 _amount);

  function doTest(uint256 _amount) public {
    emit Test(_amount);
  }

  function doTest2(uint256 _amount) public {
    emit Test2(_amount);
  }
}
