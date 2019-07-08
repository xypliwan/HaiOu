import CreateComponent from './jquery.custom-create-component'


let config = [
    {group: 'label字段', type: 'date', name: 'filed_date', label: 'date - 打印日期'},

    {group: '地址信息', type: 'text', name: 'consignee_name', label: 'text - 收件人姓名',config: {data: {text: 'consignee_name'}, props: {title: {value: {text: '收件人姓名'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_phone', label: 'text -收件人电话',config: {data: {text: 'consignee_phone'}, props: {title: {value: {text: '收件人电话'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_mobile', label: 'text -收件人手机',config: {data: {text: 'consignee_mobile'}, props: {title: {value: {text: '收件人手机'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_email', label: 'text -收件人邮箱',config: {data: {text: 'consignee_email'}, props: {title: {value: {text: '收件人邮箱'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_company', label: 'text -收件公司',config: {data: {text: 'consignee_company'}, props: {title: {value: {text: '收件公司'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_country', label: 'text -收件国家',config: {data: {text: 'consignee_country'}, props: {title: {value: {text: '收件国家'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_zipcode', label: 'text -收件邮编',config: {data: {text: 'consignee_zipcode'}, props: {title: {value: {text: '收件邮编'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_state', label: 'text -收件省/州',config: {data: {text: 'consignee_state'}, props: {title: {value: {text: '收件省/州'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_city', label: 'text -收件城市',config: {data: {text: 'consignee_city'}, props: {title: {value: {text: '收件城市'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_address1', label: 'text -收件地址1',config: {data: {text: 'consignee_address1'}, props: {title: {value: {text: '收件地址1'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_address2', label: 'text -收件地址2',config: {data: {text: 'consignee_address2'}, props: {title: {value: {text: '收件地址2'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_address3', label: 'text -收件地址3',config: {data: {text: 'consignee_address3'}, props: {title: {value: {text: '收件地址3'}}}}},
    {group: '地址信息', type: 'text', name: 'consignee_doorplate', label: 'text -收件门牌号',config: {data: {text: 'consignee_doorplate'}, props: {title: {value: {text: '收件门牌号'}}}}},

    {group: '地址信息', type: 'text', name: 'sender_name', label: 'text -寄件人姓名',config: {data: {text: 'sender_name'}, props: {title: {value: {text: '寄件人姓名'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_phone', label: 'text -寄件人电话',config: {data: {text: 'sender_phone'}, props: {title: {value: {text: '寄件人电话'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_mobile', label: 'text -寄件人手机',config: {data: {text: 'sender_mobile'}, props: {title: {value: {text: '寄件人手机'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_email', label: 'text -寄件人邮箱',config: {data: {text: 'sender_email'}, props: {title: {value: {text: '寄件人邮箱'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_company', label: 'text -寄件公司',config: {data: {text: 'sender_company'}, props: {title: {value: {text: '寄件公司'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_country', label: 'text -寄件国家',config: {data: {text: 'sender_country'}, props: {title: {value: {text: '寄件国家'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_zipcode', label: 'text -寄件邮编',config: {data: {text: 'sender_zipcode'}, props: {title: {value: {text: '寄件邮编'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_state', label: 'text -寄件省州',config: {data: {text: 'sender_state'}, props: {title: {value: {text: '寄件省州'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_city', label: 'text -寄件城市',config: {data: {text: 'sender_city'}, props: {title: {value: {text: '寄件城市'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_address1', label: 'text -寄件地址1',config: {data: {text: 'sender_address1'}, props: {title: {value: {text: '寄件地址1'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_address2', label: 'text -寄件地址2',config: {data: {text: 'sender_address2'}, props: {title: {value: {text: '寄件地址2'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_address3', label: 'text -寄件地址3',config: {data: {text: 'sender_address3'}, props: {title: {value: {text: '寄件地址3'}}}}},
    {group: '地址信息', type: 'text', name: 'sender_doorplate', label: 'text -寄件门牌号',config: {data: {text: 'sender_doorplate'}, props: {title: {value: {text: '寄件门牌号'}}}}},

    {group: 'label字段', type: 'text', name: 'filed_company_code', label: 'text - 客户代码', config: {data: {text: 'A00001'}, props: {title: {value: {text: '客户代码'}}}}},
    {group: 'label字段', type: 'text', name: 'filed_way_bill_total', label: 'text - 运单总数', config: {data: {text: 10}, props: {title: {value: {text: '运单总数'}}}}},
    {group: 'label字段', type: 'text', name: 'filed_weight_total', label: 'text - 总重量', config: {data: {text: 2.53}, props: {title: {value: {text: '总重量'}}}}},
    {group: 'label字段', type: 'text', name: 'filed_page_index', label: 'text - 页码', config: {data: {text: '1/4'}, props: {title: {value: {text: '页码'}}}}},
    {group: 'label字段', type: 'text', name: 'label_note', label: 'text -标签备注',config: {data: {text: 'label_note'}, props: {title: {value: {text: '标签备注'}}}}}

];

export default config.map(item => new CreateComponent(item))