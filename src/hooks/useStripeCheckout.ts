import { create } from "zustand";

interface StripeCheckoutProps {
	isStripeCheckoutClicked: boolean;
	setStripeCheckoutStatus: (val: boolean) => void;
}

const useStripeCheckout = create<StripeCheckoutProps>((set) => ({
	isStripeCheckoutClicked: false,
	setStripeCheckoutStatus: (val: boolean) =>
		set({ isStripeCheckoutClicked: val }),
}));

export default useStripeCheckout;
