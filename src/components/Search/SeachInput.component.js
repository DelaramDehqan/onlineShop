import {useState, useEffect} from "react"
import Autocomplete from '@material-ui/lab/Autocomplete';
import {debounce} from 'lodash';
import TextField from '@material-ui/core/TextField';
import {getProducts} from "../../api/products.api"
import styles from "./SearchInput.module.scss"

const SearchInput = () =>{
    const [state, setState] = useState({ options:[{name:''}] })

    const setProducts = async (value='', limit='')=>{
        const {data} = await  getProducts({ params:{ name_like: value, _limit:limit} })
        setState({ options:data})
    }
    const onAutoCompleteInputHandler = ({target:{value}}) => {
        debounce(async ()=>{
            await setProducts(value)
        }, 1500)()
    }

    useEffect(()=>{
        setProducts('', 0)
    }, [])

    const onAutoCompleteChangeHandler = ({target}) => {
        const productIndex = target.getAttribute('data-option-index')
        const product = state.options[productIndex]
        const path = `/product/${product.id}`
        window.location.href = path
    }

    return (
        <div className={styles.searchInputContainer}>
            <Autocomplete
                onChange={onAutoCompleteChangeHandler}
                onInputChange={onAutoCompleteInputHandler}
                id="search-input"
                options={state.options}
                getOptionLabel={(option) => option.name}
                style={{ width: 400, marginTop:30 , direction:'rtl' }}
                renderInput={(params) => <TextField placeholder="جستجوی محصولات" {...params} variant="outlined" />}
            />
        </div>

    )
}

export{SearchInput}