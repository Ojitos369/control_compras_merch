import { useEffect } from 'react';
import simple from './styles/simple.module.scss';
import dobles from './styles/dobles.module.scss';
import animated from './styles/animated.module.scss';

// -----------------------------------   BASES   ----------------------------------- //
const GeneralSimple = props => {
    const { name, d } = props;
    const icon = props.icon || '';
    const primary = props.primary || props.class1 || '';
    const fillPrimary = props.fillPrimary || props.fill1 || '';
    const className = props.className || `icon ${icon || simple[`${name}`]}` || '';
    const classPrimary = props.classPrimary || primary || (!fillPrimary && simple[`primary`]) || '';
    const style = props.style || {};
    const stylePrimary = props.stylePrimary || props.style1 || {};

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={className}
            style={style}
            viewBox="0 0 576 512">
            <path 
                className={classPrimary}
                fill={fillPrimary}
                style={stylePrimary}
                d={d}
                />
        </svg>
    )
}
const GeneralDoble = props => {
    const { name, d1, d2 } = props;
    
    const icon = props.icon || '';
    const primary = props.primary || props.class1 || '';
    const secondary = props.secondary || props.class2 || '';
    const fillPrimary = props.fillPrimary || props.fill1 || '';
    const fillSecondary = props.fillSecondary || props.fill2 || '';
    const className = props.className || `icon ${icon || dobles[`${name}`]}` || '';
    const classPrimary = props.classPrimary || primary || (!fillPrimary && dobles[`primary`]) || '';
    const classSecondary = props.classSecondary || secondary || (!fillSecondary && dobles[`secondary`]) || '';
    const style = props.style || {};
    const stylePrimary = props.stylePrimary || props.style1 || {};
    const styleSecondary = props.styleSecondary || props.style2 || {};

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={className}
            style={style}
            viewBox="0 0 576 512">
            <path 
                className={classPrimary}
                fill={fillPrimary}
                style={stylePrimary}
                d={d1}
                />
            <path 
                className={classSecondary}
                fill={fillSecondary}
                style={styleSecondary}
                d={d2}
                />
        </svg>
    )
}


// -----------------------------------   ANIMATED   ----------------------------------- //
const AnimateEdit = props => {
    const text = props.text || 'Editar';

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--animate-edit-text', `'${text}'`);

    }, [text]);
    return (
        <button 
            className={`${animated.animate_icon} ${animated.edit_button}`}
            >
            <svg 
                className={`${animated.animate_svgIcon}`}
                viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
            </svg>
        </button>
    )
}
const AnimateRemove = props => {
    const text = props.text || 'Eliminar';

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--animate-remove-text', `'${text}'`);
    }, [text]);
    return (
        <button 
            className={`${animated.animate_icon} ${animated.remove_button}`}
            >
            <svg 
                className={`${animated.animate_svgIcon}`}
                viewBox="0 0 512 512">
                <path d="M163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3C140.6 6.8 151.7 0 163.8 0zM32 128H416L394.8 467c-1.6 25.3-22.6 45-47.9 45H101.1c-25.3 0-46.3-19.7-47.9-45L32 128zM143 239c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
            </svg>
        </button>
    )
}

