// ------------------------------   REACT   ------------------------------ //
import { useMemo, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

// ------------------------------   PAGES   ------------------------------ //
// base
import { Base } from '../Pages/Base';
// index
import { Index } from '../Pages/Index';
// test
import { Test } from '../Pages/Test';
// compras
import { ComprasPage } from '../Pages/Compras/ComprasPage';
import { Nueva as ComprasNueva } from '../Pages/Compras/Nueva';
import { Detalle as ComprasDetalle } from '../Pages/Compras/Detalle';
// users
import { Users as Users } from '../Pages/Users';
import { Login as UsersLogin } from '../Pages/Users/Login';
import { Register as UsersRegister } from '../Pages/Users/Register';
import { ValidarCuenta as UsersValidarCuenta } from '../Pages/Users/ValidarCuenta';
import { Account as UsersAccount } from '../Pages/Users/Account';

// ------------------------------   STATES   ------------------------------ //
import { store } from './store';
import { Provider } from "react-redux";
import { useStates } from '../Hooks/useStates';

// ------------------------------   MODALS   ------------------------------ //
// general
import { GeneralNotification } from '../Components/Modals/general/GeneralNotification';

// ------------------------------   COMPONENTS   ------------------------------ //
// general

// ------------------------------   UTILS   ------------------------------ //
import { cambiarThema } from '../Core/helper';

export {
    useMemo, useEffect, 
    Route, Routes, 
    Base, 
    Index, 
    Test, 
    ComprasPage, ComprasNueva, ComprasDetalle, 
    Users, UsersLogin, UsersRegister, UsersValidarCuenta, UsersAccount, 
    store, Provider, useStates, 
    GeneralNotification, 
    cambiarThema, 
}