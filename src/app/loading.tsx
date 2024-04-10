import Image from 'next/image';

type LoadingProps = {
	width?: number;
	height?: number;
};

export default function Loading(props: Readonly<LoadingProps>) {
	props = {
		width: 400,
		height: 480,
		...props,
	};

	return (
		<Image
			src='/img/loader.gif'
			alt='loader'
			width={props.width}
			height={props.height}
			className='d-block m-auto p-5'
			style={{
				display: 'block',
				margin: 'auto',
				padding: '5rem',
			}}
		/>
	);
}
