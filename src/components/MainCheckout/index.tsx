import React from "react";

import { FaCcStripe } from "react-icons/fa";
import { FaBitcoin } from "react-icons/fa";
import { BsCoin } from "react-icons/bs";


interface MainCheckoutProps {
	owner_name: string;
	store_name: string;
	price: string:
}

const index: React.FC<MainCheckoutProps> = ({ owner_name, store_name, price }) => {
	return (
		<div className="md:w-[50%] md:ml-[-10%] w-full md:p-0 p-4 md:mt-0 mt-6 md:pb-0 pb-24">
			<h1 className="text-3xl font-bold capitalize font-['Poppins']">
				Checkout
			</h1>
			<p className="text-gray-500 text-['13px'] mt-2">
				*Merchant would be notified upon successful payment.
			</p>
			<h3 className="text-2xl font-semibold capitalize font-['Poppins'] mt-8">
				Merchant Information
			</h3>
			<div>
				<p className="text-gray-500 mt-2">{`${owner_name} * ${store_name}`}</p>
			</div>

			<h3 className="text-2xl font-semibold capitalize font-['Poppins'] mt-8">
				Billing Information
			</h3>
			<div>
				<input
					type="text"
					placeholder="First Name"
					className="md:w-[40%] w-full p-2 rounded-lg border-2 my-2 md:mr-2"
				/>
				<input
					type="text"
					placeholder="Last Name"
					className="md:w-[40%] w-full p-2 rounded-lg border-2 my-2 md:mx-2 "
				/>
			</div>

			<h3 className="text-2xl font-semibold capitalize font-['Poppins'] mt-8">
				Payment Methods
			</h3>
			<div className="flex flex-row items-center ">
				<button className="md:w-[40%] w-full flex flex-row items-center justify-center p-2 rounded-lg border-none my-2 mr-2 text-white bg-indigo-500 font-bold">
					Pay via sBtc <FaBitcoin size={24} className="ml-4" />
				</button>
				<button className="md:w-[40%] w-full flex flex-row items-center justify-center p-2 rounded-lg border-none my-2 mr-2 text-white bg-indigo-500 font-bold">
					Pay via USDCx <BsCoin size={24} className="ml-4" />
				</button>
			</div>
			<button className="md:w-[81%] w-full flex flex-row items-center justify-center p-2 rounded-lg border-none my-2 mr-2 text-white bg-indigo-500 font-bold">
				Pay with Stripe <FaCcStripe size={24} className="ml-4" />
			</button>
		</div>
	);
};

export default index;
