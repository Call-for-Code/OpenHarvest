import { addDays, startOfYear, getDayOfYear } from "date-fns";

export function getDateFromDayOffset(offset: number) {
    const now = new Date();
    const yearStart = startOfYear(now);
    return addDays(yearStart, offset);
}

export function getDayOffsetFromDate(date: Date) {
    return getDayOfYear(date)
}

export function dateOffsetToInputString(offset: number) {
    const date = getDateFromDayOffset(offset);
    return dateToDateInputString(date);
}

export function dateToDateInputString(date: Date | null): string {
    if (date == null) return "";

    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return date.getFullYear()+"-"+(month)+"-"+(day);
}
