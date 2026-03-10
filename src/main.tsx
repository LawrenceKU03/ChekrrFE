import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";
import Checkout from "./pages/Checkout";

import { BrowserRouter, Routes, Route } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Header />
			<Routes>
				<Route index path="/" element={<App />} />
				<Route path="/:chekrrId/checkout" element={<Checkout />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	</StrictMode>,
);
