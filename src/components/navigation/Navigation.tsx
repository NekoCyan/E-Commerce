import MultiStyles from '@/utils/ComponentUtils';
import { Container } from 'react-bootstrap';
import styles from './Navigation.module.css';

const allLinks = [
    {
        title: "Home",
        path: "/"
    }
]

export default function Navigation() {
	return (
		<nav className={styles.navigation}>
			<Container>
				<div className={styles['responsive-nav']}>
					<ul
						className={MultiStyles(
							styles['main-nav'],
							'nav',
							'navbar-nav',
						)}
					>
						<li className='active'>
							<a href='#'>Home</a>
						</li>
						<li>
							<a href='#'>Hot Deals</a>
						</li>
						<li>
							<a href='#'>Categories</a>
						</li>
						<li>
							<a href='#'>Laptops</a>
						</li>
						<li>
							<a href='#'>Smartphones</a>
						</li>
						<li>
							<a href='#'>Cameras</a>
						</li>
						<li>
							<a href='#'>Accessories</a>
						</li>
					</ul>
				</div>
			</Container>
		</nav>
	);
}
