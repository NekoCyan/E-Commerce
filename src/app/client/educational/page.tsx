import Link from 'next/link';
import { Container } from 'react-bootstrap';

export default function Page() {
	return (
		<Container style={{ fontSize: 17, paddingBottom: '15px' }}>
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
				<li>• 1721030861 | Vũ Quốc Bảo (Front-End)</li>
				<li>• 1721030593 | Nguyễn Thanh Hải (Database)</li>
				<li>• 1721030650 | Đặng Đức Minh Quang (Back-End)</li>
			</ul>
			<hr />
			<Link href='https://github.com/NekoCyan/E-Commerce' target='_blank'>
				CLICK HERE TO OPEN NEW TAB TO WEBSITE'S GITHUB PAGE.
			</Link>
			<hr />
			<h3>Template Credits</h3>
			<Link
				href='https://themewagon.com/themes/free-bootstrap-ecommerce-template-electro/'
				target='_blank'
			>
				Electro – Multi-page Ready Free Bootstrap eCommerce Template
			</Link>{' '}
			(template for this project).
		</Container>
	);
}
