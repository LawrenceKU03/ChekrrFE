import { BsFillSendFill } from "react-icons/bs";

function App() {
	return (
		<div className="h-[85vh] bg-[url('/bg.svg')]">
			<div className="w-full mh-[80%]  my-auto md:flex block flex-row justify-center items-center p-10">
				<div className="w-full text-center mt-12">
					<p className="font-['Poppins']">
						Get paid on Stacks easy from anywhere.
					</p>
					<h1 className="md:text-[64px] text-6xl font-bold  font-['Righteous'] mt-4 uppercase py-4">
						Easy,Fast & Secure
					</h1>
					<p className="mt-8 font-['Space Grotesk'] font-bold uppercase">
						Prompt,Send links and get paid all on whatsapp.
					</p>

					<button
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