// -----------------------------------   UNIQUES   ----------------------------------- //
const CcmLogo = props => {
    const stroke = props.stroke || '#000000';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            xlink="http://www.w3.org/1999/xlink"
            krita="http://krita.org/namespaces/svg/krita"
            sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
            width="245.76pt"
            height="245.76pt"
            viewBox="0 0 245.76 245.76">
            <path id="shape0" transform="translate(19.9774573094849, 62.0910827919216)" fill="none" stroke={stroke} strokeWidth="9.5999904" strokeLinecap="square" strokeLinejoin="bevel" d="M54.0234 3.92195C19.9221 -19.0947 -26.1784 65.6604 18.4397 90.2999C49.7959 107.616 90.6617 103.411 124.88 101.857C136.486 101.329 148.066 100.79 159.66 100.026C165.479 99.6422 182.42 96.2919 177.102 98.6847" nodetypes="ccccc"/>
            <path id="shape1" transform="translate(52.4061863957115, 84.1833780393964)" fill="none" stroke={stroke} strokeWidth="9.5999904" strokeLinecap="square" strokeLinejoin="bevel" d="M25.534 3.0189C0.850915 -13.6409 -16.2836 43.856 24.4455 48.8259C25.987 49.014 39.9204 48.0714 39.1403 47.0184" nodetypes="ccc"/>
            <path id="shape2" transform="translate(82.5533858267711, 85.5790993215724)" fill="none" stroke={stroke} strokeWidth="9.5999904" strokeLinecap="square" strokeLinejoin="bevel" d="M0 25.8561C5.5679 15.8347 27.8626 -15.2249 40.0414 9.08665C52.7987 34.553 30.8928 52.1189 30.8928 75.4415C30.8928 75.8713 30.4053 78.2992 30.8409 77.3191" nodetypes="cccc"/>
            <path id="shape3" transform="translate(123.625296657724, 77.7929432469583)" fill="none" stroke={stroke} strokeWidth="9.5999904" strokeLinecap="square" strokeLinejoin="bevel" d="M0.161655 16.7795C-1.30703 10.8318 7.60334 5.76751 11.8501 3.80007C64.9673 -20.808 29.1139 82.1352 28.5146 82.5397" nodetypes="ccc"/>
            <path id="shape4" transform="translate(163.776512935882, 79.5844264480792)" fill="none" stroke={stroke} strokeWidth="9.5999904" strokeLinecap="square" strokeLinejoin="bevel" d="M0 9.18052C8.83574 1.22895 27.0425 -5.81293 36.5685 7.268C48.2484 23.3064 32.6979 47.1136 31.3852 64.0953C31.1259 67.4495 34.9425 78.9461 33.303 81.1913" nodetypes="cccc"/>
            <path id="shape5" transform="translate(57.1653472233885, 164.927294541091)" fill="none" stroke={stroke} strokeWidth="9.5999904" strokeLinecap="square" strokeLinejoin="bevel" d="M14.9954 0C6.16934 3.97144 1.2282 10.3273 0.196947 20.4896C-4.34861 65.2827 71.6011 43.7825 41.0158 2.4956" nodetypes="ccc"/>
            <path id="shape6" transform="translate(157.113841598665, 160.775740851828)" fill="none" stroke={stroke} strokeWidth="9.5999904" strokeLinecap="square" strokeLinejoin="bevel" d="M1.53939 2.06433C0.326444 0.972765 -0.0991571 14.0878 0.0189368 14.6745C2.46407 26.821 7.39862 35.477 20.9078 35.0124C36.9762 34.4598 47.0702 17.7554 41.3994 3.2305C40.5954 1.17115 38.5338 0.500593 39.9657 0" nodetypes="ccccc"/>
        </svg>
    )
}

