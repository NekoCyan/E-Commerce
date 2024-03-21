'use client';

import Link from 'next/link';
import { Container, Row } from 'react-bootstrap';
import styles from './BreadCrumb.module.css';

type BreadCrumbProps = {
	navigation: { name: string; url: string }[];
};

export default function BreadCrumb({ navigation }: BreadCrumbProps) {
	if (navigation.length === 0) throw new Error(`Invalid breadcrumb length.`);
	if (navigation.some((x) => !x.url || !x.name))
		throw new Error(`Invalid breadcrumb item.`);

	if (navigation[0].name.toLowerCase() != 'home') {
		navigation.unshift({ name: 'Home', url: '/' });
	}

	return (
		<div id={styles.breadcrumb} className='section'>
			<Container>
				<Row>
					<div className='col-md-12'>
						<ul className={styles['breadcrumb-tree']}>
							{navigation.map((item, index) => (
								<li
									key={index}
									className={
										index + 1 === navigation.length
											? 'active'
											: ''
									}
								>
									<Link
										href={item.url}
										onClick={(e) => {
											if (item.url === '#') {
												e.preventDefault();
											}
										}}
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</Row>
			</Container>
		</div>
	);
}
