import React from "react";

import { FaCcStripe } from "react-icons/fa";
import { FaBitcoin } from "react-icons/fa";
import { BsCoin } from "react-icons/bs";
import { useState } from "react";
import useStripeCheckout from "../../hooks/useStripeCheckout";
import { useSearchParams } from "react-router";
import { twMerge } from "tailwind-merge";

interface MainCheckoutProps {
	owner_name: string;
	store_name: string;
	price: string;
	is_paid: boolean;
}

const index: React.FC<MainCheckoutProps> = ({
	owner_name,
	store_name,
	price,
	is_paid,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const stripeCheckout = useStripeCheckout();
	const [searchParams] = useSearchParams();
	const session_id = searchParams.get("session_id");

	const [firstName, setFirstName] = useState<string | null>(null);
	const [lastName, setLastName] = useState<string | null>(null);

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
					value={firstName}
					type="text"
					placeholder="First Name(required)"
					className="md:w-[40%] w-full p-2 rounded-lg border-2 my-2 md:mr-2"
					onChange={(e) => setFirstName(e.target.value)}
				/>
				<input
					value={lastName}
					type="text"
					placeholder="Last Name(required)"
					className="md:w-[40%] w-full p-2 rounded-lg border-2 my-2 md:mx-2 "
					onChange={(e) => setLastName(e.target.value)}
				/>
			</div>

			<h3 className="text-2xl font-semibold capitalize font-['Poppins'] mt-8">
				Payment Methods
			</h3>
			<div className="flex flex-row items-center ">
				<button
					disabled={(session_id || is_paid) && true}
					className={twMerge(
						"md:w-[40%] w-full flex flex-row items-center justify-center p-2 rounded-lg border-none my-2 mr-2 text-white bg-indigo-500 font-bold",
						(session_id || is_paid) && "opacity-75",
					)}
				>
					Pay via sBtc <FaBitcoin size={24} className="ml-4" />
				</button>
				<button
					disabled={(session_id || is_paid) && true}
					className={twMerge(
						"md:w-[40%] w-full flex flex-row items-center justify-center p-2 rounded-lg border-none my-2 mr-2 text-white bg-indigo-500 font-bold",
						(session_id || is_paid) && "opacity-75",
					)}
				>
					Pay via USDCx <BsCoin size={24} className="ml-4" />
				</button>
			</div>
			<button
				disabled={(session_id || is_paid) && true}
				onClick={() => stripeCheckout.setStripeCheckoutStatus(true)}
				className={twMerge(
					"md:w-[81%] w-full flex flex-row items-center justify-center p-2 rounded-lg border-none my-2 mr-2 text-white bg-indigo-500 font-bold",
					(session_id || is_paid) && "opacity-75",
				)}
			>
				Pay with Stripe <FaCcStripe size={24} className="ml-4" />
			</button>
		</div>
	);
};

export default index;
