var express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
var router = express.Router();
const { axiosFunction } = require('../helper/helper');
const { closeInvoice } = require('../helper/closeInvoice');
const { printInvoice, printInvoiceOnSubmit } = require('../helper/printInvoice');
const { updateQuantity } = require('../helper/updateQuantity');


router.get('/', function (req, res, next) {
  try {
    res.render('home', {
      errorResp: false,
      packingSystemLabel: res.__('Packing system'),
      pLabel: res.__('P'),
      adminLoginLabel: res.__('Admin Login'),
      palletNoLabel: res.__('Pallet No.'),
      distributionNumberLabel: res.__('Distribution Number'),
      userLoginLabel: res.__('User Login'),
      usernameLabel: res.__('Username'),
      loginLabel: res.__('Login'),
      errorMessageLabel: res.__('Enter your valid credential.')
    });

  } catch (error) {
    res.status(200).json({ status: 0 })
  }
});

router.post('/fetchbasket', (req, res, next) => {
  try {
    const basketUrl = `https://pri.paneco.com/odata/Priority/tabula.ini/a190515/AINVOICES?$filter=(ROYY_TRANSPORTMEAN eq '${req.body.basket_number}' or PNCO_WEBNUMBER eq '${req.body.basket_number}') and FINAL ne 'Y'  and ROYY_ORDSTATUS eq -4&$expand=PAYMENTDEF_SUBFORM($select=PAYACCOUNT),SHIPTO2_SUBFORM($select=ADDRESS,PHONENUM,STATE),AINVOICEITEMS_SUBFORM($select=KLINE,BARCODE,PDES,CARTONNUM,TQUANT,PRICE,Y_9965_5_ESHB,PNCO_CONTENT ;$filter= Y_9965_5_ESHB eq 'YES' ;$expand= VMSF_PARTBARCODES_SUBFORM)&$select=IV,IVNUM,CDES,IVDATE,DEBIT,IVTYPE,ROYY_TRANSPORTMEAN,PNCO_WEBNUMBER,CDES,ORDNAME,PNCO_REMARKS,QAMT_SHIPREMARK,STCODE,STDES,PNCO_NUMOFPACKS,ROYY_ORDSTATUS`;
    axiosFunction(basketUrl, 'get')
      .then(basketList => {
        if (basketList.value.length > 0) {
          let html = `<tbody>
					      <tr>
	                 	<th>נסרק</th>
	                  	<th>כמות</th>
	                  	<th>תכולה</th>
	                   	<th>תאור</th>
	                    <th>מקט</th>
                      <th></th>
	                    <th>KLINE</th>
	              </tr>`;
          let counter = 0;
          let ivnum = '';
          basketList.value.forEach(singleValue => {
            ivnum = singleValue.IVNUM;
            singleValue.AINVOICEITEMS_SUBFORM.forEach(singleAINVOICEITEMS_SUBFORM => {
              let qty = singleAINVOICEITEMS_SUBFORM.TQUANT;
              let des = singleAINVOICEITEMS_SUBFORM.PDES;
              let sku = singleAINVOICEITEMS_SUBFORM.BARCODE;
              let kline = singleAINVOICEITEMS_SUBFORM.KLINE;
              let PNCO_CONTENT = singleAINVOICEITEMS_SUBFORM.PNCO_CONTENT;

              let VMSF_BARCODE_SUBFORM = '';
              let VMSF_BARCODE_SUBFORM_ARRAY = singleAINVOICEITEMS_SUBFORM.VMSF_PARTBARCODES_SUBFORM.map(e => e.VMSF_BARCODE);
              let VMSF_BARCODE_SUBFORM_length = singleAINVOICEITEMS_SUBFORM.VMSF_PARTBARCODES_SUBFORM.length;
              singleAINVOICEITEMS_SUBFORM.VMSF_PARTBARCODES_SUBFORM.filter(e => {
                if (VMSF_BARCODE_SUBFORM_length > 1) {
                  VMSF_BARCODE_SUBFORM = VMSF_BARCODE_SUBFORM + e.VMSF_BARCODE + '\n';
                } else {
                  VMSF_BARCODE_SUBFORM = VMSF_BARCODE_SUBFORM + e.VMSF_BARCODE;
                }
              })

              let CARTONNUM = singleAINVOICEITEMS_SUBFORM.CARTONNUM ? parseInt(singleAINVOICEITEMS_SUBFORM.CARTONNUM) : 0;
              html += `<tr class="item_row ${(CARTONNUM > qty) ? 'active-red' : (CARTONNUM > 0 && CARTONNUM < qty) ? 'active-yellow' : (CARTONNUM === qty) ? 'active-green' : ''}" data-id="${counter}">`;
              html += `<td class="qtybox">
	                            <div class="number-input md-number-input">
	                              <input class="quantity" min="0" name="quantity" value="${singleAINVOICEITEMS_SUBFORM.CARTONNUM ? singleAINVOICEITEMS_SUBFORM.CARTONNUM : 0}" type="number">
	                              <div class="qty-btn">
	                                <button class="plus qtybox-btn"><i class="fa fa-sort-asc" aria-hidden="true"></i></button>
                                    <button class="minus qtybox-btn"><i class="fa fa-caret-down" aria-hidden="true"></i></button>
	                              </div>
	                            </div>
	                        </td>`;
              html += `<td class="totalqty">${qty}</td>`;
              html += `<td class="CONTENT">${PNCO_CONTENT}</td>`;
              html += `<td class="itemdesc">${des}</td>`;
              html += `<td class="itemsku" data-sku="${sku}">${sku}</td>`;
              html += `<td class="Popup" data-toggle="modal" data-target="#barcodeSubformModel">*</td>`;
              if (VMSF_BARCODE_SUBFORM_length > 0) {
                html += `<td class="kline">${kline}<span class="tooltiptext">${VMSF_BARCODE_SUBFORM}</span> </td>`;
              } else {
                html += `<td class="kline">${kline}</td>`;
              }
              html += `<td class="IVNUM" hidden>${singleValue.IVNUM}</td>`;
              html += `<td class="VMSF_BARCODE_SUBFORM" hidden>${JSON.stringify(VMSF_BARCODE_SUBFORM_ARRAY)}</td>`;
              html += `</tr>`;
              counter++;
            })
            return;
          });
          html += '</tbody>';

          res.status(200).json({
            status: 1, basketRequestUrl: basketUrl, content: html, ivnum: ivnum,
            IVNUM: basketList.value[0].IVNUM,
            IV: basketList.value[0].IV,
            ROYY_TRANSPORTMEAN: basketList.value[0].ROYY_TRANSPORTMEAN,
            ORDNAME: basketList.value[0].ORDNAME, CDES: basketList.value[0].CDES,
            SHIPTO2_SUBFORM_ADDRESS: (basketList.value[0].SHIPTO2_SUBFORM) ? basketList.value[0].SHIPTO2_SUBFORM.ADDRESS : '',
            SHIPTO2_SUBFORM_PHONENUM: (basketList.value[0].SHIPTO2_SUBFORM) ? basketList.value[0].SHIPTO2_SUBFORM.PHONENUM : '',
            SHIPTO2_SUBFORM_STATE: (basketList.value[0].SHIPTO2_SUBFORM) ? basketList.value[0].SHIPTO2_SUBFORM.STATE : '',
            PNCO_WEBNUMBER: basketList.value[0].PNCO_WEBNUMBER,
            PAYMENTDEF_SUBFORM_PAYACCOUNT: (basketList.value[0].PAYMENTDEF_SUBFORM) ? basketList.value[0].PAYMENTDEF_SUBFORM.PAYACCOUNT : '',
            PNCO_REMARKS: basketList.value[0].PNCO_REMARKS,
            QAMT_SHIPREMARK: basketList.value[0].QAMT_SHIPREMARK,
            PNCO_NUMOFPACKS: basketList.value[0].PNCO_NUMOFPACKS,
            STCODE: basketList.value[0].STCODE,
            STDES: basketList.value[0].STDES,
          })
        }
        else {
          res.status(200).json({ status: 0, message: res.__('No data found!'), basketRequestUrl: basketUrl })
        }
      })
      .catch((error) => {
        console.log("error: ", error)
        res.status(200).json({ status: 0, message: res.__('No data found!'), basketRequestUrl: basketUrl })
      })
  } catch (error) {
    console.log("error: ", error)
    res.status(200).json({ status: 0, message: res.__('No data found!') })
  }
})


