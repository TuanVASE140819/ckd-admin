import React from "react";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import TableReview from "../TableReview/TableReview";
import "./MainDash.css";
const MainDash = () => {
  return (
    <div className="MainDash">
      <h1>Quản lý đơn hàng</h1>
      {/* <Cards /> */}
      <Table />
    <TableReview/>
    </div>
  );
};

export default MainDash;
