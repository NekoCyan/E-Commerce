import { MultiStyles } from '@/utils';

type ModalProps = {
	title?: string;
	className?: string;
	onClose: () => void;
	actionButton?: {
		onClick: () => void;
		text: string;
		isLoading?: boolean;
		isDisabled?: boolean;
	};
	errorMsg?: string;
	children?: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
	title,
	className,
	onClose,
	actionButton,
	errorMsg,
	children,
}) => {
	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-0 flex justify-center items-center z-50'
			onMouseDown={onClose}
		>
			<div
				className={MultiStyles(
					'w-[350px] sm:w-[600px] flex flex-col bg-white rounded-lg p-5',
					className,
				)}
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className='flex flex-row justify-between items-center gap-3'>
					<h3 className='pb-1 break-all'>{title ?? `Modal`}</h3>
					<button
						className='text-gray-500 hover:text-gray-900'
						onClick={onClose}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-6 w-6'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>
				<hr className='pb-5' />
				{children}
				<hr className='mt-5' />
				{errorMsg && (
					<p className='text-red-500 text-2xl mt-5 font-medium'>
						Error: {errorMsg}
					</p>
				)}
				<div className='flex flex-row justify-end gap-4 pt-5'>
					{actionButton?.text && (
						<button
							className={MultiStyles(
								'text-white text-center font-bold py-2 px-10 rounded disabled:opacity-50',
								actionButton.text
									.toLowerCase()
									.includes('delete')
									? 'bg-red-500 hover:bg-red-700 disabled:hover:bg-red-500'
									: 'bg-blue-500 hover:bg-blue-700 disabled:hover:bg-blue-500',
							)}
							onClick={actionButton.onClick}
							disabled={
								actionButton.isDisabled ||
								actionButton.isLoading
							}
						>
							{actionButton.isLoading ? (
								<svg
									className='animate-spin h-5 w-5 text-white'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.009 8.009 0 014.709 10H2c0 3.042 1.135 5.824 3 7.938l1-1.647z'
									></path>
								</svg>
							) : (
								actionButton.text
							)}
						</button>
					)}
					<button
						className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-10 rounded'
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