const BuyCart = props => {
    return (
        <svg enableBackground="new 0 0 128 128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
            <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="53.999" x2="53.999" y1="26.361" y2="97.572">
                <stop offset="0" stopColor="#ffa726"/>
                <stop offset="1" stopColor="#fb8c00"/>
            </linearGradient>
            <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="59.958" x2="59.958" y1="-11.408" y2="129.05">
                <stop offset="0" stopColor="#90a4ae"/>
                <stop offset="1" stopColor="#607d8b"/>
            </linearGradient>
            <path d="m8 27.98c-2.21 0-4 1.79-4 4v4c0 1.88 1.31 3.45 3.06 3.88.3.07.62.12.94.12h4.01c0 .28 9.49 48.85 9.49 48.85.36 1.84 1.85 3.16 3.58 3.16h62.98l10.2-52.01h4.47v-.12l1.26-3.88v-8z" fill="url(#a)"/>
            <g fill="#f57c00">
                <path d="m4 35.98c0 1.88 1.31 3.45 3.06 3.88h95.68l1.26-3.88z"/>
                <path d="m20.54 48.42 7.11 32.01c.2.92 1.01 1.57 1.95 1.57h4.4c1.1 0 2-.9 2-2v-32.01c0-1.1-.9-2-2-2h-11.51c-1.28 0-2.23 1.18-1.95 2.43z"/>
                <path d="m83.46 48.42-7.11 32.01c-.2.92-1.01 1.57-1.95 1.57h-4.4c-1.1 0-2-.9-2-2v-32.01c0-1.1.9-2 2-2h11.51c1.27 0 2.23 1.18 1.95 2.43z"/>
                <path d="m46.23 45.99h11.53c1.19 0 2.12 1.04 1.99 2.22l-3.55 32c-.11 1.01-.97 1.78-1.99 1.78h-4.42c-1.02 0-1.88-.77-1.99-1.78l-3.56-32.01c-.13-1.18.8-2.21 1.99-2.21z"/>
            </g>
            <path d="m101 30.98v4.53l-.48 1.48h-2.25c-1.43 0-2.67 1.02-2.94 2.42l-9.73 49.59h-60.52c-.24 0-.55-.28-.64-.74-2.54-12.99-9.15-46.84-9.47-48.68-.2-1.47-1.45-2.59-2.97-2.59h-4c-.02 0-.09 0-.23-.04-.37-.09-.77-.43-.77-.97v-4c0-.55.45-1 1-1zm3-3h-96c-2.21 0-4 1.79-4 4v4c0 1.88 1.31 3.45 3.06 3.88.3.07.62.12.94.12h4.01c0 .28 9.49 48.85 9.49 48.85.36 1.84 1.85 3.16 3.58 3.16h62.98l10.21-52.01h4.47v-.12l1.26-3.88z" fill="#424242" opacity=".2"/>
            <path d="m34 47.99v32.01h-4.4l-7.11-32.01zm0-2h-11.51c-1.28 0-2.23 1.19-1.95 2.43l7.11 32.01c.2.92 1.01 1.57 1.95 1.57h4.4c1.1 0 2-.9 2-2v-32.01c0-1.11-.9-2-2-2z" fill="#424242" opacity=".2"/>
            <path d="m81.51 47.99-7.11 32.01h-4.4v-32.01zm0-2h-11.51c-1.1 0-2 .9-2 2v32.01c0 1.1.9 2 2 2h4.4c.94 0 1.75-.65 1.95-1.57l7.11-32.01c.28-1.25-.68-2.43-1.95-2.43z" fill="#424242" opacity=".2"/>
            <path d="m57.76 47.99-3.56 32.01h-4.42l-3.56-32.01zm0-2h-11.53c-1.19 0-2.12 1.04-1.99 2.22l3.56 32.01c.11 1.01.97 1.78 1.99 1.78h4.42c1.02 0 1.88-.77 1.99-1.78l3.56-32.01c.12-1.19-.8-2.22-2-2.22z" fill="#424242" opacity=".2"/>
            <path d="m108.53 7.59c-2.36.79-4.19 2.68-4.9 5.06l-23.46 78.2c-.29.98-.2 2.03.25 2.94l3.66 7.32c.67 1.33-.3 2.9-1.79 2.9h-70.29c-2.34 0-4.21 2.01-3.98 4.39.2 2.08 2.06 3.61 4.15 3.61h79.68c.97 0 1.95-.29 2.7-.91 1.48-1.24 1.84-3.26 1.03-4.88l-5.65-11.29c-1.06-2.11-1.27-4.55-.59-6.81l21.59-71.99c.15-.52.51-.93.98-1.18l-3.32-7.37-.06.01z" fill="url(#b)"/>
            <path d="m123.45 5.95c-.95-1.66-3-2.34-4.81-1.73l-10.04 3.35 3.32 7.37c.1-.05.19-.11.3-.14l9.04-3.02c2.36-.79 3.5-3.55 2.19-5.83z" fill="#f57c00"/>
            <path d="m119.97 6c.74 0 1.41.36 1.74.94.43.75.28 1.41.15 1.75-.22.56-.67 1-1.24 1.19l-9.04 3.02c-.26.09-.45.19-.61.28-.96.51-1.65 1.35-1.96 2.37l-21.58 71.98c-.83 2.76-.57 5.7.71 8.28l5.65 11.29c.42.83.2 1.84-.53 2.45-.34.29-.85.45-1.41.45h-79.68c-1.12 0-2.07-.79-2.16-1.8-.06-.58.13-1.13.51-1.55s.91-.65 1.48-.65h70.29c1.4 0 2.67-.71 3.4-1.9s.8-2.64.18-3.89l-3.66-7.32c-.23-.46-.27-.98-.13-1.47l23.46-78.2c.53-1.76 1.88-3.15 3.62-3.73l.06-.02 10.04-3.35c.24-.08.47-.12.71-.12m0-2c-.45 0-.9.07-1.34.22l-10.04 3.35-.06.02c-2.36.79-4.19 2.68-4.9 5.06l-23.46 78.2c-.29.98-.2 2.03.25 2.94l3.66 7.32c.67 1.33-.3 2.9-1.79 2.9h-70.29c-2.34 0-4.21 2.01-3.98 4.39.2 2.08 2.06 3.61 4.15 3.61h79.68c.97 0 1.95-.29 2.7-.91 1.48-1.24 1.84-3.26 1.03-4.88l-5.65-11.29c-1.06-2.11-1.27-4.55-.59-6.81l21.59-71.99c.15-.52.51-.93.98-1.18.1-.05.19-.11.3-.14l9.04-3.02c2.35-.79 3.49-3.55 2.19-5.83-.71-1.27-2.06-1.96-3.47-1.96z" fill="#424242" opacity=".2"/>
            <circle cx="28" cy="116" fill="#37474f" r="8"/>
            <circle cx="80" cy="116" fill="#37474f" r="8"/>
            <path d="m30 120h-4c-1.1 0-2-.9-2-2v-10h8v10c0 1.1-.9 2-2 2z" fill="#b0bec5"/>
            <circle cx="28" cy="114" fill="#fafafa" r="2" stroke="#757575" strokeMiterlimit="10" strokeWidth="1.0001"/>
            <path d="m82 120h-4c-1.1 0-2-.9-2-2v-10h8v10c0 1.1-.9 2-2 2z" fill="#b0bec5"/>
            <circle cx="80" cy="114" fill="#fafafa" r="2" stroke="#757575" strokeMiterlimit="10" strokeWidth="1.0001"/>
        </svg>
    )
}

