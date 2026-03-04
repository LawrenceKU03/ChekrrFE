import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";

interface NavLink {
	title: string;
	href: string;
}

const index = () => {
	const [NavLinks, setNavLinks] = useState<NavLink[]>([
		{
			title: "Home",
			href: "/home",
		},
		{
			title: "About",
			href: "/about",
		},
		{
			title: "Contact",
			href: "/contact",
		},
	]);

	return (
		<div className="bg-white flex flex-col shadow-[0_2px_2px_rgba(0,0,0,0.1)] relative z-5">
			<div className="flex flex-row items-center justify-between md:px-24 md:py-6 py-6 px-4">
				<h1 className="font-bold font-['Montserrat'] text-4xl bg-indigo-500 px-4 py-2 text-white">
					Chekrr
				</h1>
				<div className="flex flex-row items-center justify-between md:block hidden">
					{NavLinks.map((link) => {
						return (
							<a
								href={link.href}
								className="font-['Poppins'] mx-[20px] opacity-50 hover:opacity-100 transition hover:scale-110 font-semibold"
							>
								{link.title}
							</a>
						);
					})}
				</div>
				<button
					className="bg-indigo-500 text-white font-bold uppercase p-3 px-4 rounded-[24px] hidden md:flex flex-row items-center"
					style={{ flexDirection: "row" }}
				>
					Get Started <SiWhatsapp className="ml-4" size={24} />
				</button>
				<button className="bg-indigo-500 text-white font-bold uppercase p-3 px-4 block md:hidden rounded-lg flex flex-row items-center">
					<SiWhatsapp size={28} />
				</button>
			</div>

			<div className="md:hidden block">
				<div className="flex flex-row items-center justify-between my-4 mx-2">
					{NavLinks.map((link) => {
						return (
							<a
								href={link.href}
								className="font-['Space Grotesk'] mx-[20px] opacity-50 hover:opacity-100 transition font-semibold"
							>
								{link.title}
							</a>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default index;
