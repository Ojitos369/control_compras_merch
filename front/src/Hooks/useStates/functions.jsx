import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDispatch, useSelector } from "react-redux";
import { f as ff } from "./fs";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const link = 'http://localhost:8369/api/';
axios.defaults.withCredentials = true
const miAxios = axios.create({
    baseURL: link,
});


const useF = props => {
    const ls = useSelector(state => state.fs.ls);
    const s = useSelector(state => state.fs.s);
    const d = useDispatch();
    const navigate = useNavigate();

    const users = {
        login: () => {
            if (s.loadings?.users?.login) return;
            u2('loadings', 'users', 'login', true);

            const end = 'users/login/';
            const data = s.users?.login?.form || {};
            u2('menu', 'login', 'error', '');

            miAxios.post(end, data)
            .then(response => {
                console.log("response", response)
                const user = response.data.usuario;
                const token = user.token;
                const message = response.data.message;
                document.cookie = `tccm=${token}; max-age=86400; path=/`;
                u2('login', 'data', 'user', user);
                u2('modals', 'header', 'showMenu', false);

                navigate('/');
                // general.notificacion({
                //     mode: 'success',
                //     title: 'Ingresado con exito',
                //     message: message || "Registrado con exito"
                // });
            }).catch(error => {
                const message = error.response.data.message;
                general.notificacion({
                    mode: 'danger',
                    title: 'Error al ingresar',
                    message: message || "Error al iniciar sesiono"
                });
                u2('menu', 'login', 'error', message);
            }).finally(() => {
                u2('loadings', 'users', 'login', false);
            });
        },
        validateLogin: () => {
            const end = 'users/validate_login/';
            // get tups cookie
            miAxios.get(end)
            .then(response => {
                const user = response.data.user;
                u2('login', 'data', 'user', user);
            }).catch(error => {
                // console.log(error);
                u2('login', 'data', 'user', {});
                document.cookie = `tccm=; max-age=0; path=/`;
            })
        },
        closeSession: () => {
            if (s.loadings?.users?.closeSession) return;
            u2('loadings', 'users', 'closeSession', true);

            const end = 'users/close_session/';
            miAxios.get(end)
            .finally(() => {
                u2('login', 'data', 'user', {});
                document.cookie = 'tccm=; max-age=0; path=/';
                u2('modals', 'header', 'showMenu', false);
                u2('loadings', 'users', 'closeSession', false);
            });
        },
        register: () => {
            if (s.loadings?.users?.register) return;
            u2('loadings', 'users', 'register', true);

            const end = 'users/register/';
            const data = s.users?.register?.form || {};

            miAxios.post(end, data)
            .then(response => {
                const message = response.data.message;
                navigate('/users/login');
                general.notificacion({
                    mode: 'success',
                    title: 'Registrado con exito',
                    message: message || "Registrado con exito"
                });
            }).catch(error => {
                const message = error.response.data.message;
                general.notificacion({
                    mode: 'danger',
                    title: 'Error al registrar',
                    message: message || "Error en el registro",
                });
            }).finally(() => {
                u2('loadings', 'users', 'register', false);
            });
        },
        validarCuenta: validacion => {
            if (s.loadings?.users?.validarCuenta) return;
            u2('loadings', 'users', 'validarCuenta', true);

            const url = `users/validar_cuenta/`;
            const data = {
                "id_codigo": validacion
            }

            miAxios.post(url, data)
            .then(response => {
                navigate('/users/login');
                const message = response.data.message;
                general.notificacion({
                    mode: 'success',
                    title: 'Cuenta validada',
                    message: message || "Cuenta validada"
                });
            }).catch(error => {
                const message = error.response.data.message;
                general.notificacion({
                    mode: 'danger',
                    title: 'Error al validar cuenta',
                    message: message || "Error al validar cuenta"
                });
            }).finally(() => {
                u2('loadings', 'users', 'validarCuenta', false);
            });
        }
    }

    const app = {
        helloWorld: () => {
            const end = 'app/hello_world/';
            miAxios.get(end)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    const general = {
        notificacion: props => {
            u1("general", "notification", props);
            u2("modals", "general", "notification", true);
        },
    }

    // u[0-9]
    const u0 = (f0, value) => {
        d(ff.u0({f0, value}));
    }
    const u1 = (f0, f1, value) => {
        d(ff.u1({f0, f1, value}));
    }
    const u2 = (f0, f1, f2, value) => {
        d(ff.u2({f0, f1, f2, value}));
    }
    const u3 = (f0, f1, f2, f3, value) => {
        d(ff.u3({f0, f1, f2, f3, value}));
    }
    const u4 = (f0, f1, f2, f3, f4, value) => {
        d(ff.u4({f0, f1, f2, f3, f4, value}));
    }
    const u5 = (f0, f1, f2, f3, f4, f5, value) => {
        d(ff.u5({f0, f1, f2, f3, f4, f5, value}));
    }
    const u6 = (f0, f1, f2, f3, f4, f5, f6, value) => {
        d(ff.u6({f0, f1, f2, f3, f4, f5, f6, value}));
    }
    const u7 = (f0, f1, f2, f3, f4, f5, f6, f7, value) => {
        d(ff.u7({f0, f1, f2, f3, f4, f5, f6, f7, value}));
    }
    const u8 = (f0, f1, f2, f3, f4, f5, f6, f7, f8, value) => {
        d(ff.u8({f0, f1, f2, f3, f4, f5, f6, f7, f8, value}));
    }
    const u9 = (f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, value) => {
        d(ff.u9({f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, value}));
    }

    return { u0, u1, u2, u3, u4, u5, u6, u7, u8, u9, app, users, general };
}

export { useF };