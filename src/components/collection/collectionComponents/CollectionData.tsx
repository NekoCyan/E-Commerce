import Link from 'next/link';
import styles from './CollectionData.module.css';

type CollectionProps = {
	name: string;
	imageURL: string;
	destinationHref: string;
	externalClassName?: string;
};

export default function CollectionData(props: CollectionProps) {
	props = {
		externalClassName: 'col-md-4 col-xs-6',
		...props,
	};
	const imageName =
		props.imageURL.split('/').pop()?.split('.').shift() || 'image';

	return (
		<div className={props.externalClassName}>
			<Link href={props.destinationHref}>
				<div className={styles.shop}>
					<div className={styles['shop-img']}>
						<img src={props.imageURL} alt={imageName} />
					</div>
					<div className={styles['shop-body']}>
						<h3>
							{props.name}
							<br />
							Collection
						</h3>
						<p className={styles['cta-btn']}>
							Shop now{' '}
							<i className='fa fa-arrow-circle-right'></i>
						</p>
					</div>
				</div>
			</Link>
		</div>
	);
}
