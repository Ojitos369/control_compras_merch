import { useMemo } from 'react';
import { useStates } from '../../Hooks/useStates';

import { General } from './General';
import { Loaded } from './Loaded';

const Index = props => {
    const { ls, lf, s, f } = useStates();

    const userLogged = useMemo(() => s.login?.data?.user || {}, [s.login?.data?.user]);

    return userLogged.token ? <Loaded /> : <General />;
}

export { Index };
