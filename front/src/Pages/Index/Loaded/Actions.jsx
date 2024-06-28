import { useMemo } from 'react';
import styles from './styles/index.module.scss';
import { Link } from 'react-router-dom';
import { BuyCart } from '../../../Components/Icons';

const Actions = props => {
    const options = [
        {label: "Nueva Compra", to: "/compras/nueva", Icon: BuyCart},
    ]

    return (
        <nav
            id="nav"
            className={`${styles.nav}`}
            >
            <div id="navBar" className={`${styles.navBar} flex`}>
                {options.map((option, i) => {
                    const {label, to, Icon} = option;
                    const show = option.show ?? true;
                    if (!show) return null;
                    return (
                        <Link
                            key={i}
                            to={to}
                            className={`${styles.navElement}`}
                            >
                            {Icon && <span className={`${styles.icon} mr-3`}>
                                <Icon />
                            </span>}
                            <span>{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

export { Actions };