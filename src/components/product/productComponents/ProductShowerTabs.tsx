'use client';

import { MultiStyles } from '@/utils/ComponentUtils';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from '../ProductShower.module.css';

type ProductShowerTabsProps = {
	title: string;
	categories: string[];
	setCurrentCategory: Dispatch<SetStateAction<string>>;
};
export default function ProductShowerTabs({
	title,
	categories,
	setCurrentCategory,
}: ProductShowerTabsProps) {
	const [activeTab, setActiveTab] = useState(
		categories[0]?.toLowerCase() || '',
	);

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
							)}
						>
							{categories.map((tab, index) => {
								const theTab = tab.toLowerCase();

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
											if (activeTab === theTab) return;
											setActiveTab(theTab);
											setCurrentCategory(theTab);
										}}
									>
										<Link href='#/'>{tab}</Link>
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
