import type React from "react";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

import ProductInfo from "../../components/ProductInfo";
import MainCheckout from "../../components/MainCheckout";
import axios from "axios";

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
	const [productData, setProductData] = useState<Product | null>(null);

	const getProductData = async (chekrrId: string) => {
		const res = await axios.post("http://localhost:8000/product/", {
			chekrrId: chekrrId,
		});

		console.log(res.data);
		setProductData(res.data.productData);
	};

	useEffect(() => {
		getProductData(chekrrId as string);
	}, []);

	return (
		<div className=" bg-white h-full w-full py-6 flex md:flex-row flex-col items-start justify-center overflow-y-scroll">
			<ProductInfo
				title={productData?.title as string}
				usdAmount={productData?.price as string}
				storeName={productData?.store_name as string}
				productImgUrl={`data:image/*;base64,${productData?.image as string}`}
				desc={productData?.description as string}
				timeStamp={"4:50 PM WAT"}
			/>
			<MainCheckout
				owner_name={productData?.owner_name as string}
				store_name={productData?.store_name as string}
				price={productData?.price as string}
			/>
		</div>
	);
};

export default index;
