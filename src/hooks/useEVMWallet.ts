import { create } from "zustand";
import {
	BrowserProvider,
	JsonRpcSigner,
	parseUnits,
	Contract,
	formatUnits,
} from "ethers";
import toast from "react-hot-toast";
import { c32addressDecode } from "c32check";
import axios from "axios";

const TESTNET = {
	USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
	XRESERVE: "0x008888878f94C0d87defdf0B07f46B93C1934442",
};

const STACKS_DOMAIN_ID = 10003;

const ERC20_ABI = [
	"function balanceOf(address owner) view returns (uint256)",
	"function approve(address spender, uint256 amount) returns (bool)",
];

const XRESERVE_ABI = [
	`function depositToRemote(
    uint256 amount,
    uint32  remoteDomain,
    bytes32 remoteRecipient,
    address burnToken,
    uint256 maxFee,
    bytes   hookData
  ) external`,
];

function encodeStacksAddress(stacksAddress: string): string {
	const [version, hash160] = c32addressDecode(stacksAddress);

	const buf = new Uint8Array(32);
	buf[11] = version;

	// Convert hex string to bytes manually (no Buffer)
	const hash160Bytes = new Uint8Array(
		hash160.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
	);
	buf.set(hash160Bytes, 12);

	// Convert Uint8Array to hex string manually
	return (
		"0x" +
		Array.from(buf)
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("")
	);
}

interface EVMWalletState {
	connectedAccount: string | null;
	connectionStatus: boolean;
	provider: BrowserProvider | null;
	signer: JsonRpcSigner | null;
	connect: () => Promise<void>;
	bridgeUSDCtoStacks: (
		amountUSDC: string,
		stacksRecipient: string,
		bridgeIntentId: string,
	) => Promise<{ txHash: any }>;
}

const MASTER_WALLET_ESCROW_ADDRESS =
	"ST3K9XTZK3Q7P3WJ593G9GKMZZY57BCKFZQY46WZH";

const useEVMWallet = create<EVMWalletState>((set, get) => ({
	connectionStatus: false,
	connectedAccount: null,
	provider: null,
	signer: null,
	connect: async () => {
		if (!window.ethereum) {
			toast.error("Install MetaMask to continue.");
			return;
		}

		let provider;

		try {
			provider = new BrowserProvider(window.ethereum as never);
			await provider.send("eth_requestAccounts", []);
			const networkInfo = await provider.getNetwork();
			console.log(networkInfo);
			if (networkInfo.chainId != 11155111n) {
				try {
					await (window.ethereum as any).request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: "0xaa36a7" }],
					});
					// ✅ Re-instantiate after chain switch — old provider is stale
					provider = new BrowserProvider(window.ethereum as never);
				} catch (e) {
					toast.error("Switch to the Sepolia network in MetaMask.");
					return;
				}
			}

			const signer = await provider.getSigner();
			const address = await signer.getAddress();

			console.log(signer, address, "Tried");

			set({
				connectionStatus: true,
				connectedAccount: address,
				provider: provider,
				signer: signer,
			});
			toast.success(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
		} catch (error) {
			toast.error("Failed to connect wallet.");
			console.error(error);
		}
	},
	bridgeUSDCtoStacks: async (
		amountUSDC: string, // e.g. "10"
		stacksRecipient: string,
		bridgeIntentId: string, // e.g. "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
	) => {
		const signer = get().signer;
		const provider = get().provider;

		if (!signer || !provider) throw new Error("Wallet not connected");

		const contracts = TESTNET;
		const amount = parseUnits(amountUSDC, 6); // USDC = 6 decimals
		const maxFee = parseUnits("0.10", 6); // 0.10 USDC max fee
		const hookData = "0x";

		// Encode Stacks address → bytes32
		const remoteRecipient = encodeStacksAddress(MASTER_WALLET_ESCROW_ADDRESS);

		const usdc = new Contract(contracts.USDC, ERC20_ABI, signer);
		const xreserve = new Contract(contracts.XRESERVE, XRESERVE_ABI, signer);

		// 1. Check USDC balance
		const walletAddress = await signer.getAddress();
		const balance = await usdc.balanceOf(walletAddress);
		console.log("USDC balance:", formatUnits(balance, 6));
		if (balance < amount) toast.error("Insufficient USDC balance");

		// 2. Approve xReserve to spend USDC
		toast.loading("Approving xReserve", { duration: 5000 });
		const approveTx = await usdc.approve(contracts.XRESERVE, amount);
		await approveTx.wait();
		toast.success("XReserve Approved");

		// 3. Call depositToRemote
		toast("Bridging to Stacks");
		const depositTx = await xreserve.depositToRemote(
			amount,
			STACKS_DOMAIN_ID,
			remoteRecipient,
			contracts.USDC,
			maxFee,
			hookData,
		);
		await depositTx.wait();
		toast.success("USDC bridged successfully to Stacks", depositTx.hash);

		await axios.post("http://localhost:8000/bot/bridgeintent/", {
			stacksAddress: stacksRecipient,
			isExecuted: true,
			bridgeIntentId: bridgeIntentId,
		});

		return {
			txHash: depositTx.hash,
		};
	},
}));

export default useEVMWallet;
