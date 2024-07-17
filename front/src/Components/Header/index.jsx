// import { useStates } from "../../Hooks/useStates";
import { Link } from 'react-router-dom';
import { CcmLogo } from "../Icons"
import styles from './styles/index.module.scss';
import { Menu } from './Menu';
import { useStates } from '../../Hooks/useStates';

const Header = props => {
    const { s } = useStates();
    return (
        <header className={`w-full flex justify-between px-8 py-1 ${styles.header}`}>
            <Link to='/'>
                <span
                    className={`${styles.logo_span}`}
                    >
                    <CcmLogo stroke='var(--my-minor)'/>
                </span>
            </Link >
            {s.login?.data?.user?.usuario &&
            <p className={`${styles.usuario}`} >
                {s.login?.data?.user?.usuario}
            </p>}
            <Menu styles={styles} />
        </header>
    )
}

export { Header };