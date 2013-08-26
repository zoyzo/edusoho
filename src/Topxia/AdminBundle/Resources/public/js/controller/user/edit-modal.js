define(function(require, exports, module) {

    var Validator = require('bootstrap.validator');
    require('common/validator-rules').inject(Validator);
    var Notify = require('common/bootstrap-notify');
    require('ckeditor');

	exports.run = function() {


		CKEDITOR.replace('profile_about', {
                height: 150,
                resize_enabled: false,
                forcePasteAsPlainText: true,
                toolbar: 'Simple',
                removePlugins: 'elementspath',
                filebrowserUploadUrl: '/ckeditor/upload?group=course'
        });

        var $modal = $('#user-edit-form').parents('.modal');

        var validator = new Validator({
            element: '#user-edit-form',
            autoSubmit: false,
            onFormValidated: function(error, results, $form) {
            	if (error) {
            		return false;
            	}
            	
            	CKEDITOR.instances['profile_about'].updateElement();
				$.post($form.attr('action'), $form.serialize(), function(html) {
					$modal.modal('hide');
					Notify.success('用户信息保存成功');
					var $tr = $(html);
					$('#' + $tr.attr('id')).replaceWith($tr);
				}).error(function(){
					Notify.danger('操作失败');
				});
            }
        });

        validator.addItem({
            element: '[name="profile[truename]"]',
            rule: 'chinese minlength{min:2} maxlength{max:5}'
        });

        validator.addItem({
            element: '[name="profile[qq]"]',
            rule: 'qq'
        });

        validator.addItem({
            element: '[name="profile[weibo]"]',
            rule: 'url',
            errormessageUrl: '网站地址不正确，须以http://weibo.com开头。'
        });

        validator.addItem({
            element: '[name="profile[site]"]',
            rule: 'url',
            errormessageUrl: '网站地址不正确，须以http://开头。'
        });

	};

});