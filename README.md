# Stunning #
#### An extensive hardware-accelerated and cross-platform windowing (GUI) framework for NodeJS ####
Work in progress.

Stunning is based on StunningRenderer, a Java-based OpenGL renderer (https://github.com/anuraagvaidya/StunningRenderer).

This library is meant to help you create desktop, consumer-grade application using NodeJS.
Although it currently only has GUI features to offer, we are working on including other essential
desktop functions in the library such as networking, bluetooh
This library has a lot to offer. Please hang on to your hats.

## Basis ##
To achieve the ability to run on multiple platforms, the renderer is written in Java. In future, when building on node-gyp becomes smoother, we can rewrite the renderer in C++.

## Install ##
    npm install stunning

## Usage ##

### Static Object ###

```javascript
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
```

## Styles supported ##
You can pass the below properties in the `component.set()` call.

* left -- Left offset in pixels
* top -- Top offset in pixels
* width -- Width in pixels
* height -- Height in pixels
* scrollTop -- Amount of pixels hidden under the parent in y direction in pixels
* scrollLeft -- Amount of pixels hidden under the parent in x direction in pixels
* zoom -- Zoom amount, should be between 0 and 1
* zoomLeft -- Zooming point in x direction
* zoomTop -- Zooming point in y direction
* foregroundColor -- Color code in Hexadecimal. e.g. #ff00ff or r,g,b,a format
* backgroundImage -- Path to a background image

## Events supported ##
Events must be called with `.event('<eventName>',function(data){ });`

* click
* mouseenter
* mouseexit
* mousedown
* mouseup
* drag
* move
* keypress
* keydown
* keyup

## Importing from Stunning Designer ##
There is an ongoing effort to allow developers to design GUI using Stunning by using drag and drop.
For more info, check (https://github.com/anuraagvaidya/StunningDesigner).
(Not yet ready)

```javascript
var components=stunning.importFromFile("filename.stn");

var window=stunning.createWindow();
window.set("size",{height:700, width:1000}); //size in px
window.set("icon",{filename:"myicon.ico"});
window.add(components);
```

## Current Support ##
Stunning currently supports the following features:

1. Creation of multiple windows
2. Creation of components
3. Non-IO Events - create, style_applied, and render events
4. IO Events - Mouse and keyboard events

## Planned Support ##
We're considering the following things to be added in the rendering engine

1. Richer components
2. Easier Animation
3. Covering the complete API from Stunning Renderer

