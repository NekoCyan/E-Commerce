import MultiStyles from '@/utils/ComponentUtils';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import styles from './TopHeader.module.css';

export default function TopHeader() {
	return (
		<div className={styles['top-header']}>
			<Container className={styles.container}>
				<ul
					className={MultiStyles(
						styles['header-links'],
						styles['pull_left'],
					)}
				>
					<li>
						<Link href='#'>
							<i className='fa fa-phone'></i>+021-95-51-84
						</Link>
					</li>
					<li>
						<Link href='#'>
							<i className='fa fa-envelope-o'></i>email@email.com
						</Link>
					</li>
					<li>
						<Link href='#'>
							<i className='fa fa-map-marker'></i>1734 Stonecoal
							Road
						</Link>
					</li>
				</ul>
				<ul
					className={MultiStyles(
						styles['header-links'],
						styles['pull_right'],
					)}
				>
					<li>
						<Link href='#'>
							<i className='fa fa-dollar'></i>USD
						</Link>
					</li>
					<li>
						<Link href='#'>
							<i className='fa fa-user-o'></i>Login
						</Link>
					</li>
				</ul>
			</Container>
		</div>
	);
}
