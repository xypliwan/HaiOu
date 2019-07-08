import $ from 'jquery';
import baseUrl from '@/config/baseUrl.js';

/**
 * Created by Bright on 2018/12/14.
 */

/**
 * ================ CustomLabel ====================
 * @class
 * @param {object} opts
 * @param {string} opts.mode = [normal|preview] - 创建方式
 * @param {string} opts.name                    - 标签名称
 * @param {array}  opts.size                    - 标签大小，单位mm
 */
function CustomLabel(opts) {
    Page.pages = []
    opts = $.extend({
        mode: 'normal',
        name: '默认名称',
        type: '默认类型',
        size: [100, 100]
    }, opts)
    this.init(opts)
}

// static
CustomLabel.components = []
CustomLabel.addComponents = function (arr) {
    CustomLabel.components = CustomLabel.components.concat(arr)
}
CustomLabel.addPropsPanelField = function (name, handler) {
    PropsPanel.fields[name] = handler
}

CustomLabel.prototype = {
    init: function (opts) {
        this.opts = opts || this.opts
        this.context = {}
        this.components = CustomLabel.components
        this.pages = []
        this.widgets = []
        switch (this.opts.mode) {
            case 'normal':
                this.initLayout()
                this.initEvent()
                break
            case 'preview':
                // TODO 直接打印
                // 1.数据填充
                // 2.执行打印
                break
            default:
                console.error('CustomLabel\'s mode was undefined')
        }
    },
    initLayout: function (opts) {
        this.opts = opts || this.opts
        this.container = $('<div class="cl-container"></div>')
        this.leftMenu = this.initLeftMenuLayout()
        this.topMenu = this.initTopMenuLayout()
        this.propPanel = $('<div class="cl-props"></div>')
        this.wrap = $('<div class="cl-wrap"></div>')
        this.tips = this.initTipsLayout()

        this.container.append([this.leftMenu, this.topMenu, this.propPanel, this.wrap, this.tips])
    },
    initEvent: function () {
        var that = this

        // Init TopMenu Event
        that.topMenu
            .on('click', 'button.btn-add', that.addPage.bind(that))     // 新增页面
            .on('click', 'button.btn-preview', that.preview.bind(that)) // 打印
            .on('click', 'button.btn-clear', that.clear.bind(that))     // 清空
            .on('click', 'button.btn-reset', that.reset.bind(that))     // 重置
            .on('click', 'button.btn-save', that.save.bind(that))       // 保存
            .on('keyup', 'input[name="name"]', function () {
                that.opts.name = this.value
            })

        // Init Tips Event
        that.tips
            .on('mousedown', '.cl-wrap-tips__close', function () {
                that.tips.addClass('js-hide')
            })

        // Init Component Select Event
        that.componentSelect.find('.cl-select').on('change', function () {
            that.showComponentsByGroup.call(that, this.value)
        }).trigger('change')

        // Init Component Item Event
        that.componentContainer
            .on('dragstart-bak', '.cl-component-group-item', function (e) {
                var self = $(this)
                var name = self.data().name
                e.originalEvent.dataTransfer.setData('text', name)
            })
            .on('mousedown', '.cl-component-group-item', function (e) {
                setCapture(e)
                e.stopPropagation()
                var self = $(this)
                var name = self.data().name
                var offset = self.offset()
                var position = getMousePosition(e)
                var clone = self.clone()
                var random = getRandomString()

                clone
                    .addClass('cl-component-group-item-selected')
                    .css({
                        position: 'absolute',
                        left: position.x,
                        top: position.y,
                        marginLeft: -position.x + offset.left,
                        marginTop: -position.y + offset.top,
                        width: '178px',
                        // height: self.height(),
                        zIndex: 3
                    })
                    .appendTo(document.body)

                $(document)
                    .on('mouseup.cl.page-' + random, function (e) {
                        releaseCapture(e)
                        $(document).removeClass('cl-no-select').off('mouseup.cl.page-' + random).off('mousemove.cl.page-' + random)
                        clone.remove()
                    })
                    .on('mousemove.cl.page-' + random, function (e) {
                        position = getMousePosition(e)
                        clone.css({
                            left: position.x,
                            top: position.y
                        })
                    })

                var widget = null
                Page.startDrop()
                Page.onDragMove = function (page, position) {
                    if (widget) {
                        widget.css(position)
                    }
                }
                Page.onDragEnter = function (page) {
                    clone.hide()
                    widget = page.addWidget(name)
                }
                Page.onDragLeave = function () {
                    clone.show()
                    widget.remove()
                    widget = null
                }
                Page.onDrop = function () {
                    widget.reset()
                    that.initWidget(widget)
                }
            })
            .on('mousedown', '.cl-component-group-item-drag', function (e) {
                e.preventDefault()
            })
    },
    initTopMenuLayout: function () {
        var $elem = $('<div class="cl-top-menu"></div>')
            .append([
                '<div class="cl-inline-block cl-mr10">',
                '<div class="cl-input-group">',
                '<div class="cl-input-group-addon">模板名称</div>',
                '<input class="cl-input" type="text" name="name" value="' + this.opts.name + '">',
                '</div>',
                '</div>'
            ].join(''))
            .append([
                '<div class="cl-inline-block cl-mr10">',
                '<div class="cl-input-group">',
                '<div class="cl-input-group-addon">模板类型</div>',
                '<input class="cl-input" type="text" name="type" value="' + this.opts.type + '" disabled>',
                '</div>',
                '</div>'
            ].join(''))
            .append([
                '<div class="cl-inline-block cl-mr10">',
                '<div class="cl-input-group">',
                '<div class="cl-input-group-addon">尺寸</div>',
                '<input class="cl-input" type="text" name="size" value="' + this.opts.size[0] + ' x ' + this.opts.size[1] + '" style="width: 150px;text-align: center;" disabled>',
                '<div class="cl-input-group-addon">mm</div>',
                '</div>',
                '</div>'
            ].join(''))
            .append([
                '<div class="cl-top-menu-btn">',
                '<button class="cl-btn cl-btn-primary cl-radius btn-add">新增页面</button>',
                '<button class="cl-btn cl-btn-primary cl-radius btn-preview"><i class="iconfont icon-print cl-mr10"></i>预览</button>',
                '<button class="cl-btn cl-btn-default cl-radius btn-clear"><i class="iconfont icon-trash cl-mr10"></i>清空</button>',
                '<button class="cl-btn cl-btn-default cl-radius btn-reset">重置</button>',
                '<button class="cl-btn cl-btn-success cl-radius btn-save"><i class="iconfont icon-save cl-mr10"></i>保存</button>',
                '</div>'
            ].join(''))

        return $elem
    },
    initLeftMenuLayout: function () {
        var components = this.components
        var groups = []
        var optionTpl = components.map(function (component) {
            if (groups.indexOf(component.group) < 0) {
                groups.push(component.group)
                return '<option value="' + component.group + '">' + component.group + '</option>'
            }
        }).join('')

        this.componentSelect = $('<div class="cl-component-group-select"><select class="cl-select">' + optionTpl + '</select></div>')
        this.componentContainer = $('<div class="cl-component-group-container"></div>')
        var $elem = $('<div class="cl-left-menu"></div>')
            .append([this.componentSelect, this.componentContainer])
        return $elem
    },
    initTipsLayout: function () {
        var $elem = $('<div class="cl-wrap-tips"></div>')
            .append([
                '<div class="cl-wrap-tips__hd">',
                '<strong class="cl-wrap-tips__title">快捷键</strong>',
                '<a class="cl-wrap-tips__close" href="javascript:;">',
                '<i class="iconfont icon-checkbox-close-circle-o"></i>',
                '</a>',
                '</div>'
            ].join(''))
            .append([
                '<div class="cl-wrap-tips__bd">',
                '<div class="cl-wrap-tips__item">',
                '<label class="cl-wrap-tips__label">',
                '<i class="iconfont icon-key-up"></i>',
                '</label>',
                '<div class="cl-wrap-tips__value">上移</div>',
                '</div>',
                '<div class="cl-wrap-tips__item">',
                '<label class="cl-wrap-tips__label">',
                '<i class="iconfont icon-key-down"></i>',
                '</label>',
                '<div class="cl-wrap-tips__value">下移</div>',
                '</div>',
                '<div class="cl-wrap-tips__item">',
                '<label class="cl-wrap-tips__label">',
                '<i class="iconfont icon-key-left"></i>',
                '</label>',
                '<div class="cl-wrap-tips__value">左移</div>',
                '</div>',
                '<div class="cl-wrap-tips__item">',
                '<label class="cl-wrap-tips__label">',
                '<i class="iconfont icon-key-right"></i>',
                '</label>',
                '<div class="cl-wrap-tips__value">右移</div>',
                '</div>',
                '<div class="cl-wrap-tips__item">',
                '<label class="cl-wrap-tips__label">',
                '<i class="iconfont icon-key-keyboard"></i>',
                '<small>Esc</small>',
                '</label>',
                '<div class="cl-wrap-tips__value">取消</div>',
                '</div>',
                '<div class="cl-wrap-tips__item">',
                '<label class="cl-wrap-tips__label">',
                '<i class="iconfont icon-key-keyboard"></i>',
                '<small>Del</small>',
                '</label>',
                '<div class="cl-wrap-tips__value">删除</div>',
                '</div>',
                '<div class="cl-wrap-tips__item">',
                '<label class="cl-wrap-tips__label">',
                '<i class="iconfont icon-contextmenu"></i>',
                '</label>',
                '<div class="cl-wrap-tips__value">菜单</div>',
                '</div>',
                '</div>'
            ].join(''))

        return $elem
    },
    showComponentsByGroup: function (group) {
        var res = setArr(this.components, 'name');
        var components = res.filter(function (n) {
            return n.group === group
        })
        var componentsTpl = components.map(function (component) {
            var dragImage = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='
            return component.image
                ? [
                    '<div class="cl-component-group-item" draggable="true" data-name="' + component.name + '" data-group="' + component.group + '">',
                    '<img class="cl-component-group-item-image" src="' + component.image + '"/>',
                    '<img class="cl-component-group-item-drag" src="' + dragImage + '"/>',
                    '</div>'
                ].join('')
                : [
                    '<div class="cl-component-group-item" draggable="true" data-name="' + component.name + '" data-group="' + component.group + '">',
                    '<i class="cl-component-group-item-icon iconfont ' + component.icon + '"></i>',
                    '<span class="cl-component-group-item-span">' + component.label + '</span>',
                    '<img class="cl-component-group-item-drag" src="' + dragImage + '">',
                    '</div>'
                ].join('')
        }).join('')
        this.componentContainer.html(componentsTpl)
    },
    fillData: function (data) {
        Page.pages.forEach(function (page) {
            page.widgets.forEach(function (widget) {
                widget.fill({
                    data: data
                })
            })
        })
    },
    save: function () {
        this.onSave(this.getData())
    },
    onSave: function (data) {
        console.log('onSave:', data)
        // TODO: 保存信息
    },
    addPage: function () {
        var page = new Page({ size: this.opts.size })
        this.wrap.append(page.getElem())
        return page
    },
    getElem: function () {
        return this.container
    },
    remove: function () {
        this.container.remove()
    },
    getData: function () {
        var data = Page.pages.map(function (page) {
            return page.widgets.map(function (widget) {
                return widget.getOption()
            })
        })

        return { config: this.opts, widgets: data }
    },
    addWidget: function (page, opts) {
        var widget = page.addWidget(opts)
        this.initWidget(widget)
    },
    addWidgets: function (page, widgets) {
        var that = this
        widgets.forEach(function (widget) {
            that.addWidget(page, widget)
        })
    },
    addPageWidgets: function (list) {
        var that = this
        list.forEach(function (widgets) {
            var page = that.addPage()
            that.addWidgets(page, widgets)
        })
    },
    getPreviewPages: function () {
        var that = this
        return Page.pages.map(function (page) {

            var widgetsTpl = page.widgets.map(function (widget) {
                return widget.getHtml()
            })

            var $previewPage = $('<div class="preview-page"></div>')
                .css({
                    width: that.opts.size[0] + 'mm',
                    height: that.opts.size[1] + 'mm'
                })
                .append(widgetsTpl)

            return $previewPage.prop('outerHTML')
        }).join('')
    },
    getHtml: function () {
        var previewPages = this.getPreviewPages()
        return [
            '<!DOCTYPE html>',
            '<html lang="en">',
            '<head>',
            '<meta charset="UTF-8">',
            '<title>打印预览2</title>',
            '<link rel="stylesheet" href="http://at.alicdn.com/t/font_1105799_da1vmnivatr.css">',
            '<style>*{margin:0;padding:0;box-sizing:border-box;}html,body{height:100%;min-height:100%;background:#fff;}html{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-text-size-adjust:none;}.preview-page{margin:5px;position:relative;border:1px solid #fff;page-break-after:always;overflow:hidden;}.cl-widget{position:absolute;z-index:2;}.cl-widget-container{height:100%;overflow:hidden;}.js-hide{display:none!important;}.iconfont{font-size:inherit;}.icon-trash{color:#dd514c;}</style>',
            '</head>',
            '<body>' + previewPages + '</body>',
            '</html>'
        ].join('')
    },
    preview: function () {
        var opener = window.open('about:blank')
        opener.document.write(this.getHtml())
    },
    clear: function () {
        Page.pages.forEach(function (page) {
            page.clear()
        })
    },
    reset: function () {
        location.reload(true)
    },
    initWidget: function (widget) {
        var that = this
        widget.onSelected = function (opts) {
            that.showProps(this, opts)
            that.tips.show()
        }
        widget.onCancelSelect = function () {
            that.hideProps()
            that.tips.hide()
        }
    },
    showProps: function (widget, opts) {
        var that = this
        that.propPanel.stop().animate({
            marginRight: 0
        }, 'fast')
        var propsPanel = new PropsPanel(opts)
        propsPanel.onUpdate = function (config) {
            widget.update(config)
        }
        that.propPanel.html('').append(propsPanel.getElem())
    },
    hideProps: function () {
        var that = this
        that.propPanel.stop().animate({
            marginRight: -250
        }, 'fast')
    }
}

