import CreateComponent from './jquery.custom-create-component'

export default [
    // 常用元素
    { group: '构图元素', type: 'xLine', name: 'x-line', label: 'xLine - 水平直线' },
    { group: '构图元素', type: 'yLine', name: 'y-line', label: 'yLine - 垂直直线' },
    { group: '构图元素', type: 'default', name: 'title-x', label: 'Title - 标题' },
    { group: '构图元素', type: 'round', name: 'round-x', label: 'round - 圆形框' },
    { group: '构图元素', type: 'localImage', name: 'image-x', label: 'localImage - 本地图片' },
    // 本地测试元素
    // { group: '测试单元', type: 'date', name: 'date', label: 'date - 打印日期' },
    // { group: '测试单元', type: 'qrcode', name: 'qrcode', label: 'qrcode - 商品二维码' },
    // { group: '测试单元', type: 'barcode', name: 'barcode', label: 'barcode - 商品条形码' },
    // { group: '测试单元', type: 'info', name: 'sender-info', label: 'info - 地址信息' },
    // { group: '测试单元', type: 'table', name: 'table-01', label: 'table - 普通表格' },
    // { group: '测试单元', type: 'declaration', name: 'table-02', label: 'declaration - 报关物品' },
    // { group: '测试单元', type: 'image', name: 'image-02', label: 'image - 商品图片' },
    // { group: '测试单元', type: 'image', name: 'image-03', image: './img/TagPictures/tag01.jpg' }
].map(item => new CreateComponent(item))