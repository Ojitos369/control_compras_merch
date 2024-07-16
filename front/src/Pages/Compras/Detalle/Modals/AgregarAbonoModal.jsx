import { useEffect } from "react";
import { GeneralModal } from "../../../../Components/Modals/GeneralModal";
import { useStates } from "../../../../Hooks/useStates";
import { useVars } from "../myUse";
import { showCurrency } from "../../../../Core/helper";
import { TwiceLogo } from "../../../../Components/Loaders/TwiceLogo";

const Component = props => {
    const { f } = useStates();
    const { styles, usuarios, newAbono, upgradePerUserAbono, updateNewAbono, guardarAbono, closeModals, totalNewAbonoFinal } = useVars();
    const { total=0, tipo='', perUser={} } = newAbono;

    useEffect(() => {
        f.u2('compras', 'newAbono', 'data', null);
    }, []);
    return (
        <div className={`${styles.agregarAbonoModal}`}>
            <h3 className={`${styles.acTitle}`}>
                Agregar Abono
            </h3>
            <form
                className={`${styles.acForm}`}
                onSubmit={guardarAbono}
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
                            onChange={e => updateNewAbono('total', e.target.value)}
                        />
                    </div>
                </div>
                <div className={`${styles.acFormRow}`}>
                    <div className={`${styles.acInputElement}`}>
                        <label className={`${styles.acLabel}`}>
                            Tipo de Abono
                        </label>
                        <input 
                            className={`${styles.acInput}`}
                            type="text"
                            value={tipo}
                            placeholder="EMS, Envio, etc."
                            onChange={e => updateNewAbono('tipo', e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full"></div>

                {usuarios.map((usuario, index) => {
                    const cantidad = (total || perUser[usuario.compra_det_id]) ? (perUser[usuario.compra_det_id] ?? Number(usuario.porcentaje * total / 100).toFixed(2)) : 0;
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
                                    onChange={e => upgradePerUserAbono(usuario.compra_det_id, e.target.value)}
                                />
                            </div>
                        </div>
                    )
                })}
                <div className={`${styles.resumeDiv}`}>
                    Total Real: {showCurrency(totalNewAbonoFinal)}
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

const AgregarAbonoModal = props => {
    const { guardandoAbono } = useVars();
    return (
        <GeneralModal
            Component={!guardandoAbono ? Component : Loading}
            lvl1="compras"
            lvl2="agregarAbono"
            cw={"90"}
            {...props}
        />
    )
}

export { AgregarAbonoModal }