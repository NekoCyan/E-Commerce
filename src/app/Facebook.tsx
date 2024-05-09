import Script from 'next/script';

export default function Facebook() {
	return (
		<div>
			<div id='fb-root'></div>
			<div id='fb-customer-chat' className='fb-customerchat'></div>
			<Script strategy='lazyOnload' src='/assets/js/fb-chat.js' />
		</div>
	);
}
