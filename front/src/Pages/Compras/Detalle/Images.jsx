import { useVars } from "./myUse";

const Images = props => {
    const { styles } = useVars();
    return (
        <div className={`${styles.imagesContainer}`}>
            Images
        </div>
    )
}

export { Images };