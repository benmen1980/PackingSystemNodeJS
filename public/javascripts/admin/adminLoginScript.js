jQuery(document).ready(function () {

    let fillRequiredFieldsLabel = '';
    jQuery.ajax({

        url: '/fetchmessage',
        type: 'POST',
        data: {},
        success: function (resp) {

            var obj = resp;

            if (obj.status == 1) {
                console.log("obj: ", obj)
                noDataFoundLabel = obj.noDataFoundLabel;
                fillRequiredFieldsLabel = obj.fillRequiredFieldsLabel;
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

    jQuery(".login_submit").click(function (e) {
        // e.preventDefault();
        const username = jQuery(".loginform .username").val();
        const password = jQuery(".loginform .password").val();
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

        }

    });




});