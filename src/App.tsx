import { BsFillSendFill } from "react-icons/bs";

function App() {
	const redirect = () => {
		window.location.href =
			"https://wa.me/14155238886?text=join%20group-western";
	};

	return (
		<div className="h-[85vh] bg-[url('/bg.svg')]">
			<div className="w-full mh-[80%]  my-auto md:flex block flex-row justify-center items-center p-10">
				<div className="w-full text-center mt-12">
					<p className="font-['Poppins']">Get paid on Stacks from anywhere.</p>
					<h1 className="md:text-[64px] text-6xl font-bold  font-['Righteous'] mt-4 uppercase py-4">
						Easy,Fast & Secure
					</h1>
					<p className="mt-8 font-['Space Grotesk'] font-bold uppercase">
						From product to payout,do it all with Chekrr on WhatsApp.
					</p>

					<button
						onClick={() => redirect()}
						className="bg-indigo-500 text-white font-bold uppercase p-3 px-6 relative z-10 hover:scale-110 transition-all rounded-lg mt-12 flex flex-row items-center mx-auto"
						style={{ flexDirection: "row" }}
					>
						Get paid <BsFillSendFill className="ml-4" size={24} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
