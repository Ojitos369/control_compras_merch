import { useVars } from "./myUse";
const DetalView = props => {
    const { styles, detailView, toogleDetailView } = useVars();
    return (
        <div className={`${styles.detailViewContainer}`}>
            <button 
                className={`${styles.detailViewButton} ${detailView === 'compra' ? styles.detailViewButtonActive : ''}`}
                onClick={() => toogleDetailView('compra')}
            >
                Articulos
            </button>
            <button 
                className={`${styles.detailViewButton} ${detailView === 'cargos' ? styles.detailViewButtonActive : ''}`}
                onClick={() => toogleDetailView('cargos')}
            >
                Cargos
            </button>
            <button 
                className={`${styles.detailViewButton} ${detailView === 'pagos' ? styles.detailViewButtonActive : ''}`}
                onClick={() => toogleDetailView('pagos')}
            >
                Pagos
            </button>
        </div>
    )
}

export { DetalView };