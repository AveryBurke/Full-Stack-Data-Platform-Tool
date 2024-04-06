import { isValid, format } from "date-fns";

export function sanitize(obj: { [key: string]: any }) {
	const newObj: { [key: string]: any } = {};
	for (const key in obj) {
        switch (typeof obj[key]) {
            case "string":
                newObj[key] = obj[key].trim();
                break;
            case "object":
                if (isValid(obj[key])) {
                    newObj[key] = format(obj[key] as Date, "MM/dd/yyyy");
                }
                break;
            case "boolean":
                newObj[key] = obj[key] ? "true" : "false";
                break;
            case "bigint":
                newObj[key] = obj[key].toNumber();
                break;
            default:
                newObj[key] = obj[key];
                break;
        }
	}
	return newObj;
}