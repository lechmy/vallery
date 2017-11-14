'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
        }
    } return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var pluginName = 'gallery';

var defaults = {};

var gallery = function () {
    function gallery(element, options) {
        _classCallCheck(this, gallery);

        this.element = element;
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.index = 1;
        this.imgCount = 0;
        this.init();
    }

    _createClass(gallery, [{
        key: 'init',
        value: function init() {
            //this.$element.find('img').length;

            this.$element.append('\n            <div class="image-zoom-wrapper">\n              <a class="prev gallery-control" role="button"></a>\n              <a class="next gallery-control" role="button"></a>\n              <a class="close-gallery" role="button">X</a>\n            </div>\n            <img class="image-zoom" src="" alt="" />\n        ');

            this.$element.on('click', 'img[data-index]', $.proxy(this.openGallery, this));

            this.$element.on('click', '.gallery-control.prev', $.proxy(this.prevImg, this));

            this.$element.on('click', '.gallery-control.next', $.proxy(this.nextImg, this));

            this.$element.on('click', '.close-gallery', $.proxy(this.closeGallery, this));

            this.$element.on('click', '.image-zoom-wrapper', $.proxy(this.closeGallery, this));
        }
    }, {
        key: 'openGallery',
        value: function openGallery(e) {
            var _this = this;

            var $this = $(e.currentTarget) || $(e.currentTarget).find('img');
            this.index = $this.data('index');
            this.imgCount = this.$element.find('img[data-index]').length;
            this.$element.find('.image-zoom').attr('src', '').css({
                'top': $this.parent().offset().top - window.pageYOffset,
                'left': $this.offset().left,
                'max-width': $this.width(),
                'max-height': $this.height()
            }).attr('src', $this.attr('src')).show();

            this.$element.find('.image-zoom-wrapper').fadeIn();
            this.$element.find('.image-zoom').animate({
                top: window.innerHeight / 2 - this.$element.find('.image-zoom').height() / 2,
                left: window.innerWidth / 2 - this.$element.find('.image-zoom').width() / 2
            }, 500, function () {
                _this.$element.find('.image-zoom').addClass('gallery-zoom');
            });
            this.bindKeys();
        }
    }, {
        key: 'closeGallery',
        value: function closeGallery(e) {
            var _this2 = this;

            $(document).off('keydown');
            this.$element.find('.image-zoom-wrapper, .image-zoom').fadeOut(300, function () {
                _this2.$element.find('.image-zoom').removeClass('gallery-zoom');
            });
        }
    }, {
        key: 'nextImg',
        value: function nextImg(e) {
            e.stopPropagation();
            this.index++;
            if (this.index > this.imgCount) {
                this.index = 1;
            }
            var src = this.$element.find('[data-index=' + this.index + ']').attr('src');
            this.$element.find('.image-zoom').attr('src', src);
        }
    }, {
        key: 'prevImg',
        value: function prevImg(e) {
            e.stopPropagation();
            this.index--;
            if (this.index < 1) {
                this.index = this.imgCount;
            }
            var src = this.$element.find('[data-index=' + this.index + ']').attr('src');
            this.$element.find('.image-zoom').attr('src', src);
        }
    }, {
        key: 'bindKeys',
        value: function bindKeys() {
            var _this3 = this;

            $(document).on('keydown', function (e) {
                switch (e.keyCode) {
                    case 27:
                        //ESC
                        _this3.closeGallery();
                        break;

                    case 37:
                        //left
                        _this3.prevImg(e);
                        break;

                    case 39:
                        //right
                        _this3.nextImg(e);
                        break;

                    default:
                        break;
                }
            });
        }
    }]);

    return gallery;
}();

// A really lightweight plugin wrapper around the constructor,
// preventing against multiple instantiations


$.fn[pluginName] = function () {
    var argv = Array.prototype.slice.call(arguments);
    var method = null;
    var options = argv.shift();
    options = options || {};

    if (!$.isPlainObject(options)) {
        method = options;
        options = {};
    }
    return this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (!instance) {
            instance = new gallery(this, options);
            $.data(this, 'plugin_' + pluginName, instance);
        }
        if (method) {
            instance[method].apply(instance, argv);
        }
    });
};
