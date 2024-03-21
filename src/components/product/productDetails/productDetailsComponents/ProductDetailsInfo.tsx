'use client';

import { MultiStyles } from '@/utils/ComponentUtils';
import { Row } from 'react-bootstrap';
import styles from '../ProductDetails.module.css';

export default function ProductDetailsInfo() {
	return (
		<div className='col-md-12'>
			<div id={styles['product-tab']}>
				<ul
					className={MultiStyles(styles['tab-nav'], 'tab-nav')}
					onClick={(e) => {
						if (e.target instanceof HTMLAnchorElement) {
							e.preventDefault();

							const liTarget = e.target.parentElement;
							if (liTarget) {
								if (
									liTarget.classList.contains(
										styles['active'],
									)
								)
									return;
								const liTargets =
									liTarget.parentElement!.children;
								for (let i = 0; i < liTargets.length; i++) {
									if (
										!liTargets[i].classList.contains(
											styles['active'],
										)
									)
										continue;

									liTargets[i].classList.remove(
										styles['active'],
									);
								}
								liTarget.classList.add(styles['active']);
							}
						}
					}}
				>
					<li className={MultiStyles(styles['active'])}>
						<a data-toggle='tab' href='#tab1'>
							Description
						</a>
					</li>
					<li>
						<a data-toggle='tab' href='#tab2'>
							Details
						</a>
					</li>
					<li>
						<a data-toggle='tab' href='#tab3'>
							Reviews (3)
						</a>
					</li>
				</ul>

				<div
					className={MultiStyles(
						styles['tab-content'],
						'tab-content',
					)}
				>
					<div id='tab1' className='tab-pane fade in active'>
						<Row>
							<div className='col-md-12'>
								<p>
									Lorem ipsum dolor sit amet, consectetur
									adipisicing elit, sed do eiusmod tempor
									incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud
									exercitation ullamco laboris nisi ut aliquip
									ex ea commodo consequat. Duis aute irure
									dolor in reprehenderit in voluptate velit
									esse cillum dolore eu fugiat nulla pariatur.
									Excepteur sint occaecat cupidatat non
									proident, sunt in culpa qui officia deserunt
									mollit anim id est laborum.
								</p>
							</div>
						</Row>
					</div>

					<div id='tab2' className='tab-pane fade in'>
						<Row>
							<div className='col-md-12'>
								<p>
									Lorem ipsum dolor sit amet, consectetur
									adipisicing elit, sed do eiusmod tempor
									incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud
									exercitation ullamco laboris nisi ut aliquip
									ex ea commodo consequat. Duis aute irure
									dolor in reprehenderit in voluptate velit
									esse cillum dolore eu fugiat nulla pariatur.
									Excepteur sint occaecat cupidatat non
									proident, sunt in culpa qui officia deserunt
									mollit anim id est laborum.
								</p>
							</div>
						</Row>
					</div>

					<div id='tab3' className='tab-pane fade in'>
						<Row>
							<div className='col-md-3'>
								<div id={styles['rating']}>
									<div className={styles['rating-avg']}>
										<span>4.5</span>
										<div className={styles['rating-stars']}>
											<i
												className={MultiStyles(
													'fa fa-star',
													styles['fa-star'],
												)}
											></i>
											<i
												className={MultiStyles(
													'fa fa-star',
													styles['fa-star'],
												)}
											></i>
											<i
												className={MultiStyles(
													'fa fa-star',
													styles['fa-star'],
												)}
											></i>
											<i
												className={MultiStyles(
													'fa fa-star',
													styles['fa-star'],
												)}
											></i>
											<i className='fa fa-star-o'></i>
										</div>
									</div>
									<ul className={styles['rating']}>
										<li>
											<div
												className={
													styles['rating-stars']
												}
											>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
											</div>
											<div
												className={
													styles['rating-progress']
												}
											>
												<div
													style={{ width: '80%' }}
												></div>
											</div>
											<span className={styles['sum']}>
												3
											</span>
										</li>
										<li>
											<div
												className={
													styles['rating-stars']
												}
											>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i className='fa fa-star-o'></i>
											</div>
											<div
												className={
													styles['rating-progress']
												}
											>
												<div
													style={{ width: '60%' }}
												></div>
											</div>
											<span className={styles['sum']}>
												2
											</span>
										</li>
										<li>
											<div
												className={
													styles['rating-stars']
												}
											>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i className='fa fa-star-o'></i>
												<i className='fa fa-star-o'></i>
											</div>
											<div
												className={
													styles['rating-progress']
												}
											>
												<div></div>
											</div>
											<span className={styles['sum']}>
												0
											</span>
										</li>
										<li>
											<div
												className={
													styles['rating-stars']
												}
											>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i className='fa fa-star-o'></i>
												<i className='fa fa-star-o'></i>
												<i className='fa fa-star-o'></i>
											</div>
											<div
												className={
													styles['rating-progress']
												}
											>
												<div></div>
											</div>
											<span className={styles['sum']}>
												0
											</span>
										</li>
										<li>
											<div
												className={
													styles['rating-stars']
												}
											>
												<i
													className={MultiStyles(
														'fa fa-star',
														styles['fa-star'],
													)}
												></i>
												<i className='fa fa-star-o'></i>
												<i className='fa fa-star-o'></i>
												<i className='fa fa-star-o'></i>
												<i className='fa fa-star-o'></i>
											</div>
											<div
												className={
													styles['rating-progress']
												}
											>
												<div></div>
											</div>
											<span className={styles['sum']}>
												0
											</span>
										</li>
									</ul>
								</div>
							</div>

							<div className='col-md-6'>
								<div id={styles['reviews']}>
									<ul className={styles['reviews']}>
										<li>
											<div
												className={
													styles['review-heading']
												}
											>
												<h5 className={styles['name']}>
													John
												</h5>
												<p className={styles['date']}>
													27 DEC 2018, 8:0 PM
												</p>
												<div
													className={
														styles['review-rating']
													}
												>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i className='fa fa-star-o empty'></i>
												</div>
											</div>
											<div
												className={
													styles['review-body']
												}
											>
												<p>
													Lorem ipsum dolor sit amet,
													consectetur adipisicing
													elit, sed do eiusmod tempor
													incididunt ut labore et
													dolore magna aliqua
												</p>
											</div>
										</li>
										<li>
											<div
												className={
													styles['review-heading']
												}
											>
												<h5 className={styles['name']}>
													John
												</h5>
												<p className={styles['date']}>
													27 DEC 2018, 8:0 PM
												</p>
												<div
													className={
														styles['review-rating']
													}
												>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i className='fa fa-star-o empty'></i>
												</div>
											</div>
											<div
												className={
													styles['review-body']
												}
											>
												<p>
													Lorem ipsum dolor sit amet,
													consectetur adipisicing
													elit, sed do eiusmod tempor
													incididunt ut labore et
													dolore magna aliqua
												</p>
											</div>
										</li>
										<li>
											<div
												className={
													styles['review-heading']
												}
											>
												<h5 className={styles['name']}>
													John
												</h5>
												<p className={styles['date']}>
													27 DEC 2018, 8:0 PM
												</p>
												<div
													className={
														styles['review-rating']
													}
												>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i
														className={MultiStyles(
															'fa fa-star',
															styles['fa-star'],
														)}
													></i>
													<i className='fa fa-star-o empty'></i>
												</div>
											</div>
											<div
												className={
													styles['review-body']
												}
											>
												<p>
													Lorem ipsum dolor sit amet,
													consectetur adipisicing
													elit, sed do eiusmod tempor
													incididunt ut labore et
													dolore magna aliqua
												</p>
											</div>
										</li>
									</ul>
									<ul
										className={styles['reviews-pagination']}
									>
										<li className='active'>1</li>
										<li>
											<a href='#'>2</a>
										</li>
										<li>
											<a href='#'>3</a>
										</li>
										<li>
											<a href='#'>4</a>
										</li>
										<li>
											<a href='#'>
												<i className='fa fa-angle-right'></i>
											</a>
										</li>
									</ul>
								</div>
							</div>

							<div className='col-md-3'>
								<div id={styles['review-form']}>
									<form className={styles['review-form']}>
										<input
											className={MultiStyles(
												'input',
												styles['input'],
											)}
											type='text'
											placeholder='Your Name'
										/>
										<input
											className={MultiStyles(
												'input',
												styles['input'],
											)}
											type='email'
											placeholder='Your Email'
										/>
										<textarea
											className={MultiStyles(
												'input',
												styles['input'],
											)}
											placeholder='Your Review'
										></textarea>
										<div className={styles['input-rating']}>
											<span>Your Rating: </span>
											<div className={styles['stars']}>
												<input
													id='star5'
													name='rating'
													value='5'
													type='radio'
												/>
												<label htmlFor='star5'></label>
												<input
													id='star4'
													name='rating'
													value='4'
													type='radio'
												/>
												<label htmlFor='star4'></label>
												<input
													id='star3'
													name='rating'
													value='3'
													type='radio'
												/>
												<label htmlFor='star3'></label>
												<input
													id='star2'
													name='rating'
													value='2'
													type='radio'
												/>
												<label htmlFor='star2'></label>
												<input
													id='star1'
													name='rating'
													value='1'
													type='radio'
												/>
												<label htmlFor='star1'></label>
											</div>
										</div>
										<button className='primary-btn'>
											Submit
										</button>
									</form>
								</div>
							</div>
						</Row>
					</div>
				</div>
			</div>
		</div>
	);
}
