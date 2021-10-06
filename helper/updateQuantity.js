const { axiosFunction } = require("./helper");

exports.updateQuantity = async (items, IVNUM, username, palletNo, packNumber) => {
    return new Promise(async (resolve, reject) => {
        const apiHeader = { "content-type": "application/json; odata.metadata=minimal; odata.streaming=true", "odata-version": "4.0", "X-App-Id": "APP006", "X-App-Key": "F40FFA79343C446A9931BA1177716F04" }
        let apiArray = [{
            "method": "PATCH",
            "atomicityGroup": "l1",
            "url": `https://pri.paneco.com/odata/Priority/tabula.ini,2/a190515/AINVOICES(IVNUM='${IVNUM}',IVTYPE='A',DEBIT='D')`,
            "headers": apiHeader,
            "id": "h1",
            "body": {
                "STATDES": "Packed"
            }
        }];

        let counter = 1;
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
        const temp = { "requests": apiArray };
        await axiosFunction(batchAPIURL, 'POST', { "requests": apiArray })
            .then(basketList => {
                resolve({ patchApiReq: temp, patchApiResp: basketList })
            })
            .catch((error) => { })
    })
}