import { MultiStyles } from '@/utils';
import { Tooltip } from '@nextui-org/react';

type ToolTipProps = {
	text: string;
	/**
	 * @default {className} 'bg-red-500 p-2 px-5 rounded-lg text-white'
	 */
	className?: string;
	children?: React.ReactNode;
};

export default function ToolTip({
	text,
	className,
	children,
}: Readonly<ToolTipProps>) {
	return (
		<Tooltip
			className={MultiStyles(
				'bg-red-500 p-2 px-5 rounded-lg text-white',
				className,
			)}
			content={text}
			closeDelay={0}
		>
			{children}
		</Tooltip>
	);
}
