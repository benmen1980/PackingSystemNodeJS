const { axiosFunction } = require("./helper");

exports.updateQuantity = async (items, IVNUM, username, palletNo, packNumber) => {
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
                "ROYY_PALLETNUM": palletNo,
                "ROYY_ACTUAL_PACK_QTY": parseInt(packNumber)
            }
        }];

        let counter = 2;
        for (let singleItem of items) {
            let apiObj = { method: "PATCH" };
            apiObj.atomicityGroup = `g${counter}`,
                apiObj.url = `https://pri.paneco.com/odata/Priority/tabula.ini/a190515/AINVOICES(IVNUM='${singleItem.IVNUM}',IVTYPE='A',DEBIT='D')/AINVOICEITEMS_SUBFORM(${singleItem.kLine})`;
            apiObj.headers = apiHeader,
                apiObj.id = `g1`;
            apiObj.body = { "CARTONNUM": singleItem.current_Qty };
            apiArray.push(apiObj);
            counter++;
        }

        const batchAPIURL = 'https://pri.paneco.com/odata/Priority/tabula.ini/a190515/$batch';
        const temp = { "requests": apiArray };
        // console.log(temp);
        await axiosFunction(batchAPIURL, 'POST', { "requests": apiArray })
            .then(basketList => {
                // basketList.responses.map(e => {
                //     console.log("e : ", e.body);
                // })
                resolve({ patchApiReq: temp, patchApiResp: basketList })

            })
            .catch((error) => {})
        // resolve({ message: "Data update successfully." })
    })
}