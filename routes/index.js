var express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
var router = express.Router();
const { axiosFunction } = require('../helper/helper');


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
    const basketUrl = `https://pri.paneco.com/odata/Priority/tabula.ini/a190515/AINVOICES?$filter=ROYY_TRANSPORTMEAN eq '${req.body.basket_number}' &$expand=AINVOICEITEMS_SUBFORM($select=KLINE,PARTNAME,PDES,TQUANT,PRICE,CARTONNUM)&$select=IVNUM,CDES,IVDATE,DEBIT,IVTYPE,ROYY_TRANSPORTMEAN`;
    axiosFunction(basketUrl, 'get')
      .then(basketList => {
        if (basketList.value.length > 0) {
          let html = `<tbody>
					      <tr>
	                 	<th>נסרק</th>
	                  	<th>כמות</th>
	                   	<th>תאור</th>
	                    <th>מקט</th>
	                    <th>KLINE</th>
	              </tr>`;
          let counter = 0;
          let ivnum = '';
          basketList.value.forEach(singleValue => {
            ivnum = singleValue.IVNUM;
            singleValue.AINVOICEITEMS_SUBFORM.forEach(singleAINVOICEITEMS_SUBFORM => {
              qty = singleAINVOICEITEMS_SUBFORM.TQUANT;
              des = singleAINVOICEITEMS_SUBFORM.PDES;
              sku = singleAINVOICEITEMS_SUBFORM.PARTNAME;
              kline = singleAINVOICEITEMS_SUBFORM.KLINE;
              html += `<tr class="item_row" data-id="${counter}">`;
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
              html += `<td class="itemdesc">${des}</td>`;
              html += `<td class="itemsku" data-sku="${sku}">${sku}</td>`;
              html += `<td class="kline">${kline}</td>`;
              html += `<td class="IVNUM" hidden>${singleValue.IVNUM}</td>`;
              html += `</tr>`;
              counter++;
            })
          });
          html += '</tbody>';

          res.status(200).json({ status: 1, content: html, ivnum: ivnum, IVNUM: basketList.value[0].IVNUM, ROYY_TRANSPORTMEAN: basketList.value[0].ROYY_TRANSPORTMEAN })
        }
        else {
          res.status(200).json({ status: 0, message: res.__('No data found!') })
        }
      })
      .catch((error) => {
        res.status(200).json({ status: 0, message: res.__('No data found!') })
      })
  } catch (error) {
    res.status(200).json({ status: 0, message: res.__('No data found!') })
  }
})


router.post('/update_quantity', async (req, res, next) => {
  try {
    req.body.Items = JSON.parse(req.body.Items)
    if (req.body.Items.length > 0) {
      let itemUpdateUrl = ''
      let responseFlag = false;


      for (let singleItem of req.body.Items) {

        itemUpdateUrl = `https://pri.paneco.com/odata/Priority/tabula.ini/a190515/AINVOICES(IVNUM='${singleItem.IVNUM}',IVTYPE='A',DEBIT='D')/AINVOICEITEMS_SUBFORM(${singleItem.kLine})`;
        await axiosFunction(itemUpdateUrl, 'patch', { "CARTONNUM": singleItem.current_Qty })
          .then(basketList => {
            responseFlag = true;
          })
          .catch((error) => {
            // responseFlag = false;
            responseFlag = true;
          })

      }

      res.status(200).json({ status: responseFlag, originURL: `${req.headers.origin}/user/home`, message: res.__('The data are successfully updated') })

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
  res.status(200).json({ status: 1, noDataFoundLabel: res.__('No data found!'), fillRequiredFieldsLabel: res.__('Please fill out the required fields') })

})
module.exports = router;
