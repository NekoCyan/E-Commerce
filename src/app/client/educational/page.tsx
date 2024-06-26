import { WEBSITE } from '@/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import styles from './educational.module.css';

export const metadata: Metadata = {
	title: WEBSITE.title('Educational'),
};

export default function Page() {
	return (
		<Container style={{ fontSize: 17 }} className={styles.container}>
			<h1>Electronic Commercial</h1>
			<i>
				End-of-course assignment of ecommerce in DNTU (
				<Link
					href={'https://canvas.dntu.edu.vn/courses/1778'}
					target='_blank'
				>
					0370141 - K17
				</Link>
				).
			</i>
			<br />
			<br />
			<strong>Lecturer:</strong> Phạm Đình Sắc
			<br />
			<strong>
				<code>Ocean</code>'s members:
			</strong>
			<ul>
				<li>
					• 1721030861 | Vũ Quốc Bảo (Front-End, Back-End, Database).
				</li>
				<li>• 1721030593 | Nguyễn Thanh Hải (Database less).</li>
				<li>• 1721030650 | Đặng Đức Minh Quang (Back-End less).</li>
			</ul>
			<hr />
			<div className='py-5'>
				<Link
					href='https://github.com/NekoCyan/E-Commerce'
					target='_blank'
				>
					CLICK HERE TO OPEN NEW TAB TO WEBSITE'S GITHUB PAGE.
				</Link>
			</div>
			<hr />
			<h3 className='pt-2'>Template Credits</h3>
			<div>
				<Link
					href='https://themewagon.com/themes/free-bootstrap-ecommerce-template-electro/'
					target='_blank'
				>
					Electro – Multi-page Ready Free Bootstrap eCommerce Template
				</Link>{' '}
				(template for this project).
			</div>
			<div>
				<Link
					href='https://github.com/anhsirk0/slider-login-signup'
					target='_blank'
				>
					Login Signup form with slider animation
				</Link>{' '}
				(login / register form).
			</div>
		</Container>
	);
}
