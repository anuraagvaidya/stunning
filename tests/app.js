/**
 * Created by Anuraag on 7/3/2016.
 */
var StunningLib=require('../index');
var Stunning=StunningLib.Stunning;
var Container=StunningLib.Container;

Stunning.on('ready',function(){
    var window=Stunning.createWindow();
    window.set({title:"My Window",width:800,height:600});
    window.on('create',function(){
        var offset={left:0,top:0};
        var container=new Container(window);
        container.set({foregroundColor: '#ffff00'});

        setInterval(function(){
            container.set({left: offset.left,top: offset.top});
            offset.left++;
            offset.top++;
        },20);
    })
});
