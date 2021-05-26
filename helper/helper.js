const axios = require('axios');
const priority = require('priority-web-sdk');

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

const configuration = {
    appname: 'demo',
    username: 'API',
    password: '12345678',
    appid: 'APP006',
    appkey: 'F40FFA79343C446A9931BA1177716F04',
    url: 'https://pri.paneco.com',
    tabulaini: 'tabula.ini',
    language: 3,
    profile: {
        company: 'a190515',
    },
    devicename: 'Roy',
};

exports.closeInvoice = async (IVNUM) => {
    return new Promise((resolve, reject) => {
        try {
            let errorMessage = '';
            let filter = {
                or: 0,
                ignorecase: 1,
                QueryValues: [
                    {
                        field: 'IVNUM',
                        fromval: IVNUM,
                        op: '=',
                        sort: 0,
                        isdesc: 0,
                    },
                ],
            };
            priority
                .login(configuration)
                .then(() =>
                    priority.formStart(
                        'AINVOICES',
                        function onShowMessge(message) {
                            errorMessage = message.message;
                            reject({ message: errorMessage })
                        },
                        null,
                        configuration.profile,
                        1
                    )
                )
                .then(async (form) => {
                    await form.setSearchFilter(filter);
                    await form.getRows(1);
                    await form.setActiveRow(1);
                    await form.activateStart('CLOSEANINVOICE', 'P').then(async (activateFormResponse) => {
                        console.log("activateFormResponse : ", activateFormResponse)
                        let end = await form.activateEnd();
                        resolve({ message: "Invoice close successfully", activateStartFormResponse: activateFormResponse })
                    }).catch(err => {
                        reject({ message: err.message })
                    });
                })
                .catch((err) => {
                    reject({ message: err.message })
                });
        } catch (err) {
            reject({ message: "Getting error into close invoice API" })
        }
    })
}