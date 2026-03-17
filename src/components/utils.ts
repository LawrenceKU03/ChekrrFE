import { connect, isConnected, disconnect } from "@stacks/connect";

const connectWallet = async () => {
	try {
		if (isConnected()) {
			console.log("User is already connected.");
			return;
		}

		// 2. Trigger the connection modal
		// This will open a UI for the user to select Leather, Xverse, etc.
		const response = await connect();

		// 3. Access user addresses (STX, BTC, etc.)
		console.log("Connected addresses:", response.addresses);

		const stxAddress = response.addresses.find(
			(a) => a.symbol === "STX",
		)?.address;
		console.log("Primary STX Address:", stxAddress);
	} catch (error) {
		console.error("User cancelled or connection failed:", error);
	}
};

export { connectWallet };
