import { useVars } from "./myUse";
import { DeleteButton } from "../../../Components/Buttons";

const Images = props => {
    const { f, styles } = props;
    const { images, actualImage, cambiarImage, clickInput, deleteActualImage } = useVars();

    return (
        <div className={`${styles.images} w-full md:w-1/2 justify-center flex flex-wrap`}>
            <input 
                type="file" 
                name="temp-file" 
                id="temp-file" 
                className="hidden"
                onChange={f.compras.subirFotoForm}
                />
            <div 
                className={`${styles.images_show} manita`}
                id="images_show"
                htmlFor="temp-file"
                onDragOver={f.dd.preventOver}
                onDragLeave={f.dd.preventLeave}
                onDrop={f.compras.subirFotoForm}
                onClick={clickInput}
                >
                {actualImage ?
                <img src={actualImage.url} alt={actualImage.name} className={`${styles.images_show_img}`} /> :
                <p className={`${styles.images_show_dif}`}>
                    <span className="px-8">
                        Arrastre la imagen o de click para seleccionar
                    </span>
                </p>
                }
            </div>
            {images.length > 0 && 
            <div className="w-full flex justify-center">
                <div className="w-2/3 flex justify-between">
                    <button className={`${styles.images_change} w-1/3`} onClick={() => cambiarImage(actualImage.index - 1)}>
                        Anterior
                    </button>
                    <div 
                        className={`${styles.image_delete} w-1/6`} 
                        onClick={deleteActualImage}
                        data-tooltip-id="global" data-tooltip-content="Delete Image"
                        >
                        <DeleteButton />
                    </div>
                    <button className={`${styles.images_change} w-1/3`} onClick={() => cambiarImage(actualImage.index + 1)}>
                        Siguiente
                    </button>
                </div>
            </div>}
        </div>
    )
}

export { Images };