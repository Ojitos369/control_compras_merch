import { useEffect } from 'react';
import { cambiarThema } from '../Core/helper';
import { Theme } from '../Components/Theme';

import { Base } from '../Pages/Base';
import { Index } from '../Pages/Index';
import { Test } from '../Pages/Test';

import { Users as Users } from '../Pages/Users';
import { Login as UsersLogin } from '../Pages/Users/Login';
import { Register as UsersRegister } from '../Pages/Users/Register';
import { ValidarCuenta as UsersValidarCuenta } from '../Pages/Users/ValidarCuenta';

import { Route, Routes } from 'react-router-dom';

import { store } from './store';
import { Provider } from "react-redux";
import { useStates } from '../Hooks/useStates';

import { GeneralNotification } from '../Components/Modals/general/GeneralNotification';


const BgTheme = () => {
    const { ls } = useStates();
    return (
        <>
            <div className={`wipeInDown full-page-container bg-my-${ls.theme}`}></div>
            {/* <Theme /> */}
        </>
    )
}

function AppUI() {
    const { ls, s } = useStates();

    useEffect(() => {
        cambiarThema(ls?.theme);
    }, [ls?.theme]);

    return (
        <div className={`text-[var(--my-minor)]`}>
            <BgTheme />
            <Routes>
                {/* -----------   Base   ----------- */}
                <Route path="" element={ <Base /> } >
                    {/* -----------   Index   ----------- */}
                    <Route path="" element={ <Index /> } />
                    {/* -----------   /Index   ----------- */}

                    {/* -----------   Users   ----------- */}
                    <Route path="users" element={ <Users /> } >
                        <Route path="login" element={ <UsersLogin /> } />
                        <Route path="register" element={ <UsersRegister /> } />
                        <Route path="validar_cuenta/:validacion" element={ <UsersValidarCuenta /> } />
                    </Route>
                    {/* -----------   /Users   ----------- */}
                </Route>
                {/* -----------   /Base   ----------- */}

                {/* -----------   Test   ----------- */}
                <Route path="test" element={ <Test /> } />
                {/* -----------   /Test   ----------- */}

                {/* -----------   404   ----------- */}
                <Route path="*/" element={<div className='text-danger h1 text-center mt-5'>404 Not Found</div>} />
                {/* -----------   /404   ----------- */}
            </Routes>

            {!!s.modals?.general?.notification &&
            <GeneralNotification />}
        </div>
    );
}

function App(props) {
    return (
        <Provider store={store}>
            <AppUI />
        </Provider>
    );
}

export default App;
