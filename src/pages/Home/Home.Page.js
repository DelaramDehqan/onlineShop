import React from 'react'
import { Fragment } from "react"
import {useEffect, useState} from "react"
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import { Grid, makeStyles } from "@material-ui/core"
import {Helmet} from 'react-helmet'
import {e2p} from "../../utils/LanguageNumberConvertor.utils"
import {getGroup} from "../../api/groups.api"
import {getProducts} from "../../api/products.api"
import {numberWithCommas} from "../../utils/numberWithCommas.utils"
import {Spinner, ProductCard , SearchInput} from "../../components"
import {UserLayout} from "../../layout";

const useStyles = makeStyles((theme) => ({
    groupTitle:{
        paddingRight: theme.spacing(8),
        paddingTop: theme.spacing(5),
        cursor:'pointer',
        display:'flex',
        alignItems: 'center',
    },
    anchorGroupTitle:{
        color:"var(--russian-violet)",
        textDecoration:'none'
    },
    productsContainer:{
        width:'100%',
        display: 'flex',
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    groupArrow:{
        width:'40px',
        height:'40px'
    }
}));


const Home = (props)=>{
    const classes = useStyles();
    const [loading, setLoading] = useState({show:true});
    const [ productsState, setProductsState ] = useState({products:[]})
    useEffect(async()=>{
        const response = await getGroup('')
        const groups = response.data
        Promise.all(groups.map((group, index) => getProducts({params: {group:group.name, _limit:4}}))).then(async (responses)=>{
            const productsGroup = responses.map( (res,i)=> ({group:groups[i], products:res.data}))
            await setLoading({show:false})
            setProductsState({products:productsGroup})
        })
    }, [])

    const pageContent = (<Grid container className={classes.productsContainer}>
        <SearchInput />
        {
            productsState.products.map(product=>{
                const {name:groupName, id:groupId} = product.group
                const groupLink = `/products/group/${groupId}/${groupName.trim().replaceAll(' ', '-')}`
                return (
                    <Fragment key={product.group.id}>
                        <Grid style={{display: 'flex', justifyContent: 'flex-end'}} item xs={12}>
                            <h2 className={classes.groupTitle} dir="rtl" onClick={()=>{props.history.push(groupLink)}}>
                                <a href={groupLink} className={classes.anchorGroupTitle} onClick={event=>event.stopPropagation()}>{product.group.name}</a>
                                <ArrowLeftIcon className={classes.groupArrow}/>
                            </h2>
                        </Grid>
                        {product.products.map(prod=>{

                            const {name, image, id, price} = prod
                            return (
                                <ProductCard key={prod.id} name={name} price={e2p(numberWithCommas(price))} image={image} url={`/product/${id}`}/>
                            )
                        })}
                    </Fragment>

                )
            })
        }

    </Grid>)

    return(
        <>
            <Helmet>
                <title>صفحه اصلی</title>
            </Helmet>
            <UserLayout>
                <Spinner isLoading={loading.show} content={pageContent} />
            </UserLayout>
        </>
    )
}

export {Home}