router.post('/update_quantity_with_close_invoice', async (req, res, next) => {
  let closeInvoiceResp;
  let printInvoiceResp = {};
  let updateResp = {};
  try {
    req.body.Items = JSON.parse(req.body.Items)
    if (req.body.Items.length > 0) {
      const username = req.cookies['username'];
      updateResp = await updateQuantity("completed", req.body.Items, req.body.IVNUM, username, req.body.palletNo, req.body.packNumber);
      closeInvoiceResp = await closeInvoice(req.body.IV);
      printInvoiceResp = await printInvoice(req.body.IV);
      res.status(200).json({ status: 1, originURL: `${req.headers.origin}/user/home`, message: res.__('The data are successfully updated'), ...updateResp, closeInvoiceResp: closeInvoiceResp, printInvoiceResp: printInvoiceResp })
    }

  } catch (error) {
    res.status(200).json({ status: 0, originURL: `${req.headers.origin}/user/home`, ...updateResp, error: error, message: res.__('Error while updating the data') })
  }
})

router.post('/update_quantity', async (req, res, next) => {
  try {
    req.body.Items = JSON.parse(req.body.Items)
    if (req.body.Items.length > 0) {
      const username = req.cookies['username'];

      const updateResp = await updateQuantity("suspended", req.body.Items, req.body.IVNUM, username, req.body.palletNo, req.body.packNumber);
      res.status(200).json({ status: 1, originURL: `${req.headers.origin}/user/home`, message: res.__('The data are successfully updated'), ...updateResp })
    }

  } catch (error) {
    res.status(200).json({ status: 0, originURL: `${req.headers.origin}/user/home`, message: res.__('Error while updating the data') })
  }
})


