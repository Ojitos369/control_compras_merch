import {
    useMemo, useEffect,  
    Route, Routes, 
    Tooltip, 
    Base, 
    Index, 
    Test, 
    ComprasPage, ComprasNueva, ComprasDetalle, ComprasEditar, 
    Users, UsersLogin, UsersRegister, UsersValidarCuenta, UsersAccount, 
    CargoGrupalPage, CargoGrupalNueva, 
    store, Provider, useStates, 
    GeneralNotification, 
    cambiarThema, 
} from './imports';

const BgTheme = () => {
    const { ls } = useStates();
    return (
        <>
            <div className={`wipeInDown full-page-container bg-my-${ls.theme}`}></div>
        </>
    )
}

function AppUI() {
    const { ls, s, f } = useStates();

    const userLogged = useMemo(() => s.login?.data?.user || {}, [s.login?.data?.user]);

    useEffect(() => {
        cambiarThema(ls?.theme);
    }, [ls?.theme]);

    useEffect(() => {
        f.u1('shortCuts', 'keys', {});
        f.users.validateLogin();
    }, [window.location.href]);

    useEffect(() => {
        f.general.getHostLink()
    }, []);

    useEffect(() => { 
        const handleFocus = () => {
            f.u1('shortCuts', 'keys', {});
        };
        
        const handleBlur = () => {
            f.u1('shortCuts', 'keys', {});
        };
    
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
    
        return () => {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);
        };
    }, []);

    return (
        <div className={`text-[var(--my-minor)]`}>
            <Tooltip id="global" />
            <BgTheme />
            {userLogged.token ? <Logged /> : <NotLogged />}
            {!!s.modals?.general?.notification &&
            <GeneralNotification />}
        </div>
    );
}

const Logged = props => {
    return (
        <Routes>
            {/* -----------   Test   ----------- */}
            <Route path="test" element={ <Test /> } />
            {/* -----------   /Test   ----------- */}

            {/* -----------   Base   ----------- */}
            <Route path="" element={ <Base /> } >
                {/* -----------   Index   ----------- */}
                <Route path="" element={ <Index /> } />
                {/* -----------   /Index   ----------- */}

                {/* -----------   Users   ----------- */}
                <Route path="users" element={ <Users /> } >
                    <Route path="account" element={ <UsersAccount /> } />
                </Route>
                {/* -----------   /Users   ----------- */}

                {/* -----------   Compras   ----------- */}
                <Route path="compras" element={ <ComprasPage /> } >
                    <Route path="nueva" element={ <ComprasNueva /> } />
                    <Route path="detalle/:compra_id" element={ <ComprasDetalle /> } />
                    <Route path="editar/:compra_id" element={ <ComprasEditar /> } />
                    {/* <Route path="validar_cuenta/:validacion" element={ <UsersValidarCuenta /> } /> */}
                </Route>
                {/* -----------   /Compras   ----------- */}

                {/* -----------   Cargo Grupal   ----------- */}
                <Route path="cargo_grupal" element={ <CargoGrupalPage /> } >
                    <Route path="nueva" element={ <CargoGrupalNueva /> } />
                </Route>

                {/* -----------   404   ----------- */}
                <Route path="*" element={<div className='text-danger h1 text-center mt-5'>404 Not Found</div>} />
                {/* -----------   /404   ----------- */}
            </Route>
            {/* -----------   /Base   ----------- */}
        </Routes>
    )
}

const NotLogged = props => {
    return (
        <Routes>
            {/* -----------   Test   ----------- */}
            <Route path="test" element={ <Test /> } />
            {/* -----------   /Test   ----------- */}

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

                {/* -----------   404   ----------- */}
                <Route path="*" element={<div className='text-danger h1 text-center mt-5'>404 Not Found</div>} />
                {/* -----------   /404   ----------- */}
            </Route>
            {/* -----------   /Base   ----------- */}
        </Routes>
    )
}

function App(props) {
    return (
        <Provider store={store}>
            <AppUI />
        </Provider>
    );
}

export default App;
