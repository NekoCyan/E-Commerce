import {MultiStyles} from '@/utils/ComponentUtils';
import styles from './HeaderSearch.module.css';

export default function HeaderSearch() {
	return (
		<div className='col-md-6'>
			<div className={styles['header-search']}>
				<form>
					{/* <select className={MultiStyles(styles['input-select'], 'input-select')}>
						<option value='0'>All Categories</option>
						<option value='1'>Category 01</option>
						<option value='1'>Category 02</option>
					</select> */}
					<input
						className={MultiStyles(styles.input, 'input')}
						placeholder='Search here'
					/>
					<button className={styles['search-btn']}>Search</button>
				</form>
			</div>
		</div>
	);
}
