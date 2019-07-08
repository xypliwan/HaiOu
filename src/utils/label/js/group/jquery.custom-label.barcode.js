import CreateComponent from './jquery.custom-create-component'


let config = [
    { group: 'barcode条形码', type: 'barcode', name: 'barcode_39', label: 'barcode-39', image: 'http://barcode.cnaidc.com/html/cnaidc.php?filetype=PNG&dpi=300&scale=2&rotation=0&font_family=Arial.ttf&font_size=14&text=A12345678&thickness=40&checksum=&code=BCGcode39' },
    //{ group: 'barcode条形码', type: 'barcode', name: 'barcode_128', label: 'barcode-128',image: './../img/barcode_128.png' },
    //{ group: '测试单元', type: 'qrcode', name: 'qrcode', label: 'qrcode - 商品二维码' }
];

export default config.map(item => new CreateComponent(item))