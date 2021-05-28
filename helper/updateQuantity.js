const { axiosFunction } = require("./helper");

exports.updateQuantity = async (items) => {
    return new Promise(async (resolve, reject) => {
        for (let singleItem of items) {
            let itemUpdateUrl = `https://pri.paneco.com/odata/Priority/tabula.ini/a190515/AINVOICES(IVNUM='${singleItem.IVNUM}',IVTYPE='A',DEBIT='D')/AINVOICEITEMS_SUBFORM(${singleItem.kLine})`;
            await axiosFunction(itemUpdateUrl, 'patch', { "CARTONNUM": singleItem.current_Qty })
                .then(basketList => { })
                .catch((error) => { })
        }
        resolve({message: "Data update successfully."})
    })
}