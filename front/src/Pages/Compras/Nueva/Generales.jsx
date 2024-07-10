import { useMemo } from "react";
const Generales = props => {
    const { s, f, styles, gs, data } = props;
    // total, origen, link, status_compra, pagado, nombre_compra, descripcion_compra
    const fields = useMemo(() => [
        {label: 'Nombre', name: 'nombre_compra', type: 'text', value: data.nombre_compra,
            required: true
        },
        {label: 'Descripcion', name: 'descripcion_compra', type: 'text', value: data.descripcion_compra},
        {label: 'Link', name: 'link', type: 'text', value: data.link,
            placeholder: 'fb.com/..., jp.mercari.com/...'
        },
        {label: 'Origen', name: 'origen', type: 'text', value: data.origen,
            placeholder: 'Kyototo, Shyshy, Infieles, ...'
        },
        {label: 'Fecha Limite', name: 'fecha_limite', type: 'date', value: data.fecha_limite
        },
    ], [data])

    const upgradeData = (key, value) => {
        // s.compras?.actualCompra?.form
        f.u3('compras', 'actualCompra', 'form', key, value);
    }

    return (
        <div className={`${styles.generales} w-full md:w-1/2 flex flex-wrap px-4 justify-center`}>
            <h2 className="w-full mt-3">Datos Generales</h2>
            {fields.map((item, index) => (
                <div key={index} className={`${gs.my_input} w-full`}>
                    <div className={`${gs.input_content}`}>
                        <label htmlFor={item.name}>{item.label}</label>
                        <input
                            type={item.type}
                            value={item.value || ''}
                            placeholder={item.placeholder || ''}
                            id={item.name}
                            onChange={e => upgradeData(item.name, e.target.value)}
                            />
                        {(item.required ?? false) && !item.value && <small className='text-red-500 w-full text-start font-bold'>Campo requerido</small>}
                    </div>
                </div>
            ))}
        </div>
    )
}

export { Generales };