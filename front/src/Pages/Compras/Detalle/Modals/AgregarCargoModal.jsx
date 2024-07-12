import { useEffect } from "react";
import { GeneralModal } from "../../../../Components/Modals/GeneralModal";
import { useStates } from "../../../../Hooks/useStates";
import { useVars } from "../myUse";

const Component = props => {
    const { f } = useStates();
    const { styles, usuarios, newCargo, upgradePerUserCargo, updateNewCargo, guardarCargo, closeModals } = useVars();
    const { total=0, fecha_limite='', tipo='', perUser={} } = newCargo;
    // console.log('usuarios', usuarios);

    useEffect(() => {
        f.u2('compras', 'newCargo', 'data', null);
    }, []);
    return (
        <div className={`${styles.agregarCargoModal}`}>
            <h3 className={`${styles.acTitle}`}>
                Agregar Cargo
            </h3>
            <form
                className={`${styles.acForm}`}
                onSubmit={guardarCargo}
            >
                <div className={`${styles.acFormRow}`}>
                    <div className={`${styles.acInputElement}`}>
                        <label className={`${styles.acLabel}`}>
                            Total
                        </label>
                        <input 
                            className={`${styles.acInput}`}
                            type="number"
                            value={total}
                            onChange={e => updateNewCargo('total', e.target.value)}
                        />
                    </div>
                </div>
                <div className={`${styles.acFormRow}`}>
                    <div className={`${styles.acInputElement}`}>
                        <label className={`${styles.acLabel}`}>
                            Fecha Limite
                        </label>
                        <input 
                            className={`${styles.acInput}`}
                            type="date"
                            value={fecha_limite}
                            onChange={e => updateNewCargo('fecha_limite', e.target.value)}
                        />
                    </div>
                </div>
                <div className={`${styles.acFormRow}`}>
                    <div className={`${styles.acInputElement}`}>
                        <label className={`${styles.acLabel}`}>
                            Tipo de Cargo
                        </label>
                        <input 
                            className={`${styles.acInput}`}
                            type="text"
                            value={tipo}
                            placeholder="EMS, Envio, etc."
                            onChange={e => updateNewCargo('tipo', e.target.value)}
                        />
                    </div>
                </div>

                {usuarios.map((usuario, index) => {
                    const cantidad = total ? (perUser[usuario.compra_det_id] ?? Number(usuario.porcentaje * total / 100).toFixed(2)) : 0;
                    const user = usuario.usuario;
                    return (
                        <div className={`${styles.acFormRow}`} key={`perUser_${index}`}>
                            <div className={`${styles.acInputElement}`}>
                                <label className={`${styles.acLabel}`}>
                                    {user} ({usuario.descripcion})
                                </label>
                                <input 
                                    className={`${styles.acInput}`}
                                    type="number"
                                    value={cantidad}
                                    onChange={e => upgradePerUserCargo(usuario.id_usuario, e.target.value)}
                                />
                            </div>
                        </div>
                    )
                })}

                <div className={`${styles.acFormActions}`}>
                    <span 
                        className={`${styles.acButton} ${styles.acButtonCancel}`}
                        onClick={closeModals}
                        >
                        Cancelar
                    </span>
                    <button 
                        className={`${styles.acButton} ${styles.acButtonSave}`}
                        type="submit"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
};

const AgregarCargoModal = props => {
    return (
        <GeneralModal
            Component={Component}
            lvl1="compras"
            lvl2="agregarCargo"
            cw={"90"}
            {...props}
        />
    )
}

export { AgregarCargoModal }