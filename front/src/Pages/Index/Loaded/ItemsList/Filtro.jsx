import { useVars } from "./myUse"
const Filtro = props => {
    const { filtroCompras, updateFiltro, styles } = useVars();
    return (
        <div className={`${styles.filterContainer}`}>
            <div className={`${styles.filterdiv}`}>
                <input 
                    type="text" 
                    className={`${styles.filterInput} px-5 py-2`}
                    id="filterCompra"
                    value={filtroCompras}
                    placeholder="Filtrar compras..."
                    onChange={e => updateFiltro(e.target.value)}
                    />
            </div>
        </div>
    )
}

export { Filtro };