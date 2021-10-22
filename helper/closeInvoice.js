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
    return;
}

exports.closeInvoice = async (IV) => {
    return new Promise((resolve, reject) => {
        try {
            priority
                .login(configuration)
                .then(() => {
                    return priority.procStart('CLOSEANINVOICE', 'P', onProgress, configuration.profile.company);
                })
                .then(async (procStepResult) => {

                    let data = procStepResult.input.EditFields;
                    data[0].value = IV;

                    procStepResult = await procStepResult.proc.inputFields(1, { EditFields: data })

                    console.log('procStepResult =>', procStepResult);
                    if (procStepResult.messagetype === "information" && (procStepResult.message === "החשבונית/תזכיר הסתיימה." || procStepResult.message === "החשבונית נסגרה בהצלחה.")) {
                        resolve({ message: "Invoice close successfully", activateStartFormResponse: procStepResult })
                    } else {
                        reject({ message: procStepResult.message })
                    }
                })
                .catch((err) => {
                    reject({ message: err.message })
                });
        } catch (err) {
            reject({ message: err.message })
        }
    })
}