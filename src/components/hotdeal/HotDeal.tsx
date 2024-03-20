import { MultiStyles } from '@/utils/ComponentUtils';
import Link from 'next/link';
import { Container, Row } from 'react-bootstrap';
import styles from './HotDeal.module.css';

export default function HotDeal() {
	return (
		<div id={styles['hot-deal']} className='section'>
			<Container>
				<Row>
					<div className='col-md-12'>
						<div className={styles['hot-deal']}>
							<ul className={styles['hot-deal-countdown']}>
								<li>
									<div>
										<h3>02</h3>
										<span>Days</span>
									</div>
								</li>
								<li>
									<div>
										<h3>10</h3>
										<span>Hours</span>
									</div>
								</li>
								<li>
									<div>
										<h3>34</h3>
										<span>Mins</span>
									</div>
								</li>
								<li>
									<div>
										<h3>59</h3>
										<span>Secs</span>
									</div>
								</li>
							</ul>
							<h2 className='text-uppercase'>
								hot deal this week
							</h2>
							<p>New Collection Up to 50% OFF</p>
							<Link
								className={MultiStyles(
									'primary-btn',
									styles['cta-btn'],
								)}
								href='#'
							>
								Shop now
							</Link>
						</div>
					</div>
				</Row>
			</Container>
		</div>
	);
}
