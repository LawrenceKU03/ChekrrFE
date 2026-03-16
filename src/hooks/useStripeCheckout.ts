import { create } from "zustand";

interface StripeCheckoutProps {
	isStripeCheckoutClicked: boolean;
	firstNameField: string | null;
	lastNameField: string | null;
	setStripeCheckoutStatus: (val: boolean) => void;
	setCheckOutUserData: (firstName: string, lastNameField: string) => void;
}

const useStripeCheckout = create<StripeCheckoutProps>((set) => ({
	isStripeCheckoutClicked: false,
	firstNameField: null,
	lastNameField: null,
	setStripeCheckoutStatus: (val: boolean) => {
		set({ isStripeCheckoutClicked: val });
	},
	setCheckOutUserData: (firstName: string, lastName: string) => {
		set({ firstNameField: firstName, lastNameField: lastName });
	},
}));

export default useStripeCheckout;
