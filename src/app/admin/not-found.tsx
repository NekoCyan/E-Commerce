'use client';

import { MultiStyles, WEBSITE } from '@/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../not-found.module.css';

export const metadata: Metadata = {
	title: WEBSITE.title(`Not found`),
};

export default function NotFound() {
	const router = useRouter();
	return (
		<div>
			<div className={styles.container}>
				<h1>Not Found!</h1>
				<Image src='/img/404.jpg' alt='404' width={300} height={300} />
				<p>Sorry, the resources does not exist</p>
				<h3>
					<Link
						href='#'
						className={MultiStyles(styles.link, 'uppercase')}
						onClick={(e) => {
							e.preventDefault();
							router.back();
						}}
					>
						Back to previous page
					</Link>
				</h3>
			</div>
		</div>
	);
}
