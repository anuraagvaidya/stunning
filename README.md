# Stunning #
#### An extensive hardware-accelerated and cross-platform windowing (GUI) framework
Not ready to use, work in progress. Initial commit is expected by 15th July 2016.

## Basis ##
To achieve the ability to run on multiple platforms, the renderer is written in Java. In future, when building on node-gyp becomes smoother, we can rewrite the renderer in C++.

## Usage ##
    var window=stunning.createWindow();
    window.set("size",{height:700, width:1000}); //size in px
    window.set("icon",{filename:"myicon.ico"});
    
    var container=stunning.toolbox.container(window);
    container.set("size",{width:'100%',height:'100%'});
    container.set('backgroundColor','#ffffff');

## Importing from Stunning Designer ##
    var components=stunning.importFromFile("filename.stn");
    
    var window=stunning.createWindow();
    window.set("size",{height:700, width:1000}); //size in px
    window.set("icon",{filename:"myicon.ico"});
    window.add(components);
    
