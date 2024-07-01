import { useMemo } from "react";
import { RemoveStash } from "../../../Components/Icons";

const Articulos = props => {
    const { s, f, styles, gs, data } = props;
    // usuario_id, descripcion, precio, cantidad, total
    const fields = useMemo(() => [
        {label: 'Usuario', name: 'usuario', type: 'text',
            default: s.login?.data?.user?.usuario || '',
        },
        {label: 'Descripcion', name: 'descripcion_compra', type: 'text',
            required: true
        },
        {label: 'Cantidad', name: 'cantidad', type: 'text',
            required: true
        },
        {label: 'Precio', name: 'precio', type: 'text',
            required: true
        },
    ], [s.login?.data?.user?.usuario]);

    const items = useMemo(() => {
        const items = data.map(d => {
            const item = {};
            fields.forEach(f => {
                item[f.name] = d[f.name] || (f.default ?? null);
            });
            return item;
        })

        return items;
    }, [data]);

    const addNew = e => {
        if (!!e) e.preventDefault();
        // s.compras?.actualCompra?.form
        let newItem = {}
        fields.forEach(f => {
            newItem[f.name] = (f.default ?? null);
        });

        let newItems = [...data, newItem];
        f.u3('compras', 'actualCompra', 'form', 'items', newItems);
    }

    const upgradeData = (index, key, value) => {
        let newItems = f.cloneO(data);
        newItems[index][key] = value;
        f.u3('compras', 'actualCompra', 'form', 'items', newItems);
    };

    const removeItem = index => {
        let newItems = f.cloneO(data);
        newItems.splice(index, 1);
        f.u3('compras', 'actualCompra', 'form', 'items', newItems);
    };

    return (
        <div className={`${styles.items} w-full flex flex-wrap px-4 justify-center`}>
            <h2 className="w-full my-3 px-5">Articulos <button className="manita" onClick={addNew}>Add</button></h2>
            {items.map((item, index) => {
                return (
                    <div className={`${styles.item_container}`} key={`item_${index}`}>
                        <div className={`${styles.item_form}`}>
                            {fields.map((field, i) => {
                                const value = item[field.name]
                                return (
                                    <div key={`field_${index}_${i}`} className={`${gs.my_input} w-full`}>
                                            <div className={`${gs.input_content}`}>
                                            <label htmlFor={field.name}>{field.label}</label>
                                            <input
                                                type={field.type}
                                                value={value || ''}
                                                placeholder={field.placeholder || ''}
                                                onChange={e => upgradeData(index, field.name, e.target.value)}
                                                />
                                            {(field.required ?? false) && !value && <small className='text-red-500 w-full text-start font-bold'>Campo requerido</small>}
                                        </div>
                                    </div>
                                )
                            })}
                            <button 
                                className={`${styles.item_remove}`}
                                onClick={() => removeItem(index)}>
                                <RemoveStash />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export { Articulos };