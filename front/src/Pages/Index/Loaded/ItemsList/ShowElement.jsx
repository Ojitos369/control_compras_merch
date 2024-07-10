import { useState, useEffect } from "react";
import { useVars } from "./myUse";
import { showDate, showCurrency } from "../../../../Core/helper";
import { Link } from "react-router-dom";

const ShowElement = props => {
    const { element } = props;
    const { styles, imgLink } = useVars();
    const { 
        id_compra, 
        articulos, descripcion_compra, fecha_compra, link, nombre_compra, origen,
        cantidad_items, 
        images, total_deuda, total_abonado, total: total_compra, fecha_limite
    } = element;
    const [bgUrl, setBgUrl] = useState(images.length > 0 ? `${imgLink}/${images[0]?.compra_id}/preview/${images[0]?.filename}` : '');
    const [actualIndex, setActualIndex] = useState(0);

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
            <div className={`${styles.card}`}>
                <div className={`${styles.fecha}`}>
                    {showDate(fecha_compra)}
                </div>
                <div 
                    className={`${styles.topSection}`}
                    style={{ 
                        backgroundImage: `url(${bgUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
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
                    <Link 
                        className={`${styles.title}`}
                        to={`/compras/detalle/${id_compra}`}
                        >
                        {nombre_compra}
                    </Link>
                    <small
                        className={`${styles.description}`}
                        >
                        {descripcion_compra}
                    </small>
                    <div className={`${styles.row} ${styles.row1}`}>
                        <div className={`${styles.item}`}>
                            <span className={`${styles.bigText}`}>Articulos</span>
                            <span className={`${styles.regularText}`}>
                                {cantidad_items} ({articulos})
                            </span>
                        </div>
                        <div className={`${styles.item}`}>
                            <span className={`${styles.bigText}`}>Abonado</span>
                            <span className={`${styles.regularText}`}>
                                {showCurrency(total_abonado)}
                            </span>
                        </div>
                        <div className={`${styles.item}`}>
                            <span className={`${styles.bigText}`}>
                                Total
                            </span>
                            <span className={`${styles.regularText}`}>
                                {showCurrency(total_deuda)}
                            </span>
                        </div>
                    </div>
                    <div className={`${styles.row} ${styles.row1}`}>
                        <div className={`${styles.item}`}>
                            <span className={`${styles.bigText}`}>Total Venta</span>
                            <span className={`${styles.regularText}`}>
                                {showCurrency(total_compra)}
                            </span>
                        </div>
                        <div className={`${styles.item}`}>
                            <span className={`${styles.bigText}`}>Fecha limite</span>
                            <span className={`${styles.regularText}`}>
                                {showDate(fecha_limite, false)}
                            </span>
                        </div>
                        <div className={`${styles.item}`}>
                            <span className={`${styles.bigText}`}>Origen</span>
                            <span className={`${styles.regularText}`}>
                                {origen}
                            </span>
                        </div>
                    </div>
                    {!!link &&
                    <div className={`${styles.row} ${styles.row1}`}>
                        <div className={`${styles.item}`}>
                            <a 
                                href={link}
                                target="_blank"
                                className={`${styles.bigText}`}>Ir a la publicacion</a>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export { ShowElement };