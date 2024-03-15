import styles from './Footer.module.css';
import FooterBottom from './footerComponents/FooterBottom';
import FooterSection from './footerComponents/FooterSection';

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<FooterSection />
			<FooterBottom />
		</footer>
	);
}
