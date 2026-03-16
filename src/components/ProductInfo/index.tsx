import type React from "react";

interface ProductInfo {
	title: string;
	desc: string;
	usdAmount: number;
	productImgUrl: string;
	status: string;
	storeName: string;
}

const index: React.FC<ProductInfo> = ({
	title,
	desc,
	usdAmount,
	productImgUrl,
	status,
	storeName,
}) => {
	return (
		<div className="md:w-[25%] w-[330px] p-4 shadow-md  rounded-[18px] mx-auto md:mr-[14%]">
			<img
				className="w-[350px] h-[200px] rounded-lg mb-2 object-contain object-center mx-auto rounded-lg"
				src={productImgUrl}
			/>
			<div>
				<h1 className="text-2xl font-bold font-['Poppins'] mb-2">{title}</h1>
				<p className="font-['Poppins'] mb-4 text-gray-500 text-[14px]">
					{desc}
				</p>

				<div className="flex flex-row items-center w-full justify-between">
					<p className="font-['Poppins'] text-gray-500  text-[13px]">Price </p>
					<p className="font-semibold font-['Poppins']  text-[13px]">
						${usdAmount}
					</p>
				</div>
				<hr />
				<div className="flex flex-row items-center w-full justify-between mt-3">
					<p className="font-['Poppins'] text-gray-500 text-[13px]">
						Payment Status
					</p>
					<p className="font-semibold font-['Poppins']  text-[13px]">
						{status}
					</p>
				</div>
				<hr />
				<div className="flex flex-row items-center w-full justify-between mt-3">
					<p className="font-['Poppins'] text-gray-500  text-[13px]">Store</p>
					<p className="font-semibold font-['Poppins']  text-[13px]">
						{storeName}
					</p>
				</div>
			</div>
		</div>
	);
};

export default index;
