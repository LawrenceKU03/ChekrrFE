import { useState } from "react";

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
		<div className="bg-white flex flex-row items-center justify-between px-6 py-8">
			<h1 className="font-bold font-['Montserrat'] text-4xl">Chekrr</h1>
			<div className="flex flex-row items-center justify-between">
				{NavLinks.map((link) => {
					return (
						<a href={link.href} className="font-['Poppins'] mx-[20px]">
							{link.title}
						</a>
					);
				})}
			</div>
			<button>Get Started</button>
		</div>
	);
};

export default index;
