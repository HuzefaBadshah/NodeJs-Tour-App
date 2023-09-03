import axios from "axios";
import { showALert } from "./alert";

// type is either password/data
export async function updateSettings(data, type) {
    // relative urls
    const url = type === 'password' ? '/api/v1/users/updateMyPassword' 
                                    : '/api/v1/users/updateMe';
    try {
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if(res.data.status === 'success') {
            showALert('success', `${type.toUpperCase()} updated successfully!`);
        }

    }catch(err) {
        showALert('error', err.response.data.message);
    }
}