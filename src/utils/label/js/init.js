/**
 * Created by Bright on 2018/12/14.
 */
$(function () {
    var $elem = $('.container')
    var $initForm = $('#initForm')
    var customLabel = null
    var host = 'http://172.16.0.247'
    var initCustomLabel = function (option, widgets) {
        option = option || {}
        widgets = widgets || []

        customLabel = new CustomLabel(option)

        if (widgets.length) {
            customLabel.addPageWidgets(widgets)
        } else {
            customLabel.addPage()
        }

        $elem.html(customLabel.getElem())

        if (_status === null) {
            customLabel.onSave = function (data) { console.log(data) }
        } else {
            customLabel.onSave = function (data) {
                var postData = {
                    _method: 'PUT',
                    id: data.config.id,
                    configs: JSON.stringify(data.widgets),
                    temp_html: customLabel.getHtml()
                }
                $.ajax({
                    method: 'post',
                    url: host + '/api/temps/' + postData.id,
                    data: postData,
                    success: function (res) {
                        alert('保存成功')
                    }
                })
            }
        }

        $.modal.close()
    }
    var $loading = null
    var showLoading = function () {
        if ($loading === null) {
            $loading = $('<div class="modal" id="loading"></div>')
                .css({ width: 'auto', textAlign: 'center', zIndex: 1210 })
                .append('<i class="cl-loading"></i>')
                .append('<p class="cl-mt10" style="color: #999;">加载中</p>')
                .appendTo(document.body)
        }

        $loading
            .modal({ escapeClose: false, clickClose: false, showClose: false })
            .one('modal:close', function (e) {
                $loading.remove()
            })
    }

    $('.test-menu')
        .on('click', '.btn-add-new', function () {
            $('#initForm').modal({
                escapeClose: false,
                clickClose: false,
                showClose: false,
                fadeDuration: 100
            })
        })
        .on('click', '.btn-get-data', function () {
            // 获取模板数据
            console.log(JSON.stringify(customLabel.getData()))
        })
        .on('click', '.btn-get-html', function () {
            // 获取HTML
            console.log(customLabel.getHtml())
        })

    $initForm
        .on('change', '[name="sizetype"]', function () {
            var $sizetype1 = $('#sizetype1')
            var $sizetype2 = $('#sizetype2')
            switch (this.value) {
                case '1':
                    $sizetype1.show()
                    $sizetype2.hide()
                    break
                case '2':
                    $sizetype1.hide()
                    $sizetype2.show()
                    break
            }
        })
        .on('click', '.modal__btn_primary', function () {
            showLoading()
            var name = $initForm.find('[name="name"]').val()
            var type = $initForm.find('[name="type"]').val()
            var typeName = $initForm.find('[name="type"]>[value="' + type + '"]').text()
            var sizeType = $initForm.find('[name="sizetype"]:checked').val()
            var size = $initForm.find('[name="size"]:checked').val()
            var width = $initForm.find('[name="width"]').val()
            var height = $initForm.find('[name="height"]').val()

            if (sizeType === '1') {
                size = size.split(',')
            } else {
                size = [width, height]
            }

            if (_status === null) {
                initCustomLabel({
                    name: name,
                    type: typeName,
                    size: size
                })
            } else {
                $.ajax({
                    method: 'GET',
                    url: host + '/api/tags',
                    data: {
                        temp_group_id: type
                    },
                    success: function (res) {
                        var components = []
                        $.each(res.data || [], function (index, opts) {
                            components.push(new CreateComponent(opts))
                        })
                        CustomLabel.addComponents(components)

                        $.ajax({
                            method: 'POST',
                            url: host + '/api/temps',
                            data: {
                                name: name,
                                temp_group_id: type,
                                width: size[0],
                                height: size[1]
                            },
                            success: function (res) {
                                var option = {
                                    id: res.data.id,
                                    name: res.data.name,
                                    type: res.data.temp_group_name,
                                    typeID: res.data.temp_group_id,
                                    size: [res.data.width, res.data.height]
                                }
                                initCustomLabel(option)
                            }
                        })
                    }
                })
            }
        })

    // init
    var _status = 0
    var _token = $.getQueryString('token')
    var _company = $.getQueryString('company')
    var _soft = $.getQueryString('soft')
    var _id = $.getQueryString('id')

    if (_token && _company) {
        showLoading()
        $.ajaxSetup({
            global: true,
            headers: {
                token: _token,
                company: _company,
                soft: _soft
            },
            dataType: 'json',
            error: function (res) {
                alert(res.message || '服务器请求超时，重新请求')
            }
        })
        $.ajax({
            method: 'GET',
            url: host + '/api/temp_groups',
            data: {},
            success: function (res) {
                if (res.data && res.data.length) {
                    var optionTpl = ''
                    $.each(res.data, function (index, item) {
                        optionTpl += '<option value="' + item.id + '">' + item.name + '</option>'
                    })
                    $initForm.find('select[name="type"]').html(optionTpl)
                }
            },
            complete: function () {
                if (_id) {
                    $.ajax({
                        method: 'GET',
                        url: host + '/api/temps/' + _id,
                        success: function (res) {
                            var option = {
                                id: res.data.id,
                                name: res.data.name,
                                type: res.data.temp_group_name,
                                typeID: res.data.temp_group_id,
                                size: [res.data.width, res.data.height]
                            }
                            var widgets = JSON.parse(res.data.configs)

                            $.ajax({
                                method: 'GET',
                                url: host + '/api/tags',
                                data: {
                                    temp_group_id: res.data.temp_group_id
                                },
                                success: function (res) {
                                    var components = []
                                    $.each(res.data || [], function (index, opts) {
                                        components.push(new CreateComponent(opts))
                                    })
                                    CustomLabel.addComponents(components)

                                    if (widgets.length) {
                                        initCustomLabel(option, widgets)
                                    } else {
                                        initCustomLabel(option)
                                    }
                                }
                            })
                        }
                    })
                } else {
                    $('#initForm').modal({
                        escapeClose: false,
                        clickClose: false,
                        showClose: false,
                        fadeDuration: 100
                    })
                }
            }
        })
    } else {
        // alert('company获取失败，目前处于离线状态')
        _status = null
        $('.test-menu').find('.btn-add-new-by-config').remove()
    }
})
