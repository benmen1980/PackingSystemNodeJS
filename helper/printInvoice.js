const priority = require('priority-web-sdk');

const configuration = {
    appname: 'demo',
    username: 'curve',
    password: 'df53dsf51c',
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

exports.printInvoice = async (IV) => {
    return new Promise((resolve, reject) => {
        try {
            priority
                .login(configuration)
                .then((loginResp) => {
                    return priority.procStart('LIEL_WWWSHOWAIV1_0', 'P', onProgress, configuration.profile.company);
                })
                .then(async procStepResult => {

                    let data = procStepResult.input.EditFields;
                    data[0].value = IV;

                    const inputFieldsResult = await procStepResult.proc.inputFields(1, { EditFields: data })

                    // const documentOptionsResult = await procStepResult.proc.documentOptions(1, -103, 1)
                    const documentOptionsResult = await procStepResult.proc.documentOptions(1, -103, { pdf: 0, word: 0, mode: 'display' })

                    await procStepResult.proc.continueProc();
                    return documentOptionsResult;

                })
                .then(documentOptionsResult => {
                    resolve({ url: documentOptionsResult.Urls[0].url })
                })
                .catch((err) => {
                    reject({ message: JSON.stringify(err) })
                });
        } catch (err) {
            reject({ message: JSON.stringify(err) })
        }
    })
}