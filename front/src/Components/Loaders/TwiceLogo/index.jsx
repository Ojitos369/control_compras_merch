import twice_logo from '../../../static/img/twice_logo.gif';

const TwiceLogo = props => {
    const { styles, className } = props;
    return (
        <img
            src={twice_logo}
            alt='Twice Logo'
            className={className || 'w-1/2 md:w-1/4'}
            styles={styles || {}}
        />
    )
}

export { TwiceLogo };