import { useSelector } from "react-redux";
import { useF } from "./functions";
import { useLf } from "./localFunctions";
import gs from '../../static/css/generales.module.scss';

const useStates = props => {
    const ls = useSelector(state => state.fs.ls);
    const s = useSelector(state => state.fs.s);
    const f = useF();
    const lf = useLf();

    return { ls, s, f, lf, gs };
}

export { useStates };