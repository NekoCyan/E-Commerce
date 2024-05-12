import { ROUTES } from '@/utils';
import Link from 'next/link';

export interface Payment_PaypalProps {
	id: string;
	onChange?: () => void;
	checked?: boolean;
	disabled?: boolean;
	/**
	 * Put orderId for pay Now button.
	 */
	orderIdPaynow?: string;
}

export default function Paypal({
	id,
	onChange,
	checked,
	disabled,
	orderIdPaynow,
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
				Paypal (PP){' '}
				{orderIdPaynow && (
					<Link
						href={ROUTES.CheckoutPaypalId(orderIdPaynow)}
						className='text-blue-500 uppercase hover:cursor-pointer underline font-bold'
					>
						Pay Now
					</Link>
				)}
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
