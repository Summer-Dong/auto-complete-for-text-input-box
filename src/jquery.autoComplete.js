// Get caret pixel position
// Copy from: https://github.com/beviz/jquery-caret-position-getter
(function($, window, document) {
    $(function() {
        var calculator = {
            // key styles
            primaryStyles: ['fontFamily', 'fontSize', 'fontWeight', 'fontVariant', 'fontStyle',
                'paddingLeft', 'paddingTop', 'paddingBottom', 'paddingRight',
                'marginLeft', 'marginTop', 'marginBottom', 'marginRight',
                'borderLeftColor', 'borderTopColor', 'borderBottomColor', 'borderRightColor',
                'borderLeftStyle', 'borderTopStyle', 'borderBottomStyle', 'borderRightStyle',
                'borderLeftWidth', 'borderTopWidth', 'borderBottomWidth', 'borderRightWidth',
                'line-height', 'outline'],

            specificStyle: {
                'word-wrap': 'break-word',
                'overflow-x': 'hidden',
                'overflow-y': 'auto'
            },

            simulator : $('<div id="textarea_simulator" contenteditable="true"/>').css({
                position: 'absolute',
                top: 0,
                left: 0,
                visibility: 'hidden'
            }).appendTo(document.body),

            toHtml : function(text) {
                return text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g, '<br>')
                    .replace(/(\s)/g,'<span style="white-space:pre-wrap;">$1</span>');
            },
            // calculate position
            getCaretPixelPosition: function() {
                var cal = calculator, self = this, element = self[0], elementOffset = self.offset();

                // IE has easy way to get caret offset position
                if (!!($.browser.msie)) {
                    // must get focus first
                    element.focus();
                    var range = document.selection.createRange();
                    return {
                        left: range.boundingLeft - elementOffset.left,
                        top: parseInt(range.boundingTop) - elementOffset.top + element.scrollTop
                        + document.documentElement.scrollTop + parseInt(self.getComputedStyle("fontSize"))
                    };
                }
                cal.simulator.empty();
                // clone primary styles to imitate textarea
                $.each(cal.primaryStyles, function(index, styleName) {
                    self.cloneStyle(cal.simulator, styleName);
                });

                // caculate width and height
                cal.simulator.css($.extend({
                    'width': self.width(),
                    'height': self.height()
                }, cal.specificStyle));

                var value = self.val(), cursorPosition = self.getCursorPosition();
                var beforeText = value.substring(0, cursorPosition),
                    afterText = value.substring(cursorPosition);

                var before = $('<span class="before"/>').html(cal.toHtml(beforeText)),
                    focus = $('<span class="focus"/>'),
                    after = $('<span class="after"/>').html(cal.toHtml(afterText));

                cal.simulator.append(before).append(focus).append(after);
                var focusOffset = focus.offset(), simulatorOffset = cal.simulator.offset();
                // alert(focusOffset.left  + ',' +  simulatorOffset.left + ',' + element.scrollLeft);
                return {
                    top: focusOffset.top - simulatorOffset.top - element.scrollTop
                    // calculate and add the font height except Firefox
                    + ($.browser.mozilla ? 0 : parseInt(self.getComputedStyle("fontSize"))),
                    left: focus[0].offsetLeft -  cal.simulator[0].offsetLeft - element.scrollLeft
                };
            }
        };

        $.fn.extend({
            getComputedStyle: function(styleName) {
                if (this.length == 0) return;
                var thiz = this[0];
                var result = this.css(styleName);
                result = result || ($.browser.msie ?
                    thiz.currentStyle[styleName]:
                    document.defaultView.getComputedStyle(thiz, null)[styleName]);
                return result;
            },
            // easy clone method
            cloneStyle: function(target, styleName) {
                var styleVal = this.getComputedStyle(styleName);
                if (!!styleVal) {
                    $(target).css(styleName, styleVal);
                }
            },
            cloneAllStyle: function(target, style) {
                var thiz = this[0];
                for (var styleName in thiz.style) {
                    var val = thiz.style[styleName];
                    typeof val == 'string' || typeof val == 'number'
                        ? this.cloneStyle(target, styleName)
                        : NaN;
                }
            },
            getCursorPosition : function() {
                var thiz = this[0], result = 0;
                if ('selectionStart' in thiz) {
                    result = thiz.selectionStart;
                } else if('selection' in document) {
                    var range = document.selection.createRange();
                    if (parseInt($.browser.version) > 6) {
                        thiz.focus();
                        var length = document.selection.createRange().text.length;
                        range.moveStart('character', - thiz.value.length);
                        result = range.text.length - length;
                    } else {
                        var bodyRange = document.body.createTextRange();
                        bodyRange.moveToElementText(thiz);
                        for (; bodyRange.compareEndPoints("StartToStart", range) < 0; result++)
                            bodyRange.moveStart('character', 1);
                        for (var i = 0; i <= result; i ++){
                            if (thiz.value.charAt(i) == '\n')
                                result++;
                        }
                        var enterCount = thiz.value.split('\n').length - 1;
                        result -= enterCount;
                        return result;
                    }
                }
                return result;
            },
            getCaretPixelPosition: calculator.getCaretPixelPosition
        });
    });
})(jQuery, window, document);

