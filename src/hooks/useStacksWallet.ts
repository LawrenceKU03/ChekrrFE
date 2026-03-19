import {
	connect,
	isConnected,
	disconnect,
	openContractCall,
} from "@stacks/connect";
import {
	Pc,
	PostConditionMode,
	principalCV,
	uintCV,
	noneCV,
} from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";
import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const USDCX_CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const USDCX_CONTRACT_NAME = "usdcx";
const USDCX_ASSET_NAME = "usdcx-token";

const SBTC_CONTRACT_ADDRESS = "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT";
const SBTC_CONTRACT_NAME = "sbtc-token";
const SBTC_ASSET_NAME = "sbtc";

const MASTER_WALLET_ESCROW_ADDRESS =
	"ST3K9XTZK3Q7P3WJ593G9GKMZZY57BCKFZQY46WZH";

interface Product {
	title: string;
	description: string;
	image: string;
	price: string;
	quantity: number;
	owner_name: string;
	store_name: string;
	product_hash: string;
	is_paid: boolean;
}

interface useStacksWalletProps {
	connectionStatus: boolean;
	connectedAddress: string | null;
	isPaid: boolean;
	connectIntentType: string | null;
	connectWallet: (connectionType: string) => void;
	disconnectWallet: () => void;
	sendUSDCx: (
		amount: number,
		firstName: string,
		lastName: string,
		productData: Product,
	) => Promise<void>;
	sendsBTC: (
		amount: number,
		firstName: string,
		lastName: string,
		productData: Product,
	) => Promise<void>;
}

const sBTC_MOCK_DATA_PRICE = 74255;

const usdcxToSBTC = async (usdcxAmount: number) => {
	return usdcxAmount / sBTC_MOCK_DATA_PRICE; // e.g. $100 / $60000 = 0.00166667 sBTC
};

const useStacksWallet = create<useStacksWalletProps>((set, get) => ({
	connectionStatus: false,
	connectedAddress: null,
	isPaid: false,
	connectIntentType: null,
	connectWallet: async (connectionType: string) => {
		const connected = isConnected();
		if (!connected) {
			const res = await connect();
			const stxAddress = res.addresses.find((a) => a.symbol === "STX")?.address;
			set(() => ({ connectIntentType: connectionType }));
			set(() => ({ connectionStatus: true, connectedAddress: stxAddress }));
		} else {
			const res = await connect();
			const stxAddress = res.addresses.find((a) => a.symbol === "STX")?.address;

			set(() => ({ connectIntentType: connectionType }));

			set(() => ({ connectionStatus: true, connectedAddress: stxAddress }));
		}
	},
	disconnectWallet: async () => {
		if (!isConnected()) {
			disconnect();
			set(() => ({
				connectionStatus: true,
				connectedAddress: null,
				connectIntentType: null,
			}));
		} else {
			set(() => ({
				connectionStatus: false,
				connectedAddress: null,
				connectIntentType: null,
			}));
		}
	},
	sendUSDCx: async (
		amount: number,
		firstName: string,
		lastName: string,
		productData: Product,
	) => {
		const microAmount = amount * 1_000_000;
		const senderAddress = get().connectedAddress as string; // swap for .testnet if on testnet

		openContractCall({
			contractAddress: USDCX_CONTRACT_ADDRESS,
			contractName: USDCX_CONTRACT_NAME,
			functionName: "transfer",
			functionArgs: [
				uintCV(microAmount),
				principalCV(senderAddress),
				principalCV(MASTER_WALLET_ESCROW_ADDRESS),
				noneCV(), // memo
			],

			network: STACKS_TESTNET,
			postConditionMode: PostConditionMode.Deny,
			postConditions: [
				Pc.principal(senderAddress)
					.willSendEq(microAmount)
					.ft(
						`${USDCX_CONTRACT_ADDRESS}.${USDCX_CONTRACT_NAME}`,
						USDCX_ASSET_NAME,
					),
			],
			appDetails: {
				name: "Chekrr",
				icon: window.location.origin + "/favicon.ico",
			},
			onFinish: async () => {
				toast.loading("Processing estimated 1-2 minutes", { duration: 5000 });

				await axios.post(
					"https://crepuscular-ayanna-fugaciously.ngrok-free.dev/payment/onchain_payment/",
					{
						amount: amount,
						firstName: firstName,
						lastName: lastName,
						product_data: productData,
						type: "PAID",
						payment_method: get().connectIntentType,
					},
				);

				set(() => ({ isPaid: true }));

				toast.success("Payment Successful!");
			},
			onCancel: () => {
				console.log("User cancelled");
			},
		});
	},
	sendsBTC: async (
		amountUSDCx: number,
		firstName: string,
		lastName: string,
		productData: Product,
	) => {
		const amount = await usdcxToSBTC(amountUSDCx);
		const satoshiAmount = Math.floor(amount * 1_0000_0000); // ✅ defined here
		const senderAddress = get().connectedAddress as string; // swap for .testnet if on testnet

		openContractCall({
			contractAddress: SBTC_CONTRACT_ADDRESS,
			contractName: SBTC_CONTRACT_NAME,
			functionName: "transfer",
			functionArgs: [
				uintCV(satoshiAmount),
				principalCV(senderAddress),
				principalCV(MASTER_WALLET_ESCROW_ADDRESS),
				noneCV(),
			],
			network: STACKS_TESTNET,
			postConditionMode: PostConditionMode.Deny,
			postConditions: [
				Pc.principal(senderAddress)
					.willSendEq(satoshiAmount)
					.ft(
						`${SBTC_CONTRACT_ADDRESS}.${SBTC_CONTRACT_NAME}`,
						SBTC_ASSET_NAME,
					),
			],
			appDetails: {
				name: "Chekrr",
				icon: window.location.origin + "/favicon.ico",
			},
			onFinish: async (data) => {
				toast.loading("Processing estimated 1-2 minutes", { duration: 5000 });

				await axios.post(
					"https://crepuscular-ayanna-fugaciously.ngrok-free.dev/payment/onchain_payment/",
					{
						tx_id: data.txId, // 👈 also send txId so backend can verify
						amount: amountUSDCx,
						sBTCAmount: amount.toFixed(8),
						firstName: firstName,
						lastName: lastName,
						product_data: productData,
						type: "PAID",
						payment_method: get().connectIntentType, // 👈 so backend knows to settle in USDCx
					},
				);
				set(() => ({ isPaid: true }));
				toast.success("Payment Successful!");
			},
			onCancel: () => {
				console.log("User cancelled");
			},
		});
	},
}));

export default useStacksWallet;
