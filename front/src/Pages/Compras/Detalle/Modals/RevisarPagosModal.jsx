import { useEffect } from "react";
import { GeneralModal } from "../../../../Components/Modals/GeneralModal";
import { useStates } from "../../../../Hooks/useStates";
import { useVars } from "../myUse";
import { showCurrency, showDate } from "../../../../Core/helper";
import { TwiceLogo } from "../../../../Components/Loaders/TwiceLogo";

const Component = props => {
    const { f } = useStates();
    const { styles, pagoView, changePagoView, validarPago, 
        pagoListView, ordenar, validarOrdenTable, compra_id, imgLink } = useVars();

    const order = mode => {
        ordenar(mode, [...pagoListView], 'pagos');
    }

    useEffect(() => {
        f.u2('compras', 'newPago', 'data', null);
    }, []);
    return (
        <div className={`${styles.pagosContainer}`}>
            <div className={`${styles.pagoViewContainer}`}>
                <button 
                    className={`${styles.pagoViewButton} ${pagoView === 'todo' ? styles.pagoViewButtonActive : ''}`}
                    onClick={() => changePagoView('todo')}
                >
                    Todo
                </button>
                <button 
                    className={`${styles.pagoViewButton} ${pagoView === 'extra' ? styles.pagoViewButtonActive : ''}`}
                    onClick={() => changePagoView('extra')}
                >
                    Extra
                </button>
                <button 
                    className={`${styles.pagoViewButton} ${pagoView === 'compra' ? styles.pagoViewButtonActive : ''}`}
                    onClick={() => changePagoView('compra')}
                >
                    Compra
                </button>
            </div>

            <div className={`${styles.tableContainer}`}>
                <div className={`${styles.tableDiv}`}>
                    <table className={`${styles.table} table table-auto`}>
                        <thead>
                            <tr>
                            <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('usuario');
                                        }}>
                                        Usuario {validarOrdenTable('usuario')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('tipo');
                                        }}>
                                        Tipo {validarOrdenTable('tipo')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('fecha_pago');
                                        }}>
                                        Fecha {validarOrdenTable('fecha_pago')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('cantidad');
                                        }}>
                                        Cantidad {validarOrdenTable('cantidad')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    <button className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'
                                        onClick={() => {
                                            order('comprobante');
                                        }}>
                                        Comprobante {validarOrdenTable('comprobante')}
                                    </button>
                                </th>
                                <th className='text-start table-header' scope="col">
                                    Validar Pago
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pagoListView.map((ele, i) => {
                                return (<ShowElement
                                    key={i}
                                    ele={ele}
                                    index={i}
                                    styles={styles}
                                    compra_id={compra_id}
                                    imgLink={imgLink}
                                    validarPago={validarPago}
                                />)
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

const ShowElement = props => {
    const { ele, index, styles, compra_id, imgLink, validarPago } = props;
    const par = index % 2 === 0;
    const { cantidad, tipo, fecha_pago, usuario, validado, comprobante, id_pago } = ele;
    const link = comprobante ? `${imgLink}/${compra_id}/comprobantes/${comprobante}` : '';
    if (validado) return null;
    return (
        <tr className={`${styles[par ? 'par' : 'impar']}`}>
            <td>
                { usuario }
            </td>
            <td>
                { tipo }
            </td>
            <td>
                { showDate(fecha_pago) }
            </td>
            <td>
                { showCurrency(cantidad) }
            </td>
            <td>
                { comprobante ? 
                <a href={link} target='_blank' className={`${styles.comprobante}`}>
                    Ver {comprobante}
                </a> : 
                'Sin Comprobante' 
                }
            </td>
            <td>
                <button 
                    onClick={() => validarPago(ele)}
                    className='w-full m-0 bg-[#788] px-3 py-1 rounded-lg whitespace-nowrap'>
                    Validar
                </button>
            </td>
        </tr>
    )
}

const Loading = () => {
    return (
        <div className="w-full flex justify-center items-center">
            <TwiceLogo />
        </div>
    )
}

const RevisarPagosModal = props => {
    const { guardandoPago } = useVars();
    return (
        <GeneralModal
            Component={!guardandoPago ? Component : Loading}
            lvl1="compras"
            lvl2="revisarPagos"
            cw={"90"}
            {...props}
        />
    )
}

export { RevisarPagosModal }