var SportsBet = artifacts.require("./SportsBet.sol");

contract('SportsBet', function (accounts) {
    it("Initial balance is 0", function () {
        var bet;
        return SportsBet.deployed().then(function (instance) {
            bet = instance;
            assert.equal(web3.eth.getBalance(bet.address).toNumber(), 0, 'Initial balance is 0');
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

    // it("Outcome list should contain 4 outcomes: A, B, C, D", function () {
    //     var bet;
    //     return SportsBet.deployed().then(function (instance) {
    //         bet = instance;
    //         return bet.outcomes.call(0);
    //     }).then(function (outcome) {
    //         console.log(web3.toAscii(outcome));
    //         assert.ok(web3.toAscii(outcome) == "A");
    //     });
    // });
});