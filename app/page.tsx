import Container from "@/app/components/Container";
import QueryForm from "@/app/components/QueryInput";
import ResizableWindowLayout from "./components/resizableWindows/ResizableWindowLayout";

export default function Home() {
	const dev = process.env.NODE_ENV === "development";
	return <ResizableWindowLayout direction="horizontal" />;
}
