import type { Column } from "react-table";
import { useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import TableHOC from "../components/admin/TableHOC";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const columns: Column<DataType>[] = [
  {
    Header: "ID",            // ✅ v7 uses Header
    accessor: "_id",         // ✅ v7 uses accessor (string | function)
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {
  const [rows] = useState<DataType[]>([
    {
      _id: "ffef8d4ddejdep5eded",
      amount: 45456,
      quantity: 23,
      discount: 5666,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/ffef8d4ddejdep5eded`}>View</Link>,
    },
  ]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Orders",
    true
  );

  return (
    <div className="container">
      <h1>My Orders</h1>
      {Table()}
    </div>
  );
};

export default Orders;
