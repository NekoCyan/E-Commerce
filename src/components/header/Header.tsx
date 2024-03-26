import { Container, Row } from 'react-bootstrap';
import styles from './Header.module.css';
import HeaderLogo from './headerComponents/HeaderLogo';
import HeaderMisc from './headerComponents/HeaderMisc';
import HeaderSearch from './headerComponents/HeaderSearch';

type HeaderProps = {
	excluded?: Array<'logo' | 'search' | 'misc'>;
	miscExcluded?: Array<'wishlist' | 'cart' | 'menu'>;
	logoNavHref?: string;
};

export default function Header(
	{ excluded, logoNavHref, miscExcluded }: Readonly<HeaderProps> = {
		excluded: [],
	},
) {
	return (
		<div className={styles.header}>
			<Container>
				<Row className={styles.row}>
					<HeaderLogo
						isDisabled={excluded?.includes('logo')}
						logoNavHref={logoNavHref}
					/>
					<HeaderSearch isDisabled={excluded?.includes('search')} />
					<HeaderMisc
						isDisabled={excluded?.includes('misc')}
						miscExcluded={miscExcluded}
					/>
				</Row>
			</Container>
		</div>
	);
}