// ================ page ====================
function Page(opts) {
    this.opts = $.extend({
        name: '' + (Page.pages.length + 1),
        size: [100, 100] // mm
    }, opts)
    this._index = Page.pages.push(this) - 1
    this.widgets = []
    this.init()
}

Page.reInit = function () {
    for (var i = 0; i < Page.pages.length; i++) {
        (function (page, n) {
            page._index = n
            page.elem.find('.cl-page-name > span').html(n + 1)
        })(Page.pages[i], i)
    }
}

Page.pages = []
Page.onDrop = function () { }
Page.onDragMove = function () { }
Page.onDragEnter = function () { }
Page.onDragLeave = function () { }
Page.startDrop = function () {
    for (var i = 0; i < Page.pages.length; i++) {
        (function (page) {
            page.startDrop()
            page.onDrop = function (position) {
                Page.onDrop(page, position)
            }
            page.onDragMove = function (position) {
                Page.onDragMove(page, position)
            }
            page.onDragEnter = function (position) {
                Page.onDragEnter(page, position)
            }
            page.onDragLeave = function (position) {
                Page.onDragLeave(page, position)
            }
        })(Page.pages[i])
    }
}

Page.prototype = {
    init: function () {
        this.initLayout()
        this.initEvent()
    },
    onDrop: function () { },
    onDragMove: function () { },
    onDragEnter: function () { },
    onDragLeave: function () { },
    getElem: function () {
        return this.elem
    },
    initLayout: function () {
        var that = this

        that.container = $('<div class="cl-page-container"></div>')
            .css({ width: that.opts.size[0] + 'mm', height: that.opts.size[1] + 'mm' })

        that.tools = $('<div class="cl-page-tools"></div>')
            .append([
                '<input id="picture" type="file">',
                '<button class="cl-btn cl-btn-primary cl-radius js-select"><i class="iconfont icon-image"></i></button>',
                '<button class="cl-btn cl-btn-primary cl-radius js-setbg" style="display:none"><i class="iconfont icon-exchange"></i></button>',
                '<button class="cl-btn cl-btn-default cl-radius js-remove"><i class="iconfont icon-trash"></i></button>'
            ])

        that.previewArea = $('<div class="cl-page-preview-area js-hide"></div>')
            .css({ width: that.opts.size[0] + 'mm', height: that.opts.size[1] + 'mm' })

        that.elem = $('<div class="cl-page"></div>')
            .append([that.container, that.tools, that.previewArea])
    },
    initEvent: function () {
        var that = this
        that.tools
            .on('click', 'button.js-remove', function () {
                that.remove()
            })
            .on('click', 'button.js-select', function () {
                if ($(this).hasClass('cl-btn-danger')) {
                    that.tools.find('button.js-select')
                        .addClass('cl-btn-primary')
                        .removeClass('cl-btn-danger')
                    that.tools.find('button.js-setbg').hide()
                    that.previewArea.addClass('js-hide')
                } else {
                    that.tools.find('[type="file"]').trigger('click')
                }
            })
            .on('click', 'button.js-setbg', function () {
                var has = $(this).hasClass('cl-btn-danger')
                that.tools.find('button.js-setbg')
                    .toggleClass('cl-btn-danger', !has)
                    .toggleClass('cl-btn-primary', has)
                that.previewArea.toggleClass('multiply', !has)
            })
            .on('change', '[type="file"]', function () {
                var picture = new Image()
                var pictureFile = document.getElementById('picture')

                // 获取图片后缀
                var ext = this.value.substring(this.value.lastIndexOf('.') + 1).toLowerCase()
                if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
                    alert('图片的格式必须为png或者jpg或者jpeg格式！')
                    return false
                }

                var fileReader = function (file) {
                    file.select()
                    file.blur() // 全村的希望
                    var reallocalpath = document.selection.createRange().text
                    picture.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=\'scale\',src="' + reallocalpath + '")'
                    picture.style.width = that.opts.size[0] + 'mm'
                    picture.style.height = that.opts.size[1] + 'mm'
                    picture.src = 'data:image/bmp;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
                }

                var html5Reader = function (file) {
                    var file = file.files[0]
                    var reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = function (d) {
                        picture.src = this.result
                    }
                }

                // 判断ie类型
                if (navigator.appName === "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 10) {
                    fileReader(pictureFile)
                } else {
                    html5Reader(pictureFile)
                }

                that.tools.find('button.js-select')
                    .addClass('cl-btn-danger')
                    .removeClass('cl-btn-primary')
                that.tools.find('button.js-setbg')
                    .addClass('cl-btn-primary')
                    .removeClass('cl-btn-danger')
                    .show()
                that.previewArea
                    .html(picture)
                    .removeClass('js-hide')
                    .removeClass('multiply')
            })

        that.container.on('contextmenu', function (e) {
            e.preventDefault()
            e.stopPropagation()
            showContextMenu(
                e,
                ['清空当前页'].concat(Page.pages.map(function (n) {
                    return '复制所有到页面：' + (n._index + 1)
                })),
                [function () {
                    that.clear()
                }].concat(Page.pages.map(function (page) {
                    return function () {
                        that.widgets.forEach(function (widget) {
                            page.addWidget(widget.getOption())
                        })
                    }
                }))
            )
        })
    },
    remove: function () {
        var that = this
        that.elem.remove()
        Page.pages.splice(this._index, 1)
        Page.reInit()
    },
    clear: function () {
        while (this.widgets.length) {
            this.widgets[0].remove()
        }
    },
    getWidgetIndex: function (widget) {
        for (var i = 0; i < this.widgets.length; i++) {
            var obj = this.widgets[i]
            if (widget.opts.id === obj.opts.id) {
                return i
            }
        }
    },
    addWidget: function (name) {
        var that = this
        var widget = new Widget(name)
        this.widgets.push(widget)
        widget.onRemove = function () {
            that.widgets.splice(that.getWidgetIndex(widget), 1)
        }
        this.container.append(widget.render())
        return widget
    },
    addWidgets: function (widgets) {
        var that = this
        widgets.forEach(function (widget) {
            that.addWidget(widget)
        })
    },
    startDrop: function () {
        var that = this
        var $doc = $(document)
        var containerRect = this.getContainerPosition()
        var status = 0
        var random = getRandomString()
        $doc
            .on('mouseup.cl.page-' + random, function (e) {
                releaseCapture(e)
                $doc
                    .removeClass('cl-no-select')
                    .off('mouseup.cl.page-' + random)
                    .off('mousemove.cl.page-' + random)
                var containerPosition = that.checkInContainer(getMousePosition(e))
                if (containerPosition) {
                    that.onDrop(containerPosition)
                }
            })
            .on('mousemove.cl.page-' + random, function (e) {
                var position = getMousePosition(e)
                var containerPosition = that.checkInContainer(position, containerRect)
                if (containerPosition) {
                    if (!status) {
                        that.onDragEnter()
                        status = 1
                    }
                    that.onDragMove(containerPosition)
                } else {
                    if (status) {
                        that.onDragLeave()
                        status = 0
                    }
                }
            })
    },
    checkInContainer: function (p, rectPosition) {
        var position = rectPosition || this.getContainerPosition()
        var p1 = position.p1
        var p2 = position.p2
        if (p.x > p1.left && p.x < p2.left && p.y > p1.top && p.y < p2.top) {
            return {
                left: p.x - p1.left,
                top: p.y - p1.top
            }
        }
    },
    getContainerPosition: function () {
        var p1 = this.container.offset()
        var p2 = {
            left: p1.left + this.container.width(),
            top: p1.top + this.container.height()
        }

        return { p1: p1, p2: p2 }
    }
}

