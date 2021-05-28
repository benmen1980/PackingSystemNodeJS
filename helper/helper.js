const axios = require('axios');

exports.axiosFunction = async (apiUrl, method, payloadData = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            await axios({
                method: method,
                url: apiUrl,
                auth: {
                    username: 'API',
                    password: '12345678'
                },
                headers: {
                    'X-App-Id': 'APP006',
                    'X-App-Key': 'F40FFA79343C446A9931BA1177716F04',
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                data: payloadData
            })
                .then((response) => {
                    // console.log(response.data.value);
                    resolve(response.data)
                })
                .catch((error) => {
                    reject({ error: error.message });
                })
        } catch (error) {
            reject({ error: error.message });
        }
    })
}