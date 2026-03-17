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
	isPaid:boolean;
	connectWallet: () => void;
	disconnectWallet: () => void;
	sendUSDCx: (amount: number,firstName:string,lastName:string,productData:Product) => Promise<void>;
}

const useStacksWallet = create<useStacksWalletProps>((set, get) => ({
	connectionStatus: false,
	connectedAddress: null,
	isPaid:false,
	connectWallet: async () => {
		const connected = isConnected();
		if (!connected) {
			const res = await connect();
			const stxAddress = res.addresses.find((a) => a.symbol === "STX")?.address;

			set(() => ({ connectionStatus: true, connectedAddress: stxAddress }));
		} else {
			const res = await connect();
			const stxAddress = res.addresses.find((a) => a.symbol === "STX")?.address;

			set(() => ({ connectionStatus: true, connectedAddress: stxAddress }));
		}
	},
	disconnectWallet: async () => {
		if (!isConnected()) {
			disconnect();
			set(() => ({ connectionStatus: true, connectedAddress: null }));
		} else {
			set(() => ({ connectionStatus: false, connectedAddress: null }));
		}
	},
	sendUSDCx: async (
		amount: number,
		firstName: string,
		lastName: string,
		productData: Product,
	) => {
		// amount is in micros — 1 USDCx = 1_000_000
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
			onFinish: async (data) => {
				set(()=>({ isPaid:true }));

				toast.success("Payment Successful!")
				
				const res = await axios.post(
					"http://localhost:8000/payment/onchain_payment/",
					{
						amount: amount,
						firstName: firstName,
						lastName: lastName,
						product_data: productData,
						type:"PAID"
					},
				);
				console.log("TX broadcasted:", data.txId);
// call your Django backend here to record the transaction
			},
			onCancel: () => {
				console.log("User cancelled");
			},
		});
	},
}));

export default useStacksWallet;
