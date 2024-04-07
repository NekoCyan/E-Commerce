import { CategoryData, ProductData } from '@/app/models/interfaces';
import { Container, Row } from 'react-bootstrap';
import ProductDetailsData from './productDetailsComponents/ProductDetailsData';
import ProductDetailsInfo from './productDetailsComponents/ProductDetailsInfo';
import ProductDetailsPreview from './productDetailsComponents/ProductDetailsPreview';

export default function ProductDetails({
	productData,
	isPreview,
	categoriesList,
}: Readonly<{
	productData: ProductData;
	isPreview?: boolean;
	categoriesList: CategoryData[];
}>) {
	return (
		<div id='product-details' className='section'>
			<Container>
				<Row>
					<ProductDetailsPreview images={productData.imageUrls} />
					<ProductDetailsData
						props={productData}
						isPreview={isPreview}
						categories={categoriesList}
					/>
					<ProductDetailsInfo
						props={productData}
						isPreview={isPreview}
					/>
				</Row>
			</Container>
		</div>
	);
}
