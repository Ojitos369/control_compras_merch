const Articulos = props => {
    const { s, f, styles } = props;
    return (
        <div className={`${styles.articulos} w-10/12`}>
            <p>Articulos</p>
        </div>
    )
}

export { Articulos };