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
            e.preventDefault();
        } else if ((e.keyCode === 27) && hasDropDown() && getDropDown().css('opacity') === '1') {
            getDropdownRemoved();
            return;
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

    function filterSourceData(e, node, keycode,  keychar, sourceData) {
        if ((e.keyCode === 38 || e.keyCode === 40) && hasDropDown()  && getDropDown().css('opacity') === '1') {
            e.preventDefault();
            return;
        } else if (e.keyCode === 27) {
            e.preventDefault();
            return;
        }

        switch (e.keyCode){
            case keycode:
                !hasDropDown() && $(ulNode).insertAfter(node);
                break;
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

    $.fn.autocompleteToken = function (keycode, keychar, sourceData) {
        this.keydown(function(e){
            figureKeycodeOption(e);
        });

        this.keyup(function (e) {
            filterSourceData(e, this, keycode, keychar, sourceData);
        });

        this.blur(function () {
            blurredEle = this;
            akeychar = keychar;
            console.log($(':focus'));
            getDropDown().removeClass('showDropDown').addClass('hideDropDown');
        });

    };
}(jQuery));
