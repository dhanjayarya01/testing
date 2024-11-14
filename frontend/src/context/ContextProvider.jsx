import React,{useState} from "react";
import {ApiContext} from "./Context";
import ApiService from "../api/Apiservice";

const ApiProvider=({children})=>{
    const[isLoggedIn,setIsLoggedIn]=useState(false)
    const[currentuserinfo,setCurrentuserinfo]=useState({})
  
    const defaultValue={
        apiContext:new ApiService(), 
        isLoggedIn,
        currentuserinfo,
        setCurrentuserinfo,
        setIsLoggedIn,
       
}

return (
    <ApiContext.Provider value={defaultValue}>
        {children}
    </ApiContext.Provider>
)

}

export default ApiProvider