const RemoveStash = props => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
            onClick={props.onClick}
            >
            <path fill="#888" d="M16 9H8v10h8zm-.47 7.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14l-2.13-2.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14z" opacity="0.1"/>
            <path fill="#c22" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8z"/>
        </svg>
    )
}

// -----------------------------------   SIMPLE   ----------------------------------- //
const Play = props => {
    const name = 'play';
    const d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
    return (
        <GeneralSimple
            name={name}
            d={d}
            {...props}
            />
    )
}
const Pause = props => {
    const name = 'pause';
    const d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"
    return (
        <GeneralSimple
            name={name}
            d={d}
            {...props}
            />
    )
}


// -----------------------------------   DOBLE   ----------------------------------- //
const Sun = props => {
    const name = 'sun';
    const d1="M639.1 416C639.1 468.1 596.1 512 543.1 512H271.1c-53 0-96-43-96-95.99c0-50.62 39.25-91.62 88.88-95.37C264.7 317.8 263.1 315 263.1 312c0-61.86 50.25-111.1 112-111.1c45.38 0 84.25 27.13 101.9 65.1c9.876-6.249 21.5-9.999 34.13-9.999c35.25 0 63.1 28.63 63.1 64c0 1.875-.6203 3.619-.7453 5.619C612.7 338.6 639.1 373.9 639.1 416z"
    const d2="M144.7 303c-43.63-43.74-43.63-114.7 0-158.3c43.75-43.62 114.8-43.62 158.5 0c9.626 9.748 16.88 20.1 22.25 32.74c9.75-3.749 20.13-5.999 30.75-7.499l29.75-88.86c4-11.87-7.25-23.12-19.25-19.25L278.1 91.2L237.5 8.342c-5.5-11.12-21.5-11.12-27.13 0L168.1 91.2L81.1 61.83C69.22 57.96 57.97 69.21 61.85 81.08l29.38 87.73L8.344 210.3c-11.13 5.624-11.13 21.5 0 27.12l82.88 41.37l-29.38 87.86c-4 11.87 7.375 22.1 19.25 19.12l76.13-25.25c6-12.37 14-23.75 23.5-33.49C167.7 321.7 155.4 313.7 144.7 303zM139.1 223.8c0 40.87 29.25 74.86 67.88 82.36c8-4.749 16.38-8.873 25.25-11.75C238.5 250.2 264.1 211.9 300.5 189.4C287.2 160.3 257.1 139.9 223.1 139.9C177.7 139.9 139.1 177.6 139.1 223.8z"
    return (
        <GeneralDoble
            name={name}
            d1={d1}
            d2={d2}
            {...props}
            />
    )
}
const Moon = props => {
    const name = 'moon';
    const d1="M415.1 431.1C415.1 476.2 380.2 512 335.1 512H95.99c-52.1 0-95.1-43-95.1-96c0-41.88 27.13-77.25 64.62-90.25c-.125-2-.6279-3.687-.6279-5.687c0-53 43-96.06 96-96.06c36.25 0 67.37 20.25 83.75 49.88c11.5-11 27-17.87 44.25-17.87c35.25 0 63.1 28.75 63.1 64c0 12-3.5 23.13-9.25 32.75C383.7 356.2 415.1 390.1 415.1 431.1z"
    const d2="M565.2 298.4c-92.1 17.75-178.5-53.62-178.5-147.6c0-54.25 29-104 76.12-130.9c7.375-4.125 5.375-15.12-2.75-16.63C448.4 1.125 436.7 0 424.1 0c-105.9 0-191.9 85.88-191.9 192c0 8.5 .6251 16.75 1.75 25c5.875 4.25 11.62 8.875 16.75 14.25C262.1 226.5 275.2 224 287.1 224c52.87 0 95.1 43.13 95.1 96c0 3.625-.25 7.25-.625 10.75c23.62 10.75 42.37 29.5 53.5 52.5c54.37-3.375 103.7-29.25 137.1-70.37C579.2 306.4 573.5 296.8 565.2 298.4z"
    return (
        <GeneralDoble
            name={name}
            d1={d1}
            d2={d2}
            {...props}
            />
    )
}
const ChevronsLeft = props => {
    const name = 'chevrons_left';
    const d1="M233.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l192-192c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L301.3 256 470.6 425.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-192-192z";
    const d2="M41.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l192-192c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L109.3 256 278.6 425.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-192-192z";
    return (
        <GeneralDoble
            name={name}
            d1={d1}
            d2={d2}
            {...props}
            />
    )
}

export { 
    AnimateEdit,
    AnimateRemove,

    CcmLogo,
    BuyCart,
    RemoveStash,

    Play,
    Pause,

    Sun,
    Moon,
    ChevronsLeft,
 };