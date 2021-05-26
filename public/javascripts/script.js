jQuery(document).ready(function () {
	let noDataFoundLabel = '';
	let fillRequiredFieldsLabel = '';
	let closeinvoiceLabel = '';
	let CloseInvoiceInProgressLabel = '';

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
		jQuery(this).toggleClass('active');
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
						jQuery('.item-table-wrapper').addClass('show-table');
						jQuery('.alert').hide();
						$this.hide();

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
							jQuery('.item-table-wrapper').addClass('show-table');
							jQuery('.alert').hide();
							$this.hide();

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


	jQuery('.scanitem').on('focusout', function () {

		var items = [];
		var item_val = jQuery(this).val();
		var $this = jQuery(this);
		if (item_val !== "") {

			jQuery('.table-items .item_row').each(function () {

				var td_val = jQuery(this).find('.itemsku').attr('data-sku');
				items.push(td_val);

				if (jQuery.trim(item_val) == jQuery.trim(td_val)) {

					var current_qty = parseInt(jQuery(this).find('.quantity').val());
					var new_qty = current_qty + 1;

					jQuery(this).addClass('active');
					jQuery(this).siblings().removeClass('active');
					jQuery(this).find('.quantity').val(new_qty);
					// jQuery(this).find('.totalqty').text(new_qty);

					jQuery('.item-table-wrapper').addClass('show-table');
					jQuery('.alert').hide();

					$this.val('');
				}
				else {
					jQuery(this).removeClass('active');
				}
			});

			if (jQuery.inArray(item_val, items) === -1) {
				// jQuery('.item-table-wrapper').removeClass('show-table');
				// jQuery('.alert').html(noDataFoundLabel);
				// jQuery('.alert').show();
				jQuery('#error_message').html(noDataFoundLabel);
				jQuery('#error_message').show();
			}
		}

	});

	jQuery('.scanitem').keypress(function (event) {

		var keycode = (event.keyCode ? event.keyCode : event.which);

		if (keycode == '13') {

			var items = [];
			var item_val = jQuery(this).val();
			var $this = jQuery(this);

			if (item_val !== "") {

				jQuery('.table-items .item_row').each(function () {

					var td_val = jQuery(this).find('.itemsku').attr('data-sku');
					items.push(td_val);

					if (jQuery.trim(item_val) == jQuery.trim(td_val)) {

						var current_qty = parseInt(jQuery(this).find('.quantity').val());
						var new_qty = current_qty + 1;

						jQuery(this).addClass('active');
						jQuery(this).siblings().removeClass('active');
						jQuery(this).find('.quantity').val(new_qty);
						// jQuery(this).find('.totalqty').text(new_qty);

						jQuery('.item-table-wrapper').addClass('show-table');
						jQuery('.alert').hide();

						$this.val('');
					}
					else {
						jQuery(this).removeClass('active');
					}
				});

				if (jQuery.inArray(item_val, items) === -1) {
					// jQuery('.item-table-wrapper').removeClass('show-table');
					// jQuery('.alert').html(noDataFoundLabel);
					// jQuery('.alert').show();
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


	jQuery(".btn-complete").click(function (e) {
		e.preventDefault();

		let ItemArray = [];
		let IVnum = jQuery('.ivnum').val();

		jQuery('.table-items .item_row').each(function () {
			let current_Qty = jQuery(this).find('.quantity').val();
			let kLine = jQuery(this).find('.kline').text();
			let IVNUM = jQuery(this).find('.IVNUM').text();

			ItemArray.push({ kLine: kLine, current_Qty: current_Qty, IVNUM: IVNUM })

		});

		if (ItemArray.length > 0) {
			jQuery('.btn-complete').prop('disabled', true);
			jQuery('.alert').hide();


			jQuery.ajax({

				url: '/update_quantity',
				type: 'POST',
				data: {
					'action': 'patchitemtable',
					'IVNUM': IVnum,
					'Items': JSON.stringify(ItemArray)
				},
				dataType: "json",
				beforeSend: function (x) {
					if (x && x.overrideMimeType) {
						x.overrideMimeType("application/j-son;charset=UTF-8");
					}
				},
				success: function (resp) {

					/** API called success messgae remove, Enable to display scan basket, enable complete button and remove table body content*/
					$('#api_processing_message').hide();
					jQuery('.scanbasket').show();
					$('#scanbasket').val('');
					jQuery('.btn-complete').prop('disabled', false);
					jQuery('tbody').remove();
					/** */

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.status);
					jQuery('.btn-complete').prop('disabled', false);

				}

			});


			/**This is the code for auto download the file */
			setTimeout(() => {
				let inputvariable = ''
				for (let i = 1; i < 21; i++) {
					inputvariable += `text${i}\t`;
				}
				let bb = new Blob([inputvariable], { type: 'text/plain' });
				let a = document.createElement('a');
				a.download = 'label.txt';
				a.href = window.URL.createObjectURL(bb);
				a.textContent = 'Download ready';
				a.style = 'display:none';
				a.click();
			}, 1500);
			/** */


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

		}

	});

	jQuery(".btn-close-to-invoice").click(function (e) {
		e.preventDefault();
		const ivnumValue = jQuery('.scanbasket-IVNUM label').html();
		if (ivnumValue && ivnumValue !== "") {

			/**Disable close invoice, complete button and change close invoice button text */
			jQuery('.btn-close-to-invoice').text(CloseInvoiceInProgressLabel)
			jQuery('.btn-close-to-invoice').prop('disabled', true);
			jQuery('.btn-complete').prop('disabled', true);
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
					jQuery('.btn-close-to-invoice').prop('disabled', false);
					jQuery('.btn-complete').prop('disabled', false);
					/** **/

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.status);
					/**enable close invoice, complete button and change close invoice button text */
					jQuery('.btn-close-to-invoice').text(closeinvoiceLabel)
					jQuery('.btn-close-to-invoice').prop('disabled', false);
					jQuery('.btn-complete').prop('disabled', false);
					/** */
				}
			});
		}
	})

});