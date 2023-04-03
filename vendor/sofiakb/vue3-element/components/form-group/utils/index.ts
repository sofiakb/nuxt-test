import momentJS from "moment";
import momentTimezone from "moment-timezone";
import Matrix from "./Matrix";

const twoDigits = (n: string | number) =>
    n !== null && typeof n !== "undefined"
        ? parseInt(n.toString()) < 10
            ? "0" + parseInt(n.toString())
            : parseInt(n.toString())
        : null;
const moment = (date = null, format = null) => {
    momentTimezone.locale("fr");
    return date === null
        ? momentJS()
        : format === null
        ? momentJS(date)
        : momentJS(date, format);
};

export { twoDigits, moment, Matrix };
