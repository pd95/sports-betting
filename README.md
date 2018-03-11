# Experimental project to explore and learn about ethereum block chain

## Scenario
Implement a simple betting system as it is common in  [sports betting]( https://en.wikipedia.org/wiki/Sports_betting).
Somebody starts a bet event. He becomes the bookmaker of the bet. He specifies the possible event outcomes to which others can place a wager (paid up-front). He also places a time limit until which bets are accepted.
When the outcome is known, the bookmaker is publishing the result and the winners are calculated. Each winner will receive back his wager and a percentage relative to his wager of the total remaining amount.

## Smart contract design
1. The bookmaker creates the contract, specifies the outcomes and the duration/ending time. The contract amount is 0.

2. Up to the end date everybody can place a wager of an arbitrary amount against any outcome. It is also allowed to place multiple bets for multiple outcomes.
The contract value will therefore increase and the source addresses and amounts are kept in an array. In case of an
abort (contract suicide triggered by the bookmaker), everybody will get his amount back.

3. When the outcome is known and is published by the bookmaker, the winning amounts are calculated for everybody who bet for the final outcome. The amount which can be requested/claimed by each winner is calculated as follows:
    - T = total sum of all wagers placed
    - W = sum of wagers placed on the winning outcome
    - Wi = wager placed by bettor i onto the winning outcome
    - Ai = winner amount for bettor i which can be claimed

    Ai = (T - W) * Wi / W

## Tools used
* [Solidity](https://solidity.readthedocs.io/) as the smart contract language
* [Truffle framework](http://truffleframework.com) as the development framework and tooling
* [OpenZeppelin](https://openzeppelin.org) as the base library for secure smart contract functionality and as a place to learn about smart contract development


## Interacting / testing
1. Start Ganache

2. `truffle compile`

3. `truffle migrate`

4. `truffle develop` and use the console to run the following commands:
```javascript
// Show remaining time
SportsBet.deployed().then(function(inst) { return inst.remainingTime(); }).then(function(val){ return val.toNumber();})

// Place bets:
SportsBet.deployed().then(function(inst) { return inst.placeWager(0,{from:web3.eth.accounts[0], value:500}); })
SportsBet.deployed().then(function(inst) { return inst.placeWager(1,{from:web3.eth.accounts[1], value:100}); })
SportsBet.deployed().then(function(inst) { return inst.placeWager(2,{from:web3.eth.accounts[2], value:900}); })

// Check balance of contract:
web3.eth.getBalance(SportsBet.address).toNumber()

// Publish result
SportsBet.deployed().then(function(inst) { return inst.setWinningOutcome(2,{from:web3.eth.accounts[0]}); })

// Verify that the result is set
SportsBet.deployed().then(function(inst) { return inst.winningOutcome.call();}).then(function(val){ return val.toNumber();})

// Everybody tries to claim his profit:
SportsBet.deployed().then(function(inst) { return inst.claimProfit({from:web3.eth.accounts[0]}); })
SportsBet.deployed().then(function(inst) { return inst.claimProfit({from:web3.eth.accounts[1]}); })
SportsBet.deployed().then(function(inst) { return inst.claimProfit({from:web3.eth.accounts[2]}); })

// Calculate winning amounts
SportsBet.deployed().then(function(inst) { return inst.calculateWinningAmounts({from:web3.eth.accounts[0], gas:5000000});})

// Retry to claim profit:
SportsBet.deployed().then(function(inst) { return inst.claimProfit({from:web3.eth.accounts[0]}); })
SportsBet.deployed().then(function(inst) { return inst.claimProfit({from:web3.eth.accounts[1]}); })
SportsBet.deployed().then(function(inst) { return inst.claimProfit({from:web3.eth.accounts[2]}); })
```

5. Use `migrate --reset` in the console to rerun the migration and create a new contract.