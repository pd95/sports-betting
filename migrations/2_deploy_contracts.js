var SportsBet = artifacts.require("SportsBet");

module.exports = function (deployer) {
    deployer.deploy([
        [SportsBet, ["A", "B", "C", "D"], 60 * 60 /* seconds */]
    ]);
};
