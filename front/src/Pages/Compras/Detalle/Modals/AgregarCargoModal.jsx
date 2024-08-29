import { useEffect } from "react";
import { GeneralModal } from "../../../../Components/Modals/GeneralModal";
import { useStates } from "../../../../Hooks/useStates";
import { useVars } from "../myUse";
import { showCurrency, justNumbers } from "../../../../Core/helper";
import { TwiceLogo } from "../../../../Components/Loaders/TwiceLogo";

const Component = props => {
    const { f } = useStates();
    const { styles, usuarios, newCargo, upgradePerUserCargo, updateNewCargo, guardarCargo, closeModals, totalNewCargoFinal } = useVars();
    const { total=0, fecha_limite='', tipo='', perUser={} } = newCargo;

    useEffect(() => {
        f.u2('compras', 'newCargo', 'data', {tipo: 'compra'});
        const ele = document.getElementById('total_cargo');
        ele.focus();
        ele.select();
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
                            type="text"
                            value={total}
                            id="total_cargo"
                            onChange={e => updateNewCargo('total', justNumbers(e.target.value))}
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
                <div className="w-full"></div>

                <hr 
                    style={{
                        margin: '30px 0',
                        border: '2px solid var(--my-minor)',
                        width: '100%',
                    }}
                />

                {usuarios.map((usuario, index) => {
                    const cantidad = (total || perUser[usuario.compra_det_id]) ? (perUser[usuario.compra_det_id] ?? Number(usuario.porcentaje * total / 100)) : 0;
                    const user = usuario.usuario;
                    return (
                        <div className={`${styles.acFormRow}`} key={`perUser_${index}`}>
                            <div className={`${styles.acInputElement}`}>
                                <label className={`${styles.acLabel}`}>
                                    {user} ({usuario.descripcion})
                                </label>
                                <input 
                                    className={`${styles.acInput}`}
                                    type="text"
                                    value={cantidad}
                                    onChange={e => upgradePerUserCargo(usuario.compra_det_id, justNumbers(e.target.value))}
                                />
                            </div>
                        </div>
                    )
                })}

                <div className={`${styles.resumeDiv} w-full text-center`}>
                    Total Real: {showCurrency(totalNewCargoFinal)}
                </div>

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

const Loading = () => {
    return (
        <div className="w-full flex justify-center items-center">
            <TwiceLogo />
        </div>
    )
}

const AgregarCargoModal = props => {
    const { guardandoCargo } = useVars();
    return (
        <GeneralModal
            Component={!guardandoCargo ? Component : Loading}
            lvl1="compras"
            lvl2="agregarCargo"
            cw={"90"}
            {...props}
        />
    )
}

export { AgregarCargoModal }