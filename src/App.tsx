import { Routes } from "react-router-dom";
import Header from "./components/Header";

function App() {
	return (
		<div className="w-screen overflow-hidden">
			<Header />
			<Routes></Routes>
		</div>
	);
}

export default App;