//= =============== propsPanel ====================

function PropsPanel(opts) {
    this.opts = $.extend({
        label: '未命名'
    }, opts)
    this.group = {
        _default_: []
    }
    this.init()
}

PropsPanel.fields = {}
PropsPanel.onUpdate = function () { }

PropsPanel.prototype = {
    init: function (opts) {
        this.opts = opts || this.opts

        this.tabs = $('<div class="cl-props-tabs"></div>')
        this.container = $('<div class="cl-props-container"></div>')

        this.elem = $('<div class="cl-props-panel"></div>')
            .html('<div class="cl-props-panel-name">' + this.opts.label + '</div>')
            .append([
                this.tabs,
                this.container
            ])

        this.initTabs()
        this.initEvent()
    },
    getElem: function () {
        return this.elem
    },
    initEvent: function () {
        this.elem.on('mousedown', function (e) {
            e.stopPropagation()
        })
    },
    initTabs: function () {
        var that = this
        var groups = that.group
        var count = 0

        for (var name in that.opts.config.props) {
            var prop = that.opts.config.props[name]
            prop.name = name

            if (prop.group && !groups[prop.group]) {
                groups[prop.group] = []
                count++
            }

            if (prop.group) {
                groups[prop.group].push(prop)
            } else {
                groups._default_.push(prop)
            }
        }

        if (count > 0) {
            var html = ''
            for (var group in groups) {
                var label = group === '_default_'
                    ? '基本'
                    : group

                html += groups[group].length > 0
                    ? '<span class="cl-props-tab" data-group="' + group + '">' + label + '</span>'
                    : ''
            }

            this.tabs.html(html)
        }

        var tabItems = this.tabs.find('.cl-props-tab')
            .on('click', function () {
                var name = $(this).data('group')

                $(this)
                    .addClass('cl-props-tab-active')
                    .siblings()
                    .removeClass('cl-props-tab-active')

                that.initFields(name)
            })
        tabItems.eq(0).click()

        if (tabItems.length < 2) {
            tabItems.parent().hide()
        }
    },
    initFields: function (groupName) {
        var that = this
        var list = this.group[groupName]

        this.container.html('')
        for (var i = 0; i < list.length; i++) {
            var obj = list[i]
            that.initField(obj)
        }
    },
    initField: function (field) {
        var that = this
        var handler = PropsPanel.fields[field.type]

        if (handler) {
            this.container.append(handler(field, function (val) {
                if (typeof val !== 'undefined') {
                    field.value = val
                }
                that.opts.config.props[field.name] = field
                that.onUpdate(that.opts)
            }))
        }
    }
}

