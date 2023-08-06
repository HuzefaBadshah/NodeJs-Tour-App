import axios from "axios";
import { showALert } from "./alert";

export async function login({email, password}) {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:7000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if(res.data.status === 'success') {
            showALert('success', 'logged in successfully');
            window.setTimeout(()=> {
                location.assign('/');
            }, 1000);
        }
        console.log('login res: ', res);
    }catch(err) {
        console.log('login error: ', err);
        showALert('error', err.response.data.message);
    }
}

