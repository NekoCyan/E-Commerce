import Image from 'next/image';
import Link from 'next/link';
import styles from './HeaderLogo.module.css';

type HeaderLogoProps = {
	isDisabled?: boolean;
	logoNavHref?: string;
};

export default function HeaderLogo(
	{ isDisabled, logoNavHref }: Readonly<HeaderLogoProps> = { logoNavHref: '/' },
) {
	logoNavHref = logoNavHref ?? '/';

	return (
		<div className='col-md-3'>
			{!isDisabled && (
				<div className={styles['header-logo']}>
					<Link href={logoNavHref} className={styles['logo']}>
						<Image
							src='/img/logo.png'
							alt='logo'
							width={169}
							height={70}
						/>
					</Link>
				</div>
			)}
		</div>
	);
}
