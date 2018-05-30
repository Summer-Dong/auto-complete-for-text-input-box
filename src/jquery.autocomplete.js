(function ($) {
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

    function getLastestPositionOfCurlyBrace(ele, keychar) {
        return ele.value.slice(0, getCaretPosition(ele)).lastIndexOf(keychar);
    }

    function extractNewInputs(node, keychar) {
        if (getLastestPositionOfCurlyBrace(node, keychar) >= 0) {
            return node.value.slice(getLastestPositionOfCurlyBrace(node, keychar), getCaretPosition(node));
        }
        return '';
    }

    function filterData(originData, matchedInputs) {
        return !!matchedInputs && originData.filter(function (data) {
            return data.slice(0, matchedInputs.length).toLowerCase() === matchedInputs.toLowerCase();
        });
    }

    function fullfillUL(node, data) {
        if (data) {
            data.forEach(function (ele) {
                if (ele) {
                    var liNode = document.createElement('li');
                    $(liNode).css({"display": "list-item"})
                        .hover(function(){
                            $(this).addClass("hoverLi");
                        },function(){
                            $(this).removeClass("hoverLi");
                        });
                    liNode.innerHTML = ele;
                    node.append(liNode);
                }
            });
        }
    }

    function getDropDown(){
        return $("#autoCompleteDropDown");
    }

    function addToken(node, keychar){
        var token = getDropDown().find('li.hoverLi').text();
        var inputsUtilCaret = node.value
            .slice(0, getLastestPositionOfCurlyBrace(node,keychar))
            .concat(token);
        node.value = inputsUtilCaret
            .concat(node.value.slice(getCaretPosition(document.activeElement)));
        setCaretPosition(node, inputsUtilCaret.length);

        getDropdownRemoved;
    }

    function figureKeycodeOption(e) {
        if ((e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) && getDropDown().length) {
            e.preventDefault();
        }
        switch (e.keyCode) {
            case 38:
                if (getDropDown().find('li.hoverLi').length) {
                    var preLi = getDropDown().find('li.hoverLi').removeClass('hoverLi')
                        .prev();
                    preLi ? preLi.addClass('hoverLi') : getDropDown().last().addClass('hoverLi');
                } else if (getDropDown().length && !getDropDown().find('li.hoverLi').length) {
                    getDropDown().children().last().addClass('hoverLi');
                }
                break;
            case 40:
                if (getDropDown().find('li.hoverLi').length) {
                    var nextLi = getDropDown().find('li.hoverLi').removeClass('hoverLi')
                        .next();
                    nextLi ? nextLi.addClass('hoverLi') : getDropDown().first().addClass('hoverLi');
                } else if (getDropDown().length && !getDropDown().find('li.hoverLi').length) {
                    getDropDown().children().first().addClass('hoverLi');
                }
                break;
            default:
                break;
        }
    }

    function getDropdownRemoved() {
        getDropDown().remove();
    }

    $.fn.autocompleteToken = function (keycode, keychar, sourceData) {
        var ulNode=document.createElement('ul');
        $(ulNode).css({"display":"inline-block", "border": "1px solid #c5c5c5"});
        $(ulNode).attr('id','autoCompleteDropDown');

        this.keyup(function (e) {
            if ((e.keyCode === 38 || e.keyCode === 40) && getDropDown().length) {
                e.preventDefault();
                return;
            }

            switch (e.keyCode){
                case keycode:
                    !getDropDown().length && document.body.appendChild(ulNode);
                    break;
                case 13:
                    if (getDropDown().find('li.hoverLi').length) {
                        addToken(this, keychar);
                    }
                    getDropdownRemoved();
                    return;
                default:
                    break;
            }

            var matchedData = filterData(sourceData, extractNewInputs(this, keychar));
            if (matchedData.length) {
                if(getDropDown().length){
                    getDropDown().find('li').remove();
                }else{
                    document.body.appendChild(ulNode);
                }

                fullfillUL(getDropDown(), matchedData);
            } else {
                getDropdownRemoved();
            }
        });

        this.keydown(function(e){
            figureKeycodeOption(e);
        });

        this.blur(function () {
            getDropdownRemoved();
        });

    };
}(jQuery));
