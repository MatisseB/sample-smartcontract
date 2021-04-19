// const Catalog = artifacts.require("Catalog");
const Course = artifacts.require("Course");

module.exports = function(deployer) {
  // deployer.deploy(Catalog);
  deployer.deploy(Course);
};