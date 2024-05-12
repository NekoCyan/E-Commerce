export const paypal_static = {
	access_token: '',
	expires_at: 0,
};

export function update_paypal_static(data: {
	access_token: string;
	expires_at: number;
}) {
	paypal_static.access_token = data.access_token;
	paypal_static.expires_at = data.expires_at;
}
