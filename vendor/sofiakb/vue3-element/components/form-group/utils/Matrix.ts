import { each, last, range } from "lodash"

const rows = range(0, 6),
    cols = range(0, 7);

const getMatrix = (year: number, m: number) => {
    const matrix: any[] = [], date = new Date(year, m), numDays = new Date(year, m + 1, 0).getDate()
    let dayNum;

    each(rows, function (row) {
        const week: any[] = [];

        each(cols, function (col) {
            if (row === 0) {
                dayNum = col - date.getDay() + 1;
                week.push(col < date.getDay() ? -(new Date(year, m, -(date.getDay() - 1 - col)).getDate()) : dayNum);
            } else {
                dayNum = last(matrix)[6] + col + 1;
                week.push(dayNum <= numDays ? dayNum : -(dayNum - numDays));
            }
        });

        if (!row || week[0] > 1) matrix.push(week);

    });

    return matrix;
}

export default function (year: Date | number, month: number) {
    if (typeof year === "undefined") year = new Date();

    if (year instanceof Date) {
        return getMatrix(year.getFullYear(), year.getMonth());
    } else {
        return getMatrix(year, month);
    }
};
