import React from 'react'
import {useEffect, useState} from "react"
import {Grid , makeStyles, Typography} from "@material-ui/core"
import {Helmet} from "react-helmet";
import {Link} from "react-router-dom";
import {Pagination, PaginationItem} from "@material-ui/lab";
import {e2p} from "../../utils/LanguageNumberConvertor.utils"
import {getGroup} from "../../api/groups.api"
import {getProducts} from "../../api/products.api"
import {numberWithCommas} from "../../utils/numberWithCommas.utils"
import {Sidebar, ProductCard , Spinner} from "../../components"
import {UserLayout} from "../../layout";

const useStyles = makeStyles((theme) => ({
    asideContainer:{
        height:'100vh',
        boxSizing: 'border-box',
    },
    productGroupTitle:{
        textAlign:'right',
        marginTop:theme.spacing(7),
        marginRight:theme.spacing(3),
        color:'var(--russian-violet)'
    },
    productsContainer:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap:'wrap',
        justifyContent:'flex-end',
    },
    mainContent:{
        borderRight: '1px solid var(--lavender-floral)',
    }
}));


const Products = (props) =>{
    const classes = useStyles();
    const [groupsState, setGroupsState] = useState({ groups: [] })
    const [productsState, setProductsState] = useState({ products: [] })
    const [loading, setLoading] = useState({ show: true })
    const [pageState, setPageState] = useState({perpage:3,page:1})
    const [pagesCountState, setPagesCount] = useState(null)

    const handleChange = async (event, newPage) => {
        setPageState({...pageState,page:newPage})
    };

    useEffect( ()=>{
        const getGroupsAndProducts = async () => {
            const allgroups = []
            const response = await getGroup('')
            const groups = response.data
            groups.map(async (group , index)=>{
                const response = await getProducts({params: {group:group.name}})
                allgroups.push({
                    group:group.name,
                    groupId:group.id,
                    products:response.data.map(prod=> ({name:prod.name, id:prod.id})),
                })
                if(index ===groups.length-1){
                    await setGroupsState({groups:allgroups})
                }
            })
        }
        getGroupsAndProducts()
    }, [])

    useEffect(async ()=>{
        const getProductByGroupName = async () =>{
            try {
                const response = await getProducts({params: {_limit:3,_page:1,group:props.params.groupName.replaceAll('-', ' ')}})
                const products = response.data
                await setProductsState({ products:products })
                setLoading({show:false})

                const productsCount = response.headers['x-total-count']
                const pagesCount = Math.ceil( productsCount / pageState.perpage )
                setPagesCount(pagesCount)

            }
            catch (e){}
        }
        getProductByGroupName()
    }, [])

    const getProductsPerPage = async () =>{
        const { page } = pageState
        const response = await getProducts( {params:{_page:page, _limit:3 , group:props.params.groupName.replaceAll('-', ' ')}})
        setProductsState({ products:response.data })
    }

    useEffect( ()=>{
        getProductsPerPage()
    }, [pageState])

    const pageContent = (
        <div style={{display:'flex', }}>
            <Grid item lg={10} md={9} sm ={8} xs={8} className={classes.mainContent}>
                <Typography variant="h4" component="h1" className={classes.productGroupTitle}>{props.params.groupName.replaceAll('-', ' ')}</Typography>
                <div className={classes.productsContainer}>
                    {productsState.products.map((prod, index)=>{
                        const {name, image, id, price} = prod
                        return (<ProductCard lg={4} md={6} sm ={12} xs={12} url={`/product/${id}`} name={name} price={e2p(numberWithCommas(price))} image={image}></ProductCard>)
                    })}
                </div>
            </Grid>
            <Grid item lg={2} md={3} sm ={4} xs={4} className={classes.asideContainer}>
                <Sidebar groups={groupsState.groups}/>
            </Grid>
        </div>
    )

    return (
        <div>
            <Helmet>
                <title>دسته های کالا</title>
            </Helmet>
            <UserLayout>
                <Spinner isLoading={loading.show} content={pageContent} />
                <Pagination style={{display:'flex' , justifyContent:'center'}}
                    hidePrevButton
                    hideNextButton
                    showFirstButton
                    showLastButton
                    count={pagesCountState}
                    page={pageState.page}
                    onChange={handleChange}
                    renderItem={(item) => (
                        <PaginationItem
                            component={Link}
                            to={`?page=${item.page}`}
                            {...item}
                        />
                    )}
                />
            </UserLayout>
        </div>
    )
}

export {Products}