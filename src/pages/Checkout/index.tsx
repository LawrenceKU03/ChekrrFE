import type React from "react";
import { useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";

import { FaCircleXmark } from "react-icons/fa6";
import ProductInfo from "../../components/ProductInfo";
import MainCheckout from "../../components/MainCheckout";
import { loadStripe } from "@stripe/stripe-js";
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import axios from "axios";
import useStripeCheckout from "../../hooks/useStripeCheckout";

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

const index: React.FC = () => {
	const { chekrrId } = useParams();
	const [searchParams] = useSearchParams();
	const session_id = searchParams.get("session_id");

	const [productData, setProductData] = useState<Product | null>(null);
	const [stripePromise, setStripePromise] = useState<null | any>(null);
	const [stripeClientSecret, setStripeClientSecret] = useState<null | any>(
		null,
	);

	const stripeCheckout = useStripeCheckout();

	const getProductData = async (chekrrId: string) => {
		const res = await axios.post("http://localhost:8000/product/", {
			chekrrId: chekrrId,
		});

		console.log(res.data);
		setProductData(res.data.productData);

		if (session_id) {
			await axios.post("http://localhost:8000/payment/stripe/", {
				amount: parseFloat(res.data.productData?.price),
				product_data: res.data?.productData,
				merchant_id: session_id,
				type: "PAID",
			});

			return;
		}
	};

	const createStripeCheckoutSession = async (
		firstNameField: string,
		lastNameField: string,
	) => {
		const res_stripe = await axios.post(
			"http://localhost:8000/payment/stripe/",
			{
				amount:
					parseFloat(productData?.price as string) *
					parseInt(`${productData?.quantity}`),
				firstName: firstNameField,
				lastName: lastNameField,
				product_data: productData,
				type: "PENDING",
			},
		);
		console.log(res_stripe);
		setStripeClientSecret(res_stripe.data?.clientSecret);
	};

	const loadSTRIPE = async () => {
		const res = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
		console.log(res);
		setStripePromise(res);
	};

	useEffect(() => {
		getProductData(chekrrId as string);
		loadSTRIPE();
	}, []);

	return (
		<div className=" bg-white h-full w-full py-6 flex md:flex-row flex-col items-start justify-center overflow-y-scroll">
			<ProductInfo
				title={productData?.title as string}
				usdAmount={productData?.price as string}
				storeName={productData?.store_name as string}
				productImgUrl={`data:image/*;base64,${productData?.image as string}`}
				desc={productData?.description as string}
				quantity={`${productData?.quantity}`}
				status={productData?.is_paid || session_id ? "PAID" : "PENDING"}
			/>
			<MainCheckout
				owner_name={productData?.owner_name as string}
				store_name={productData?.store_name as string}
				price={productData?.price as string}
				is_paid={productData?.is_paid as boolean}
				quantity={`${productData?.quantity}`}
				onStripeBtnClick={createStripeCheckoutSession}
				productData={productData as Product}
			/>
			{stripeCheckout.isStripeCheckoutClicked && (
				<EmbeddedCheckoutProvider
					stripe={stripePromise}
					options={{ clientSecret: stripeClientSecret }}
				>
					<div className="w-full h-max absolute backdrop-blur-md z-50 r-0">
						<FaCircleXmark
							size={30}
							className="ml-12 cursor-pointer"
							onClick={() => stripeCheckout.setStripeCheckoutStatus(false)}
						/>
						<div className="relative w-[40%] top-[-20px] mx-auto mb-20">
							<EmbeddedCheckout />
						</div>
					</div>
				</EmbeddedCheckoutProvider>
			)}
		</div>
	);
};

export default index;
