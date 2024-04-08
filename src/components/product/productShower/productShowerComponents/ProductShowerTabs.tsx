'use client';

import { CategoryData } from '@/app/models/interfaces';
import { LimitArray, ShuffleArray } from '@/utils';
import { MultiStyles } from '@/utils/ComponentUtils';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from '../ProductShower.module.css';

type ProductShowerTabsProps = {
	title: string;
	categories: CategoryData[];
	setCurrentCategory: Dispatch<SetStateAction<CategoryData>>;
	isDisabled?: boolean;
};
export default function ProductShowerTabs({
	title,
	categories,
	setCurrentCategory,
	isDisabled,
}: Readonly<ProductShowerTabsProps>) {
	const [activeTab, setActiveTab] = useState(categories[0].categoryId || 0);

	categories =
		categories.length > 4
			? LimitArray(ShuffleArray(categories), 4)
			: categories;

	return (
		<div className='col-md-12'>
			<div className={styles['section-title']}>
				<h3 className={styles.title}>{title}</h3>
				{categories.length > 0 && (
					<div className={styles['section-nav']}>
						<ul
							className={MultiStyles(
								styles['section-tab-nav'],
								'tab-nav',
								isDisabled ? styles.disabled : '',
							)}
						>
							{categories.map((tab, index) => {
								const theTab = tab.categoryId;

								return (
									<li
										key={index}
										className={
											activeTab === theTab
												? styles.active
												: ''
										}
										onClick={(e) => {
											e.preventDefault();
											if (
												activeTab === theTab ||
												isDisabled
											)
												return;
											setActiveTab(theTab);
											setCurrentCategory(
												categories[index],
											);
										}}
									>
										<Link
											href='#'
											onClick={(e) => e.preventDefault()}
										>
											{tab.name}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
