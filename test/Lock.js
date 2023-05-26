const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20", function () {
  let erc20;
  let owner;
  let alice;

  beforeEach(async () => {
    const ERC20 = await ethers.getContractFactory("ERC20");
    [owner, alice] = await ethers.getSigners();

    erc20 = await ERC20.deploy();
    await erc20.deployed();
  });

  it("should have correct initial values", async function () {
    expect(await erc20.name()).to.equal("Solidity by Example");
    expect(await erc20.symbol()).to.equal("SOLBYEX");
    expect(await erc20.decimals()).to.equal(18);
  });

  it("should mint tokens", async function () {
    const initialSupply = await erc20.totalSupply();

    await erc20.mint(100);
    const newSupply = await erc20.totalSupply();

    expect(newSupply).to.equal(initialSupply.add(100));
    expect(await erc20.balanceOf(owner.address)).to.equal(100);
  });

  it("should allow transfers", async function () {
    await erc20.mint(100);

    await erc20.transfer(alice.address, 50);
    expect(await erc20.balanceOf(owner.address)).to.equal(50);
    expect(await erc20.balanceOf(alice.address)).to.equal(50);
  });

  it("should allow approvals and transfers from", async function () {
    await erc20.mint(100);

    await erc20.approve(alice.address, 50);
    await erc20.connect(alice).transferFrom(owner.address, alice.address, 50);

    expect(await erc20.balanceOf(owner.address)).to.equal(50);
    expect(await erc20.balanceOf(alice.address)).to.equal(50);
  });

  it("should allow staking and unstaking", async function () {
    await erc20.mint(100);
    await erc20.transfer(alice.address, 50);

    await erc20.connect(alice).stake(30);
    expect(await erc20.balanceOf(alice.address)).to.equal(20);
    expect(await erc20.balanceOf(erc20.address)).to.equal(30);
    expect(await erc20.stackedBalance(alice.address)).to.equal(30);

    await erc20.connect(alice).unstake(20);
    expect(await erc20.balanceOf(alice.address)).to.equal(40);
    expect(await erc20.balanceOf(erc20.address)).to.equal(10);
    expect(await erc20.stackedBalance(alice.address)).to.equal(10);
  });
});
