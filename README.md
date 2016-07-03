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
var StunningLib=require('stunning');
var Stunning=StunningLib.Stunning; //Import Stunning
var Container=StunningLib.Container; //Import the Container tool

Stunning.on('ready',function(){
    var window=Stunning.createWindow(); //Create a window
    window.set({title:"My Window",width:800,height:600});
    window.on('create',function(){
        var cont=new Container(window); //Create a container
        cont.set({foregroundColor: '#ffff00'}); //set style
    })
});
```

### Animating Object ###

```javascript
var StunningLib=require('stunning')
var Stunning=StunningLib.Stunning; //Import Stunning
var Container=StunningLib.Container;  //Import the Container tool

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
```

### Text Support ###

```javascript
var Stunning=StunningLib.Stunning; //Import Stunning
var Text=StunningLib.Text;  //Import the Text tool

Stunning.on('ready',function(){
    var window=Stunning.createWindow();
    window.set({title:"My Window",width:800,height:600});
    window.on('create',function(){
        var offset={left:0,top:0};
        var text=new Text(window);
        text.set({text:'Write something here', fontFamily:'Calibri'});
        //The font must be installed on the machine
    })
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
* foregroundColor -- Color code in Hexadecimal. e.g. #ff00ff
* backgroundImage -- Path to a background image
* opacity -- Opacity between 0 and 1

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

