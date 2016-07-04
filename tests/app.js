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

        var textContainer=new Container(window,{width:500,height:200,text:'Type Something',foregroundColor: '#ffff00'});
        textContainer.event('keydown',function(data){
            textContainer.set({text:(textContainer.config.text || '')+String.fromCharCode(data.keyCode)});
        });

        var offset={left:0,top:0};
        var container0=new Container(window,{width:300,height:200,foregroundColor: '#ffff00'});
        container0.on('create',function(){
            setInterval(function(){
                container0.set({left:offset.left++,top:offset.top++});
            },100);
        });
        var container1=new Container(window,{width:300,height:200,foregroundColor: '#ffff'});
        container1.on('create',function(){
            setInterval(function(){
                container1.set({left:500-offset.left++,top:300-offset.top++});
            },100);
        });
    });
});