// ================ widget ====================
function Widget(opts) {
    if (typeof opts === 'string') {
        opts = { name: opts }
    }

    this.opts = $.extend(
        {
            id: getRandomString(),
            config: {
                data: {},
                props: {},
                css: {}
            },
            dataFormat: function (data) {
                return data
            },
            option: {
                resize: true,
                move: true
            }
        },
        Widget.getBaseConfig(opts.name)
    )

    if (opts.config && opts.config.props) {
        opts.config.props = this.formatProps(opts.config.props)
    }

    // $.extend(this.opts,opts);
    this.opts.config = JSON.parse(JSON.stringify(opts.config || this.opts.config))
    this.defaultConfig = JSON.parse(JSON.stringify(this.opts.config))
    this.init()
}

// static function
Widget.getComponents = function () {
    return CustomLabel.components.map(function (obj) {
        return {
            name: obj.name,
            type: obj.type,
            label: obj.label,
            config: obj.config,
            dataFormat: obj.dataFormat,
            option: obj.option,
            render: obj.render
        }
    })
}

// static function
Widget.getBaseConfig = function (name) {
    return $.extend({}, Widget.getComponents().filter(function (obj) {
        return obj.name === name

    })[0])
}

// static object
Widget.lastSelectedWidget = null

// TODO
Widget.prototype = {
    init: function (opts) {
        this.opts = opts || this.opts
        this.elem = $('<div class="cl-widget" data-id="' + this.opts.id + '"></div>')
            .css(this.opts.config.css)
            .data('_id_', this.opts.id)
            .html('<div class="cl-widget-drag"></div>')

        this.btnResize = $('<div class="cl-widget-resize"></div>')
        if (this.opts.option.resize) {
            this.btnResize.appendTo(this.elem)
        }

        this.initEvent()
    },
    onSelected: function () { },
    onCancelSelect: function () { },
    onUpdate: function () { },
    onRemove: function () { },
    getElem: function () {
        return this.elem
    },
    getHtml: function () {
        var $barcode = this.elem.find('[data-name="barcode_39"]')
        if ($barcode.length) {
            var code = $barcode.data('code');
            var type = $barcode.data('type');
            $barcode.attr('src', baseUrl + 'image/barcode?text=' + code + '&type=' + type);
        }
        return this.elem.get(0).outerHTML
    },
    getId: function () {
        return this.opts.id
    },
    getConfig: function () {
        return this.opts.config
    },
    getOption: function () {
        var that = this
        return {
            name: that.opts.name,
            type: that.opts.type,
            config: {
                data: that.opts.config.data,
                props: (function (props) {
                    var obj = {}
                    Object.keys(props).forEach(function (n) {
                        obj[n] = props[n].value
                    })
                    return obj
                })(that.opts.config.props),
                css: that.opts.config.css
            }
        }
    },
    formatProps: function (data) {
        var props = JSON.parse(JSON.stringify(this.opts.config.props))
        for (var name in data) {
            if (props[name]) {
                props[name].value = data[name]
            }
        }
        return props
    },
    fill: function (config) {
        // config.data && $.extend(this.opts.config.data, this.opts.dataFormat(config.data))
        this.opts.config.data = config.data ? this.opts.dataFormat(config.data) : this.opts.config.data
        config.css && $.extend(this.opts.config.css, config.css)
        config.props && $.extend(this.opts.config.props, this.formatProps(config.props))
        this.update()
    },
    css: function (css) {
        $.extend(this.opts.config.css, css)
        this.elem.css(css)
        return this
    },
    reset: function () {
        this.css(this.defaultConfig.css)
        return this
    },
    render: function (data) {
        $.extend(this.opts.config.data, data)
        return this.originalRender()
    },
    originalRender: function (config) {
        $.extend(this.opts.config, config || {})

        this.elem.find(':not(.cl-widget-drag,.cl-widget-resize)').remove()
        this.elem.append(this.opts.render.call(this, this.opts.config))

        return this.elem
    },
    update: function (config) {
        this.originalRender(config)
    },
    initEvent: function () {
        var that = this
        this.elem
            .on('mousedown', function (e) {
                setCapture(e)
                e.stopPropagation()
                var self = $(this)
                var offset = self.offset()
                var width = self.outerWidth()
                var height = self.outerHeight()
                var parent = self.parent()
                var parentOffset = parent.offset()
                var parentWidth = parent.innerWidth()
                var parentHeight = parent.innerHeight()
                var startPosition = getMousePosition(e)
                var position = startPosition
                var leftFix = (startPosition.x - offset.left)
                var topFix = (startPosition.y - offset.top)
                var maxX = parentWidth - width
                var maxY = parentHeight - height
                var maxWidth = parentOffset.left + parentWidth - offset.left
                var maxHeight = parentOffset.top + parentHeight - offset.top
                var x = 0
                var y = 0
                var isResize = e.target === that.btnResize[0]

                parent.addClass('cl-no-select')
                that.select()

                $(document)
                    .on('mouseup.cl.id-' + that.opts.id, function (e) {
                        releaseCapture(e)
                        parent.removeClass('cl-no-select')
                        $(this)
                            .off('mouseup.cl.id-' + that.opts.id)
                            .off('mousemove.cl.id-' + that.opts.id)
                        that.update()
                        that.onUpdate(that.opts.config)
                    })
                    .on('mousemove.cl.id-' + that.opts.id, function (e) {
                        position = getMousePosition(e)
                        if (isResize && that.opts.option.resize) {
                            width = position.x - offset.left + 5
                            width = width < 10 ? 10 : width
                            width = width > maxWidth ? maxWidth : width

                            height = position.y - offset.top + 5
                            height = height < 10 ? 10 : height
                            height = height > maxHeight ? maxHeight : height

                            that.css({ width: width, height: height })
                        } else if (that.opts.option.move) {
                            x = position.x - parentOffset.left - leftFix
                            x = x < 0 ? 0 : x
                            x = x > maxX ? maxX : x

                            y = position.y - parentOffset.top - topFix
                            y = y < 0 ? 0 : y
                            y = y > maxY ? maxY : y

                            that.css({ left: x, top: y })
                        }
                    })
            })
            .on('contextmenu', function (e) {
                e.preventDefault()
                e.stopPropagation()
                showContextMenu(
                    e,
                    ['删除'].concat(Page.pages.map(function (n) {
                        return '复制到页面：' + (n._index + 1)
                    })).concat(Page.pages.map(function (n) {
                        return '移动到页面：' + (n._index + 1)
                    })),
                    [function () {
                        that.remove()
                    }].concat(Page.pages.map(function (page) {
                        return function () {
                            page.addWidget(that.getOption())
                        }
                    })).concat(Page.pages.map(function (page) {
                        return function () {
                            page.addWidget(that.getOption())
                            that.remove()
                        }
                    }))
                )
            })
    },
    show: function () {
        this.elem.show()
    },
    hide: function () {
        this.elem.hide()
    },
    remove: function () {
        this.elem.remove()
        this.onRemove(this)
    },
    select: function () {
        var that = this
        if (Widget.lastSelectedWidget) {
            this.cancelSelect.call(Widget.lastSelectedWidget)
        }
        Widget.lastSelectedWidget = this

        $(document.body)
            .on('mousedown.widget.cancel' + this.opts.id, this.cancelSelect.bind(this))
            .on('keydown.widget', function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0]
                var $elem = that.elem
                var top = parseFloat($elem.css('top'))
                var maxTop = $elem.parent().height() - $elem.height()
                var left = parseFloat($elem.css('left'))
                var maxLeft = $elem.parent().width() - $elem.width()

                switch (e.keyCode) {
                    case 27: // esc
                        that.cancelSelect()
                        break
                    case 37: // left
                        left = left - 1 > 0 ? left - 1 : 0
                        $elem.css({ left: left })
                        break
                    case 38: // up
                        top = top - 1 > 0 ? top - 1 : 0
                        $elem.css({ top: top })
                        break
                    case 39: // right
                        left = left + 1 > maxLeft ? maxLeft : left + 1
                        $elem.css({ left: left })
                        break
                    case 40: // down
                        top = top + 1 > maxTop ? maxTop : top + 1
                        $elem.css({ top: top })
                        break
                    case 46: // delete
                        that.cancelSelect()
                        that.remove()
                        break
                }
            })
        this.elem.addClass('cl-widget-selected')

        this.onSelected(this.opts)
    },
    cancelSelect: function () {
        $(document.body)
            .off('mousedown.widget.cancel' + this.opts.id)
            .off('keydown.widget')
        this.elem.removeClass('cl-widget-selected')
        this.onCancelSelect()
    }
}


