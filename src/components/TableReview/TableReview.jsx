import * as React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";
import { Button, Modal } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// popup notification when changing status
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import Pagination from '@mui/material/Pagination';

const makeStyle=(status)=>{
  if(status === 'Approved')
  {
    return {
      background: 'rgb(145 254 159 / 47%)',
      color: 'green',
    }
  }
  else if(status === 'Pending')
  {
    return{
      background: '#ffadad8f',
      color: 'red',
    }
  }
  else{
    return{
      background: '#59bfff',
      color: 'white',
    }
  }
}

const _URL = "https://ckdvietnam.com/upload/product/"
  const _URLREVIEW = "https://ckdvietnam.com/upload/news/"
export default function BasicTable() {


  const [rows, setRows] = useState([]);
  const [totalReview, setTotalReview] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);


  const [openModal, setOpenModal] = useState(false);


  const [productId, setProductId] = useState([]);
  

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

const handleDetailsClick = (product) => {
  const productReviews = totalReview.filter(review => review.productId ===
    product.id);
  setProductId(productReviews);
  setOpenModal(true);
  // console.log("product.id", product.id);
  // console.log("productID", totalReview.filter(review => review.productId ===
  //   product.id));
};
  
   const handleStatusClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setOpenPopper(true);
    setCurrentOrder(order);
  };



  const handleReviewStatusChange = (newStatus) => {
    fetch(`https://ckd--project-default-rtdb.firebaseio.com/Reviews/${currentOrder.id}.json`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(() => {
      const updatedRows = rows.map(r => r.id === currentOrder.id ? { ...r, status: newStatus } : r);
      setRows(updatedRows);
      setOpenSnackbar(true);
      setSnackbarMessage(`Trạng thái đơn hàng ${currentOrder.id} đã được thay đổi.`);
    });
    setOpenPopper(false);
  };



  useEffect(() => {
    fetch('https://ckdvietnam.com/erp/api/tab?table=product&select=*&where=hienthi+>0')
      .then((response) => response.json())
      .then((data) => {
        setRows(data);
      });
  }, []);

  useEffect(() => {
  fetch('https://ckd--project-default-rtdb.firebaseio.com/Reviews.json')
    .then((response) => response.json())
    .then((data) => {
     const reviewsArray = Object.values(data);
      setTotalReview(reviewsArray);
    });
}, []);

  // tôi muốn truy vấn tưới product trong totalReview
  console.log(totalReview.map((review) => review.image));
  return (
      <div className="Table">
      <h3>Quản lý Review đơn hàng</h3>
        <TableContainer
          component={Paper}
          style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
               <TableCell>STT</TableCell>
                <TableCell>Mã sản phẩm</TableCell>
               
                <TableCell align="left">Hình ảnh </TableCell>
                <TableCell align="left">Tên sản phẩm</TableCell>
                <TableCell align="left">Review</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ color: "white" }}>
            {rows.map((row) => (
                
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                    {rows.indexOf(row)+1}
                </TableCell>
                  <TableCell component="th" scope="row">
                      {row?.id}
                  
                  </TableCell>
                 
                  <TableCell align="left">
                  <img
                    src={_URL + row.photo}
                    alt={row.tenvi}
                    style={{ width: "50px", height: "50px" }}
                  />
                </TableCell>
                 <TableCell align="left">
                  {row.tenvi}
                  </TableCell>
                  <TableCell align="left" className="Details">
              <Button 
      variant="contained" 
      color="primary" 
      size="small" 
      className="btn-details"
      onClick={() => handleDetailsClick(row)}
    >
      Chi tiết
    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </TableContainer>
      <Popper className="Popper"
        style={{ zIndex: 10000 }}
        open={openPopper} anchorEl={anchorEl} placement="bottom-start">
  <ClickAwayListener onClickAway={() => setOpenPopper(false)}>
    <MenuList className="MenuList">
      <MenuItem className="MenuItem" onClick={() => handleReviewStatusChange(0)}>Chờ xác nhận</MenuItem>
      <MenuItem className="MenuItem" onClick={() => handleReviewStatusChange(1)}>Đã xác nhận</MenuItem>

    </MenuList>
  </ClickAwayListener>
</Popper>
        <Snackbar 
  open={openSnackbar} 
  autoHideDuration={3000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'l', horizontal: 'center' }}
      >
        
  <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
      </Snackbar>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="Modal">
         
          <div className="ModalContent">
            <div className="ModalSection">
              
              <TableContainer component={Paper} className="TableContainer">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Người bình luận</TableCell>
                        <TableCell>Hình ảnh</TableCell>
                      <TableCell>Nôi dung</TableCell>
                      <TableCell>Đánh giá</TableCell>
                       <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
{
  productId
    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
    .map((review, index) => (
      <TableRow key={index}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{review.customerName}</TableCell>
        <TableCell>
          <img
            src={review.image}
            alt={review.name}
            style={{ width: "50px", height: "50px" }}
          />
        </TableCell>
        <TableCell>{review.reviewText}</TableCell>
        <TableCell>{review.stars}</TableCell>
        <TableCell>
           <Button 
      variant="contained" 
      className="status btn" 
      style={makeStyle(review.status === 0 ? "Pending" : review.status === 1 ? "Approved" : "Cancelled")}
      onClick={(event) => handleStatusClick(event, review)}
    >
      {
        review.status === 0 ? "Chờ xác nhận" : review.status === 1 ? "Đã xác nhận" : "Đã hủy"
      }
    </Button>
        </TableCell>
      </TableRow>
    ))
}
</TableBody>
                </Table>
                <Pagination
                  className="Pagination"
  count={Math.ceil(totalReview.length / itemsPerPage)}
  page={page}
  onChange={(event, value) => setPage(value)}
/>
              </TableContainer>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    
  );
}