/**User login API */
router.post('/', async function (req, res, next) {
  try {
    const data = fs.readFileSync('./helper/manageUser.json', 'utf8');
    const obj = JSON.parse(data);
    const returnUser = obj.users.find((element) => {
      return element.username == req.body.username;
    });

    if (returnUser) {
      const comparePassword = await bcrypt.compare(req.body.password, returnUser.password);
      if (comparePassword) {
        res.cookie('username', returnUser.username, { httpOnly: true });
        res.cookie('role', "user", { httpOnly: true });
        res.redirect('/user/home');
      }
      else {
        res.render('home', {
          palletNo: [], errorResp: true, packingSystemLabel: res.__('Packing system'),
          pLabel: res.__('P'),
          adminLoginLabel: res.__('Admin Login'),
          palletNoLabel: res.__('Pallet No.'),
          distributionNumberLabel: res.__('Distribution Number'),
          userLoginLabel: res.__('User Login'),
          usernameLabel: res.__('Username'),
          loginLabel: res.__('Login'),
          errorMessageLabel: res.__('Enter your valid credential.'),
        })
      }

    } else {
      res.render('home', {
        palletNo: [], errorResp: true, packingSystemLabel: res.__('Packing system'),
        pLabel: res.__('P'),
        adminLoginLabel: res.__('Admin Login'),
        palletNoLabel: res.__('Pallet No.'),
        distributionNumberLabel: res.__('Distribution Number'),
        userLoginLabel: res.__('User Login'),
        usernameLabel: res.__('Username'),
        loginLabel: res.__('Login'),
        errorMessageLabel: res.__('Enter your valid credential.'),
      })
    }
  } catch (error) {
    res.render('home', {
      palletNo: [], errorResp: true, packingSystemLabel: res.__('Packing system'),
      pLabel: res.__('P'),
      adminLoginLabel: res.__('Admin Login'),
      palletNoLabel: res.__('Pallet No.'),
      distributionNumberLabel: res.__('Distribution Number'),
      userLoginLabel: res.__('User Login'),
      usernameLabel: res.__('Username'),
      loginLabel: res.__('Login'),
      errorMessageLabel: res.__('Enter your valid credential.'),
    });
  }
});


router.post('/fetchmessage', function (req, res, next) {
  res.status(200).json({
    status: 1, noDataFoundLabel: res.__('No data found!'), fillRequiredFieldsLabel: res.__('Please fill out the required fields'), closeinvoiceLabel: res.__('Close invoice'), CloseInvoiceInProgressLabel: res.__('Close invoice in-progress'),
    printinvoiceLabel: res.__('Print invoice'), printingInvoiceLabel: res.__('Printing invoice')
  })

})

router.post('/close_invoice', async function (req, res, next) {
  try {
    console.log('req.body.IV =>', req.body.IV);
    if (req.body.IV === "") {
      return res.status(200).json({ message: "Please select valid IV" })
    }
    await closeInvoice(req.body.IV)
      .then(closeInvoiceResp => {
        res.status(200).json({ ...closeInvoiceResp })
      })
      .catch(error => {
        res.status(200).json({ ...error })
      })
  } catch (error) {
    res.status(200).json({ message: "Getting error into close invoice API" })
  }
})

router.post('/print_invoice', async function (req, res, next) {
  try {
    if (req.body.IV === "") {
      return res.status(200).json({ message: "Please select valid IV" })
    }
    await printInvoice(req.body.IV)
      .then(printInvoiceResp => {
        res.status(200).json({ status: 1, ...printInvoiceResp })
      })
      .catch(error => {
        res.status(200).json({ status: 0, ...error })
      })
  } catch (error) {
    res.status(200).json({ status: 0, message: "Getting error into print invoice API" })
  }
})
module.exports = router;
