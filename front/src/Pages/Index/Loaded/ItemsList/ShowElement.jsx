import { useState, useEffect } from "react";
import { useVars } from "./myUse";
import { showDate, showCurrency } from "../../../../Core/helper";
import { Link } from "react-router-dom";

const ShowElement = props => {
    const { element } = props;
    const { styles, imgLink, convertLink } = useVars();
    const { 
        id_compra, 
        fecha_compra, nombre_compra, descripcion_compra, 
        articulos, link, origen,
        images, fecha_limite,
        cantidad_items, 

        total_abonado,
        total_compra,
        
        total_abonado_compra,
        total_compra_compra,

        total_abonado_cargos,
        total_compra_cargos,

        total_abonado_usuario,
        total_usuario,

        total_abonado_usuario_compra,
        total_usuario_compra,
        
        total_usuario_cargos,
        total_abonado_usuario_cargos,

    } = element;
    const [bgUrl, setBgUrl] = useState(images.length > 0 ? `${imgLink}/${images[0]?.compra_id}/preview/${images[0]?.filename}` : '');
    const [actualIndex, setActualIndex] = useState(0);
    const [isHover, setIsHover] = useState(false);

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
                className={`${styles.card}`}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                >
                <div className={`${styles.fecha}`}>
                    {showDate(fecha_compra)}
                </div>
                <Link 
                    className={`${styles.topSection}`}
                    to={`/compras/detalle/${id_compra}`}
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
                </Link>
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
                    <p
                        className={`${styles.title}`}>
                        <Link to={`/compras/detalle/${id_compra}`}
                            >
                            {nombre_compra}
                        </Link>
                    </p>
                    <small
                        className={`${styles.description}`}
                        >
                        {descripcion_compra}
                    </small>


                    {/* ----------------------------   ARTICULOS, FECHA LIMITE, ORIGEN   ---------------------------- */}
                    <div className={`${styles.row} ${styles.row1}`}>
                        {/* --------------------   ARTICULOS   -------------------- */}
                        <div className={`${styles.item}`}>
                            <span className={`${styles.bigText}`}>Articulos</span>
                            <span className={`${styles.regularText}`}>
                                {cantidad_items} ({articulos})
                            </span>
                        </div>
                        {/* --------------------   /ARTICULOS   -------------------- */}
                        {/* --------------------   FECHA LIMITE   -------------------- */}
                        <div className={`${styles.item}`}>
                            <span className={`${styles.bigText}`}>Fecha limite</span>
                            <span className={`${styles.regularText}`}>
                                {showDate(fecha_limite, false)}
                            </span>
                        </div>
                        {/* --------------------   /FECHA LIMITE   -------------------- */}
                        {/* --------------------   ORIGEN   -------------------- */}
                        <div className={`${styles.item}`}>
                            <span className={`${styles.bigText}`}>Origen</span>
                            <span className={`${styles.regularText}`}>
                                {origen}
                            </span>
                        </div>
                        {/* --------------------   /ORIGEN   -------------------- */}
                    </div>
                    {/* ----------------------------   /ARTICULOS, FECHA LIMITE, ORIGEN   ---------------------------- */}

                    <div className={`${styles.aditional_info} ${isHover ? styles.showInfo : styles.hiddeInfo}`}>
                        {/* ----------------------------   USUARIO (TOTAL, COMPRA, CARGOS)   ---------------------------- */}
                        <p className={`${styles.sub_title}`}>Usuario</p>
                        <div className={`${styles.row} ${styles.row1}`}>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.bigText}`}>Total</span>
                                <span className={`${styles.regularText}`}>
                                    {showCurrency(total_abonado_usuario)}/{showCurrency(total_usuario)}
                                </span>
                            </div>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.bigText}`}>Compra</span>
                                <span className={`${styles.regularText}`}>
                                    {showCurrency(total_abonado_usuario_compra)}/{showCurrency(total_usuario_compra)}
                                </span>
                            </div>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.bigText}`}>Cargos</span>
                                <span className={`${styles.regularText}`}>
                                    {showCurrency(total_abonado_usuario_cargos)}/{showCurrency(total_usuario_cargos)}
                                </span>
                            </div>
                        </div>
                        {/* ----------------------------   /USUARIO (TOTAL, COMPRA, CARGOS)   ---------------------------- */}

                        {/* ----------------------------   GENERAL (TOTAL, COMPRA, CARGOS)   ---------------------------- */}
                        <p className={`${styles.sub_title}`}>General</p>
                        <div className={`${styles.row} ${styles.row1}`}>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.bigText}`}>Total</span>
                                <span className={`${styles.regularText}`}>
                                    {showCurrency(total_abonado)}/{showCurrency(total_compra)}
                                </span>
                            </div>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.bigText}`}>Compra</span>
                                <span className={`${styles.regularText}`}>
                                    {showCurrency(total_abonado_compra)}/{showCurrency(total_compra_compra)}
                                </span>
                            </div>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.bigText}`}>Cargos</span>
                                <span className={`${styles.regularText}`}>
                                    {showCurrency(total_abonado_cargos)}/{showCurrency(total_compra_cargos)}
                                </span>
                            </div>
                        </div>
                        {/* ----------------------------   /GENERAL (TOTAL, COMPRA, CARGOS)   ---------------------------- */}
                    </div>

                    {!!link &&
                    <div className={`${styles.row} ${styles.row1}`}>
                        <div className={`${styles.item}`}>
                            <a 
                                href={convertLink(link)}
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