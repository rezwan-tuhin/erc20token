// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract TuhinToken is ERC20, Ownable, Pausable {

    mapping (address => bool) private _whitelisted;
    mapping ( address => uint256) private _stakingBalance;
    mapping ( address => uint256) private _stakingStartTime;
    mapping ( address => uint256) public lockedUntil;

    uint256 public totalStaked;
    uint256 public stakingRewardRate = 1; //reward rate 1 per cent per year

    constructor (uint256 initialSupply) ERC20("TuhinToken", "Tuhin") Ownable (msg.sender) {
        _mint (msg.sender, initialSupply * 10 ** decimals());
    }

    //modifiers 

    //modifers for whiteliste rquired
    modifier onlyWhiteListed () {
        require (_whitelisted[msg.sender], "You are not whitelisted!");
        _;
    }

    //onlyOwner is a modifier defined in Ownable.sol


    ////////Functions for onwer only//////////
    //Function to add in whitelist
    function addToWhitelist (address account) external onlyOwner {
        _whitelisted[account] = true;
    }

    //Functio to remove from whitelist 
    function removeFromWhitelist (address account) external onlyOwner {
        _whitelisted[account] = false;
    }

    //Function to mint new Token 
    function mint ( address to, uint256 amount) external onlyOwner {
        _mint (to, amount);
    }
    //Function to burn Token
    function burn (address account, uint256 amount) external onlyOwner {
        _burn (account, amount);
    }

    //Function to freeze or lock an account for next some time

    function lockTokens (address account, uint256 lockDuration) external onlyOwner {
        lockedUntil[account] = block.timestamp + lockDuration;
    }

    //Function to unfreeze or unlock an account
    function unlockTokens ( address account) external onlyOwner {
        lockedUntil [account] = 0;
    }

    //Function to pause functionality of entire contract
    function pause () external onlyOwner {
        _pause ();
    }
    //Function to un-pause functionality of entire contract
    function unpause () external onlyOwner {
        _unpause ();
    }

    /// Generalized Function
    //Function to check if account is locked
    function isLocked ( address account) public view returns ( bool ) {
        return block.timestamp < lockedUntil [account];
    }


    //Function to increase allowance 
    function increaseAllowance (address spender, uint256 amount) whenNotPaused public returns (bool) {
        _approve(msg.sender, spender,  allowance(msg.sender, spender) + amount);
        return true;
    }

    //Function to decrease allowance 
    function decreaseAllowance (address spender, uint256 amount) whenNotPaused public returns (bool) {
        require (allowance(msg.sender, spender) >= amount, "You have not enough allowance");
        _approve(msg.sender, spender,  allowance(msg.sender, spender) - amount);
        return true;
    }

   //Transfer functionality with whitelist and lock check
    //I am here overriding the _update function to check extra thing when address
    //are not address(0)

    function _update (address from, address to, uint256 amount) internal override {
        if(from != (address(0) || address(this)) && to != (address(0) || address(this))) {
            require (!isLocked(msg.sender), "Sender's Tokens are locked!");
            require (_whitelisted[msg.sender] || _whitelisted[to], "Sender or Receiver are not in Whitelist!");
        }
        super._update(from, to, amount);

    }

    //Function to stake tokens
    //Limitation of this staking function: Every time a user stake new tokens, his
    //staking time counts restart. 
    function stake (uint256 amount) external whenNotPaused {
        require (amount > 0, "You cannot stake 0 Tuhin!");
        _transfer (msg.sender, address(this), amount);
        _stakingBalance[msg.sender] += amount;
        totalStaked += amount;
        _stakingStartTime[msg.sender] = block.timestamp;
    }

    //Function to unstake tokens
    function unstake (uint256 amount) external whenNotPaused {
        require (amount > 0, "You cannot unstake 0 Tuhin");
        require (_stakingBalance[msg.sender] >= amount, "Not enough Tuhin staked!");
        uint256 reward = calculateStakingReward(msg.sender);
        _stakingBalance[msg.sender] -= amount;
        totalStaked -= amount;
        _transfer(address(this), msg.sender, amount + reward);

    }

    //Function to calculate staking reward
    function calculateStakingReward (address account) public view returns (uint256) {
        uint256 stakingDuration = block.timestamp - _stakingStartTime[account];
        uint256 reward = _stakingBalance[account] * stakingRewardRate * stakingDuration / (365 days * 100);
        return reward;
    }

}