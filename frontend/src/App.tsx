import { useEffect } from 'react'
import {GoogleOAuthProvider} from '@react-oauth/google'
import Router from './Routes/Router'

//zustand
import useUserStore from './store/userStore';

function App() {
  const addUser = useUserStore(state=> state.addUser)
    const checkUser = async () => {
    try {
      const access_token = localStorage.getItem("userToken");
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        const result = await response.json();
        // console.log(result);
        addUser({id:result.sub, name:result.name,profile:result.picture, email:result.email})
    } catch (err) {
      console.log(err);
      // navigate('/home')

    }
  };
  useEffect(() => {
    checkUser();
  });

  return (
    <div>
      {/* <Router /> */}
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router />
        </GoogleOAuthProvider>

    </div>
  )
}

export default App
