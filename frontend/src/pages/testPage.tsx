import { GoogleLogin } from "@react-oauth/google"
import {jwtDecode} from 'jwt-decode'
const testPage = () => {
    return (
        <div>
            <GoogleLogin onSuccess={
                (credentialResponse) => {
                    if(credentialResponse.credential)
                        console.log(jwtDecode(credentialResponse.credential))
                }
            } onError={() => {

                console.log("error")
            }
            } 
             />
        </div>
    )
}

export default testPage