import React, {useEffect} from 'react'
import {connect} from "react-redux"
import DoneIcon from '@material-ui/icons/Done';
import {Helmet} from "react-helmet";
import {Link} from "react-router-dom";
import {LocalMall, ShoppingBasket} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles"
import {Typography, Grid, Toolbar, Badge, AppBar} from "@material-ui/core"
import {cartSelector } from "../../redux/selects/user.select"
import {emptyUserCart} from "../../redux/actions/card.action"
import {e2p} from "../../utils/LanguageNumberConvertor.utils";
import {getProductWithId , patchProduct} from "../../api/products.api"
import {patchOrder} from "../../api/orders.api"
import {LINKS} from "../../layout/UserLayout/components/Header/Header.config";
import {Navigation} from "../../components";
import {PATHS} from "../../configs/routes.config"

const useStyles = makeStyles((theme) => ({
  appbar: {
    marginBottom: "10rem",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#47d147",
    flexWrap: "wrap",
  },
  rightSide: {
    display: "flex",
    alignItems: "center",
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(10),
    fontSize: "1.5rem",
  },
  title: {
    color: "#fff",
    fontSize: "2.5rem!important",
    fontFamily: "AMitra",
  },
  image: {
    width: "10rem",
    height: "5rem",
  },
  icon: {
    transform: "translate(10rem)",
  },
  header: {
    width: "70%",
    margin: "30px auto",
    textAlign: "right",
  },
  container: {
    display: "flex",
    width: "50%",
    justifyContent: "center",
    margin: "auto",
    flexDirection: "column",
    alignItems: "center",
  },
  info: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: "5rem",
  },
  paymentIcon: {
    position: "relative",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "green",
    marginLeft: "40px",
    fontSize: "5rem",
  },
  paymentIconItem: {
    fill: "#ffff",
    position: "absolute",
    top: "50%",
    left: "50%",
    fontSize: "xxx-large !important",
    transform: "translate(-50%, -50%)",
  },
  backToHome: {
    color: "blue",
    fontSize: "2rem",
  },
}));



const PaymentSuccess = (props) =>{

    const classes = useStyles();
    const orderId = localStorage.getItem('orderId');
    useEffect( ()=>{
        const getSuccessOrder = async () =>{
            try {
                const response = await patchOrder({ pay:true },orderId)
                localStorage.setItem('orderId',-1)
                const {products} = response.data
                products.map(async product => {
                    const response = await getProductWithId(product.id)
                    await patchProduct({ quantity: +response.data.quantity - +product.count },product.id)
                })

            } catch (error) {
                console.log(error)
            }
        }
        getSuccessOrder()
    }, [])

    return (
        <>
            <Helmet>
                <title>پرداخت موفقیت آمیز</title>
            </Helmet>
            <AppBar className={classes.appbar}>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.rightSide}>
                        <LocalMall className={classes.image} />
                        <Link to={PATHS.HOME}>
                            <Typography className={classes.title} variant="h6" noWrap>
                                فروشگاه فلان
                            </Typography>
                        </Link>
                    </div>

                    <div className={classes.leftSide}>
                        <Navigation className={{navClass: classes.navigation}} links={LINKS}/>
                        <Badge className={classes.icon} anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                               badgeContent={e2p(''+0)}
                               color="secondary">
                            <ShoppingBasket />
                        </Badge>
                    </div>

                </Toolbar>
            </AppBar>
            <div style={{width:'100%' ,direction:'ltr', marginTop:'10rem' }}>
                <Typography variant="h4" className={classes.header}>نتیجه ی پرداخت</Typography>
                <Grid item lg={8} md={10} sm ={10} xs={10} className={classes.container}>
                    <div className={classes.info}>
                        <div className={classes.paymentIcon}><DoneIcon className={classes.paymentIconItem} /></div>
                        <Typography dir="rtl" variant="p" component="p" >با تشکر از پرداخت شما. سفارش شما ثبت شده است.</Typography>

                    </div>
                    <Link className={classes.backToHome} to={PATHS.HOME}>بازگشت به سایت</Link>
                </Grid>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({userCart:cartSelector(state)})
const mapDispatchToProps = (dispatch) => ({ emptyUserCart:dispatch(emptyUserCart())})

const SuccessPaymentResult = connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess)
export {SuccessPaymentResult}
