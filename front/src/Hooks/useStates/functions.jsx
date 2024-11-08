import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDispatch, useSelector } from "react-redux";
import { f as ff } from "./fs";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);
const project_key = 'tccm';

import { v4 as uuidv4 } from 'uuid';

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
                document.cookie = `${project_key}=${token}; max-age=64800; path=/`;
                u2('login', 'data', 'user', user);
                u2('modals', 'header', 'showMenu', false);
                navigate('/');
                // const message = response.data.message;
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
                    message: message || "Error al iniciar sesion"
                });
                u2('menu', 'login', 'error', message);
            }).finally(() => {
                u2('loadings', 'users', 'login', false);
            });
        },
        validateLogin: () => {
            const end = 'users/validar_sesion/';
            // console.log('validando sesion');
            if (!document.cookie.includes(project_key)) return;

            // console.log('enviando validacion');
            miAxios.get(end)
            .then(response => {
                const user = response.data.usuario;
                u2('login', 'data', 'user', user);
            }).catch(error => {
                // console.log(error);
                users.closeSession();
            })
        },
        closeSession: () => {
            if (s.loadings?.users?.closeSession) return;
            u2('loadings', 'users', 'closeSession', true);

            const end = 'users/close_session/';
            miAxios.get(end)
            .finally(() => {
                u2('login', 'data', 'user', {});
                document.cookie = `${project_key}=; max-age=0; path=/`;
                u2('loadings', 'users', 'closeSession', false);
                u0('modals', null);
                navigate('/users/login');
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
        convertLink: link => {
            if (!link) return '';
            if (link.includes('http')) {
                return link;
            }
            return `https://${link}`;
        },
        getUuid: () => {
            return uuidv4();
        },
        getHostLink: () => {
            const end = 'general/get_host_link/';
            miAxios.get(end)
            .then(response => {
                const host = response.data.host;
                u1('general', 'host', host);
                u1('general', 'imagesLink', `${host}/static/compras`);
            });
        },
        getUsuarios: () => {
            if (s.loadings?.general?.getUsuarios) return;
            u2('loadings', 'general', 'getUsuarios', true);

            const end = 'general/get_usuarios/';
            miAxios.get(end)
            .then(response => {
                const usuarios = response.data.usuarios;
                u1('general', 'usuarios', usuarios);
            }).catch(error => {
                const message = error.response.data.message;
                general.notificacion({
                    mode: 'danger',
                    title: 'Error al obtener usuarios',
                    message: message || "Error al obtener usuarios"
                });
            }).finally(() => {
                u2('loadings', 'general', 'getUsuarios', false);
            });
        },
        tables: {
            validarOrden: modo => {
                return s.tables?.orden?.mode == modo ? (s.tables?.orden?.order == 'asc' ? '⬆️' : '⏬') : '➾'
            }
        },
    }

    const compras = {
        subirFotoForm: e => {
            const temp_file = document.getElementById('temp-file');
            temp_file.files = null;
            const end = 'compras/guardar_imagen/'
            const formData = new FormData();
            const name = s.compras?.actualCompra?.form?.id + '_' + general.getUuid();
            let file;
            if (e.target?.files?.length > 0) {
                file = e.target.files[0];
            } else if (e.dataTransfer?.files?.length > 0) {
                e.preventDefault();
                file = e.dataTransfer.files[0];
            }
            const ext = file.name.split('.').pop();
            formData.append('file', file, `${name}.${ext}`);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
            miAxios.post(end, formData, config).then(response => {
                // console.log(response.data);
                const image = response.data.image;
                if (image) {
                    const images = s.compras?.actualCompra?.form?.images || [];
                    image.index = images.length;
                    u3('compras', 'actualCompra', 'form', 'images', [...images, image]);
                    u2('compras', 'actualCompra', 'actualImage', image);
                }
                
                temp_file.files = null;
            }).catch(err => {
                console.log(err);
            })

            // remove files from temp_file
            temp_file.files = null;
        },
        validarImagenesNoGuardadas: () => {
            const end = 'compras/validar_imagenes_no_guardadas/';
            miAxios.get(end)
        },
        guardarCompra: () => {
            if (s.loadings?.compras?.guardarCompra) return;
            u2('loadings', 'compras', 'guardarCompra', true);

            const end = 'compras/guardar_compra/';
            const data = s.compras?.actualCompra?.form || {};

            miAxios.post(end, data)
            .then(response => {
                const message = response.data.message;
                general.notificacion({
                    mode: 'success',
                    title: 'Guardado con exito',
                    message: message || "Guardado con exito"
                });
                navigate('/');
            }).catch(error => {
                const message = error.response.data.message;
                general.notificacion({
                    mode: 'danger',
                    title: 'Error al guardar',
                    message: message || "Error al guardar"
                });
            }).finally(() => {
                u2('loadings', 'compras', 'guardarCompra', false);
            });
        },
        getMyCompras: () => {
            if (s.loadings?.compras?.getMyCompras) return;
            u2('loadings', 'compras', 'getMyCompras', true);

            const end = 'compras/get_my_compras/';
            miAxios.get(end)
            .then(response => {
                const compras = response.data.compras;
                u1('compras', 'misCompras', compras);
            }).catch(error => {
                const message = error.response.data.message;
                console.log(message);
            }).finally(() => {
                u2('loadings', 'compras', 'getMyCompras', false);
            });
        },
        getCompra: compra_id => {
            if (!!s.loadings?.compras?.getCompra) return;
            u2('loadings', 'compras', 'getCompra', true);

            const end = 'compras/get_compra/?compra_id='+compra_id;
            miAxios(end)
            .then(response => {
                const compra = response.data.compra;
                u2('compras', 'consulta', 'compraData', compra);
            }).catch(err => {
                console.log('err', err)
            }).finally(() => {
                u2('loadings', 'compras', 'getCompra', false);
            });
        },
        guardarCargo: (compra_id, usuarios) => {
            if (s.loadings?.compras?.guardarCargo) return;
            u2('loadings', 'compras', 'guardarCargo', true);

            const end = 'compras/guardar_cargo/';
            const data = {
                compra_id, usuarios,
                ...s.compras?.newCargo?.data || {}
            }

            miAxios.post(end, data)
            .then(response => {
                const message = response.data.message;
                general.notificacion({
                    mode: 'success',
                    title: 'Guardado con exito',
                    message: message || "Guardado con exito"
                });
                u2('modals', 'compras', 'agregarCargo', false);
                u2('compras', 'newCargo', 'data', null);
                compras.getCompra(compra_id);
            }).catch(error => {
                const message = error.response.data.message;
                general.notificacion({
                    mode: 'danger',
                    title: 'Error al guardar',
                    message: message || "Error al guardar"
                });
            }).finally(() => {
                u2('loadings', 'compras', 'guardarCargo', false);
            });
        },
        guardarPago: (compra_id, usuarios) => {
            if (s.loadings?.compras?.guardarPago) return;
            u2('loadings', 'compras', 'guardarPago', true);

            const end = 'compras/guardar_pago/';
            const data = {
                compra_id, usuarios,
                ...s.compras?.newPago?.data || {}
            }

            const inputFile = document.getElementById('comprobante_pago');
            const comprobante = inputFile.files[0];

            const formData = new FormData();
            formData.append('comprobante', comprobante);
            formData.append('data', JSON.stringify(data));

            miAxios.post(end, formData)
            .then(response => {
                const message = response.data.message;
                general.notificacion({
                    mode: 'success',
                    title: 'Guardado con exito',
                    message: message || "Guardado con exito"
                });
                u2('modals', 'compras', 'agregarPago', false);
                u2('compras', 'newPago', 'data', null);
                compras.getCompra(compra_id);
            }).catch(error => {
                const message = error.response.data.message;
                general.notificacion({
                    mode: 'danger',
                    title: 'Error al guardar',
                    message: message || "Error al guardar"
                });
            }).finally(() => {
                u2('loadings', 'compras', 'guardarPago', false);
                inputFile.files = null;
            });
        },
        validarPago: pago => {
            if (s.loadings?.compras?.validarPago) return;
            u2('loadings', 'compras', 'validarPago', true);

            const end = 'compras/validar_pago/';

            miAxios.post(end, pago)
            .then(response => {
                const message = response.data.message;
                general.notificacion({
                    mode: 'success',
                    title: 'Validado con exito',
                    message: message || "Validado con exito"
                });
                compras.getCompra(pago.compra_id);
            }).catch(error => {
                const message = error.response.data.message;
                general.notificacion({
                    mode: 'danger',
                    title: 'Error al validar',
                    message: message || "Error al validar"
                });
            }).finally(() => {
                u2('loadings', 'compras', 'validarPago', false);
            });
        },
        eliminarImagen: (id_image, setActualImage) => {
            if (s.loadings?.compras?.eliminarImagen) return;
            u2('loadings', 'compras', 'eliminarImagen', true);
            const url = 'compras/eliminar_imagen/';

            miAxios.post(url, {id_image})
            .then(response => {
                const message = response.data.message;
                const images = s.compras?.actualCompra?.form?.images || [];
                const newImages = images.filter(image => image.id_image != id_image);
                u3('compras', 'actualCompra', 'form', 'images', newImages);
                if (setActualImage) {
                    setActualImage(newImages?.[0] || null);
                }
            }).catch(error => {
                const message = error.response.data.message;
            }).finally(() => {
                u2('loadings', 'compras', 'eliminarImagen', false);
            });
        },
        eliminarCompra: compra_id => {
            MySwal.fire({
                title: 'Eliminar compra',
                text: '¿Estas seguro de eliminar esta compra?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'Cancelar',
            }).then(result => {
                if (result.isConfirmed) {
                    if (s.loadings?.compras?.eliminarCompra) return;
                    u2('loadings', 'compras', 'eliminarCompra', true);
                    const end = 'compras/eliminar_compra/';

                    miAxios.post(end, {compra_id})
                    .then(response => {
                        const message = response.data.message;
                        general.notificacion({
                            mode: 'success',
                            title: 'Eliminado con exito',
                            message: message || "Eliminado con exito"
                        });
                        navigate('/');
                    }).catch(error => {
                        const message = error.response.data.message;
                        general.notificacion({
                            mode: 'danger',
                            title: 'Error al eliminar',
                            message: message || "Error al eliminar"
                        });
                    }).finally(() => {
                        u2('loadings', 'compras', 'eliminarCompra', false);
                    });
                }
            });
        }
    }

    const dd = {
        removeDragData: e => {
            if (e.dataTransfer.items) {
                e.dataTransfer.items.clear();
            } else {
                e.dataTransfer.clearData();
            }
        },
        preventOver: (e) => {
            e.preventDefault();
        },
        preventLeave: e => {
            e.preventDefault();
        }
    }

    const cloneO = obj => {
        return JSON.parse(JSON.stringify(obj))
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

    return { u0, u1, u2, u3, u4, u5, u6, u7, u8, u9, app, users, general, compras, dd, cloneO };
}

export { useF };