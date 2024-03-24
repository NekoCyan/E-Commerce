import { Container, Row } from 'react-bootstrap';
import ProductDetailsData from './productDetailsComponents/ProductDetailsData';
import ProductDetailsInfo from './productDetailsComponents/ProductDetailsInfo';
import ProductDetailsPreview from './productDetailsComponents/ProductDetailsPreview';

type ProductDetailsProps = {
	productId: string;
};

const productImages = [
	'/img/product01.png',
	'/img/product03.png',
	'/img/product06.png',
	'/img/product08.png',
];

const productData = {
	productName: 'Laptop GTX',
	categoryName: 'Laptops',
	imageURL: './img/product01.png',
	price: 1000,
	stock: 1,
	rating: 5,
	review: 1,
	isNew: true,
	salePercentage: 30,
};

export default function ProductDetails({ productId }: ProductDetailsProps) {
	return (
		<div id='product-details' className='section'>
			<Container>
				<Row>
					<ProductDetailsPreview images={productImages} />
					<ProductDetailsData productData={productData} />
					<ProductDetailsInfo />
				</Row>
			</Container>
		</div>
	);
}
