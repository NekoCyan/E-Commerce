import { Container, Row } from 'react-bootstrap';
import CollectionData from './collectionComponents/CollectionData';

type CollectionProps = {
	name: string;
	imageURL: string;
	destinationHref: string;
}[];

export default function Collection({ collectionData }: { collectionData: CollectionProps }) {
	return (
		<div className='section'>
			<Container>
				<Row>
					{collectionData.map((collection, index) => (
						<CollectionData key={index} {...collection} />
					))}
				</Row>
			</Container>
		</div>
	);
}