function setArr(arr, key) {
    var result = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i][key]]) {
            result.push(arr[i]);
            obj[arr[i][key]] = true;
        }
    }
    return result
}
// ================ contextMenu ===============

function showContextMenu(e, menus, callbacks) {
    var position = getMousePosition(e)
    var $doc = $(document)
    var $elem = $('<div class="cl-context-menu"></div>')
    var random = getRandomString()
    var html = ''

    $.each(menus, function (index, item) {
        html += '<a href="javascript:void(0);">' + menus[index] + '</a>'
    })

    $elem
        .css({ top: position.y, left: position.x })
        .html(html)
        .appendTo(document.body)
        .on('click', '>a', function () {
            var index = $(this).index()
            $elem.remove()
            callbacks[index] && callbacks[index]()
        })
        .on('mouseup', '>a', function (e) {
            e.stopPropagation()
        })

    $doc.on('mouseup.' + random, function () {
        $elem.remove()
        $doc.off('mouseup.' + random)
    })
}

// ================ common ====================

function getRandomString() {
    return 'cl' + Math.random().toString(16).substr(2)
}

function getMousePosition(ev) {
    return ev.pageX || ev.pageY
        ? { x: ev.pageX, y: ev.pageY }
        : {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
        }
}

// 设置捕获范围
function setCapture(e) {
    if (e.target.setCapture) {
        e.target.setCapture()
    } else if (window.captureEvents) {
        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
    }
}

// 取消捕获范围
function releaseCapture(e) {
    if (e.target.releaseCapture) {
        e.target.releaseCapture()
    } else if (window.captureEvents) {
        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
    }
}


// ----------------------------
/**
 * Created by Bright on 2019/1/14.
 */

//= ===========自定义属性面板字段=======================================================

var host = 'http://172.16.0.126:8000'

// 输入框
CustomLabel.addPropsPanelField('text', function (data, update) {
    var $elem = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + data.label + '：</label>',
        '<input class="cl-input" type="text" data-widget-type="text" value="' + data.value + '">',
        '</div>'
    ].join(''))

    $elem.on('keyup', '[data-widget-type="text"]', function () {
        update(this.value)
    })

    return $elem
})

// 文本域
CustomLabel.addPropsPanelField('textarea', function (data, update) {
    var $elem = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + data.label + '：</label>',
        '<textarea class="cl-textarea" data-widget-type="textarea">' + data.value + '</textarea>',
        '</div>'
    ].join(''))

    $elem.on('keyup', '[data-widget-type="textarea"]', function () {
        update($(this).val())
    })

    return $elem
})

// 下拉框
CustomLabel.addPropsPanelField('select', function (data, update) {
    var $elem = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + data.label + '：</label>',
        '<select class="cl-select" data-widget-type="select">',
        createOptionTpl(data.option, data.value),
        '</select>',
        '</div>'
    ].join(''))

    $elem.on('change', '[data-widget-type="select"]', function () {
        update($(this).val())
    })

    return $elem
})

// 单选框
CustomLabel.addPropsPanelField('checkbox', function (prop, update) {
    var value = prop.value
    var $elem = $([
        '<div>',
        '<label class="cl-checkbox">',
        '<input type="checkbox" data-widget-type="checkbox">',
        '<span>' + prop.label + '</span>',
        '</label>',
        '</div>'
    ].join(''))

    $elem
        .on('change', '[type="checkbox"]', function () {
            value = $(this).is(':checked')
            update(value)
        })
        .find('[type="checkbox"]')
        .prop('checked', value)

    return $elem
})

// 可编辑多选框
CustomLabel.addPropsPanelField('checkboxList', function (prop, update) {
    var value = prop.value
    var option = prop.option
    var $elem = $('<div></div>')

    // init data
    if (typeof option.title === 'string' && option.title) {
        $elem.html('<div class="cl-props-label">' + option.title + '</div>')
    }

    $.each(value || [], function (index, item) {
        var $checkbox = $([
            '<label class="cl-checkbox">',
            item.checked
                ? '<input type="checkbox" data-widget-name="' + item.name + '" data-widget-type="checkbox" checked>'
                : '<input type="checkbox" data-widget-name="' + item.name + '" data-widget-type="checkbox">',
            '<span>' + item.label + '</span>',
            '</label>'
        ].join(''))

        var $input = $([
            '<div class="cl-form-group">',
            item.checked
                ? '<input class="cl-input" type="text" data-widget-name="' + item.name + '" data-widget-type="text" value="' + item.text + '">'
                : '<input class="cl-input" type="text" data-widget-name="' + item.name + '" data-widget-type="text" value="' + item.text + '" disabled>',
            '</div>'
        ].join(''))

        if (option.edit) {
            $elem.append([$checkbox, $input])
        } else {
            $elem.append($checkbox)
        }
    })

    // init event
    $elem
        .on('change', '[data-widget-type="checkbox"]', function () {
            var name = $(this).data('widgetName')
            var checked = $(this).is(':checked')

            $elem.find('[data-widget-name="' + name + '"][data-widget-type="text"]')
                .prop('disabled', !checked)

            $.each(value || [], function (index, item) {
                if (item.name === name) {
                    item.checked = checked
                }
            })

            update(value)
        })
        .on('keyup', '[data-widget-type="text"]', function () {
            var name = $(this).data('widgetName')
            var text = this.value
            $.each(value || [], function (index, item) {
                if (item.name === name) {
                    item.text = text
                }
            })

            update(value)
        })

    return $elem
})

