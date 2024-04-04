import { isValid } from "date-fns";

export function sanitize(obj: { [key: string]: any}) {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
        if (typeof obj[key] === "string") {
            newObj[key] = obj[key].trim();
        } else if (typeof obj[key] === "object") {
            if (isValid(obj[key])) {
                newObj[key] = obj[key].toISOString();
            }
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}