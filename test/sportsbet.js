var SportsBet = artifacts.require("./SportsBet.sol");

contract('SportsBet', function (accounts) {
    it("Initial balance is 0", function () {
        var bet;
        return SportsBet.deployed().then(function (instance) {
            bet = instance;
            assert.equal(web3.eth.getBalance(bet.address).toNumber(), 0, 'Initial balance is 0');
        });
    });

    // Verify that the deployed contract contains the correct initial values
    it("4 outcomes A, B, C, D", function () {
        var bet, outcomeIndex = 0;
        var expectedValues = [
            { name: 'A', betCount: 0, amount: 0 }, { name: 'B', betCount: 0, amount: 0 },
            { name: 'C', betCount: 0, amount: 0 }, { name: 'D', betCount: 0, amount: 0 }
        ];
        var assertOutcome = function (value, index) {
            assert.equal(web3.toUtf8(value[0]), expectedValues[index].name, 'outcome ' + index + ' is named "' + expectedValues[index].name + '"');
            assert.equal(value[1].toNumber(), expectedValues[index].betCount, 'outcome ' + index + ' has ' + expectedValues[index].betCount + ' bets');
            assert.equal(value[2].toNumber(), expectedValues[index].amount, 'outcome ' + index + ' has amount of ' + expectedValues[index].amount + ' wei');
        }
        return SportsBet.deployed().then(function (instance) {
            bet = instance;
            return bet.getOutcomeCount.call();
        }).then(function (value) {
            assert.equal(value.toNumber(), expectedValues.length, expectedValues.length + ' outcomes expected');
            return bet.outcomes.call(outcomeIndex);
        }).then(function (value) {
            assertOutcome(value, outcomeIndex);
            outcomeIndex++;
            return bet.outcomes.call(outcomeIndex);
        }).then(function (value) {
            assertOutcome(value, outcomeIndex);
            outcomeIndex++;
            return bet.outcomes.call(outcomeIndex);
        }).then(function (value) {
            assertOutcome(value, outcomeIndex);
            outcomeIndex++;
            return bet.outcomes.call(outcomeIndex);
        }).then(function (value) {
            assertOutcome(value, outcomeIndex);
        });
    });

    it("Remaining time should be > 3550", function () {
        var bet;
        return SportsBet.deployed().then(function (instance) {
            bet = instance;
            return bet.remainingTime.call();
        }).then(function (value) {
            assert.ok(value.toNumber() > 3550);
        });
    });

    it("Should be possible to place a wager to outcome 1 and 500 wei", function () {
        var bet;
        return SportsBet.deployed().then(function (instance) {
            bet = instance;
            return bet.placeWager(0, { from: accounts[1], value: 500 });
        }).then(function (value) {
            assert.equal(web3.eth.getBalance(bet.address).toNumber(), 500, 'Balance is 500');
        });
    });

    it("Balance should increase with each additional placed wager", function () {
        var bet;
        return SportsBet.deployed().then(function (instance) {
            bet = instance;
            assert.equal(web3.eth.getBalance(bet.address).toNumber(), 500, 'Start balance is 500');
            return bet.placeWager(1, { from: accounts[2], value: 100 });
        }).then(function (value) {
            assert.equal(web3.eth.getBalance(bet.address).toNumber(), 600, 'Balance is 600');
            return bet.placeWager(2, { from: accounts[3], value: 900 });
        }).then(function (value) {
            assert.equal(web3.eth.getBalance(bet.address).toNumber(), 1500, 'Balance is 1500');
            return bet.placeWager(0, { from: accounts[4], value: 200 });
        }).then(function (value) {
            assert.equal(web3.eth.getBalance(bet.address).toNumber(), 1700, 'Balance is 1700');
        });
    });

    // Verify that the deployed contract contains the correct initial values
    it("All outcomes have the expected state", function () {
        var bet, outcomeIndex = 0;
        var expectedValues = [
            { name: 'A', betCount: 2, amount: 700 }, { name: 'B', betCount: 1, amount: 100 },
            { name: 'C', betCount: 1, amount: 900 }, { name: 'D', betCount: 0, amount: 0 }
        ];
        var assertOutcome = function (value, index) {
            assert.equal(web3.toUtf8(value[0]), expectedValues[index].name, 'outcome ' + index + ' is named "' + expectedValues[index].name + '"');
            assert.equal(value[1].toNumber(), expectedValues[index].betCount, 'outcome ' + index + ' has ' + expectedValues[index].betCount + ' bets');
            assert.equal(value[2].toNumber(), expectedValues[index].amount, 'outcome ' + index + ' has amount of ' + expectedValues[index].amount + ' wei');
        }
        return SportsBet.deployed().then(function (instance) {
            bet = instance;
            return bet.getOutcomeCount.call();
        }).then(function (value) {
            assert.equal(value.toNumber(), expectedValues.length, expectedValues.length + ' outcomes expected');
            return bet.outcomes.call(outcomeIndex);
        }).then(function (value) {
            assertOutcome(value, outcomeIndex);
            outcomeIndex++;
            return bet.outcomes.call(outcomeIndex);
        }).then(function (value) {
            assertOutcome(value, outcomeIndex);
            outcomeIndex++;
            return bet.outcomes.call(outcomeIndex);
        }).then(function (value) {
            assertOutcome(value, outcomeIndex);
            outcomeIndex++;
            return bet.outcomes.call(outcomeIndex);
        }).then(function (value) {
            assertOutcome(value, outcomeIndex);
        });
    });

});