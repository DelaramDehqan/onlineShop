import http from 'services/http.service';

export async function getOrders(config) {
    try {
        const response = await http.get(`/orders` , config);
        return response;
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function patchOrder(data , id){
    try{
        const response = await http.patch('/orders' , data , id)
        return response
    }catch (e){
        return Promise.reject(e)
    }
}

export async function deleteOrder(id){
    try{
        const response = await http.delete('/orders',id)
        return response
    } catch (e){
        return Promise.reject(e)
    }
}

export async function postOrder(data){
    try{
        const response = await http.post('/orders/',data)
        return response
    }catch (e){
        return Promise.reject(e)
    }
}
