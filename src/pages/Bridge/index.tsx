import axios from "axios";
import { useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa6";
import { PiStackSimpleBold } from "react-icons/pi";
import { TbBuildingBridge2Filled } from "react-icons/tb";
import { useParams } from "react-router";
import useEVMWallet from "../../hooks/useEVMWallet";
import { twMerge } from "tailwind-merge";

interface BridgeIntentDataType {
	usdcAmount: string;
	recvStacksAddress: string;
}

interface isExecutedDataType {
	txHash: string;
	status: boolean;
}

const index = () => {
	const { bridgeIntentId } = useParams();
	const [bridgeIntentData, setBridgeIntentData] =
		useState<null | BridgeIntentDataType>(null);
	const evmWallet = useEVMWallet();
	const [isExecutedData, setIsExecutedData] =
		useState<isExecutedDataType | null>(null);

	const fetchBridgeIntentData = async () => {
		const res = await axios.post("https://crepuscular-ayanna-fugaciously.ngrok-free.dev/bot/bridgeintent/", {
			bridgeIntentId: bridgeIntentId,
		});
		console.log(res);
		setBridgeIntentData(res?.data.BridgeIntentData);
	};

	useEffect(() => {
		console.log(bridgeIntentData);
		fetchBridgeIntentData();
	}, []);

	return (
		<div className="w-full h-screen bg-white ">
			<div className="rounded-lg shadow-md mx-auto my-auto w-[360px] p-4 relative top-[8%]">
				<div className="flex flex-row items-center py-3">
					<div className="bg-gray-100 w-[50%] p-2 rounded-lg flex flex-row items-center mr-4">
						<FaEthereum size={40} className="mx-auto" />
					</div>
					<div className="bg-gray-100 w-[50%] p-2 rounded-lg flex flex-row items-center">
						<PiStackSimpleBold size={40} className="mx-auto" />
					</div>
				</div>

				<p className="mt-4 font['Poppins'] font-bold">
					Bridging {bridgeIntentData ? bridgeIntentData.usdcAmount : 0} USDC on
					Sepolia Eth to {bridgeIntentData ? bridgeIntentData.usdcAmount : 0}{" "}
					USDCx on Stacks testnet
				</p>

				<p className="text-gray-500 my-4">
					*only ethereum sepolia is supported at this time
				</p>

				{isExecutedData?.status && (
					<p className="my-3">
						<b>Transaction Hash:</b>
						<br />
						<a
							className="w-full mx-auto font-bold text-indigo-500 no-underline block break-all "
							href={`https://sepolia.etherscan.io/tx/${isExecutedData.txHash}`}
						>{`https://sepolia.etherscan.io/tx/${isExecutedData.txHash}`}</a>
					</p>
				)}
				<button
					disabled={isExecutedData?.txHash ? true : false}
					onClick={async () => {
						if (!evmWallet.connectionStatus) {
							await evmWallet.connect();
							return;
						}

						const res = await evmWallet.bridgeUSDCtoStacks(
							bridgeIntentData?.usdcAmount as string,
							bridgeIntentData?.recvStacksAddress as string,
							bridgeIntentId as string,
						);

						if (res?.txHash) {
							setIsExecutedData({
								txHash: res?.txHash as string,
								status: true,
							});
						}
					}}
					className={twMerge(
						"w-full p-2 py-3 rounded-lg bg-indigo-500 font-bold text-2xl text-white flex flex-row items-center justify-center font-[25px]",
						evmWallet.connectionStatus &&
						(isExecutedData?.txHash
							? "bg-green-500 opacity-75"
							: "bg-green-500"),
					)}
				>
					<b>{evmWallet.connectionStatus ? "Bridge USDC" : "Connect Wallet"}</b>
					<TbBuildingBridge2Filled size={24} className="ml-2" />
				</button>
			</div>
		</div>
	);
};

export default index;
