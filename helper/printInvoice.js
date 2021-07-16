const priority = require('priority-web-sdk');

const configuration = {
    appname: 'demo',
    username: 'API',
    password: '12345678',
    appid: 'APP006',
    appkey: 'F40FFA79343C446A9931BA1177716F04',
    url: 'https://pri.paneco.com',
    tabulaini: 'tabula.ini',
    language: 1,
    profile: {
        company: 'a190515',
    },
    devicename: 'Roy',
};

function onProgress(proc, number) {
    console.log('proc---: ', proc, "---number--------", number);
}

exports.printInvoice = async (IVNUM) => {
    return new Promise((resolve, reject) => {
        try {
            priority
                .login(configuration)
                .then(async (loginResp) => {
                    return await priority.procStart('LIEL_WWWSHOWAIV1_0', 'P', onProgress, configuration.profile.company);
                })
                .then(async procStepResult => {

                    let data = procStepResult.input.EditFields;
                    data[0].value = IVNUM;

                    procStepResult = await procStepResult.proc.inputOptions(1 , 1);

                    const inputFieldsResult = await procStepResult.proc.inputFields(1, { EditFields: data })

                    // const documentOptionsResult = await procStepResult.proc.documentOptions(1, -103, 1)
                    const documentOptionsResult = await procStepResult.proc.documentOptions(1, -103, { pdf: 1, word: 0, mode: 'display' })

                    await procStepResult.proc.continueProc();
                    return documentOptionsResult;

                })
                .then(documentOptionsResult => {
                    resolve({ url: documentOptionsResult.Urls[0].url })
                })
                .catch((err) => {
                    // reject({ message: JSON.stringify(err) })
                    reject({ message: "Getting error into print invoice API" })
                });
        } catch (err) {
            reject({ message: "Getting error into print invoice API" })
        }
    })
}