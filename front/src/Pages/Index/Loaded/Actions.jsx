import { useMemo } from 'react';
import styles from './styles/index.module.scss';
import { Link } from 'react-router-dom';
import { BuyCart } from '../../../Components/Icons';

import { useStates } from '../../../Hooks/useStates';

const Actions = props => {
    const { f } = useStates();
    const options = [
        {label: "Nueva Compra", to: "/compras/nueva", Icon: BuyCart,
            onClick: () => {
                const id = f.general.getUuid();
                f.u1('compras', 'actualCompra', {form: {id}});
            }
        },
        {label: "Cargo Grupal", to: "/cargo_grupal/nueva", Icon: BuyCart},
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
                            onClick={option.onClick}
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