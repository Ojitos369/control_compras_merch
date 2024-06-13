import { useMemo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useStates } from '../../Hooks/useStates';
import { Header } from '../../Components/Header';

import styles from './styles/index.module.scss';

const Base = props => {
    const { ls, lf, s, f } = useStates();
    const theme = useMemo(() => ls.theme, [ls.theme]);
    return (
        <div className='flex w-full justify-center flex-wrap'>
            <Header />
            <Outlet />
        </div>
    )
}

export { Base };
