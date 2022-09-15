import http from 'services/http.service';export async function getProducts(config) {    try {        const response = await http.get(`/products`,config);        return response    } catch (e) {        return Promise.reject(e);    }}export async function deleteProduct(id){    try{        const response = await http.delete('/products',id)        return response    } catch (e){        return Promise.reject(e)    }}export async function postProduct(data){    try{        const response = await http.post('/products/',data)        return response    }catch (e){        return Promise.reject(e)    }}export async function patchProduct(data,id){    try{        const response = await http.patch('/products' , data , id)        return response    }catch (e){        return Promise.reject(e)    }}export async function getProductWithId(id){    try{        const response = await http.getId('/products' , id)        return response    }catch (e){        return Promise.reject(e)    }}