import { useState, useEffect } from "react";
import { useVars } from "./myUse";
import { showDate, showCurrency } from "../../../../Core/helper";
import { Link } from "react-router-dom";

const ShowElement = props => {
    const { element } = props;

    const { styles, imgLink, convertLink, comprasSelected, toggleSelected } = useVars();
    const { 
        compra_id, total_compra, fecha_compra, 
        nombre_compra, descripcion_compra, origen, 
        detalles, images

    } = element;
    const [bgUrl, setBgUrl] = useState(images.length > 0 ? `${imgLink}/${images[0]?.compra_id}/preview/${images[0]?.filename}` : '');
    const [actualIndex, setActualIndex] = useState(0);
    const selected = comprasSelected.includes(compra_id);

    const updateBgUrl = index => {
        let newIndex = index;
        if (newIndex < 0) {
            newIndex = images.length - 1;
        } else if (newIndex >= images.length) {
            newIndex = 0;
        }
        setActualIndex(newIndex);
        setBgUrl(`${imgLink}/${images[newIndex]?.compra_id}/preview/${images[newIndex]?.filename}`);
    }

    return (
        <div className={`${styles.elementContainer}`}>
            <div 
                className={`${styles.card} ${selected ? styles.selected : ''}`}
                >
                <div className={`${styles.fecha}`}>
                    {showDate(fecha_compra)}
                </div>
                <div 
                    className={`${styles.topSection} manita`}
                    style={{ 
                        backgroundImage: `url(${bgUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                    onClick={() => toggleSelected(compra_id)}
                    >
                    <div className={`${styles.border}`}></div>
                    {images.length > 0 &&
                    <div className={`${styles.imageCount}`}>
                        <span>
                            {actualIndex + 1} / {images.length}
                        </span>
                    </div>}
                </div>
                <div className={`${styles.changeBgControl}`}>
                    <button
                        className={`${styles.changeBgButton}`}
                        onClick={() => updateBgUrl(actualIndex - 1)}
                        >
                        {'<'}
                    </button>
                    <button
                        className={`${styles.changeBgButton}`}
                        onClick={() => updateBgUrl(actualIndex + 1)}
                        >
                        {'>'}
                    </button>
                </div>
                <div className={`${styles.bottomSection}`}>
                    <div
                        className={`${styles.title}`}>
                        <p
                            className="manita"
                            onClick={() => toggleSelected(compra_id)}
                            >
                            {nombre_compra}
                        </p>
                    </div>
                    <small
                        className={`${styles.description}`}
                        >
                        {descripcion_compra}
                    </small>
                </div>
            </div>
        </div>
    )
}

export { ShowElement };