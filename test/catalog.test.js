const Course = artifacts.require("./Course.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract("Course", (accounts) => {
  let contract;

  before(async () => {
    contract = await Course.deployed();
  })

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = contract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })

    it("has correct name", async () => {
      const name = await contract.name();
      assert.equal(name, "course");
    })

    it("has a symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "COURSE");
    })
  })

  describe("Register new SingleEstate", async () => {
    it("creates a new token", async () => {
      await contract.registerStudent("0xD05393C990Da55410d2ea4181F14F38bB07088B1", "John", "Doe");
    })
  })

  // describe("indexing", async () => {
  //   it("Buy estate", async () => {
  //     console.log(accounts)

  //     await web3.eth.getBalance(accounts[1]).then( balance => {
  //       console.log("From Balance:\nBuyer: ",web3.utils.fromWei(balance, 'ether'))
  //     })
  //     await web3.eth.getBalance(accounts[0]).then( balance => {
  //       console.log("Seller: ",web3.utils.fromWei(balance, 'ether'))
  //     })
  //     await contract.buyEstate(0, {from : accounts[1], value:  web3.utils.toWei('50', 'ether')});
  //     await web3.eth.getBalance(accounts[1]).then( balance => {
  //       console.log("\nNew Balances:\nBuyer: ", web3.utils.fromWei(balance, 'ether'))
  //     })
  //     await web3.eth.getBalance(accounts[0]).then( balance => {
  //       console.log("Seller: ", web3.utils.fromWei(balance, 'ether'))
  //     })
  //   })
  // })
})