'use client';

import Link from 'next/link';
import { Container, Row, Table } from 'react-bootstrap';
import styles from './categories.module.css';

export default function Component() {
	return (
		<Container>
			<Row className={styles.row}>
				<div className='col-md-6'>
					<h3>Categories Management</h3>
				</div>
				<div className='col-md-6'>
					<Link href='#' className='btn btn-primary'>
						Add Category
					</Link>
				</div>
			</Row>

			<Table className={styles.table}>
				<thead>
					<tr>
						<th>#</th>
						<th>Category Name</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>Category 1</td>
						<td>
							<Link
								href='#'
								onClick={(e) => {
									e.preventDefault();
								}}
							>
								<i className='fa fa-edit'></i>
							</Link>
							<Link href='#'>
								<i className='fa fa-solid fa-trash'></i>
							</Link>
						</td>
					</tr>
					<tr>
						<td>2</td>
						<td>Category 2</td>
						<td>
							<Link href='#'>
								<i className='fa fa-edit'></i>
							</Link>
							<Link href='#'>
								<i className='fa fa-solid fa-trash'></i>
							</Link>
						</td>
					</tr>
				</tbody>
			</Table>
		</Container>
	);
}