// 边框
CustomLabel.addPropsPanelField('border', function (prop, update) {
    var value = prop.value
    var keyMap = { Top: '上', Bottom: '下', Left: '左', Right: '右' }
    var optionValues = ['0px', '1px', '2px', '3px', '4px', '5px']
    var $elem = $('<div></div>')
    var html = ''

    for (var key in value.config) {
        html += [
            '<label class="cl-checkbox">',
            '<input type="checkbox" data-widget-position="' + key + '" data-widget-name="disabled" data-widget-type="checkbox">',
            '显示' + keyMap[key] + '边框',
            '</label>',
            '<div class="cl-form-group-inline">',
            '<div class="cl-form-group">',
            '<label class="cl-form-group-label">' + keyMap[key] + '边框厚度：</label>',
            '<select class="cl-select" data-widget-position="' + key + '" data-widget-name="border" data-widget-type="select">',
            createOptionTpl(optionValues),
            '</select>',
            '</div>',
            '<div class="cl-form-group">',
            '<label class="cl-form-group-label">' + keyMap[key] + '边框边距：</label>',
            '<select class="cl-select" data-widget-position="' + key + '" data-widget-name="padding" data-widget-type="select">',
            createOptionTpl(optionValues),
            '</select>',
            '</div>',
            '</div>'
        ].join('')
    }

    $elem.html(html)

    // init data
    $elem.find('[data-widget-position]').each(function () {
        var name = $(this).data('widgetName')
        var type = $(this).data('widgetType')
        var position = $(this).data('widgetPosition')
        var disabled = value.config[position].disabled

        switch (type) {
            case 'checkbox':
                $(this).prop('checked', !disabled)
                break
            case 'select':
                $(this).prop('disabled', disabled).val(value.config[position][name])
                break
        }
    })

    // init event
    $elem
        .on('change', '[data-widget-type="checkbox"]', function () {
            var position = $(this).data('widgetPosition')
            var disabled = !$(this).is(':checked')

            $('[data-widget-position="' + position + '"]:not([data-widget-type="checkbox"])').prop('disabled', disabled)

            value.css['border' + position] = disabled ? 0 : value.config[position].border + ' solid #000'
            value.css['padding' + position] = disabled ? 0 : value.config[position].padding
            value.config[position].disabled = disabled

            update(value)
        })
        .on('change', '[data-widget-name="border"]', function () {
            var name = $(this).data('widgetName')
            var position = $(this).data('widgetPosition')

            value.config[position][name] = this.value
            value.css[name + position] = this.value + ' solid #000'

            update(value)
        })
        .on('change', '[data-widget-name="padding"]', function () {
            var name = $(this).data('widgetName')
            var position = $(this).data('widgetPosition')

            value.config[position][name] = this.value
            value.css[name + position] = this.value

            update(value)
        })

    return $elem
})
// export 
CustomLabel.addPropsPanelField('date', function (prop, update) {
    var value = prop.value
    var $elem = $([
        '<div>',
        '<label class="cl-checkbox">',
        value.yearVisible
            ? '<input type="checkbox" data-widget-value="yearVisible" checked>'
            : '<input type="checkbox" data-widget-value="yearVisible">',
        '显示年份',
        '</label>',
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">日期分割符号：</label>',
        '<select class="cl-select" data-widget-value="separator">',
        createOptionTpl([
            { value: '-', label: '中横杠（-）' },
            { value: '/', label: '斜　线（/）' },
            { value: '.', label: '逗　点（.）' }
        ], value.separator || '-'),
        '</select>',
        '</div>',
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">日期对齐方式：</label>',
        '<select class="cl-select" data-widget-name="textAlign" data-widget-type="select">',
        createOptionTpl([
            { value: 'left', label: '左对齐' },
            { value: 'center', label: '居中' },
            { value: 'right', label: '右对齐' }
        ], value.css.textAlign),
        '</select>',
        '</div>',
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">日期文字字体：</label>',
        '<select class="cl-select" data-widget-name="fontFamily" data-widget-type="select">',
        createOptionTpl(['Arial', 'Helvetica', 'Tahoma', 'Verdana', 'Lucida Grande', 'Times New Roman', 'Georgia'], value.css.fontFamily),
        '</select>',
        '</div>',
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">日期文字尺寸：</label>',
        '<select class="cl-select" data-widget-name="fontSize" data-widget-type="select">',
        createOptionTpl(['6px', '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '24px', '30px', '36px', '48px', '60px', '72px'], value.css.fontSize),
        '</select>',
        '</div>',
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">日期行间距：</label>',
        '<select class="cl-select" data-widget-name="lineHeight" data-widget-type="select">',
        createOptionTpl([
            { value: 'normal', label: '默认' },
            { value: '1', label: '1倍' },
            { value: '1.5', label: '1.5倍' },
            { value: '2', label: '2倍' },
            { value: '2.5', label: '2.5倍' },
            { value: '3', label: '3倍' }
        ], value.css.lineHeight),
        '</select>',
        '</div>',
        '<label class="cl-checkbox">',
        value.css.fontWeight === 'bold'
            ? '<input type="checkbox" data-widget-name="fontWeight" data-widget-type="checkbox" data-widget-default="normal" data-widget-value="bold" checked>'
            : '<input type="checkbox" data-widget-name="fontWeight" data-widget-type="checkbox" data-widget-default="normal" data-widget-value="bold">',
        '日期文字加粗',
        '</label>',
        '</div>'
    ].join(''))

    $elem
        .on('keyup', '[data-widget-type="text"]', function () {
            var name = $(this).data('widgetName')
            value.css[name] = this.value
            update(value)
        })
        .on('change', '[data-widget-type="select"]', function () {
            var name = $(this).data('widgetName')
            value.css[name] = this.value
            update(value)
        })
        .on('change', '[data-widget-type="checkbox"]', function () {
            var name = $(this).data('widgetName')
            value.css[name] = $(this).is(':checked')
                ? $(this).data('widgetValue') || true
                : $(this).data('widgetDefault') || false
            update(value)
        })
        .on('change', '[data-widget-value="yearVisible"]', function () {
            value.yearVisible = $(this).is(':checked')
            update(value)
        })
        .on('change', '[data-widget-value="separator"]', function () {
            value.separator = this.value
            update(value)
        })

    return $elem
})

// 文本样式
CustomLabel.addPropsPanelField('fontStyle', function (data, update) {
    var defaultProps = {
        label: '内容',
        option: [
            'visible',
            'text',
            'display',
            'textAlign',
            'paddingBottom',
            'fontFamily',
            'fontSize',
            'lineHeight',
            'fontWeight',
            'prefix'
        ],
        value: {
            visible: true,
            text: '',
            prefix: '',
            css: {
                display: 'block',
                textAlign: 'left',
                paddingBottom: '0px',
                fontFamily: 'Arial',
                fontSize: '12px',
                lineHeight: 'normal',
                fontWeight: 'normal'
            }
        }
    }
    var props = $.extend(defaultProps, data)
    var propOption = props.option
    var propValue = props.value
    var propLabel = props.label

    var $formGroup = {}

    // 是否显示 - visible
    $formGroup['visible'] = $([
        '<label class="cl-checkbox">',
        propValue.visible
            ? '<input type="checkbox" data-widget-value="visible" checked>'
            : '<input type="checkbox" data-widget-value="visible">',
        '<span>显示' + propLabel + '</span>',
        '</label>'
    ].join(''))
    $formGroup['visible'].find('[data-widget-value="visible"]')
        .change(function () {
            var visible = $(this).is(':checked')
            propValue.visible = visible
            update(propValue)
        })

    // 文字文本 - text
    $formGroup['text'] = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + propLabel + '文本：</label>',
        '<input class="cl-input" type="text" data-widget-name="text" data-widget-type="text" value="' + propValue.text + '">',
        '</div>'
    ].join(''))

    // 整行显示 - display:inline-block
    $formGroup['display'] = $([
        '<label class="cl-checkbox">',
        propValue.css.display === 'block'
            ? '<input type="checkbox" data-widget-name="display" data-widget-type="checkbox" data-checked-value="block" data-unchecked-value="inline" checked>'
            : '<input type="checkbox" data-widget-name="display" data-widget-type="checkbox" data-checked-value="block" data-unchecked-value="inline">',
        '<span>' + propLabel + '整行显示</span>',
        '</label>'
    ].join(''))
    $formGroup['display'].find('[data-widget-name]')
        .change(function () {
            var display = $(this).is(':checked') ? 'block' : 'none'
            $formGroup['textAlign'].css('display', display)
            $formGroup['paddingBottom'].css('display', display)
        })

    // 对齐方式 - textAlign
    $formGroup['textAlign'] = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + propLabel + '对齐方式：</label>',
        '<select class="cl-select" data-widget-name="textAlign" data-widget-type="select">',
        createOptionTpl([
            { value: 'left', label: '左对齐' },
            { value: 'center', label: '居中' },
            { value: 'right', label: '右对齐' }
        ], propValue.css.textAlign),
        '</select>',
        '</div>'
    ].join(''))
    $formGroup['textAlign'].css('display', propValue.css.display === 'inline' ? 'none' : 'block')

    // 与内容间距 - paddingBottom
    $formGroup['paddingBottom'] = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + propLabel + '与内容间距：</label>',
        '<select class="cl-select" data-widget-name="paddingBottom" data-widget-type="select">',
        createOptionTpl(['0px', '1px', '2px', '3px', '4px', '5px'], propValue.css.paddingBottom),
        '</select>',
        '</div>'
    ].join(''))
    $formGroup['paddingBottom'].css('display', propValue.css.display === 'inline' ? 'none' : 'block')

    // 文字字体 - fontFamily
    $formGroup['fontFamily'] = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + propLabel + '文字字体：</label>',
        '<select class="cl-select" data-widget-name="fontFamily" data-widget-type="select">',
        createOptionTpl(['Arial', 'Helvetica', 'Tahoma', 'Verdana', 'Lucida Grande', 'Times New Roman', 'Georgia'], propValue.css.fontFamily),
        '</select>',
        '</div>'
    ].join(''))

    // 文字尺寸 - fontSize
    $formGroup['fontSize'] = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + propLabel + '文字尺寸：</label>',
        '<select class="cl-select" data-widget-name="fontSize" data-widget-type="select">',
        createOptionTpl(['6px', '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '24px', '30px', '36px', '48px', '60px', '72px'], propValue.css.fontSize),
        '</select>',
        '</div>'
    ].join(''))

    // 行间距 - lineHeight
    $formGroup['lineHeight'] = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + propLabel + '行间距：</label>',
        '<select class="cl-select" data-widget-name="lineHeight" data-widget-type="select">',
        createOptionTpl([
            { value: 'normal', label: '默认' },
            { value: '1', label: '1倍' },
            { value: '1.5', label: '1.5倍' },
            { value: '2', label: '2倍' },
            { value: '2.5', label: '2.5倍' },
            { value: '3', label: '3倍' }
        ], propValue.css.lineHeight),
        '</select>',
        '</div>'
    ].join(''))

    // 文字加粗 - fontWeight
    $formGroup['fontWeight'] = $([
        '<label class="cl-checkbox">',
        propValue.css.fontWeight === 'bold'
            ? '<input type="checkbox" data-widget-name="fontWeight" data-widget-type="checkbox" data-checked-value="bold" data-unchecked-value="normal" checked>'
            : '<input type="checkbox" data-widget-name="fontWeight" data-widget-type="checkbox" data-checked-value="bold" data-unchecked-value="normal">',
        '<span>' + propLabel + '文字加粗</span>',
        '</label>'
    ].join(''))

    // 前缀 - prefix
    $formGroup['prefix'] = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + propLabel + '前缀：</label>',
        '<input class="cl-input" type="text" data-widget-name="prefix" data-widget-type="text" value="' + propValue.prefix + '">',
        '</div>'
    ].join(''))

    var $elem = $('<div></div>')

    // init document
    $.each(propOption, function (index, item) {
        $formGroup[item].appendTo($elem)
    })

    // init data
    $elem.find('[data-widget-name]').prop('disabled', !propValue.visible)

    // init event
    $elem
        .on('change', '[data-widget-value="visible"]', function () {
            var checked = $(this).is(':checked')
            for (var key in $formGroup) {
                $formGroup[key].find('[data-widget-type]').prop('disabled', !checked)
            }
        })
        .on('keyup', '[data-widget-type="text"]', function () {
            var widgetName = $(this).data('widgetName')
            var widgetValue = this.value
            propValue[widgetName] = widgetValue
            update(propValue)
        })
        .on('change', '[data-widget-type="checkbox"]', function () {
            var widgetName = $(this).data('widgetName')
            var checkedValue = $(this).data('checkedValue')
            var uncheckedValue = $(this).data('uncheckedValue')
            var checked = $(this).is(':checked')
            propValue.css[widgetName] = checked ? checkedValue : uncheckedValue
            update(propValue)
        })
        .on('change', '[data-widget-type="select"]', function () {
            var widgetName = $(this).data('widgetName')
            var widgetValue = this.value
            propValue.css[widgetName] = widgetValue
            update(propValue)
        })

    return $elem
})

