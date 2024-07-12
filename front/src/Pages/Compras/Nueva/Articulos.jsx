import { RemoveStash } from "../../../Components/Icons";
import { showCurrency } from "../../../Core/helper";
import { useVars } from "./myUse";

const Articulos = props => {
    const { styles, gs } = props;
    const { items, fields, addNew, upgradeData, removeItem } = useVars(props);

    return (
        <div className={`${styles.items} w-full flex flex-wrap mb-12 justify-around`}>
            <h2 className="w-10/12 mt-8 px-5">Articulos <button data-tooltip-id="global" data-tooltip-content="Add Alt+A" className={`${styles.addButton} `} onClick={addNew}>Add</button></h2>
            {items.map((item, index) => {
                return (
                    <div className={`${styles.item_container}`} key={`item_${index}`}>
                        <button 
                            className={`${styles.item_remove}`}
                            >
                            <RemoveStash 
                                onClick={() => removeItem(index)}
                            />
                        </button>
                        <div className={`${styles.item_form}`}>
                            <p className="w-full text-center mb-0 mt-2 text-xl font-bold">
                                Total: {showCurrency(item.cantidad * item.precio)}
                            </p>
                            {fields.map((field, i) => {
                                const value = item[field.name]
                                return (
                                    <div key={`field_${index}_${i}`} className={`${gs.my_input} w-full mt-0 mb-3`}>
                                            <div className={`${gs.input_content}`}>
                                            <label htmlFor={field.name}>{field.label}</label>
                                            <input
                                                type={field.type}
                                                value={value || ''}
                                                placeholder={field.placeholder || ''}
                                                id={`${field.name}_${index}`}
                                                onChange={e => upgradeData(index, field.name, e.target.value)}
                                                />
                                            {(field.required ?? false) && !value && <small className='text-red-500 w-full text-start font-bold'>Campo requerido</small>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export { Articulos };