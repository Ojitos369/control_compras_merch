import { useMemo } from 'react';
import styles from './styles/index.module.scss';

const Actions = props => {

    return (
        <nav
            id="nav"
            className={`${styles.nav}`}
            >
            <div id="navBar" className={`${styles.navBar} flex`}>
                <button className={`${styles.navElement}`}>
                    <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In sapiente possimus</span>
                </button>
                <button className={`${styles.navElement}`}>
                    <span>Button 1</span>
                </button>
                <button className={`${styles.navElement}`}>
                    <span>Button 1</span>
                </button>
                <button className={`${styles.navElement}`}>
                    <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In sapiente possimus</span>
                </button>
                <button className={`${styles.navElement}`}>
                    <span>Button 1</span>
                </button>
                <button className={`${styles.navElement}`}>
                    <span>Button 1</span>
                </button>
            </div>
        </nav>
    )
}

export { Actions };