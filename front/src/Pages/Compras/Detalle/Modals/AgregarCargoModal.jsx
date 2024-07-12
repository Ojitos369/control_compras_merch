import { GeneralModal } from "../../../../Components/Modals/GeneralModal";
import { useVars } from "../myUse";

const Component = props => {
    const { styles, usuarios, newCargo, updateNewCargo, guardarCargo, closeModals } = useVars();
    const { total, fecha_limite, tipo, perUser } = newCargo;
    console.log('usuarios', usuarios);

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
                            onChange={e => updateNewCargo('total', e.target.value)}
                        />
                    </div>
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