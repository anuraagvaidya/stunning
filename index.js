/**
 * Created by Anuraag on 7/3/2016.
 */
var spawn=require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var uniqueId=function(){
    var time=process.hrtime();
    return ((+time[0]) * 1e9) + (+time[1]);;
};
var Window=function(stunning){
    var This=this;
    this.stunning=stunning;
    this.id=uniqueId();
    this.children=[];
    this.toolIndexes={};
    this.set=function(params)
    {
        for(var p in params)
        {
            This.stunning.setWindowStyle(This.id,p,params[p]);
        }
    };
    this.createTool=function(toolObject,toolParent,toolType)
    {
        toolObject.on('create',function(config,style){
            if(toolParent==null)
            {
                This.children.push(toolObject);
            }
            else
            {
                toolParent.children.push(toolObject);
            }
        });
        toolObject.id=uniqueId();
        This.toolIndexes[toolObject.id]=toolObject;
        This.stunning.createTool(This.id,toolParent==null?null:toolParent.id,toolObject.id,toolType);
    }
};
var Stunning=function(){
    var This=this;
    var args=['-cp',__dirname + '\\jars\\StunningRenderer.jar','com.bysness.stunningrenderer.StunningInstance'];
    var stunningInstance=spawn('java',args);
    var status={ready:false};
    this.windows={};
    var setupIO=function(){
        console.log('java ' + args.join(' '));
        stunningInstance.stdout.setEncoding('utf8');
        stunningInstance.stdin.setEncoding('utf-8');
        stunningInstance.stdout.on('data', function(data) {
            //Here is where the output goes
            if(!status.ready)
            {
                status.ready=true;
                This.emit('ready',{});
            }

            //todo: find if JSON.parse is going to be good at performance, if not, what else to use?
            try
            {
                var response=JSON.parse(data);
            }
            catch(err)
            {
            }
            if(response)
            {
                if(response.error)
                {
                    This.emit('error',response.message);
                }
                else if(response.event)
                {
                    //event coming from renderer
                    if(response.event=='render')
                    {
                        This.windows[response.windowId].toolIndexes[response.toolId].emit('render',{});
                    }
                    else if(response.event=='create')
                    {
                        if(response.object=='tool')
                        {
                            This.windows[response.windowId].toolIndexes[response.toolId].emit('create',{config:response.config,style:response.style});
                        }
                        else if(response.object=='window')
                        {
                            This.windows[response.windowId].emit('create',{});
                        }
                    }
                    else if(response.event=='style_applied')
                    {
                        if(response.object=='tool')
                        {
                            This.windows[response.windowId].toolIndexes[response.toolId].emit('style_applied',{key:response.key,value:response.value});
                        }
                        else if(response.object=='window')
                        {
                            This.windows[response.windowId].emit('style_applied',{key:response.key,value:response.value});
                        }
                    }
                }
            }
        });
        stunningInstance.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
            //Here is where the error output goes
        });
        stunningInstance.on('close', function(code) {
            console.log('closing code: ' + code);
            //Here you can get the exit code of the script
        });

    };
    this.sendCommand=function(command)
    {
        stunningInstance.stdin.write(command + "\n");
    };
    this.setWindowStyle=function(windowId,param,value)
    {
        This.sendCommand("windowstyle:" + windowId + ":" + param + ":" + value);
    };
    this.setToolStyle=function(windowId,toolId,param,value)
    {
        This.sendCommand("toolstyle:" + windowId + ":" + toolId + ":" + param + ":" + value);
    };
    this.createWindow=function(){
        if(status.ready)
        {
            var window=new Window(This);
            This.windows[window.id]=window;
            This.sendCommand("createwindow:" + window.id);
            return window;
        }
    };
    this.createTool=function(windowId,parentId,toolId,type){
        if(status.ready)
        {
            This.sendCommand("createtool:" + windowId + ":" + (parentId||"") + ":" + toolId + ":" + type)
        }
    };
    this.bubbleEvent=function(){

    };
    this.cleanup=function(){
        This.sendCommand("exit");
    };
    process.on('exit',function(){
        This.cleanup();
    });
    process.on('SIGINT',function(){
        This.cleanup();
    });
    setupIO();
};
var Container=function(window){
    var This=this;
    this.id=uniqueId();
    this.window=window;
    this.children=[];
    this.config={};
    this.style={};
    this.set=function(params){
        for(var p in params)
        {
            (function(key,value){
                This.window.stunning.setToolStyle(This.window.id,This.id,p,params[p]);
                This.style[p]=params[p];
            })(p,params[p]);
        }
    };
    //todo: add a forceSync method that will re-get data from the renderer about this object

    This.window.createTool(This,null,'rectangle');
};
util.inherits(Container, EventEmitter);
util.inherits(Stunning, EventEmitter);
util.inherits(Window, EventEmitter);
module.exports={Container:Container,Stunning:new Stunning()};