import { Container, Row } from 'react-bootstrap';
import styles from './Header.module.css';
import HeaderLogo from './headerComponents/HeaderLogo';
import HeaderMisc from './headerComponents/HeaderMisc';
import HeaderSearch from './headerComponents/HeaderSearch';

type HeaderProps = {
	excluded?: Array<'logo' | 'search' | 'misc'>;
	logoHref?: string;
};

export default function Header(
	{ excluded, logoHref }: Readonly<HeaderProps> = { excluded: [] },
) {
	return (
		<div className={styles.header}>
			<Container>
				<Row className={styles.row}>
					{!excluded?.includes('logo') && (
						<HeaderLogo logoHref={logoHref} />
					)}
					{!excluded?.includes('search') && <HeaderSearch />}
					{!excluded?.includes('misc') && <HeaderMisc />}
				</Row>
			</Container>
		</div>
	);
}
