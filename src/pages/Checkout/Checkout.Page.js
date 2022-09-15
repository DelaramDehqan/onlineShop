import React from 'react'
import {useState} from "react"
import {connect} from "react-redux"
import { DatePicker } from "jalali-react-datepicker";
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Grid} from "@material-ui/core"
import {toast} from "react-toastify";
import { cartSelector } from "../../redux/selects/user.select"
import {postOrder} from "../../api/orders.api"
import {UserLayout} from "../../layout";
import {Helmet} from "react-helmet";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    width: "60%",
    margin: "50px auto",
  },
  input: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    margin: "20px 0",
  },
  dateInput: {
    height: "5rem",
    width: "32.5rem",
    border: "1px solid lightgray",
    borderRadius: "0.5rem",
  },
  textField: {
    width: "80%",
    margin: "7px 0",
    direction: "rtl",
  },
  buttonContainer: {
    textAlign: "center",
    width: "20%",
    margin: "auto",
  },
  payButton: {
    padding: "10px 25px",
    backgroundColor: "#00cc44",
    border: "2px solid var(--russian-violet)",
    color: "white",
    borderRadius: "0.5rem",
    cursor: "pointer",
    width: "100%",
  },
}));

const CheckoutPage = (props) =>{

    const classes = useStyles();

    const [state, setState] = useState({
        name:'', familyName:'', address:'', phone:'', deliveryTime:'',
    })



    const channgInputHandler  = ({target:{value}}, name)=>{
        setState({...state, [name]:value })
    }

    const changePhoneHandler = ({target:{value}} , name)=>{
        if(value.length != 11) {
            toast.error('شماره تلفن باید 11 رقم باشد.', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            setState({...state, [name]:"" })
        } else{
            setState({...state, [name]:value })
        }
    }

    const setDeliveryTime = ({value:{_d}}) => {
        const currentTime = new Date()
        const time = new Date(_d)
        if(time.getDate() - currentTime.getDate() > 3){
            setState({...state, deliveryTime:new Date(_d) })
        }
        else{
            toast.error('تاریخ تحویل حداقل باید از 3 روز آینده باشد.', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            setState({...state, deliveryTime:"" })
        }
    }

    const productsInfo = props.userCart.map(prod=> ({id:prod.id, name:prod.name, price:prod.price, count:prod.count, allPrice:prod.allPrice}) )
    const submitHandler = async (event)=>{
        event.preventDefault()
        const { name, familyName, address, phone, deliveryTime } = state
        if(name && familyName && address && phone && deliveryTime){
            try {
                const response = await postOrder({
                    name,
                    familyName,
                    address,
                    phone,
                    deliveryRequestTime:deliveryTime,
                    pay:false,
                    delivered:false,
                    deliveryDoneTime:'',
                    cost:props.userCart.reduce((acc, cv)=> acc + +cv.allPrice, 0),
                    products:productsInfo
                })
                const { data:{id:orderId} } = response
                localStorage.setItem('orderId',orderId)
                window.location.href=`http://127.0.0.1:5500/shaparak.html`
                setState({
                    name:'', familyName:'', address:'', phone:'', deliveryTime:'',
                })
            } catch (error) {
                console.log(error)
            }
        }else{
            toast.error('وارد کردن تمامی فیلدها الزامی است.', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    const { name, familyName, address, phone, deliveryTime } = state

    return (

        <>
            <Helmet>
                <title>بررسی نهایی</title>
            </Helmet>

            <UserLayout>
                <form onSubmit={submitHandler} >
                    <div className={classes.container}>
                        <Grid xs={2} xl={6} lg={6} md={6} sm={6}>
                            <div className={classes.input}>
                                <div>
                                    <label for="family-name">:نام خانوادگی</label>
                                </div>
                                <TextField  onChange={e=>channgInputHandler(e, 'familyName')} value={familyName} className={classes.textField} id="family-name" variant="outlined" />
                            </div>
                        </Grid>

                        <Grid xs={2} xl={6} lg={6} md={6} sm={6}>
                            <div className={classes.input}>
                                <div>
                                    <label for="name">:نام</label>
                                </div>
                                <TextField  onChange={e=>channgInputHandler(e, 'name')} value={name} className={classes.textField} id="name" variant="outlined" />
                            </div>
                        </Grid>

                        <Grid xs={2} xl={6} lg={6} md={6} sm={6}>
                            <div className={classes.input}>
                                <div>
                                    <label for="phone">:تلفن همراه</label>
                                </div>
                                <TextField onBlur={e=>changePhoneHandler(e,"phone")}  onChange={e=>channgInputHandler(e, 'phone')} type="number" value={phone} className={classes.textField} id="phone" variant="outlined" />
                            </div>
                        </Grid>

                        <Grid xs={2} xl={6} lg={6} md={6} sm={6}>
                            <div className={classes.input}>
                                <div>
                                    <label for="address">:آدرس</label>
                                </div>
                                <TextField onChange={e=>channgInputHandler(e, 'address')} value={address} className={classes.textField} id="address" variant="outlined" />
                            </div>
                        </Grid>

                        <Grid xs={2} xl={6} lg={6} md={6} sm={6}>
                            <div className={classes.input}>
                                <div>
                                    <label for="time" >:زمان تحویل</label>
                                </div>
                                <DatePicker timePicker={false} className={classes.dateInput}
                                            onClickSubmitButton={setDeliveryTime}
                                />
                            </div>
                        </Grid>

                    </div>

                    <div className={classes.buttonContainer}>
                        <button className={classes.payButton}>پرداخت</button>
                    </div>
                </form>

            </UserLayout>
        </>
    )
}

const mapStateToProps = (state)=>({userCart:cartSelector(state)})
const Checkout = connect(mapStateToProps)(CheckoutPage)
export {Checkout}
