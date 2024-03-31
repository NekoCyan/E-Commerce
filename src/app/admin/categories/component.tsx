'use client';

import Modal from '@/components/modal/Modal';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { Container, Row, Table } from 'react-bootstrap';
import styles from './categories.module.css';

export default function Component() {
	const [actionType, setActionType] = useState<
		'' | 'add' | 'update' | 'delete'
	>('');
	const [categoryId, setCategoryId] = useState(0);

	const [isVisible, setIsVisible] = useState(true);
	const [errorMsg, setErrorMsg] = useState('');
	const [actionButton, setActionButton] = useState({
		text: '',
		isLoading: false,
		isDisabled: false,
	});

	const handleClick = (id: number) => {
		setIsVisible(true);
		setCategoryId(id);
	};

	// Clean up.
	const handleClose = () => {
		setCategoryId(0);
		setIsVisible(false);
		setErrorMsg('');
		setActionButton({
			text: '',
			isLoading: false,
			isDisabled: false,
		});
	};

	return (
		<Fragment>
			<Container>
				<Row className={styles.row}>
					<div className='col-sm-6'>
						<h3>Categories Management</h3>
					</div>
					<div className='col-sm-6'>
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
										handleClick(1);
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

			<Modal
				isVisible={isVisible}
				onClose={handleClose}
				errorMsg={errorMsg}
				actionButton={{
					onClick: handleClose,
					...actionButton,
				}}
			>
				{/* Modal content */}
				<p>This is the modal content for category {categoryId}.</p>
			</Modal>
		</Fragment>
	);
}
