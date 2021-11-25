// import { expect, use } from "chai";
// import { Contract, utils, Wallet } from "ethers";
// import { deployContract, deployMockContract, MockProvider, solidity } from "ethereum-waffle";
// import IERC20 from "../build/IERC20.json";
// import GoldenAgeTimeLock from "../build/GoldenAgeTimeLock.json";

// use(solidity);
// describe("BasicToken", () => {
// 	let mockERC20: Contract;
// 	let contract: Contract;
// 	// let wallet: Wallet;
// 	// let sender: Wallet;
// 	// let receiver: Wallet;
// 	const [wallet, sender, receiver] = new MockProvider().getWallets();

// 	beforeEach(async () => {
// 		return new Promise<void>(async (resolve, reject) => {
// 			console.log("deploying contract...", receiver.address);
// 			const mockERC20 = await deployMockContract(wallet, IERC20.abi);
// 			contract = await deployContract(wallet, GoldenAgeTimeLock, [mockERC20.address]);
// 			console.log("contract deployed!");
// 			resolve();
// 		});
// 	}, 2000);
// 	it("returns false if the wallet has less than 1000000 tokens", async () => {
// 		console.log("Probando balance...");

// 		// await mockERC20.mock.balanceOf.returns(utils.parseEther("999999"));
// 		return new Promise<void>((resolve, reject) => {
// 			console.log(receiver.address);

// 			contract.deposit(receiver.address, 100, 199999);
// 			// expect(contract.estimateGas).to.be (false);
// 			resolve();
// 		});
// 	}, 5000);
// });

import { expect, use } from "chai";
import { Contract, Signer, BigNumber, providers, utils } from "ethers";
import { deployContract, MockProvider, solidity, deployMockContract } from "ethereum-waffle";
import GoldenAgeTimeLock from "../build/GoldenAgeTimeLock.json";
import GoldenAge from "../build/GoldenAge.json";

use(solidity);

describe("BasicToken", () => {
	const [wallet, walletTo] = new MockProvider().getWallets();
	let token: Contract;

	beforeEach(async () => {
		console.log("deploying contract...");

		return new Promise<void>(async (resolve, reject) => {
			const mockERC20 = await deployMockContract(wallet, GoldenAge.abi);
			let tiempo = new Date().getTime();
			token = await deployContract(wallet, GoldenAgeTimeLock, [mockERC20.address, walletTo.address, tiempo + 2500]);
			resolve();
		});
	});

	it("Chequea el beneficiario", async () => {
		return new Promise<void>(async (resolve, reject) => {
			expect(await token.beneficiary()).to.equal(walletTo.address);
			resolve();
		});
	});

	it("Chequea que esté bloqueado aún", async () => {
		const ahora = BigNumber.from(new Date().getTime());
		let releaseTime = await token.releaseTime();
		console.log("ahora, releaseTime", ahora, releaseTime);
		expect(releaseTime).to.be.closeTo(ahora, 2500);
	});

	it("Verifica que esté desbloqueado y retira", async () => {
		let releaseTime = await token.releaseTime();
		console.log(" releaseTime", releaseTime);
		var currentTime = new Date().getTime();

		while (currentTime + 5000 >= new Date().getTime()) {}
		const ahora = BigNumber.from(new Date().getTime());
		console.log("ahora", ahora);
		expect(releaseTime).to.be.lt(ahora);
		await token.release();
	});

	// it("Transfer emits event", async () => {
	// 	await expect(token.transfer(walletTo.address, 7)).to.emit(token, "Transfer").withArgs(wallet.address, walletTo.address, 7);
	// });

	// it("Can not transfer above the amount", async () => {
	// 	await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
	// });

	// it("Can not transfer from empty account", async () => {
	// 	const tokenFromOtherWallet = token.connect(walletTo);
	// 	await expect(tokenFromOtherWallet.transfer(wallet.address, 1)).to.be.reverted;
	// });

	// it("Calls totalSupply on BasicToken contract", async () => {
	// 	await token.totalSupply();
	// 	expect("totalSupply").to.be.calledOnContract(token);
	// });

	// it("Calls balanceOf with sender address on BasicToken contract", async () => {
	// 	await token.balanceOf(wallet.address);
	// 	expect("balanceOf").to.be.calledOnContractWith(token, [wallet.address]);
	// });
});
