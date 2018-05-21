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

    function extractNewInputs(inputs, ele) {
        if (getLastestPositionOfCurlyBrace(inputs, ele) >= 0) {
            return inputs.substring(getLastestPositionOfCurlyBrace(inputs, ele), getCaretPosition(ele));
        }
        return null;
    }

    $.fn.autocompleteToken = function (keycode, sourceData) {
        var ulNode=document.createElement('ul');
        $(ulNode).css({"display":"none"});
        if(sourceData){
            sourceData.forEach(function(data){
                if(data){
                    var liNode=document.createElement('li');
                    liNode.innerHTML=data;
                    ulNode.appendChild(liNode);
                }
            });
        }

        this.keyup(function(e){
            if(e.keyCode === keycode){
                document.body.appendChild(ulNode);
                $(ulNode).css({"display":"inline"});
            }
        });

        this.blur(function(){
            $(ulNode).remove();
        });
        
    };
}(jQuery));
