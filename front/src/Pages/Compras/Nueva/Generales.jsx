import { useVars } from "./myUse";
const Generales = props => {
    const { styles, gs } = props;
    const { generalFields, upgradeGeneralData } = useVars();

    return (
        <div className={`${styles.generales} w-full md:w-1/2 flex flex-wrap px-4 justify-center`}>
            <h2 className="w-full mt-3">Datos Generales</h2>
            {generalFields.map((item, index) => (
                <div key={index} className={`${gs.my_input} w-full`}>
                    <div className={`${gs.input_content}`}>
                        <label htmlFor={item.name}>{item.label}</label>
                        <input
                            type={item.type}
                            value={item.value || ''}
                            placeholder={item.placeholder || ''}
                            id={item.name}
                            onChange={e => upgradeGeneralData(item.name, e.target.value)}
                            />
                        {(item.required ?? false) && !item.value && <small className='text-red-500 w-full text-start font-bold'>Campo requerido</small>}
                    </div>
                </div>
            ))}
        </div>
    )
}

export { Generales };