import { useEffect, useState } from 'react';
import { Grid, Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper} from '@material-ui/core';
import { Link } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import {Pagination, PaginationItem} from '@material-ui/lab';
import {getProducts} from "api/products.api"
import {ProductInput} from "./ProductInput.Component";

const useStyles = makeStyles({
  container: {
    margin: "20px auto 0",
    height: 600,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tableHeading: {
    backgroundColor: "var(--light-face)",
  },
  tableRow1: {
    backgroundColor: "whitesmoke",
  },
  tableRow2: {
    backgroundColor: "var(--light-face)",
  },
  table: {
    minWidth: 650,
  },
  pagin:{
      fontFamily: "AMitra",
      fontSize: 15,
      fontWeight: 30,
      dir: "rtl",
      marginTop: 20,
  },
});

const QuantityTable = (props) => {
    const classes = useStyles();
    const [productsState, setProductsState] = useState([])
    const [pageState, setPageState] = useState({perpage:5,page:1})
    const [pagesCountState, setPagesCount] = useState(null)
    const [editModeProducts, setEditModeProducts] = useState([])
    const [escapeState, setEscapeState] = useState({press:false})

    const handleChange = async (event, newPage) => {
        setPageState({...pageState,page:newPage})
    };

    useEffect( ()=>{
        props.setEditingProductsState([...editModeProducts])
    }, [editModeProducts])

    useEffect( ()=>{
        const getProduct = async () =>{
            try {
                const response = await getProducts( {params:{_page:1, _limit:5}})
                const products = response.data
                await setProductsState(products)

                const productsCount = response.headers['x-total-count']
                const pagesCount = Math.ceil( productsCount / pageState.perpage )
                setPagesCount(pagesCount)

            } catch (error) {
            }
        }
        getProduct()
    }, [])

    const getProductsPerPage = async () =>{
        const { page } = pageState
        const response = await getProducts( {params:{_page:page, _limit:5}})
        setProductsState(response.data)
    }

    useEffect( ()=>{
        getProductsPerPage()
    }, [pageState, props.editmode])

    document.addEventListener('keydown', (event) => {
        if(event.code==='Escape' && !escapeState.press){
            setEscapeState({press:true})
        }
    })

    return (
        <Grid item lg={8} md={10} sm ={10} xs={10} className={classes.container}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead className={classes.tableHeading}>
                        <TableRow>
                            <TableCell align="right">موجودی</TableCell>
                            <TableCell align="right">قیمت</TableCell>
                            <TableCell align="right">کالا</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productsState.map((row, index) => {
                            const { id, name, price, quantity } = row
                            return (
                                <TableRow className={index%2===0? classes.tableRow1 : classes.tableRow2} key={id}>

                                    <TableCell align="right">
                                        <ProductInput
                                            escapeState={escapeState}
                                            setEscapeState={setEscapeState}
                                            editmode={props.editmode}
                                            field="quantity"
                                            value={quantity}
                                            product={row}
                                            setEditModeProducts={setEditModeProducts}
                                            editModeProducts={editModeProducts}/>
                                    </TableCell>

                                    <TableCell align="right" component="th" scope="row">
                                        <ProductInput
                                            escapeState={escapeState}
                                            setEscapeState={setEscapeState}
                                            editmode={props.editmode}
                                            field="price"
                                            value={price}
                                            product={row}
                                            setEditModeProducts={setEditModeProducts}
                                            editModeProducts={editModeProducts}/>
                                    </TableCell>

                                    <TableCell align="right">{name}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                hidePrevButton
                hideNextButton
                showFirstButton
                showLastButton
                count={pagesCountState}
                page={pageState.page}
                onChange={handleChange}
                renderItem={(item) => (
                    <PaginationItem
                        className={classes.pagin}
                        component={Link}
                        to={`?page=${item.page}`}
                        {...item}
                    />
                )}
            />
        </Grid>
    );
}

export {QuantityTable}