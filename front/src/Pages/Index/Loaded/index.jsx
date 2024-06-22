import { Actions } from './Actions';
import styles from './styles/index.module.scss';

const Loaded = props => {
    return (
        <div className={`flex flex-wrap w-full ${styles.mainLoaded}`}>
            <Actions />
        </div>
    )
}

export { Loaded };