import Link from 'next/link';
import { Container, Row } from 'react-bootstrap';
import styles from './FooterSection.module.css';

export default function FooterSection() {
	return (
		<div className='section'>
			<Container>
				<Row>
					<div className='col-md-3 col-xs-6'>
						<div className={styles.footer}>
							<h3 className={styles['footer-title']}>About Us</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur
								adipisicing elit, sed do eiusmod tempor
								incididunt ut.
							</p>
							<ul className={styles['footer-links']}>
								<li>
									<Link href='#'>
										<i className='fa fa-map-marker'></i>1734
										Stonecoal Road
									</Link>
								</li>
								<li>
									<Link href='#'>
										<i className='fa fa-phone'></i>
										+021-95-51-84
									</Link>
								</li>
								<li>
									<Link href='#'>
										<i className='fa fa-envelope-o'></i>
										email@email.com
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className='col-md-3 col-xs-6'>
						<div className={styles.footer}>
							<h3 className={styles['footer-title']}>
								Categories
							</h3>
							<ul className={styles['footer-links']}>
								<li>
									<Link href='#'>Hot deals</Link>
								</li>
								<li>
									<Link href='#'>Laptops</Link>
								</li>
								<li>
									<Link href='#'>Smartphones</Link>
								</li>
								<li>
									<Link href='#'>Cameras</Link>
								</li>
								<li>
									<Link href='#'>Accessories</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className='col-md-3 col-xs-6'>
						<div className={styles.footer}>
							<h3 className={styles['footer-title']}>
								Information
							</h3>
							<ul className={styles['footer-links']}>
								<li>
									<Link href='#'>About Us</Link>
								</li>
								<li>
									<Link href='#'>Contact Us</Link>
								</li>
								<li>
									<Link href='#'>Privacy Policy</Link>
								</li>
								<li>
									<Link href='#'>Orders and Returns</Link>
								</li>
								<li>
									<Link href='#'>Terms & Conditions</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className='col-md-3 col-xs-6'>
						<div className={styles.footer}>
							<h3 className={styles['footer-title']}>Service</h3>
							<ul className={styles['footer-links']}>
								<li>
									<Link href='#'>My Account</Link>
								</li>
								<li>
									<Link href='#'>View Cart</Link>
								</li>
								<li>
									<Link href='#'>Wishlist</Link>
								</li>
								<li>
									<Link href='#'>Track My Order</Link>
								</li>
								<li>
									<Link href='#'>Help</Link>
								</li>
							</ul>
						</div>
					</div>
				</Row>
			</Container>
		</div>
	);
}
