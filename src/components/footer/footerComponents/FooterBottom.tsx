import { ROUTES } from '@/utils';
import { MultiStyles } from '@/utils/ComponentUtils';
import Link from 'next/link';
import { Container, Row } from 'react-bootstrap';
import styles from './FooterBottom.module.css';

export default function FooterBottom() {
	return (
		<div className={MultiStyles(styles['bottom-footer'], 'section')}>
			<Container>
				<Row>
					<div className='col-md-12 text-center'>
						<ul className={styles['footer-payments']}>
							<li>
								<Link href='#'>
									<i className='fa fa-cc-visa'></i>
								</Link>
							</li>
							<li>
								<Link href='#'>
									<i className='fa fa-credit-card'></i>
								</Link>
							</li>
							<li>
								<Link href='#'>
									<i className='fa fa-cc-paypal'></i>
								</Link>
							</li>
							<li>
								<Link href='#'>
									<i className='fa fa-cc-mastercard'></i>
								</Link>
							</li>
							<li>
								<Link href='#'>
									<i className='fa fa-cc-discover'></i>
								</Link>
							</li>
							<li>
								<Link href='#'>
									<i className='fa fa-cc-amex'></i>
								</Link>
							</li>
						</ul>
						<span className={styles.copyright}>
							Copyright &copy; {new Date().getFullYear()} All
							rights reserved | This template is made with{' '}
							<i className='fa fa-heart-o' aria-hidden='true'></i>{' '}
							by{' '}
							<Link
								href='https://colorlib.com'
								target='_blank'
								className={styles.link}
							>
								Colorlib
							</Link>
						</span>
						<br />
						<span>
							Frequently reminder: This website is just using for{' '}
							<u>
								<Link
									href={ROUTES.Educational}
									className={styles.link}
								>
									EDUCATIONAL PURPOSE
								</Link>
							</u>
							, not for Commercial.
						</span>
					</div>
				</Row>
			</Container>
		</div>
	);
}
