import Image from 'next/image';

export default function Loading() {
	return (
		<Image
			src='/img/loader.gif'
			alt='loader'
			width={400}
			height={480}
			className='d-block m-auto p-5'
			style={{
				display: 'block',
				margin: 'auto',
				padding: '5rem',
			}}
		/>
	);
}