// 表格内容
CustomLabel.addPropsPanelField('tableRow', function (prop, update) {
    var option = prop.option
    var label = prop.label
    var value = prop.value
    var $elem = $('<div></div>')

    var theadText = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + label + '表头文字：</label>',
        '<textarea class="cl-textarea" data-widget-name="text" data-widget-type="textarea">' + value.text + '</textarea>',
        '</div>'
    ].join(''))
    theadText.appendTo($elem)

    var $typeSelect = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">' + label + '显示内容：</label>',
        '<select class="cl-select" data-widget-name="type" data-widget-type="select">',
        createOptionTpl([
            { label: '多字段组合', value: 'fields' },
            { label: '自定义内容', value: 'const' }
        ], value.type),
        '</select>',
        '</div>'
    ].join(''))

    var $checkboxList = $('<div class="cl-form-group"><label class="cl-form-group-label">选择显示字段：</label></div>')
    $.each(option.fields || [], function (index, item) {
        var $checkbox = $([
            '<label class="cl-checkbox">',
            '<input type="checkbox" data-widget-field="' + item.field + '">',
            '<span>' + item.label + '</span>',
            '</label>'
        ].join(''))
        $checkbox.appendTo($checkboxList)
    })
    $.each(value.fields || [], function (index, field) {
        $checkboxList.find('[data-widget-field="' + field + '"]')
            .prop('checked', true)
    })

    var $textarea = $([
        '<label class="cl-form-group-label">自定义文字内容：</label>',
        '<textarea class="cl-textarea" data-widget-name="const" data-widget-type="textarea">' + value.const + '</textarea>'
    ].join(''))

    // init document
    switch (value.type) {
        case 'fields':
            $elem.append([$typeSelect, $checkboxList])
            break
        case 'const':
            $elem.append([$typeSelect, $textarea])
            break
    }

    // init event
    $elem
        .on('keyup', '[data-widget-type="textarea"]', function () {
            var widgetName = $(this).data('widgetName')
            value[widgetName] = this.value
            update(value)
        })
        .on('change', '[data-widget-type="select"]', function () {
            var widgetName = $(this).data('widgetName')
            value[widgetName] = this.value
            update(value)
        })
        .on('change', '[data-widget-field]', function () {
            var fields = []
            $checkboxList.find('[data-widget-field]').each(function () {
                var widgetField = $(this).data('widgetField')
                var isChecked = $(this).is(':checked')
                if (isChecked) {
                    fields.push(widgetField)
                }
                $(this).prop('disabled', false)
            })

            if (fields.length === 1) {
                $checkboxList.find('[data-widget-field="' + fields[0] + '"]')
                    .prop('disabled', true)
            }

            value.fields = fields
            update(value)
        })
        .on('change', '[data-widget-name="type"]', function () {
            switch (this.value) {
                case 'fields':
                    $textarea.remove()
                    $elem.append($checkboxList)
                    break
                case 'const':
                    $checkboxList.remove()
                    $elem.append($textarea)
                    break
            }
        })

    return $elem
})

