// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stake is ERC20 {
    mapping (address => uint256) public staked;
    mapping (address => uint256) public stakedFromTs;

    constructor() ERC20("Token", "TK") {
        _mint(msg.sender, 100000);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, address(this), amount);
        if (staked[msg.sender] > 0) {
            claim();
        }
        stakedFromTs[msg.sender] = block.timestamp;
        staked[msg.sender] += amount;
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(staked[msg.sender] >= amount, "Insufficient staked amount");
        claim();
        staked[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
    }

    function claim() public {
        require(staked[msg.sender] > 0, "No staked amount");
        uint256 second = block.timestamp - stakedFromTs[msg.sender];
        uint256 reward = (staked[msg.sender] * second) / 3.154e7;
        _mint(msg.sender, reward);
        stakedFromTs[msg.sender] = block.timestamp;
    }

    function mint( uint256 amount) external {
 
        _mint(msg.sender, amount);
       
    }
}
