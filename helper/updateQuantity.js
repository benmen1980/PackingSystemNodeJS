const { axiosFunction } = require("./helper");

exports.updateQuantity = async (items, IVNUM, username) => {
    return new Promise(async (resolve, reject) => {
        const apiHeader = { "content-type": "application/json; odata.metadata=minimal; odata.streaming=true", "odata-version": "4.0", "X-App-Id": "APP006", "X-App-Key": "F40FFA79343C446A9931BA1177716F04" }
        let apiArray = [{
            "method": "PATCH",
            "atomicityGroup": "g1",
            "url": `https://pri.paneco.com/odata/Priority/tabula.ini/a190515/AINVOICES(IVNUM='${IVNUM}',IVTYPE='A',DEBIT='D')`,
            "headers": apiHeader,
            "id": "g1",
            "body": {
                "DETAILS": username,
                // "ROYY_PALLETNUM": "PL003215",
                // "ROYY_ACTUAL_PACK_QTY": 5
            }
        }];

        let counter = 2;
        for (let singleItem of items) {
            let apiObj = { method: "PATCH" };
            apiObj.atomicityGroup = `g${counter}`,
                apiObj.url = `https://pri.paneco.com/odata/Priority/tabula.ini/a190515/AINVOICES(IVNUM='${singleItem.IVNUM}',IVTYPE='A',DEBIT='D')/AINVOICEITEMS_SUBFORM(${singleItem.kLine})`;
            apiObj.headers = apiHeader,
                apiObj.id = `g1`;
            apiObj.body = { "QUANT": parseInt(singleItem.current_Qty) };
            apiArray.push(apiObj);
            counter++;
        }

        const batchAPIURL = 'https://pri.paneco.com/odata/Priority/tabula.ini/a190515/$batch';
        await axiosFunction(batchAPIURL, 'POST', { "requests": apiArray })
            .then(basketList => {
                // basketList.responses.map(e => {
                //     console.log("e : ", e.body);
                // })
            })
            .catch((error) => console.log("error -- ", error))
        resolve({ message: "Data update successfully." })
    })
}