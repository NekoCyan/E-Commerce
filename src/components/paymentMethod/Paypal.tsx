export interface Payment_PaypalProps {
	id: string;
	onChange?: () => void;
	checked?: boolean;
	disabled?: boolean;
}

export default function Paypal({
	id,
	onChange,
	checked,
	disabled,
}: Readonly<Payment_PaypalProps>) {
	return (
		<div className='input-radio'>
			<input
				type='radio'
				name='payment'
				id={id}
				onChange={onChange}
				checked={checked}
				disabled={disabled}
			/>
			<label htmlFor={id}>
				<span></span>
				Paypal (PP)
			</label>
			<div className='caption'>
				<p>
					Pay via PayPal; you can pay with your credit card if you
					don't have a PayPal account.
				</p>
			</div>
		</div>
	);
}
