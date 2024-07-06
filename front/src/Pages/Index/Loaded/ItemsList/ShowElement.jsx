const ShowElement = props => {
    const { styles, element } = props;
    return (
        <div className={`${styles.elementContainer}`}>
            <div className={`${styles.element}`}>
                {element.nombre_compra}
            </div>
        </div>
    )
}

export { ShowElement };