import React from "react";
import {Header} from "./components";

const UserLayout = (props) =>{
    return(
        <>
            <Header />
            <div style={{width:'100%' ,direction:'ltr', marginTop:'10rem' }}>
                {props.children}
            </div>
        </>
    )
}

export {UserLayout}