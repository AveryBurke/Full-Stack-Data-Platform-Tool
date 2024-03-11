interface TableProps {
	data: any[];
}

const Table: React.FC<TableProps> = ({ data }) => {
	const headers = Object.keys(data[0]);
	const tableHeads = headers.map((header, i) => <th className={"font-bold p-2 border-b text-left" + (i === header.length - 1 && " px-4")}>{header}</th>);
	const tableRows = data.map((row) => {
		return (
			<tr>
				{headers.map((header, i) => (
					<td className={"font-bold p-2 border-b text-left hover:bg-stone-100" + (i === header.length - 1 && " px-4")}>{row[header]}</td>
				))}
			</tr>
		);
	});
	return (
		<table className="table-auto border">
			<thead>
				<tr>{tableHeads}</tr>
			</thead>
			<tbody>{tableRows}</tbody>
		</table>
	);
};

export default Table;
