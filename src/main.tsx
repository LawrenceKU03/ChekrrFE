import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";

import App from "./App.tsx";
import Checkout from "./pages/Checkout";
import Bridge from "./pages/Bridge";

import { BrowserRouter, Routes, Route } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Toaster />
			<Header />
			<Routes>
				<Route index path="/" element={<App />} />
				<Route path="/:chekrrId/checkout" element={<Checkout />} />
				<Route path="/:bridgeIntentId/bridge" element={<Bridge />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	</StrictMode>,
);
