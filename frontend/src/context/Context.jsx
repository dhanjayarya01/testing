import React from "react";
import { createContext } from "react";
import ApiService from "../api/Apiservice";


export const ApiContext=createContext({
     apiContext:new ApiService(),
     isLoggedIn:true,
     currentuserinfo:"",
    

    setCurrentuserinfo:()=>{},
    setIsLoggedIn:()=>{},
  
})

export default ApiContext