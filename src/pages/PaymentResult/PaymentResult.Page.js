import {useRef , useState} from "react";
import {postProduct} from "../../api/products.api"
import http from 'services/http.service';

const PaymentResult = () =>{
    const inputEl = useRef(null)
    const [images,setImages] = useState([])

    const changeInput = (event) =>{
        const data = new FormData()
        data.append('image',event.target.files[0])
        try{
            http.post('/upload',data).then(res=>{
                console.log(res)
                setImages([...images,`${res.data.filename}`])
                console.log(images)
            }).catch(e=>{
                console.log(e)
            })
        }catch (e){console.log(e)}
    }

    const uploadFile = async (e) => {
        e.preventDefault()
        const dataToSend = {
            "image":images
        }


        await postProduct(dataToSend);
    };


    return(
        <>
            <form action="" onSubmit={(event)=>uploadFile(event)}>
                <input onChange={(event)=>changeInput(event)} multiple={true} ref={inputEl} id='input' type="file"  accept='image/*'  />
                <input type="submit" />
            </form>
        </>
    )
}
export {PaymentResult}