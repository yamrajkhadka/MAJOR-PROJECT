import React from "react";
import { useNavigate } from "react-router-dom";
//zustand
import useUserStore from "../store/userStore";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const user = useUserStore(state =>state.user)
  if(user)
    return <>{children}</>
  else
    navigate('/')

};

export default ProtectedRoutes