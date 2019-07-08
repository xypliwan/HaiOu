import CreateComponent from './jquery.custom-create-component'


let config = [
    { group: 'image图片', type: 'image', name: 'label_logo', label: 'image - 标签Logo' },
    { group: 'image图片', type: 'image', name: 'image_product', label: 'image - 商品图片' },
    { group: 'image图片', type: 'image', name: 'image_other', label: 'image - 其他图片' }
];

export default config.map(item => new CreateComponent(item))