import { useMemo } from 'react';
import styles from './styles/index.module.scss';

const Actions = props => {
    const { sobra, hNav } = useMemo(() => {
        const nav = document.getElementById('nav');
        const navBar = document.getElementById('navBar');
        if (!nav || !navBar) return false;
        const navWidth = nav.offsetWidth;
        const navBarWidth = navBar.offsetWidth;
        const sobra = navBarWidth > navWidth;
        const hNav = nav.offsetHeight;
    }, [
        document.getElementById('nav'),
        document.getElementById('navBar')
    ]);

    return (
        <nav
            id="nav"
            className={`${styles.nav}`}
            >
            {sobra &&
            <div 
                style={{
                    height: `${hNav}px`
                }}
                className={`${styles.navSombraSobra}`}></div>
            }
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