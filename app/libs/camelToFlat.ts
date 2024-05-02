export default function camelToFlat(s: string) {
	return s.replace(/[A-Z]/g, " $&").toLocaleLowerCase();
}