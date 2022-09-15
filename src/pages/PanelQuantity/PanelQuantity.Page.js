import React, { useState } from "react";
import {Helmet} from 'react-helmet'
import { makeStyles } from '@material-ui/core/styles';
import {toast} from "react-toastify";
import {Typography, Button, Grid} from "@material-ui/core"
import {AdminLayout} from "../../layout";
import {patchProduct} from "../../api/products.api";
import {QuantityTable} from "./components/QuantityTable.Component"

const useStyles = makeStyles({
    container:{
        margin:'20px auto 0',
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});


const PanelQuantity = () => {
    const classes = useStyles();

    const [ editingProductsState ,setEditingProductsState ] = useState([]);
    const [editmode, setEditMode ] = useState({edit:'end'});

    const saveButtonClickHandler = async (event) => {
        setEditMode({edit:'start'})
        editingProductsState.map(async({id, quantity, price}, index)=>{
            const obj = {};
            if(quantity>=0){
                obj.quantity = quantity
            }
            if(price)
                obj.price = price
            if(index===editingProductsState.length-1){
                await patchProduct({...obj} , id)
                await setEditMode({edit:'done'})
            }
            else {
                await patchProduct({...obj} , id)
            }
        })
        toast.success('کالای مورد نظر با موفقیت ویرایش شد', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    return (
        <>
            <Helmet>
                <title>پنل موجودی ها</title>
            </Helmet>
            <AdminLayout>
                <Grid item lg={8} md={10} sm ={10} xs={10} className={classes.container}>
                    <Button id="SaveButtonQuantity" variant="contained" color="primary" onClick={(event)=>saveButtonClickHandler(event, editingProductsState)}>ذخیره</Button>
                    <Typography variant="h4" component="p">مدیریت موجودی و قیمت ها</Typography>
                </Grid>
                <QuantityTable setEditingProductsState={setEditingProductsState} editingProductsState={editingProductsState} editmode={editmode}/>
            </AdminLayout>
        </>
    )
}

export {PanelQuantity}