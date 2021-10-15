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

function onProgress(proc, number) {
    console.log('proc---: ', proc, "---number--------", number);
}

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
                            // console.log("message ::::: ", message);
                            // if (message.type === "information" && message.message === " The invoice/memo has been finalized.") {
                            //     resolve({ message: message });
                            // } else {
                            //     reject({ message: message });
                            // }
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
                    await priority.procStart('LIEL_WWWSHOWAIV1_0', 'P', onProgress, configuration.profile.company).then(procStartResponse => {
                        console.log("procStartResponse : ", procStartResponse)
                        resolve({ message: "Invoice close successfully", procStartResponse: procStartResponse, procObj: procStartResponse })
                    }).catch(err => {
                        reject({ message: err.message })
                    });
                    // await form.activateStart('CLOSEANINVOICE', 'P').then(async (activateFormResponse) => {
                    //     formObj = form;
                    //     // console.log("activateFormResponse : ", activateFormResponse)
                    //     let end = await form.activateEnd();
                    //     formObj = form;
                    //     resolve({ message: "Invoice close successfully", activateStartFormResponse: activateFormResponse, formObj: form })
                    // }).catch(err => {
                    //     reject({ message: err.message })
                    // });
                })
                .catch((err) => {
                    reject({ message: err.message })
                });
        } catch (err) {
            reject({ message: "Getting error into close invoice API" })
        }
    })
}