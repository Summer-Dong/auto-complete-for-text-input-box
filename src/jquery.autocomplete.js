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

    function getLastestPositionOfCurlyBrace(inputs, ele) {
        return inputs.substring(0, getCaretPosition(ele)).lastIndexOf('{');
    }

    function extractNewInputs(node) {
        if (getLastestPositionOfCurlyBrace(node.value, node) >= 0) {
            return node.value.substring(getLastestPositionOfCurlyBrace(node.value, node), getCaretPosition(node));
        }
        return null;
    }

    function filterData(originData, matchedInputs) {
        return originData.filter(function (data) {
            return data.slice(0, matchedInputs.length).toLowerCase() === matchedInputs.toLowerCase();
        });
    }

    function fullfillUL(node, data) {
        if (data) {
            data.forEach(function (ele) {
                if (ele) {
                    var liNode = document.createElement('li');
                    $(liNode).css({"display": "list-item"});
                    liNode.innerHTML = ele;
                    node.append(liNode);
                }
            });
        }
    }

    function getDropDown(){
        return $("#autoCompleteDropDown");
    }

    $.fn.autocompleteToken = function (keycode, sourceData) {
        this.keyup(function (e) {
            var ulNode=document.createElement('ul');
            $(ulNode).css({"display":"inline-block", "border": "1px solid #c5c5c5"});
            $(ulNode).attr('id','autoCompleteDropDown');

            if (e.keyCode === keycode) {
                document.body.appendChild(ulNode);
            }
            var matchedData = filterData(sourceData, extractNewInputs(this));
            if (matchedData) {
                getDropDown().length && getDropDown().find('li').remove();
                !getDropDown().length && document.body.appendChild(ulNode);
                fullfillUL(getDropDown(), matchedData);
            }
        });

        this.blur(function () {
            getDropDown().remove();
        });

    };
}(jQuery));
