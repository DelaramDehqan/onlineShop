const initialState = {
    products: []
};

const ProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PRODUCTS_GET_PRODUCTS':
            return {...state, products: action.payload};
        default:
            return state;
    }
};

export {ProductReducer};


