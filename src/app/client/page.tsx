import Collection from '@/components/collection/Collection';
import { Container, Row } from 'react-bootstrap';

const collections: {
	name: string;
	imageURL: string;
	destinationHref: string;
}[] = [
	{
		name: 'Laptop',
		imageURL: '/img/shop01.png',
		destinationHref: '#',
	},
	{
		name: 'Accessories',
		imageURL: '/img/shop03.png',
		destinationHref: '#',
	},
	{
		name: 'Cameras',
		imageURL: '/img/shop02.png',
		destinationHref: '#',
	},
];

export default function Home() {
	return (
		<div>
			<div className='section'>
				<Container>
					<Row>
						{collections.map((collection, index) => (
							<Collection key={index} {...collection} />
						))}
					</Row>
				</Container>
			</div>
		</div>
	);
}
