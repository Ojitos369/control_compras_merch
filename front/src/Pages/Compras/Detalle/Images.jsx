import { useVars } from "./myUse";

const Images = props => {
    const { styles, actualImage, indexImage, lenImages, chageImageSelected } = useVars();
    if (!lenImages) return null;
    return (
        <div className={`${styles.imagesContainer}`}>
            <div 
                className={`${styles.imageDiv}`}
                style={{
                    backgroundImage: `url(${actualImage.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
                >
                <div className={`${styles.imagesCounter}`}>
                    <p className={`${styles.counter}`}>
                        {`${indexImage + 1}/${lenImages}`}
                    </p>
                </div>
            </div>
            <div className={`${styles.imagesButtonsContainer}`}>
                <div className={`${styles.buttons}`}>
                    <button 
                        className={`${styles.imageButton} ${styles.imageButtonLeft}`}
                        onClick={() => chageImageSelected(indexImage - 1)}
                    >
                        {'<'}
                    </button>
                    <button 
                        className={`${styles.imageButton} ${styles.imageButtonRight}`}
                        onClick={() => chageImageSelected(indexImage + 1)}
                    >
                        {'>'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export { Images };