import { useVars } from "./myUse"
const Filtro = props => {
    const { filtroCompras, updateFiltro, comprasSelected, styles } = useVars();
    return (
        <div className={`${styles.headContainer}`}>
            <div className={`${styles.headDiv}`}>
                <input 
                    type="text" 
                    className={`${styles.filterInput} px-5 py-2`}
                    id="filterCompra"
                    value={filtroCompras}
                    placeholder="Filtrar compras..."
                    onChange={e => updateFiltro(e.target.value)}
                    />
                <div className={`${styles.resumeSelected}`}>
                    <p>
                        Total Seleccionados: {comprasSelected.length}
                    </p>
                </div>
            </div>
        </div>
    )
}

export { Filtro };