(function ($) {

    var blurredEle, akeychar;
    var ulNode=document.createElement('ul');
    $(ulNode).addClass("dropDown")
        .attr('id','autoCompleteDropDown');

    function getCaretPosition(domElement) {
        var iCaretPos = 0;
        // IE Support
        if (document.selection) {
            domElement.focus();
            var oSel = document.selection.createRange();
            oSel.moveStart('character', -domElement.value.length);
            iCaretPos = oSel.text.length;
        }
        // Firefox support
        else if (domElement.selectionStart || domElement.selectionStart === '0') {
            iCaretPos = domElement.selectionStart;
        }
        return iCaretPos;
    }

    function setCaretPosition(domElement, pos) {
        if (domElement.setSelectionRange) {
            domElement.focus();
            domElement.setSelectionRange(pos, pos);
        } else if (domElement.createTextRange) {
            var range = domElement.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    function getLastestPositionOfKeychar(ele, keychar) {
        return ele.value.slice(0, getCaretPosition(ele)).lastIndexOf(keychar);
    }

    function extractNewInputs(node, keychar) {
        if (getLastestPositionOfKeychar(node, keychar) >= 0) {
            return node.value.slice(getLastestPositionOfKeychar(node, keychar), getCaretPosition(node));
        }
        return '';
    }

    function filterData(originData, matchedInputs) {
        return !!matchedInputs && originData.filter(function (data) {
            return data.slice(0, matchedInputs.length).toLowerCase() === matchedInputs.toLowerCase();
        });
    }

    function fillDropDown(node, data) {
        getDropDown().find('li').remove();
        data &&
            data.forEach(function (ele) {
                if (ele) {
                    var liNode = document.createElement('li');
                    $(liNode).hover(function(){
                            $(this).parent().find('li.hoverLi').removeClass('hoverLi');
                            $(this).addClass("hoverLi");
                        },function(){
                            $(this).removeClass("hoverLi");
                        }).click(function(){
                            blurredEle && addToken(blurredEle, akeychar);
                            blurredEle = null;
                    });
                    liNode.innerHTML = ele;
                    node.append(liNode);
                }
            });
    }

    function getDropDown(){
        return $("#autoCompleteDropDown");
    }

    function getHoveredLi() {
        return getDropDown().find('li.hoverLi');
    }

    function addToken(node, keychar){
        var token = getHoveredLi().text();
        var inputsUtilCaret = node.value
            .slice(0, getLastestPositionOfKeychar(node,keychar))
            .concat(token);
        node.value = inputsUtilCaret
            .concat(node.value.slice(getCaretPosition(node)));

        setCaretPosition(node, inputsUtilCaret.length);

        getDropdownRemoved();
    }

    function hasDropDown() {
        return getDropDown().length;
    }

    function hasHoveredList() {
        return getHoveredLi().length;
    }

    function getDropdownRemoved() {
        hasDropDown() && getDropDown().remove();
    }

    function figureKeycodeOption(e) {
        if ((e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) && hasDropDown() && getDropDown().css('opacity') === '1') {
            // 38: arrowUp; 40: arrowDown; 13: Enter;
            e.preventDefault();
        }
        switch (e.keyCode) {
            case 38:
                if (hasHoveredList()) {
                    var preLi = getHoveredLi().removeClass('hoverLi')
                        .prev();
                    preLi ? preLi.addClass('hoverLi') : getDropDown().last().addClass('hoverLi');
                } else if (hasDropDown() && !hasHoveredList()) {
                    getDropDown().children().last().addClass('hoverLi');
                }
                break;
            case 40:
                if (hasHoveredList()) {
                    var nextLi = getHoveredLi().removeClass('hoverLi')
                        .next();
                    nextLi ? nextLi.addClass('hoverLi') : getDropDown().first().addClass('hoverLi');
                } else if (hasDropDown() && !hasHoveredList()) {
                    getDropDown().children().first().addClass('hoverLi');
                }
                break;
            default:
                break;
        }
    }

    function filterSourceData(e, node, keychar, sourceData) {
        if ((e.keyCode === 38 || e.keyCode === 40) && hasDropDown()  && getDropDown().css('opacity') === '1') {
            //38: arrowUp; 40: arrowDown;
            e.preventDefault();
            return;
        } else if (e.keyCode === 27 && hasDropDown()  && getDropDown().css('opacity') === '1') {
            // 27: Esc;
            getDropdownRemoved();
            return;
        }

        switch (e.keyCode){
            case 13:
                if (hasHoveredList()) {
                    addToken(node, keychar);
                }
                return;
            default:
                break;
        }

        var matchedData = filterData(sourceData, extractNewInputs(node, keychar));
        if (matchedData.length) {
            if(hasDropDown()){
                getDropDown().find('li').remove();
            }else{
                $(ulNode).insertAfter(node);
            }
            fillDropDown(getDropDown(), matchedData);
            getDropDown().removeClass('hideDropDown').addClass('showDropDown');
        } else {
            getDropdownRemoved();
        }

        if(hasDropDown()){
            var pos = $(node).getCaretPixelPosition();

            getDropDown().css({
                'left': node.offsetLeft + pos.left,
                'top': node.offsetTop + pos.top
            });
        }
    }

    $.fn.autocompleteToken = function (keychar, sourceData) {
        this.keydown(function(e){
            figureKeycodeOption(e);
        });

        this.keyup(function (e) {
            filterSourceData(e, this, keychar, sourceData);
        });

        this.blur(function () {
            blurredEle = this;
            akeychar = keychar;
            console.log($(':focus'));
            getDropDown().removeClass('showDropDown').addClass('hideDropDown');
        });

    };
}(jQuery));
