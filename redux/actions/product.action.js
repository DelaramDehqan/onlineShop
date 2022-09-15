import {getProducts} from '../../api/products.api';

export const setProducts = (data) => {
    return {type: 'PRODUCTS_GET_PRODUCTS', payload: data};
};

export const fetchProducts = () => {
    return (dispatch, getState) => {
        return (getProducts('').data)
            .then(response => {
                dispatch(setProducts(response));
                return response;
            })
            .catch(error => {
                return Promise.reject(error);
            });
    }
}