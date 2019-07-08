import { getLodop } from "./lodop";
import { getLocalStorage } from "@/utils/localStorage";

//直接打印页面
export function doPrint(width, height, html, pagetype) {
  var LODOP = getLodop();
  if (LODOP) {
    LODOP.PRINT_INIT("print_lodop");
    const printerData = getLocalStorage("printerBound");
    printerData.forEach(el => {
      if (el.type_index == pagetype) {
        LODOP.SET_PRINTER_INDEX(el.printer_index); //设置打印机
      } else {
        LODOP.SET_PRINTER_INDEX("-1"); //设置默认打印机
      }

    });

    LODOP.SET_PRINT_PAGESIZE(1, width + "mm", height + "mm", pagetype);
    LODOP.ADD_PRINT_HTM("0mm", "0mm", width + "mm", height + "mm", html);
    // LODOP.PREVIEW();
    LODOP.PRINT();
  }
}

//获取打印控件
export function getPrint() {
  var LODOP = getLodop();
  if (LODOP) {
    // LODOP.PRINT_INIT("print_lodop");
    const lodopLength = LODOP.GET_PRINTER_COUNT();
    const arr = [];
    for (let i = 0; i < lodopLength; i++) {
      const obj = {
        printer_index: i,
        printer_name: LODOP.GET_PRINTER_NAME(i)
      };
      arr.push(obj);
    }
    return arr;
  }
}

// return;
// let html = [
//   '<!DOCTYPE html>',
//   '<html lang="en">',
//   '<head>',
//   '<meta charset="UTF-8">',
//   '<title>打印预览2</title>',
//   '<link rel="stylesheet" href="http://at.alicdn.com/t/font_1105799_da1vmnivatr.css">',
//   '<style>*{margin:0;padding:0;box-sizing:border-box;}html,body{height:100%;min-height:100%;background:#fff;}html{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-text-size-adjust:none;}.preview-page{margin:5px;position:relative;border:1px solid #000;page-break-after:always;overflow:hidden;}.cl-widget{position:absolute;z-index:2;}.cl-widget-container{height:100%;overflow:hidden;}.js-hide{display:none!important;}.iconfont{font-size:inherit;}.icon-trash{color:#dd514c;}</style>',
//   '</head>',
//   '<body>',
//   pageHtml,
//   '</body>',
//   '</html>'
// ].join('');
// var opener = window.open('about:blank');
// opener.document.write(html);
// LODOP.PRINT_INIT('print_lodop');
// LODOP.SET_PRINT_PAGESIZE(1, template.width + 'mm', template.height + 'mm', 'A4');
// LODOP.ADD_PRINT_HTM('0mm', '0mm', template.width + 'mm', template.height + 'mm', html);
// LODOP.PREVIEW();
