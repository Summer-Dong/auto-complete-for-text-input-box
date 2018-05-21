(function ($) {
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
