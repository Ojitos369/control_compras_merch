import { useVars, useMyEffects } from './myUse';

const Form = props => {
    const { styles, formGasto, updateForm, camposForm } = useVars();
    useMyEffects();

    return (
        <div className={`${styles.formContainer}`}>
            <div
                className={`${styles.form}`}>
                {camposForm.map((campo, index) => {
                    const { key, label, type } = campo;
                    return (
                        <div key={index} className={`${styles.inputContainer}`}>
                            <label>{label}</label>
                            <input
                                type={type}
                                value={formGasto[key] || ''}
                                onChange={e => updateForm(key, e.target.value)}
                                />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export { Form };