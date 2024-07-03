import { useMemo, useState, useEffect } from "react";
const Images = props => {
    const { s, f, styles } = props;
    const images = useMemo(() => s.compras?.actualCompra?.form?.images || [], [s.compras?.actualCompra?.form?.images]);
    const [actualImage, setActualImage] = useState(null);

    const cambiar = newIndex => {
        const index = newIndex < 0 ? images.length - 1 : newIndex >= images.length ? 0 : newIndex;
        setActualImage(images[index]);
    }

    const clickInput = () => {
        const input = document.getElementById('temp-file');
        input.value = '';
        input.click();
    }

    useEffect(() => {
        if (images.length > 0 && !actualImage) {
            cambiar(0)
        }
        else if (!images.length) {
            setActualImage(null);
        }

    }, [images]);

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
            {images.length > 1 && 
            <div className="w-full flex justify-center">
                <div className="w-1/2 flex justify-between">
                    <button className={`${styles.images_change}`} onClick={() => cambiar(actualImage.index - 1)}>
                        Anterior
                    </button>
                    <button className={`${styles.images_change}`} onClick={() => cambiar(actualImage.index + 1)}>
                        Siguiente
                    </button>
                </div>
            </div>}
        </div>
    )
}

export { Images };