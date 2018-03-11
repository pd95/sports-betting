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