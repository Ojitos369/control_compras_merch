// import { useStates } from "../../Hooks/useStates";
import { Link } from 'react-router-dom';
import { CcmLogo } from "../Icons"
import styles from './styles/index.module.scss';
import { Menu } from './Menu';

const Header = props => {
    return (
        <header className={`w-full flex justify-between px-8 py-1 ${styles.header}`}>
            <Link to='/'>
                <span
                    className={`${styles.logo_span}`}
                    >
                    <CcmLogo stroke='var(--my-minor)'/>
                </span>
            </Link >
            <Menu styles={styles} />
        </header>
    )
}

export { Header };