'use client';

import { useEffect } from 'react';

type ProductDetailsPreviewProps = {
	images: string[];
};

export default function ProductDetailsPreview({
	images,
}: ProductDetailsPreviewProps) {
	const mainId = 'product-main-img';
	const navId = 'product-imgs';

	useEffect(() => {
		try {
			($(`#${mainId}`) as any).slick({
				infinite: true,
				speed: 300,
				dots: false,
				arrows: true,
				fade: true,
				asNavFor: `#${navId}`,
			});

			($(`#${navId}`) as any).slick({
				slidesToShow: 3,
				slidesToScroll: 1,
				arrows: true,
				centerMode: true,
				focusOnSelect: true,
				centerPadding: 0,
				vertical: true,
				asNavFor: `#${mainId}`,
				responsive: [
					{
						breakpoint: 991,
						settings: {
							vertical: false,
							arrows: false,
							dots: true,
						},
					},
				],
			});

			// Product img zoom
			var zoomMainProduct = document.getElementById(mainId);
			if (zoomMainProduct) {
				($(`#${mainId} .product-preview`) as any).zoom();
			}
		} catch {}
	});

	return (
		<div>
			<div className='col-md-5 col-md-push-2'>
				<div id={mainId}>
					{images.map((image, index) => (
						<div className={'product-preview'} key={index}>
							<img src={image} alt='' />
						</div>
					))}
				</div>
			</div>
			<div className='col-md-2 col-md-pull-5'>
				<div id='product-imgs'>
					{images.map((image, index) => (
						<div className={'product-preview'} key={index}>
							<img src={image} alt='' />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
