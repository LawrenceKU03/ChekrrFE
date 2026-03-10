import type React from "react";
import { useParams } from "react-router";

import ProductInfo from "../../components/ProductInfo";
import MainCheckout from "../../components/MainCheckout";

const index: React.FC = () => {
	const { chekrrId } = useParams();

	return (
		<div className=" bg-white h-full w-full py-6 flex md:flex-row flex-col items-start justify-center overflow-y-scroll">
			<ProductInfo
				title={"Sneakers"}
				usdAmount={24.0}
				storeName="Legs Luxury"
				productImgUrl={
					"https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?_gl=1*1xdydgz*_ga*MjA5NDQ4OTY3OC4xNzcxMDIwNTY0*_ga_8JE65Q40S6*czE3NzMxNzQxNjMkbzMkZzEkdDE3NzMxNzQ0MTckajIxJGwwJGgw"
				}
				desc={
					"Crafted with a premium leather upper and a classic low-profile silhouette, these are designed to anchor any fit. Whether you’re hitting the city or just keeping it casual, the [Sneaker Name] delivers a heritage look that never goes out of style"
				}
				timeStamp={"4:50 PM WAT"}
			/>
			<MainCheckout />
		</div>
	);
};

export default index;
