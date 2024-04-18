import { MultiStyles } from '@/utils';
import Image from 'next/image';

type LoadingProps = {
	className?: string;
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
			className={MultiStyles('d-block m-auto p-5', props.className)}
			style={{
				display: 'block',
				margin: 'auto',
				padding: '5rem',
			}}
		/>
	);
}
