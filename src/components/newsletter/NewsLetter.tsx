import { Container, Row } from 'react-bootstrap';
import styles from './NewsLetter.module.css';

export default function NewsLetter() {
	return (
		<div id={styles.newsletter} className='section'>
			<Container>
				<Row>
					<div className='col-md-12'>
						<div className={styles.newsletter}>
							<p>
								Sign Up for the <strong>NEWSLETTER</strong>
							</p>
							<form>
								<input
									className='input'
									type='email'
									placeholder='Enter Your Email'
								/>
								<button className={styles['newsletter-btn']}>
									<i className='fa fa-envelope'></i> Subscribe
								</button>
							</form>
							<ul className={styles['newsletter-follow']}>
								<li>
									<a href='#'>
										<i className='fa fa-facebook'></i>
									</a>
								</li>
								<li>
									<a href='#'>
										<i className='fa fa-twitter'></i>
									</a>
								</li>
								<li>
									<a href='#'>
										<i className='fa fa-instagram'></i>
									</a>
								</li>
								<li>
									<a href='#'>
										<i className='fa fa-pinterest'></i>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</Row>
			</Container>
		</div>
	);
}
