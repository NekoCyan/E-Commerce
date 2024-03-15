import { Container, Row } from 'react-bootstrap';
import styles from './Header.module.css';
import HeaderLogo from './headerComponents/HeaderLogo';
import HeaderMisc from './headerComponents/HeaderMisc';
import HeaderSearch from './headerComponents/HeaderSearch';

export default function Header() {
	return (
		<div className={styles.header}>
			<Container>
                <Row className={styles.row}>
                    <HeaderLogo />
                    <HeaderSearch />
                    <HeaderMisc />
                </Row>
            </Container>
		</div>
	);
}
