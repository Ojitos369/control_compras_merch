import { RemoveStash } from "../../../Components/Icons";
import { showCurrency } from "../../../Core/helper";
import { useVars } from "./myUse";

const Articulos = props => {
    const { styles, gs } = props;
    const { items, fields, addNew, upgradeData, removeItem } = useVars(props);

    return (
        <div className={`${styles.items} w-11/12 flex flex-wrap mb-12 justify-around`}>
            <h2 className="w-10/12 mt-8 px-5">Articulos <button data-tooltip-id="global" data-tooltip-content="Add Alt+A" className={`${styles.addButton} `} onClick={addNew}>Add</button></h2>
            <div className="w-full overflow-x-auto mt-4">
                <table className={`${styles.item_table}`}>
                    <thead>
                        <tr>
                            {fields.map((field, i) => (
                                <th key={`header_${i}`}>{field.label}</th>
                            ))}
                            <th>Total</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={`item_${index}`}>
                                {fields.map((field, i) => {
                                    const requerido = (field.required ?? false) && !item[field.name];
                                    return (
                                    <td key={`field_${index}_${i}`}>
                                        <input
                                            type={field.type}
                                            value={item[field.name] ?? ''}
                                            placeholder={field.placeholder || ''}
                                            id={`${field.name}_compra_${index}`}
                                            onChange={e => {
                                                if (field.readOnly) return;
                                                upgradeData(index, field.name, e.target.value)
                                            }}
                                            readOnly={field.readOnly}
                                            className={`${requerido && styles.input_invalid} ${styles.item_input} ${field.readOnly && styles.input_readonly}`}
                                        />
                                    </td>
                                )})}
                                <td>{showCurrency(item.cantidad * item.precio)}</td>
                                <td className="manita" onClick={() => removeItem(index)}>
                                    <span className={`${styles.item_remove}`}>
                                        <RemoveStash />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export { Articulos };