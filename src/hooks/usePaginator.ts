import { useEffect, useState } from "react";

import { Pagination } from "../interfaces";

interface Props<T> {
	getData: (args: any) => Promise<Pagination<T>>;
	rowsPerPageOptions?: number[];
}

export const usePaginator = <T>({
	getData,
	rowsPerPageOptions = [5, 10, 25, 50],
}: Props<T>) => {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [first, setFirst] = useState(0);
	const [totalDocs, setTotalDocs] = useState(0);
	const [rows, setRows] = useState(5);
	const [page, setPage] = useState(1);

	useEffect(() => {
		rechargeTable();
	}, []);

	const rechargeTable = (params?: any) => {
		params = params ?? {
			limit: rows,
			page: page,
		};
		setLoading(true);
		getData(params)
			.then((resp) => {
				setData(resp.docs);
				setTotalDocs(resp.totalDocs);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setLoading(false));
	};

	const changePage = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		setPage(event.page + 1);

		const params = {
			limit: event.rows,
			page: event.page + 1,
		};
		rechargeTable(params);
	};

	const paginatorProps = {
		first,
		rows,
		totalRecords: totalDocs,
		rowsPerPageOptions,
		onPageChange: changePage,
	};

	return {
		data,
		paginatorProps,
		loading,
		rechargeTable,
		page,
		rows,
	};
};
