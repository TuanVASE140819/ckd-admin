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
export default function BasicTable() {


  const [rows, setRows] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);


  const [openModal, setOpenModal] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null);
  

   const handleDetailsClick = (order) => {
    setCurrentOrderDetails(order);
    setOpenModal(true);
  };
  
   const handleStatusClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setOpenPopper(true);
    setCurrentOrder(order);
  };

  const handleStatusChange = (newStatus) => {
    fetch(`https://ckd--project-default-rtdb.firebaseio.com/Orders/${currentOrder.id}.json`, {
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
    fetch('https://ckd--project-default-rtdb.firebaseio.com/Orders.json')
      .then(response => response.json())
      .then(data => {
        const fetchedOrders = [];
        for (let key in data) {
          fetchedOrders.push({
            ...data[key],
            id: key
          });
        }
        setRows(fetchedOrders);
      });
  }, []);

  console.log("rows", rows);
  return (
      <div className="Table">
      <h3>Quản lý đơn hàng</h3>
        <TableContainer
          component={Paper}
          style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
               <TableCell>STT</TableCell>
                <TableCell>Mã đơn hàng</TableCell>
               
                <TableCell align="left">Tổng giá</TableCell>
                <TableCell align="left">Ngày</TableCell>
                <TableCell align="left">Trạng thái</TableCell>
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
                  <TableCell align="left">{row.total}
                  </TableCell>
                  <TableCell align="left">
                    {
                    
                      new Date(row.created_at).toLocaleDateString() + " " + new Date(row.created_at).toLocaleTimeString()
                    }
                  </TableCell>
                  <TableCell align="left">
                      <Button 
      variant="contained" 
      className="status btn" 
      style={makeStyle(row.status === 0 ? "Pending" : row.status === 1 ? "Approved" : "Cancelled")}
      onClick={(event) => handleStatusClick(event, row)}
    >
      {
        row.status === 0 ? "Chờ xác nhận" : row.status === 1 ? "Đã xác nhận" : "Đã hủy"
      }
    </Button>
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
        open={openPopper} anchorEl={anchorEl} placement="bottom-start">
  <ClickAwayListener onClickAway={() => setOpenPopper(false)}>
    <MenuList className="MenuList">
      <MenuItem className="MenuItem" onClick={() => handleStatusChange(0)}>Chờ xác nhận</MenuItem>
      <MenuItem className="MenuItem" onClick={() => handleStatusChange(1)}>Đã xác nhận</MenuItem>

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
      classes={{ root: "Modal" }}
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {currentOrderDetails && (
       <div
  style={{
    backgroundColor: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
    fontFamily: "'Roboto', sans-serif",
    color: "#333",
  }}
>
  <h2 id="simple-modal-title">Chi tiết đơn hàng</h2>
  <p id="simple-modal-description">
              <h3>Thông tin người nhận</h3>
              <p>
                <strong>Tên:</strong> {currentOrderDetails.user.name}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {currentOrderDetails.user.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {currentOrderDetails.user.address.province + ", " + currentOrderDetails.user.address.district + ", " + currentOrderDetails.user.address.ward} 
              </p>
              <p>
                <strong>Email:</strong> {currentOrderDetails.user.email}
              </p>
              <h3>Hình thức thanh toán</h3>
              <p>
                <strong>Phương thức:</strong> 
                <div className="payment-method">
                  {currentOrderDetails.payment}
                </div>
              </p>
              <h3>Danh sách sản phẩm</h3>
              {/* tạo bảng */}
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                       <TableCell align="left">Hình ảnh</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell align="right">Giá</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrderDetails.cart.map((product) => (
                      <TableRow
                        key={product.id}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {currentOrderDetails.cart.indexOf(product) + 1}
                        </TableCell>
                        <TableCell align="left">
                          <img
                            src={_URL + product.photo}
                            alt={product.tenvi}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                         
                          {product.tenvi.length > 40 ? product.tenvi.slice(0, 40) + "..." : product.name}
                        </TableCell>
                        <TableCell align="right">{product.quantity}</TableCell>
                        <TableCell align="right">
                          {product.giamoi.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                        <TableCell align="right">
                          {(product.quantity * product.giamoi).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/*  tạm tính */}
             <p style={{ textAlign: "right" }}>
  <strong>Tạm tính:</strong>{" "}
  
</p>
<p style={{ textAlign: "right" }}>
  <strong>Phí vận chuyển:</strong>{" "}
  
</p>
<p style={{ textAlign: "right" }}>
  <strong>Giảm giá:</strong>{" "}
  
</p>
<p style={{ textAlign: "right" }}>
  <strong>Tổng cộng:</strong>{" "}
  
</p>
            
  </p>
</div>
      )}
    </Modal>
    </div>
    
  );
}