const priority = require('priority-web-sdk');

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
            let formObj;
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
                            // console.log("message ::::: ", message);
                            if (message.type === "information" && message.message === " The invoice/memo has been finalized.") {
                                resolve({ message: message, formObj: formObj });
                            } else {
                                reject({ message: message, formObj: formObj });
                            }
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
                    formObj = form;
                    await form.activateStart('CLOSEANINVOICE', 'P').then(async (activateFormResponse) => {
                        formObj = form;
                        // console.log("activateFormResponse : ", activateFormResponse)
                        let end = await form.activateEnd();
                        resolve({ message: "Invoice close successfully", activateStartFormResponse: activateFormResponse, formObj: form })
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