jQuery(document).ready(function () {
	let noDataFoundLabel = '';
	let fillRequiredFieldsLabel = '';
	let closeinvoiceLabel = '';
	let CloseInvoiceInProgressLabel = '';
	let printInvoiceLabel = '';
	let printingInvoiceLabel = '';

	jQuery.ajax({

		url: '/fetchmessage',
		type: 'POST',
		data: {},
		success: function (resp) {

			let obj = resp;

			if (obj.status == 1) {
				noDataFoundLabel = obj.noDataFoundLabel;
				fillRequiredFieldsLabel = obj.fillRequiredFieldsLabel;
				closeinvoiceLabel = obj.closeinvoiceLabel;
				CloseInvoiceInProgressLabel = obj.CloseInvoiceInProgressLabel;
				printInvoiceLabel = obj.printInvoiceLabel;
				printingInvoiceLabel = obj.printingInvoiceLabel;
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR.status);
		}

	});

	jQuery(".logout").click(function () {
		jQuery(".user-nav").hide();
		jQuery(".user_login_area").show();
		jQuery(".form-response").html('');
	});

	jQuery('body').on('click', '.qtybox-btn', function () {
		var qty = jQuery(this).parents(".number-input").find('.quantity').val();
		var new_qty = 0;

		if (jQuery(this).hasClass('plus')) {
			new_qty = parseInt(qty) + 1;
		} else {
			new_qty = parseInt(qty) - 1;
			if (new_qty < 0) {
				new_qty = 0;
			}
		}

		jQuery(this).parents(".number-input").find('.quantity').val(new_qty);
		// jQuery(this).parents(".item_row").find(".totalqty").text(new_qty);
	});

	jQuery('.table-items').on('click', '.item_row', function () {

		jQuery('.table-items .item_row').each(function () {
			let scan_quantity = jQuery(this).find('.quantity').val();
			let item_quantity = jQuery(this).find('.totalqty').html();
			if (parseInt(scan_quantity) > parseInt(item_quantity)) {
				jQuery(this).addClass('active-red');
			} else if (parseInt(scan_quantity) > 0 && parseInt(scan_quantity) < parseInt(item_quantity)) {

				jQuery(this).addClass('active-yellow');

			} else if (parseInt(scan_quantity) === parseInt(item_quantity)) {
				jQuery(this).addClass('active-green');

			}
			else {
				jQuery(this).removeClass('active');
				jQuery(this).removeClass('active-red');
				jQuery(this).removeClass('active-yellow');
				jQuery(this).removeClass('active-green');
			}
		});

		jQuery(this).removeClass('active-yellow');
		jQuery(this).removeClass('active-green');
		jQuery(this).removeClass('active-red');
		jQuery(this).addClass('active');
		jQuery(this).siblings().removeClass('active');

	});


	jQuery('.scanbasket').on('focusout', function () {
		var basket_num = jQuery(this).val();
		var $this = jQuery(this);

		if (basket_num) {

			jQuery(".scanitem").parents('.form-group').show();

			jQuery.ajax({

				url: '/fetchbasket',
				type: 'POST',
				data: {
					'action': 'fetchbasket',
					'basket_number': basket_num
				},
				success: function (resp) {

					var obj = resp;

					if (obj.status == 1) {

						jQuery('.table-items').html(obj.content);
						jQuery('.alert').hide();
						$this.hide();

						/**Verify scan basket stcode and pallletno stcode */
						const palletNoStcode = jQuery('.pallet_no-STCODE label').text();
						if ((palletNoStcode === "") || (parseInt(palletNoStcode) !== parseInt(obj.STCODE))) {
							/**Hide the table and display error message */
							jQuery('#error_message_STCODE_not_eq_pallete_STCODE').show();
							jQuery('.btn').prop('disabled', true);
						}
						else {
							/**Hide the error message and display the table */
							jQuery('.item-table-wrapper').addClass('show-table');
							jQuery('.alert').hide();
							jQuery('.btn').prop('disabled', false);

						}

						if (obj.ivnum != '') {
							var hidden_field = '<input type="hidden" name="ivnum" class="ivnum" value="' + obj.ivnum + '">';
							jQuery(hidden_field).insertAfter('.table-items');
						}

						/**Dynamically IVNUM and ROYY_TRANSPORTMEAN display enable and set value in label */
						if (obj.IVNUM && obj.IVNUM !== "") {
							jQuery('.scanbasket-IVNUM').show();
							jQuery('.scanbasket-IVNUM label').text(obj.IVNUM);
							jQuery('.scanbasket-royy_transportmean').show();
							jQuery('.scanbasket-royy_transportmean label').text(obj.ROYY_TRANSPORTMEAN);
						}
						/*** ***/

						jQuery('.scanitem').show();

						/**Information section enable and set values */
						jQuery('.order_information_section').show();
						jQuery('.ORDNAME').text(obj.ORDNAME);
						jQuery('.CDES').text(obj.CDES);
						jQuery('.SHIPTO2_SUBFORM_ADDRESS').text(obj.SHIPTO2_SUBFORM_ADDRESS);
						jQuery('.SHIPTO2_SUBFORM_PHONENUM').text(obj.SHIPTO2_SUBFORM_PHONENUM);
						jQuery('.SHIPTO2_SUBFORM_STATE').text(obj.SHIPTO2_SUBFORM_STATE);

						jQuery('.PNCO_WEBNUMBER').text(obj.PNCO_WEBNUMBER);
						jQuery('.PNCO_REMARKS').text(obj.PNCO_REMARKS);
						jQuery('.QAMT_SHIPREMARK').text(obj.QAMT_SHIPREMARK);
						jQuery('.PAYMENTDEF_SUBFORM_PAYACCOUNT').text(obj.PAYMENTDEF_SUBFORM_PAYACCOUNT);
						jQuery('.PNCO_NUMOFPACKS').text(obj.PNCO_NUMOFPACKS);
						jQuery('.STCODE').text(obj.STCODE);
						jQuery('.STDES').text(obj.STDES);

						jQuery(".packs_number").val(obj.PNCO_NUMOFPACKS);
						/** */

					} else {
						// jQuery('.alert').html(obj.message);
						// jQuery('.alert').show();
						jQuery('#error_message').html(obj.message);
						jQuery('#error_message').show();
						jQuery('.product_table').removeClass('show-table');
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.status);
				}

			});

		}

	});

	jQuery('.scanbasket').keypress(function (event) {

		var keycode = (event.keyCode ? event.keyCode : event.which);
		var $this = jQuery(this);

		if (keycode == '13') {

			var basket_num = jQuery(this).val();

			if (basket_num) {

				jQuery(".scanitem").parents('.form-group').show();

				jQuery.ajax({

					url: '/fetchbasket',
					type: 'POST',
					data: {
						'action': 'fetchbasket',
						'basket_number': basket_num
					},
					success: function (resp) {

						var obj = resp;

						if (obj.status == 1) {

							jQuery('.table-items').html(obj.content);
							jQuery('.alert').hide();
							$this.hide();

							/**Verify scan basket stcode and pallletno stcode */
							const palletNoStcode = jQuery('.pallet_no-STCODE label').text();
							if ((palletNoStcode === "") || (parseInt(palletNoStcode) !== parseInt(obj.STCODE))) {
								/**Verify scan basket stcode and pallletno stcode */
								jQuery('#error_message_STCODE_not_eq_pallete_STCODE').show();
								jQuery('.btn').prop('disabled', true);
							}
							else {
								/**Hide the error message and display the table */
								jQuery('.item-table-wrapper').addClass('show-table');
								jQuery('.alert').hide();
								jQuery('.btn').prop('disabled', false);

							}

							if (obj.ivnum != '') {
								var hidden_field = '<input type="hidden" name="ivnum" class="ivnum" value="' + obj.ivnum + '">';
								jQuery(hidden_field).insertAfter('.table-items');
							}

							/**Dynamically IVNUM and ROYY_TRANSPORTMEAN display enable and set value in label */
							if (obj.IVNUM && obj.IVNUM !== "") {
								jQuery('.scanbasket-IVNUM').show();
								jQuery('.scanbasket-IVNUM label').text(obj.IVNUM);
								jQuery('.scanbasket-royy_transportmean').show();
								jQuery('.scanbasket-royy_transportmean label').text(obj.ROYY_TRANSPORTMEAN);
							}
							/*** ***/

							jQuery('.scanitem').show();


							/**Information section enable and set values */
							jQuery('.order_information_section').show();
							jQuery('.ORDNAME').text(obj.ORDNAME);
							jQuery('.CDES').text(obj.CDES);
							jQuery('.SHIPTO2_SUBFORM_ADDRESS').text(obj.SHIPTO2_SUBFORM_ADDRESS);
							jQuery('.SHIPTO2_SUBFORM_PHONENUM').text(obj.SHIPTO2_SUBFORM_PHONENUM);
							jQuery('.SHIPTO2_SUBFORM_STATE').text(obj.SHIPTO2_SUBFORM_STATE);

							jQuery('.PNCO_WEBNUMBER').text(obj.PNCO_WEBNUMBER);
							jQuery('.PNCO_REMARKS').text(obj.PNCO_REMARKS);
							jQuery('.QAMT_SHIPREMARK').text(obj.QAMT_SHIPREMARK);
							jQuery('.PAYMENTDEF_SUBFORM_PAYACCOUNT').text(obj.PAYMENTDEF_SUBFORM_PAYACCOUNT);
							jQuery('.PNCO_NUMOFPACKS').text(obj.PNCO_NUMOFPACKS);
							jQuery('.STCODE').text(obj.STCODE);
							jQuery('.STDES').text(obj.STDES);

							jQuery(".packs_number").val(obj.PNCO_NUMOFPACKS);
							/** */


						} else {

							// jQuery('.alert').html(obj.message);
							// jQuery('.alert').show();
							jQuery('#error_message').html(obj.message);
							jQuery('#error_message').show();
							// jQuery('.item-table-wrapper').removeClass('show-table');
							jQuery('.product_table').removeClass('show-table');

						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(jqXHR.status);
					}

				});

			}
		}
	});


	async function scanItemWithChangeQuantity(item_val) {
		const totalScanItemArray = []
		let flag = true;
		let count = 0;
		jQuery('.table-items .item_row').each(function () {
			let td_val = jQuery(this).find('.itemsku').attr('data-sku');
			let tooltiptext = jQuery(this).find('.VMSF_BARCODE_SUBFORM').html();
			tooltiptext = JSON.parse(tooltiptext);
			if (jQuery.trim(item_val) == jQuery.trim(td_val) || tooltiptext.includes(jQuery.trim(item_val))) {
				let current_qty = parseInt(jQuery(this).find('.quantity').val());
				let item_quantity = parseInt(jQuery(this).find('.totalqty').html());
				if (current_qty !== item_quantity) {
					flag = false;
				}
				count++;
			}

		})

		if (count > 1 && flag) {
			return true
		} else {
			return false
		}
	}

	jQuery('.scanitem').on('focusout', async function () {

		let items = [];
		let item_val = jQuery(this).val();
		let $this = jQuery(this);
		if (item_val !== "") {

			const isDifferentQuantity = await scanItemWithChangeQuantity(item_val);

			let totalSkuCount = 0;
			jQuery('.table-items .item_row').each(function () {

				let sku_val = jQuery(this).find('.itemsku').attr('data-sku');
				let tooltiptext = jQuery(this).find('.VMSF_BARCODE_SUBFORM').html();
				tooltiptext = JSON.parse(tooltiptext);
				if (jQuery.trim(item_val) == jQuery.trim(sku_val) || tooltiptext.includes(jQuery.trim(item_val))) {
					totalSkuCount++;
				}
			});

			jQuery('.table-items .item_row').each(function () {

				let td_val = jQuery(this).find('.itemsku').attr('data-sku');
				let tooltiptext = jQuery(this).find('.VMSF_BARCODE_SUBFORM').html();
				tooltiptext = JSON.parse(tooltiptext);
				items.push(td_val);
				items = [...items, ...tooltiptext];

				if (totalSkuCount > 1) {
					if (jQuery.trim(item_val) == jQuery.trim(td_val) || tooltiptext.includes(jQuery.trim(item_val))) {

						let current_qty = parseInt(jQuery(this).find('.quantity').val());
						let item_quantity = parseInt(jQuery(this).find('.totalqty').html());

						let new_qty = 0
						if (current_qty < item_quantity) {
							new_qty = current_qty + 1;
							jQuery(this).removeClass('active-red');
							jQuery(this).removeClass('active-yellow');
							jQuery(this).addClass('active');
							jQuery(this).siblings().removeClass('active');
							jQuery(this).find('.quantity').val(new_qty);
							jQuery('.item-table-wrapper').addClass('show-table');
							jQuery('.alert').hide();
							$this.val('');
							return false;
						} else {
							if (parseInt(current_qty) > parseInt(item_quantity)) {
								jQuery(this).addClass('active-red');
							}
							else if (current_qty === item_quantity) {
								jQuery(this).addClass('active-green');
							}
							jQuery(this).addClass('active');
							jQuery(this).siblings().removeClass('active');
							jQuery('.item-table-wrapper').addClass('show-table');
							jQuery('.alert').hide();
							$this.val('');
						}


						// jQuery(this).removeClass('active-red');
						// jQuery(this).addClass('active');
						// jQuery(this).siblings().removeClass('active');
						// jQuery(this).find('.quantity').val(new_qty);
						// // jQuery(this).find('.totalqty').text(new_qty);

						// jQuery('.item-table-wrapper').addClass('show-table');
						// jQuery('.alert').hide();

						// $this.val('');
					}
					else {
						// jQuery(this).removeClass('active');
						let scan_quantity = jQuery(this).find('.quantity').val();
						let item_quantity = jQuery(this).find('.totalqty').html();
						if (parseInt(scan_quantity) > parseInt(item_quantity)) {
							jQuery(this).addClass('active-red');
						} else if (parseInt(scan_quantity) > 0 && parseInt(scan_quantity) < parseInt(item_quantity)) {

							jQuery(this).addClass('active-yellow');

						} else if (parseInt(scan_quantity) === parseInt(item_quantity)) {
							jQuery(this).addClass('active-green');

						}
						else {
							jQuery(this).removeClass('active');
							jQuery(this).removeClass('active-red');
							jQuery(this).removeClass('active-yellow');
							jQuery(this).removeClass('active-green');
						}
					}
				}
				else {
					if (jQuery.trim(item_val) == jQuery.trim(td_val) || tooltiptext.includes(jQuery.trim(item_val))) {

						let current_qty = parseInt(jQuery(this).find('.quantity').val());
						let new_qty = current_qty + 1;

						jQuery(this).removeClass('active-red');
						jQuery(this).removeClass('active-yellow');
						jQuery(this).removeClass('active-green');
						jQuery(this).addClass('active');
						jQuery(this).siblings().removeClass('active');
						jQuery(this).find('.quantity').val(new_qty);
						// jQuery(this).find('.totalqty').text(new_qty);

						jQuery('.item-table-wrapper').addClass('show-table');
						jQuery('.alert').hide();

						$this.val('');
					}
					else {
						// jQuery(this).removeClass('active');
						let scan_quantity = jQuery(this).find('.quantity').val();
						let item_quantity = jQuery(this).find('.totalqty').html();
						if (parseInt(scan_quantity) > parseInt(item_quantity)) {
							jQuery(this).addClass('active-red');
						} else if (parseInt(scan_quantity) > 0 && parseInt(scan_quantity) < parseInt(item_quantity)) {

							jQuery(this).addClass('active-yellow');

						} else if (parseInt(scan_quantity) === parseInt(item_quantity)) {
							jQuery(this).addClass('active-green');

						}
						else {
							jQuery(this).removeClass('active');
							jQuery(this).removeClass('active-red');
							jQuery(this).removeClass('active-yellow');
							jQuery(this).removeClass('active-green');
						}
					}
				}

			});


			if (isDifferentQuantity) {
				jQuery('.table-items .item_row').each(function () {

					let td_val = jQuery(this).find('.itemsku').attr('data-sku');
					let tooltiptext = jQuery(this).find('.VMSF_BARCODE_SUBFORM').html();
					tooltiptext = JSON.parse(tooltiptext);
					if (jQuery.trim(item_val) == jQuery.trim(td_val) || tooltiptext.includes(jQuery.trim(item_val))) {

						let current_qty = parseInt(jQuery(this).find('.quantity').val());
						let new_qty = current_qty + 1;
						jQuery(this).removeClass('active-green');
						jQuery(this).addClass('active-red');
						jQuery(this).siblings().removeClass('active');
						jQuery(this).find('.quantity').val(new_qty);

						jQuery('.item-table-wrapper').addClass('show-table');
						jQuery('.alert').hide();

						$this.val('');
						return false;
					}

				});
			}

			if (jQuery.inArray(item_val, items) === -1) {
				// jQuery('.item-table-wrapper').removeClass('show-table');
				jQuery('#error_message').html(noDataFoundLabel);
				jQuery('#error_message').show();
			}
		}
	});

	jQuery('.scanitem').keypress(async function (event) {

		var keycode = (event.keyCode ? event.keyCode : event.which);

		if (keycode == '13') {

			var items = [];
			var item_val = jQuery(this).val();
			var $this = jQuery(this);

			if (item_val !== "") {

				const isDifferentQuantity = await scanItemWithChangeQuantity(item_val);

				let totalSkuCount = 0;
				jQuery('.table-items .item_row').each(function () {

					let sku_val = jQuery(this).find('.itemsku').attr('data-sku');
					let tooltiptext = jQuery(this).find('.VMSF_BARCODE_SUBFORM').html();
					tooltiptext = JSON.parse(tooltiptext);
					if (jQuery.trim(item_val) == jQuery.trim(sku_val) || tooltiptext.includes(jQuery.trim(item_val))) {
						totalSkuCount++;
					}
				});

				jQuery('.table-items .item_row').each(function () {

					let td_val = jQuery(this).find('.itemsku').attr('data-sku');
					let tooltiptext = jQuery(this).find('.VMSF_BARCODE_SUBFORM').html();
					tooltiptext = JSON.parse(tooltiptext);
					items.push(td_val);
					items = [...items, ...tooltiptext];

					if (totalSkuCount > 1) {
						if (jQuery.trim(item_val) == jQuery.trim(td_val) || tooltiptext.includes(jQuery.trim(item_val))) {

							let current_qty = parseInt(jQuery(this).find('.quantity').val());
							let item_quantity = parseInt(jQuery(this).find('.totalqty').html());

							let new_qty = 0
							if (current_qty < item_quantity) {
								new_qty = current_qty + 1;
								jQuery(this).removeClass('active-red');
								jQuery(this).removeClass('active-yellow');
								jQuery(this).addClass('active');
								jQuery(this).siblings().removeClass('active');
								jQuery(this).find('.quantity').val(new_qty);
								jQuery('.item-table-wrapper').addClass('show-table');
								jQuery('.alert').hide();
								$this.val('');
								return false;
							} else {
								if (parseInt(current_qty) > parseInt(item_quantity)) {
									jQuery(this).addClass('active-red');
								}
								else if (current_qty === item_quantity) {
									jQuery(this).addClass('active-green');
								}
								jQuery(this).addClass('active');
								jQuery(this).siblings().removeClass('active');
								jQuery('.item-table-wrapper').addClass('show-table');
								jQuery('.alert').hide();
								$this.val('');
							}
						}
						else {
							// jQuery(this).removeClass('active');
							let scan_quantity = jQuery(this).find('.quantity').val();
							let item_quantity = jQuery(this).find('.totalqty').html();
							if (parseInt(scan_quantity) > parseInt(item_quantity)) {
								jQuery(this).addClass('active-red');
							} else if (parseInt(scan_quantity) > 0 && parseInt(scan_quantity) < parseInt(item_quantity)) {

								jQuery(this).addClass('active-yellow');

							} else if (parseInt(scan_quantity) === parseInt(item_quantity)) {
								jQuery(this).addClass('active-green');

							}
							else {
								jQuery(this).removeClass('active');
								jQuery(this).removeClass('active-red');
								jQuery(this).removeClass('active-yellow');
								jQuery(this).removeClass('active-green');
							}
						}
					}
					else {
						if (jQuery.trim(item_val) == jQuery.trim(td_val) || tooltiptext.includes(jQuery.trim(item_val))) {

							let current_qty = parseInt(jQuery(this).find('.quantity').val());
							let new_qty = current_qty + 1;

							jQuery(this).removeClass('active-red');
							jQuery(this).removeClass('active-yellow');
							jQuery(this).removeClass('active-green');
							jQuery(this).addClass('active');
							jQuery(this).siblings().removeClass('active');
							jQuery(this).find('.quantity').val(new_qty);
							// jQuery(this).find('.totalqty').text(new_qty);

							jQuery('.item-table-wrapper').addClass('show-table');
							jQuery('.alert').hide();

							$this.val('');
						}
						else {
							// jQuery(this).removeClass('active');
							let scan_quantity = jQuery(this).find('.quantity').val();
							let item_quantity = jQuery(this).find('.totalqty').html();
							if (parseInt(scan_quantity) > parseInt(item_quantity)) {
								jQuery(this).addClass('active-red');
							} else if (parseInt(scan_quantity) > 0 && parseInt(scan_quantity) < parseInt(item_quantity)) {

								jQuery(this).addClass('active-yellow');

							} else if (parseInt(scan_quantity) === parseInt(item_quantity)) {
								jQuery(this).addClass('active-green');

							}
							else {
								jQuery(this).removeClass('active');
								jQuery(this).removeClass('active-red');
								jQuery(this).removeClass('active-yellow');
								jQuery(this).removeClass('active-green');
							}
						}
					}

				});


				if (isDifferentQuantity) {
					jQuery('.table-items .item_row').each(function () {

						let td_val = jQuery(this).find('.itemsku').attr('data-sku');
						let tooltiptext = jQuery(this).find('.VMSF_BARCODE_SUBFORM').html();
						tooltiptext = JSON.parse(tooltiptext);
						if (jQuery.trim(item_val) == jQuery.trim(td_val) || tooltiptext.includes(jQuery.trim(item_val))) {

							let current_qty = parseInt(jQuery(this).find('.quantity').val());
							let new_qty = current_qty + 1;
							jQuery(this).removeClass('active-green');
							jQuery(this).addClass('active-red');
							jQuery(this).siblings().removeClass('active');
							jQuery(this).find('.quantity').val(new_qty);

							jQuery('.item-table-wrapper').addClass('show-table');
							jQuery('.alert').hide();

							$this.val('');
							return false;
						}

					});
				}

				if (jQuery.inArray(item_val, items) === -1) {
					// jQuery('.item-table-wrapper').removeClass('show-table');
					jQuery('#error_message').html(noDataFoundLabel);
					jQuery('#error_message').show();
				}
			}
		}
	});

	// jQuery(".btn-complete").click(function () {
	// 	jQuery('.item-table-wrapper').hide();

	// 	jQuery('.scanbasket').show();
	// 	jQuery('.scanitem').hide();
	// 	jQuery('.item-table-wrapper').removeClass('show-table');
	// 	$('#scanbasket').val('');
	// });

	jQuery(".login_submit").click(function (e) {
		// e.preventDefault();
		var username = jQuery(".loginform .username").val();
		var password = jQuery(".loginform .password").val();
		var error = 0;

		if (username == '') {
			error = 1;
			jQuery(".loginform .username").addClass('input-error');
		} else {
			jQuery(".loginform .username").removeClass('input-error');
		}

		if (password == '') {
			error = 1;
			jQuery(".loginform .password").addClass('input-error');
		} else {
			jQuery(".loginform .password").removeClass('input-error');
		}

		if (error == 1) {
			jQuery('.form-response').html(
				`<div class="alert alert-danger" role="alert">${fillRequiredFieldsLabel}</div>`
			);
			return false;

		} else {
			// jQuery(".user_login_area").hide();
			// jQuery(".logged_user a").text(username);
			// jQuery(".user-nav").show();
			// jQuery(".loginform")[0].reset();
		}

	});


	/*jQuery(".qtybox-btn").click(function(){
		var qty = jQuery(this).parents(".number-input").find('.quantity').val();
		jQuery(this).parents(".item_row").find(".totalqty").text(qty);
	});*/

	/*jQuery(".item_row").click(function(){
		jQuery(this).toggleClass('active');
		jQuery(this).siblings().removeClass('active');
	});*/

	/*jQuery('.scanbasket').on('focus', function(){
		jQuery('.item-table-wrapper').show();
	});*/

	/*jQuery('.scanitem').on('focusout', function(){
		jQuery('.item-table-wrapper').hide();
	});*/

	$("select.pallet_no").change(function () {
		const selectedPalletNoValue = jQuery("select.pallet_no").children("option:selected").val();
		const selectedPalletNoText = jQuery("select.pallet_no").children("option:selected").text();
		if (selectedPalletNoValue && selectedPalletNoValue !== "") {
			const splitedText = selectedPalletNoText.split(' ');
			let STCODE = splitedText[2];
			const STDES = splitedText.slice(4).join(' ');
			// jQuery('.pallet_no-STCODE').show();
			jQuery('.pallet_no-STCODE label').text(STCODE);
			// jQuery('.pallet_no-STDES').show();
			jQuery('.pallet_no-STDES label').text(STDES);


			const infoSTCODE = jQuery('.STCODE').text();
			if (jQuery('.scanbasket-IVNUM label').text() !== "") {
				if (infoSTCODE && infoSTCODE !== "" && parseInt(infoSTCODE) === parseInt(STCODE)) {
					jQuery('.item-table-wrapper').addClass('show-table');
					jQuery('.alert').hide();
					jQuery('.btn').prop('disabled', false);
				} else {
					jQuery('.alert').hide();
					jQuery('.item-table-wrapper').removeClass('show-table');
					jQuery('#error_message_STCODE_not_eq_pallete_STCODE').show();
					jQuery('.btn').prop('disabled', true);
				}
			}

		} else {
			jQuery('.pallet_no-STCODE label').text('-');
			jQuery('.pallet_no-STDES label').text('-');

			if (jQuery('.scanbasket-IVNUM label').text() !== "") {
				jQuery('.alert').hide();
				jQuery('.item-table-wrapper').removeClass('show-table');
				jQuery('#error_message_STCODE_not_eq_pallete_STCODE').show();
				jQuery('.btn').prop('disabled', true);
			}
		}
	});

	/**This is the code for auto download the file */
	async function generateDownloadFileContent() {
		const textField = [{ field: 'ORDNAME', position: 2 }, { field: 'CDES', position: 4 }, { field: 'SHIPTO2_SUBFORM_ADDRESS', position: 6 }, { field: 'SHIPTO2_SUBFORM_PHONENUM', position: 7 }, { field: 'SHIPTO2_SUBFORM_STATE', position: 8 }, { field: 'PNCO_WEBNUMBER', position: 10 }, { field: 'PAYMENTDEF_SUBFORM_PAYACCOUNT', position: 11 }, { field: 'PNCO_REMARKS', position: 14 }, { field: 'QAMT_SHIPREMARK', position: 18 }, { field: 'PNCO_NUMOFPACKS', position: 21 }]
		let inputvariable = '';
		for (let i = 1; i < 22; i++) {
			const findField = textField.filter(e => {
				if (e.position === i) {
					return e;
				}
			})
			if (findField.length > 0) {
				let findText = jQuery(`.${findField[0].field}`).text();
				if (findText !== "") {
					if (findField[0].position === 6) {
						inputvariable += `${jQuery(`.${findField[0].field}`).text()}`;
					}
					else if (findField[0].position === 7) {
						inputvariable += `${jQuery(`.${findField[0].field}`).text()}`;
					}
					else if (findField[0].position === 10) {
						inputvariable += `${jQuery(`.${findField[0].field}`).text()}`;
					}
					else {
						inputvariable += `${jQuery(`.${findField[0].field}`).text()}`;
					}
					inputvariable += `\t`;
				}
				else {
					inputvariable += `\t`;
				}
			} else {
				inputvariable += `\t`;
			}
		}
		return inputvariable;
	}

	jQuery(".btn-complete").click(async function (e) {
		e.preventDefault();


		/**Hide the invoice url div */
		jQuery('.invoice-url').hide();
		jQuery('#invoice-url-tag').attr("href", "#");
		jQuery('#invoice-url-tag').text("");
		/** **/


		let ItemArray = [];
		let IVnum = jQuery('.scanbasket-IVNUM label').html();

		jQuery('.table-items .item_row').each(function () {
			let current_Qty = jQuery(this).find('.quantity').val();
			let kLine = jQuery(this).find('.kline').text();
			let IVNUM = jQuery(this).find('.IVNUM').text();

			ItemArray.push({ kLine: kLine, current_Qty: current_Qty, IVNUM: IVNUM })

		});

		const selectedPalletNo = jQuery("select.pallet_no").children("option:selected").val();

		const packNumber = jQuery(".packs_number").val();

		if (ItemArray.length > 0 && packNumber > 0) {
			jQuery('.btn-complete').prop('disabled', true);
			jQuery('.alert').hide();
			jQuery(".packs_number").removeClass('input-error');
			const inputvariable = await generateDownloadFileContent();


			/** Hide scan item, table section, (IVNUM and royy_transportmean div section set to display none) and display the API processing message  */
			jQuery('.scanitem').hide();
			jQuery('.item-table-wrapper').removeClass('show-table');
			jQuery('.scanbasket-IVNUM').hide();
			jQuery('.scanbasket-royy_transportmean').hide();
			$('#api_processing_message').show();
			/** */

			/**Unset IVNUM and ROYY_TRANSPORTMEAN labels text*/
			jQuery('.scanbasket-IVNUM label').text('');
			jQuery('.scanbasket-royy_transportmean label').text('');
			/** **/

			/**Information section enable and set values */
			jQuery('.order_information_section').hide();
			jQuery('.ORDNAME').text('');
			jQuery('.CDES').text('');
			jQuery('.SHIPTO2_SUBFORM_ADDRESS').text('');
			jQuery('.SHIPTO2_SUBFORM_PHONENUM').text('');
			jQuery('.SHIPTO2_SUBFORM_STATE').text('');

			jQuery('.PNCO_WEBNUMBER').text('');
			jQuery('.PNCO_REMARKS').text('');
			jQuery('.QAMT_SHIPREMARK').text('');
			jQuery('.PAYMENTDEF_SUBFORM_PAYACCOUNT').text('');
			jQuery('.PNCO_NUMOFPACKS').text('');
			jQuery('.STCODE').text('');
			jQuery('.STDES').text('');
			/** */



			/**This is the code for auto download the file */
			setTimeout(() => {
				let bb = new Blob([inputvariable], { type: 'text/plain' });
				let a = document.createElement('a');
				a.download = 'label.txt';
				a.href = window.URL.createObjectURL(bb);
				a.textContent = 'Download ready';
				a.style = 'display:none';
				a.click();
			}, 500);
			/** */


			const requestData = {
				'action': 'patchitemtable',
				'IVNUM': IVnum,
				'packNumber': packNumber,
				'palletNo': selectedPalletNo,
				'Items': JSON.stringify(ItemArray)
			};

			setTimeout(() => {

				jQuery.ajax({

					url: '/update_quantity_with_close_invoice',
					type: 'POST',
					data: requestData,
					dataType: "json",
					beforeSend: function (x) {
						if (x && x.overrideMimeType) {
							x.overrideMimeType("application/j-son;charset=UTF-8");
						}
					},
					success: function (resp) {

						console.log("PATCH API Request called..");
						console.log(resp.patchApiReq);

						console.log("=========================================");
						console.log("Patch API Response: ");
						console.log(resp.patchApiResp);

						console.log("=========================================");
						console.log("Close Invoice Response: ");
						console.log(resp.closeInvoiceResp);

						/** API called success messgae remove, Enable to display scan basket, enable complete button and remove table body content*/
						$('#api_processing_message').hide();
						jQuery('.scanbasket').show();
						$('#scanbasket').val('');
						jQuery('.btn-complete').prop('disabled', false);
						jQuery('tbody').remove();
						jQuery('.scanitem').val('')
						/** */

						jQuery(".packs_number").val(1);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(jqXHR.status);
						jQuery('.btn-complete').prop('disabled', false);
						jQuery(".packs_number").val(1);

					}

				});
			}, 800);

		}
		if (packNumber < 1) {
			jQuery(".packs_number").addClass('input-error');
		}

	});

	jQuery(".btn-close-to-invoice").click(function (e) {
		e.preventDefault();
		const ivnumValue = jQuery('.scanbasket-IVNUM label').html();
		if (ivnumValue && ivnumValue !== "") {

			/**Disable close invoice, complete button and change close invoice button text */
			jQuery('.btn-close-to-invoice').text(CloseInvoiceInProgressLabel)
			// jQuery('.btn-close-to-invoice').prop('disabled', true);
			// jQuery('.btn-complete').prop('disabled', true);
			jQuery('.btn').prop('disabled', true);
			/** **/

			jQuery.ajax({
				url: '/close_invoice',
				type: 'POST',
				data: {
					'IVNUM': ivnumValue
				},
				success: function (resp) {
					console.log("Close Invoice API Response  : ", resp)

					/**enable close invoice, complete button and change close invoice button text */
					jQuery('.btn-close-to-invoice').text(closeinvoiceLabel)
					// jQuery('.btn-close-to-invoice').prop('disabled', false);
					// jQuery('.btn-complete').prop('disabled', false);
					jQuery('.btn').prop('disabled', false);

					/** **/

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.status);
					/**enable close invoice, complete button and change close invoice button text */
					jQuery('.btn-close-to-invoice').text(closeinvoiceLabel)
					jQuery('.btn').prop('disabled', false);
					/** */
				}
			});
		}
	})


	jQuery(".btn-print-to-invoice").click(function (e) {
		e.preventDefault();
		const ivnumValue = jQuery('.scanbasket-IVNUM label').html();
		if (ivnumValue && ivnumValue !== "") {

			/**Disable close invoice, complete button and change close invoice button text */
			jQuery('.btn-print-to-invoice').text(printingInvoiceLabel)
			// jQuery('.btn-print-to-invoice').prop('disabled', true);
			jQuery('.btn').prop('disabled', true);
			/** **/


			jQuery.ajax({
				url: '/print_invoice',
				type: 'POST',
				data: {
					'IVNUM': ivnumValue
				},
				success: function (resp) {
					if (resp.status) {
						console.log("Generated Print Invoice URL: ", resp.url)

						/**Show the invoice url div*/
						jQuery('.invoice-url').show();
						jQuery('#invoice-url-tag').attr("href", resp.url);
						jQuery('#invoice-url-tag').text(resp.url);
						/** **/

						/***Download html/PDF invoice */

						let oReq = new XMLHttpRequest();
						oReq.open("GET", resp.url, true);
						oReq.responseType = "blob";
						oReq.onload = function (oEvent) {
							let blob = oReq.response;

							// console.log("blob : ", blob)
							let bb = new Blob([blob], { type: 'application/pdf' });
							let a = document.createElement('a');
							a.download = (blob.type === "application/pdf") ? 'Invoice.pdf' : 'Invoice.html';
							a.href = window.URL.createObjectURL(bb);
							a.textContent = 'Download ready';
							a.style = 'display:none';
							a.click();


							/********** Open file from URL and Print ************/
							let objFra = document.createElement('iframe');     // Create an IFrame.
							objFra.style.visibility = 'hidden';                // Hide the frame.
							objFra.src = window.URL.createObjectURL(bb);       // Set source.
							document.body.appendChild(objFra);  	// Add the frame to the web page.

							objFra.contentWindow.focus();       	// Set focus.
							objFra.contentWindow.print();

						};
						oReq.send();
						/***** */
					} else {
						console.log("Erro Message: ", resp.message)
					}


					/**Enable all buttons */
					jQuery('.btn-print-to-invoice').text(printInvoiceLabel)
					// jQuery('.btn-print-to-invoice').prop('disabled', false);
					jQuery('.btn').prop('disabled', false);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.status);

					/**enable close invoice, complete button and change close invoice button text */
					jQuery('.btn-print-to-invoice').text(printInvoiceLabel)
					jQuery('.btn').prop('disabled', false);
					/** */
				}
			});

		}

	})

	jQuery(".btn-print-sticker").on("click", async function (e) {
		let IVnum = jQuery('.scanbasket-IVNUM label').html();
		if (IVnum) {
			/**This is the code for auto download the file */
			const inputvariable = await generateDownloadFileContent();
			let bb = new Blob([inputvariable], { type: 'text/plain' });
			let a = document.createElement('a');
			a.download = 'sticker.txt';
			a.href = window.URL.createObjectURL(bb);
			a.textContent = 'Download ready';
			a.style = 'display:none';
			a.click();
			/** */
		}
	});

	async function changeInvoiceDetailAndButtons() {
		jQuery('.btn-complete').prop('disabled', true);
		jQuery('.alert').hide();
		jQuery(".packs_number").removeClass('input-error');


		/** Hide scan item, table section, (IVNUM and royy_transportmean div section set to display none) and display the API processing message  */
		jQuery('.scanitem').hide();
		jQuery('.item-table-wrapper').removeClass('show-table');
		jQuery('.scanbasket-IVNUM').hide();
		jQuery('.scanbasket-royy_transportmean').hide();
		$('#api_processing_message').show();
		/** */

		/**Unset IVNUM and ROYY_TRANSPORTMEAN labels text*/
		jQuery('.scanbasket-IVNUM label').text('');
		jQuery('.scanbasket-royy_transportmean label').text('');
		/** **/

		/**Information section enable and set values */
		jQuery('.order_information_section').hide();
		jQuery('.ORDNAME').text('');
		jQuery('.CDES').text('');
		jQuery('.SHIPTO2_SUBFORM_ADDRESS').text('');
		jQuery('.SHIPTO2_SUBFORM_PHONENUM').text('');
		jQuery('.SHIPTO2_SUBFORM_STATE').text('');

		jQuery('.PNCO_WEBNUMBER').text('');
		jQuery('.PNCO_REMARKS').text('');
		jQuery('.QAMT_SHIPREMARK').text('');
		jQuery('.PAYMENTDEF_SUBFORM_PAYACCOUNT').text('');
		jQuery('.PNCO_NUMOFPACKS').text('');
		jQuery('.STCODE').text('');
		jQuery('.STDES').text('');
		/** */
	}

	jQuery(".btn-suspend").click(function (e) {
		e.preventDefault();

		/**Hide the invoice url div */
		jQuery('.invoice-url').hide();
		jQuery('#invoice-url-tag').attr("href", "#");
		jQuery('#invoice-url-tag').text("");
		/** **/

		let ItemArray = [];
		let IVnum = jQuery('.scanbasket-IVNUM label').html();

		jQuery('.table-items .item_row').each(function () {
			let current_Qty = jQuery(this).find('.quantity').val();
			let kLine = jQuery(this).find('.kline').text();
			let IVNUM = jQuery(this).find('.IVNUM').text();

			ItemArray.push({ kLine: kLine, current_Qty: current_Qty, IVNUM: IVNUM })

		});

		const selectedPalletNo = jQuery("select.pallet_no").children("option:selected").val();

		const packNumber = jQuery(".packs_number").val();

		if (ItemArray.length > 0 && packNumber > 0) {


			changeInvoiceDetailAndButtons();

			const requestData = {
				'action': 'patchitemtable',
				'IVNUM': IVnum,
				'packNumber': packNumber,
				'palletNo': selectedPalletNo,
				'Items': JSON.stringify(ItemArray)
			};

			setTimeout(() => {

				jQuery.ajax({

					url: '/update_quantity',
					type: 'POST',
					data: requestData,
					dataType: "json",
					beforeSend: function (x) {
						if (x && x.overrideMimeType) {
							x.overrideMimeType("application/j-son;charset=UTF-8");
						}
					},
					success: function (resp) {

						console.log("PATCH API Request called..");
						console.log(resp.patchApiReq);

						console.log("=========================================");
						console.log("Patch API Response: ");
						console.log(resp.patchApiResp);


						/** API called success messgae remove, Enable to display scan basket, enable complete button and remove table body content*/
						$('#api_processing_message').hide();
						jQuery('.scanbasket').show();
						$('#scanbasket').val('');
						jQuery('.btn-complete').prop('disabled', false);
						jQuery('tbody').remove();
						jQuery('.scanitem').val('')
						/** */

						jQuery(".packs_number").val(1);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(jqXHR.status);
						jQuery('.btn-complete').prop('disabled', false);
						jQuery(".packs_number").val(1);

					}

				});
			}, 200);

		}
		if (packNumber < 1) {
			jQuery(".packs_number").addClass('input-error');
		}
	})
});