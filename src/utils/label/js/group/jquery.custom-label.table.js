import CreateComponent from './jquery.custom-create-component'


let config = [
    {
        group: 'Table表格',
        type: 'table',
        name: 'way_bill_delivery_list',
        label: '物流交货清单',
        icon: 'icon-list-alt',
        config: {
            data: [
                {no:1,customer_number:'111',way_bill_number:'12345678',tracking_number:'0.02',ship_code:'UPS',quantity:1,country_code:'US',weight:1.25,note:''}
            ],
            props: {
                fields: {
                    group: '字段',
                    label: '显示字段',
                    type: 'checkboxList',
                    option: { edit: true, title: false },
                    value: [
                        { checked: true, name: 'no', label: '序号', text: '序号', width: 30 },
                        { checked: true, name: 'customer_number', label: '客户单号', text: '客户单号', width: 100 },
                        { checked: true, name: 'way_bill_number', label: '运单号', text: '运单号', width: 100 },
                        { checked: true, name: 'tracking_number', label: '跟踪号', text: '跟踪号', width: 100 },
                        { checked: true, name: 'ship_code', label: '派送渠道', text: '派送渠道', width: 'auto' },
                        { checked: true, name: 'quantity', label: '件数', text: '件数', width: 80 },
                        { checked: true, name: 'country_code', label: '目的国家', text: '目的国家', width: 80 },
                        { checked: true, name: 'weight', label: '重量', text: '重量', width: 80 },
                        { checked: true, name: 'note', label: '备注', text: '备注', width: 'auto' }
                    ]
                }
            },
        },
        render: function (config) {
            var dataName = this.opts.name

            // thead
            var $theadTr = $('<tr></tr>')
            var tdLength = 0
            $.each(config.props.fields.value || [], function (index, field) {
                if (field.checked) {
                    tdLength++
                    $('<th>' + field.text + '</th>')
                        .attr('width', field.width || 'auto')
                        .css('overflow', 'hidden')
                        .appendTo($theadTr)
                }
            })
            var $thead = $('<thead></thead>')
                .toggleClass('js-hide', !config.props.thead.value.visible)
                .css(config.props.thead.value.css)
                .append($theadTr)

            // tbody
            var $tbody = $('<tbody></tbody>')
                .css(config.props.tbody.value.css)
            $.each(config.data || [], function (i, item) {
                var $tr = $('<tr></tr>')
                $.each(config.props.fields.value || [], function (j, field) {
                    if (field.checked) {

                        $('<td></td>')
                            .attr('width', field.width || 'auto')
                            .append('<eccang data-name="' + dataName + '.' + field.name + '">' + item[field.name] + '</eccang>')
                            .appendTo($tr)
                    }
                })
                $tr.appendTo($tbody)
            })

            // tfoot
            var $tfoot = $('<tfoot></tfoot>')
                .append('')
                .toggleClass('js-hide', !config.props.tfoot.value.visible)
                .css(config.props.tfoot.value.css)

            // table
            var $table = $('<table></table>')
                .append([$thead, $tbody, $tfoot])
                .css({
                    width: '100%',
                    textAlign: 'center',
                    wordbreak: 'break-all',
                    tableLayout: 'fixed',
                    borderCollapse: 'collapse'
                })
                .attr({
                    border: config.props.tableBorder.value ? 1 : 0,
                    cellpadding: 0,
                    cellspacing: 0
                })

            var $elem = $('<div class="cl-widget-container"></div>')
                .append([$table])

            return $elem
        }
    }

];


export default config.map(item => new CreateComponent(item))