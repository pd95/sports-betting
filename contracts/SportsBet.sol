pragma solidity ^0.4.4;

import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../node_modules/zeppelin-solidity/contracts/payment/PullPayment.sol';
import '../node_modules/zeppelin-solidity/contracts/math/Math.sol';


contract SportsBet is Ownable, PullPayment {

  uint constant MAX_UINT = 2**256 - 1;

  struct Outcome {
    bytes32 name;
    uint    betCount;
    uint    amount;
    mapping(uint => Bettor) bettors;
  }

  struct Bettor {
    address addr;
    uint amount;
  }

  Outcome[] public outcomes;
  uint public endTime;
  uint public winningOutcome;

  // Constructor to create the contract using the list of names for the outcomes 
  // and the duration of the bet (in seconds)
  function SportsBet(bytes32[] outcomeNames, uint betDuration) public {
    for (uint i = 0; i < outcomeNames.length; i++) {
      outcomes.push(Outcome({
        name: outcomeNames[i],
        betCount: 0,
        amount: 0
      }));
    }
    endTime = now + betDuration;
    winningOutcome = MAX_UINT;
  }

  // Unnamed fallback function 
  function() public { 
    revert(); // We do reject all undefined calls and plain ETH payments
  }

  // Convenience wrapper: the bookmaker is also the contract owner
  function bookmaker() public view returns (address) {
    return owner;
  }

  // Returns the remaining time (in seconds)
  function remainingTime() public view returns (uint) {
    uint rest = endTime-now;
    return rest > 0 ? rest : 0;
  }

  // Function to place a wager to an outcome
  function placeWager(uint outcome) public payable {
    require(outcome >= 0 && outcome <= outcomes.length);
    require(msg.value > 0);
    require(remainingTime() > 0);

    outcomes[outcome].amount += msg.value;
    outcomes[outcome].bettors[outcomes[outcome].betCount] = Bettor({addr: msg.sender, amount: msg.value});
    outcomes[outcome].betCount++;
  }

  // Function called by the bookmaker to publish the winning outcome
  function setWinningOutcome(uint outcome) public onlyOwner {
    // early end of betting? 
    if (now <= endTime) {
      endTime = now;
    } 
    winningOutcome = outcome;
  }

  function calculateWinningAmounts() public onlyOwner {
    require(winningOutcome < outcomes.length);

    uint totalAmount = this.balance;
    uint winningAmount = 0;

    // loop over all contributions and sum up the amounts
    for (uint i = 0; i < outcomes.length; i++) {
      if (i == winningOutcome) {
        winningAmount += outcomes[i].amount;
      }
    }

    // Distribute the amount according to the winning bettors amounts:
    uint distributableAmount = totalAmount - winningAmount;
    for (uint j = 0; j < outcomes[winningOutcome].betCount; j++) {
      Bettor storage bettor = outcomes[winningOutcome].bettors[j];
      uint additionalAmount = distributableAmount * bettor.amount / winningAmount;
      uint sendingAmount = bettor.amount + additionalAmount;
      asyncSend(bettor.addr, sendingAmount);

      totalAmount -= sendingAmount;
    }

    // Make sure we have properly calculated everything
    assert(totalAmount == 0);
  }

  // Function used by the winner to claim his wager + profit
  function claimProfit() public {
    withdrawPayments();
  }
}
