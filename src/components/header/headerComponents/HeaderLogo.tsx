import Image from 'next/image';
import Link from 'next/link';
import styles from './HeaderLogo.module.css';

type HeaderLogoProps = {
	logoHref?: string;
};

export default function HeaderLogo(
	{ logoHref }: Readonly<HeaderLogoProps> = { logoHref: '/' },
) {
	logoHref = logoHref ?? '/';

	return (
		<div className='col-md-3'>
			<div className={styles['header-logo']}>
				<Link href={logoHref} className={styles['logo']}>
					<Image
						src='/img/logo.png'
						alt='logo'
						width={169}
						height={70}
					/>
				</Link>
			</div>
		</div>
	);
}
