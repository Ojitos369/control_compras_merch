import { useMemo } from "react";
const Generales = props => {
    const { s, f, styles, gs, data } = props;

    const fields = [
        {label: 'Nombre', name: 'nombre_compra', type: 'text'},
        {label: 'Descripcion', name: 'descripcion_compra', type: 'text'},
        {label: 'Link', name: 'link', type: 'text'},
        {label: 'Origen', name: 'origen', type: 'text'},
    ]

    return (
        <div className={`${styles.generales} w-full flex justify-center`}>
            <p>Generales</p>
        </div>
    )
}

export { Generales };