// 文件上传
CustomLabel.addPropsPanelField('fileUpload', function (data, update) {
    var defaultProps = {
        label: '文件',
        option: {
            name: 'file',
            maxSize: 1024000,
            reg: ''
        },
        value: ''
    }
    var props = $.extend(defaultProps, data)

    var propValue = props.value
    var propLabel = props.label
    var propOption = props.option

    var $fileUpload = $([
        '<div class="cl-form-group">',
        '<label class="cl-form-group-label">选择' + propLabel + '：</label>',
        '<input class="cl-input" id="templetfile" name="' + propOption.name + '" type="file">',
        '</div>'
    ].join(''))
    $fileUpload
        .on('change', '[type="file"]', function () {
            if (window.File && window.FileList) {
                var files = document.getElementById("templetfile").files;

                // 限制上传文件大小
                if (files[0].size >= propOption.maxSize) {
                    alert('图片容量过大，单张图片容量不能大于1MB！')
                    return false
                }

                //文件格式过滤
                var reg = new RegExp(propOption.reg, 'i')
                if (propOption.reg && !reg.test(files[0].type)) {
                    alert('请上传正确类型的文件')
                    return false

                }

                $.ajaxFileUpload({
                    url: host + '/api/upload_img?token=tag_tool',
                    secureuri: false,
                    fileElementId: 'templetfile',
                    dataType: 'json',
                    success: function (data, status) {
                        console.log('上传成功')
                        $preview.attr('src', host + data.path)
                        update(data.path)
                    },
                    error: function (data, status, e) {
                        console.log(e)
                        alert('上传失败')
                    }
                })
            } else {
                alert('浏览器无法上传')
            }
        })

    var $preview = $('<img>')
        .attr('src', propValue ? host + '/' + propValue : './img/img_default.jpg')
        .css('width', '100%')

    var $elem = $('<div></div>')
        .append($fileUpload)
        .append($preview)

    return $elem
})

// 进步器
CustomLabel.addPropsPanelField('stepper', function (data, update) {
    var defaultProps = {
        label: '数量',
        option: {
            max: 0,
            min: 0,
            step: 1,
            subButton: '－',
            addButton: '＋',
            disabled: false,
            editable: true
        },
        value: 0
    }
    var props = $.extend(true, defaultProps, data)

    var $label = $('<label class="cl-form-group-label"></label>')
        .text(props.label)

    var $stepper = $('<div class="cl-form-group-stepper"></div>')
        .append([
            '<a class="cl-btn cl-btn-primary cl-radius js-sub-btn" href="javascript:;">' + props.option.subButton + '</a>',
            '<input class="cl-input" type="text" data-widget-name="count" value="' + props.value + '">',
            '<a class="cl-btn cl-btn-primary cl-radius js-add-btn" href="javascript:;">' + props.option.addButton + '</a>',
            '<button class="cl-btn cl-btn-primary cl-radius js-set-full">设为100%</button>'
        ])
        .on('keyup', '[data-widget-name="count"]', function () {
            update(this.value)
        })
        .on('click', '.js-sub-btn', function () {
            var $countInput = $stepper.find('[data-widget-name="count"]')
            var count = $countInput.val() - props.option.step
            count = count < props.option.min ? props.option.min : count
            $countInput.val(count)
            update(count)
        })
        .on('click', '.js-add-btn', function () {
            var $countInput = $stepper.find('[data-widget-name="count"]')
            var count = $countInput.val() * 1 + props.option.step
            count = count > props.option.max ? props.option.max : count
            $countInput.val(count)
            update(count)
        })
        .on('click', '.js-set-full', function () {
            var $countInput = $stepper.find('[data-widget-name="count"]')
            var count = props.option.max
            $countInput.val(count)
            update(count)
        })

    var $elem = $('<div class="cl-form-group"></div>')
        .append([$label, $stepper])


    return $elem
})

CustomLabel.addPropsPanelField('icon-checkbox', function (data, update) {
    var defaultProps = {
        label: '含复选框',
        value: {
            visible: false,
            iconName: 'icon-checkbox-square-o'
        }
    }

    var props = $.extend(true, defaultProps, data)

    var $checkbox = $('<label class="cl-checkbox"></label>')
        .append([
            props.value.visible
                ? '<input type="checkbox" data-widget-name="visible" data-widget-type="checkbox" checked>'
                : '<input type="checkbox" data-widget-name="visible" data-widget-type="checkbox">',
            '<span>' + props.label + '</span>',
        ])

    var radioBox = [
        'icon-checkbox-square-o',
        'icon-checkbox-checked-square-o',
        'icon-checkbox-close-square-o',
        'icon-checkbox-square',
        'icon-checkbox-close-square',
        'icon-checkbox-circle-o',
        'icon-checkbox-checked-circle-o',
        'icon-checkbox-close-circle-o',
        'icon-checkbox-point-circle-o',
        'icon-checkbox-circle',
        'icon-checkbox-checked-circle',
        'icon-checkbox-close-circle'
    ].map(function (item) {
        return [
            '<label class="cl-radio-box">',
            '<input type="radio" name="iconName" data-widget-name="iconName" data-widget-type="checkbox" value="' + item + '">',
            '<span class="cl-radio-box__label">',
            '<i class="iconfont ' + item + '"></i>',
            '</span>',
            '</label>'
        ].join('')
    })
    var $radioList = $('<div class="cl-radio-list" style="overflow:hidden;"></div>')
        .append(radioBox)
        .toggleClass('js-hide', !props.value.visible)
    $radioList.find('[data-widget-name="iconName"][value="' + props.value.iconName + '"]').prop('checked', true)

    var $elem = $('<div class="cl-form-group"></div>')
        .append([$checkbox, $radioList])
        .on('change', '[data-widget-name="visible"]', function () {
            props.value.visible = $(this).is(':checked')
            $radioList.toggleClass('js-hide', !props.value.visible)
            update(props.value)
        })
        .on('change', '[data-widget-name="iconName"]', function () {
            props.value.iconName = this.value
            update(props.value)
        })

    return $elem
})

// ================ common ====================
function createOptionTpl(options, value) {
    return options.map(function (option) {
        if (typeof option === 'object') {
            return option.value === value
                ? '<option value="' + option.value + '" selected>' + option.label + '</option>'
                : '<option value="' + option.value + '">' + option.label + '</option>'
        } else {
            return option === value
                ? '<option value="' + option + '" selected>' + option + '</option>'
                : '<option value="' + option + '">' + option + '</option>'
        }
    }).join('')
}

export default CustomLabel