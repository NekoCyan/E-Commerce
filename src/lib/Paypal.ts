import { OrderData } from '@/app/models/interfaces';
import { ROUTES, Truncate } from '@/utils';
import getUrl from '@/utils/getUrl';
import { paypal_static, update_paypal_static } from '@/utils/static';
import axios from 'axios';

const clientId = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_SECRET;
const baseUrl = process.env.PAYPAL_BASE_URL;

export async function generateAccessToken() {
	const { access_token, expires_at } = paypal_static;

	if (access_token && expires_at > Date.now()) return access_token;

	const basicAuth = Buffer.from(`${clientId}:${secret}`).toString('base64');
	const { data } = await axios
		.post(baseUrl + '/v1/oauth2/token', 'grant_type=client_credentials', {
			headers: {
				Authorization: `Basic ${basicAuth}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		.catch((e) => {
			console.log(`Failed to obtain access token.`);
			console.dir(e.response.data, { depth: null, maxArrayLength: null });
			
			return e;
		});

	update_paypal_static({
		access_token: data.access_token,
		expires_at: Date.now() - 5_000 + data.expires_in * 1000,
	});

	return data.access_token;
}

export async function createOrder(orderData: OrderData): Promise<{
	id: string;
	status: string;
	payment_source: {
		paypal: {};
	};
	links: {
		href: string;
		rel: string;
		method: string;
	}[];
}> {
	const accessToken = await generateAccessToken();

	const products = orderData.products;
	const dataPayload: {
		name: string;
		quantity: number;
		price: number;
	}[] = [];

	for (const product of products) {
		dataPayload.push({
			name: product.name,
			quantity: product.quantity,
			price: Number(
				(
					product.price *
					((100 - product.salePercentage) / 100)
				).toFixed(2),
			),
		});
	}

	const totalPrice = dataPayload
		.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
		.toFixed(2);

	const payload = {
		intent: 'CAPTURE',
		purchase_units: [
			{
				amount: {
					currency_code: 'USD',
					value: totalPrice,
					breakdown: {
						item_total: {
							currency_code: 'USD',
							value: totalPrice,
						},
					},
				},
				items: dataPayload.map((order) => ({
					name: Truncate(order.name, 127),
					quantity: order.quantity,
					unit_amount: {
						currency_code: 'USD',
						value: order.price.toFixed(2),
					},
				})),
			},
		],
		application_context: {
			return_url: getUrl(
				ROUTES.CheckoutPaypalIdSucceed(orderData.orderId),
			),
			cancel_url: getUrl(
				ROUTES.CheckoutPaypalIdCancelled(orderData.orderId),
			),
			shipping_preference: 'NO_SHIPPING',
			user_action: 'PAY_NOW',
			brand_name: 'Ocean Electro',
			payment_method: {
				payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
			},
		},
	};
	console.dir(payload, {
		depth: null,
		maxArrayLength: null,
	});

	const { data } = await axios
		.post(baseUrl + '/v2/checkout/orders', payload, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})
		.catch((err) => err.response);

	console.dir(data, {
		depth: null,
		maxArrayLength: null,
	});

	return data;
}

export async function capturePayment(paymentId: string) {
	const accessToken = await generateAccessToken();

	const { data } = await axios
		.post(
			baseUrl + `/v2/checkout/orders/${paymentId}/capture`,
			{
				intent: 'CAPTURE',
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			},
		)
		.catch((err) => err.response);

	return data;
}
