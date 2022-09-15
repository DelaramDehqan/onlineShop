import React from 'react';
import {confirm} from "react-confirm-box";
import {connect} from "react-redux"
import {Helmet} from "react-helmet";
import {Link} from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'
import { cartSelector } from "../../redux/selects/user.select"
import {e2p} from "../../utils/LanguageNumberConvertor.utils"
import {getProductWithId} from "../../api/products.api"
import {numberWithCommas} from "../../utils/numberWithCommas.utils"
import {PATHS} from '../../configs/routes.config'
import {removeFromCart} from "../../redux/actions/card.action"
import { ToastContainer, toast } from 'react-toastify';
import {UserLayout} from "../../layout";


const styles = makeStyles({
  table: {
    minWidth: 650,
  },
  container: {
    margin: "100px auto 0",
  },
  title: {
    margin: "40px 0",
    textAlign: "right",
  },
  cartInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ff1a1a",
    border: "none",
    color: "white",
    textDecoration: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1.5rem",
    cursor: "pointer",
  },
  productLink: {
    color: "var(--russian-violet)",
    border: "none",
    textDecoration: "none",
    cursor: "pointer",
  },
  buyButton: {
    backgroundColor: "#47d147",
    padding: "5px 10px",
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.5rem",
    borderRadius: "0.5rem",
  },
  tableHeaders: {
    color: "var(--russian-violet)",
  },
  cartPrice: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row-reverse",
    color: "var(--lavender-floral)",
  },
  cartPriceTypography: {
    direction: "rtl",
    marginLeft: "15px",
    color: "var(--lavender-floral)",
    fontSize: "2.5rem",
  },
  cartPriceCost: {
    direction: "rtl",
    marginLeft: "7.5px",
    fontSize: "2.5rem",
  },
});

const basketPage = (props) => {

    const classes = styles()


     const removeFromcartButtonClickHandler = async (event, row)=>{
        const options = {
            render: (message, onConfirm, onCancel) => {
                return (
                    <>
                        <div style={{backgroundColor:'white' ,borderRadius:'0.5rem' , marginTop:'-5rem', padding:'2rem 4rem',marginLeft:'-10rem' , display:'flex',flexDirection:'column' , gap:'2rem' }}>
                            <h1 style={{fontSize:'2rem'}}> {message} </h1>
                            <div style={{display:'flex', justifyContent:'space-between' , direction:'rtl'}}>
                                <button style={{backgroundColor:'green',padding:'0.5rem 1rem' , outline:'none' , border:'none' , color:'white'  , width:'45%' , borderRadius:'0.5rem' , cursor:'pointer'}} onClick={onConfirm}> بله </button>
                                <button style={{backgroundColor:'red',padding:'0.5rem 1rem' , outline:'none' , border:'none' , color:'white' , width:'45%'  , borderRadius:'0.5rem' , cursor:'pointer'}} onClick={onCancel}> خیر </button>

                            </div>
                        </div>
                    </>
                );
            }
        };
        const result = await confirm("آیا از حذف این محصول مطمئن هستید؟", options);
        if (result) {
            props.removeFromCart(row)
        }
    }

    const finalizeCart = async (event)=>{
        event.preventDefault()
        let success = true
        await Promise.all(props.userCart.map(prod=>getProductWithId(prod.id))).then((responses)=>{
            responses.forEach((response,index)=>{
                const product = response.data
                if(product.quantity<props.userCart[index].count){
                    success = false
                }
            })
        })
        if(success){
            window.location.href = '/checkout'
        }
        else{
            toast.error('متاسفانه موجودی محصولات مورد انتخاب شما کافی نیست', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                rtl: true,
            });
        }
    }

    return (
      <>
        <Helmet>
          <title>سبد خرید 💳</title>
        </Helmet>
        <UserLayout>
          <Grid
            item
            lg={8}
            md={10}
            sm={10}
            xs={10}
            className={classes.container}
          >
            <Typography variant="h4" component="p" className={classes.title}>
              سبد خرید
            </Typography>
            {props.userCart.length < 1 ? (
              <Typography
                dir="rtl"
                variant="h5"
                component="p"
                lassName={classes.title}
              >
                شما هنوز محصولی به سبد خرید خود اضافه نکرده اید.
              </Typography>
            ) : (
              <>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHeaders}></TableCell>
                        <TableCell align="right">تعداد &times; قیمت</TableCell>
                        <TableCell
                          className={classes.tableHeaders}
                          align="right"
                        >
                          تعداد
                        </TableCell>
                        <TableCell
                          className={classes.tableHeaders}
                          align="right"
                        >
                          قیمت
                        </TableCell>
                        <TableCell
                          className={classes.tableHeaders}
                          align="right"
                        >
                          کالا
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.userCart.map((row, index) => (
                        <TableRow
                          style={{
                            backgroundColor:
                              index % 2 === 0
                                ? "whitesmoke"
                                : "var(--light-face)",
                          }}
                          key={row.id}
                        >
                          <TableCell component="th" scope="row">
                            <button
                              className={classes.deleteButton}
                              onClick={(event) =>
                                removeFromcartButtonClickHandler(event, row)
                              }
                            >
                              حذف
                            </button>
                          </TableCell>
                          <TableCell align="right">
                            {e2p(numberWithCommas("" + row.allPrice))}
                          </TableCell>
                          <TableCell align="right">
                            {e2p(numberWithCommas("" + row.count))}
                          </TableCell>
                          <TableCell align="right">
                            {e2p(numberWithCommas("" + row.price))}
                          </TableCell>
                          <TableCell align="right">
                            <Link
                              className={classes.productLink}
                              to={`/product/${row.id}`}
                            >
                              {row.name}
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className={classes.cartInfo}>
                  <Link
                    className={classes.buyButton}
                    to={PATHS.CHECKOUT}
                    onClick={finalizeCart}
                  >
                    نهایی کردن سبد خرید
                  </Link>
                  <div className={classes.cartPrice}>
                    <p className={classes.cartPriceTypography}>جمع:</p>
                    <div className={classes.cartPriceCost}>
                      {e2p(
                        numberWithCommas(
                          props.userCart.reduce(
                            (acc, cv) => acc + +cv.allPrice,
                            0
                          )
                        )
                      )}
                    </div>
                    <span>تومان</span>
                  </div>
                </div>
              </>
            )}
          </Grid>
          <ToastContainer />
        </UserLayout>
      </>
    );
}

const mapStateToProps = (state) => ({userCart:cartSelector(state)})
const mapDispatchToProps = (dispatch) => ({removeFromCart:product=>dispatch(removeFromCart(product))})

const Basket = connect(mapStateToProps, mapDispatchToProps)(basketPage)
export {Basket}
