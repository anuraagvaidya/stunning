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
var encodeParams=function(params){
    var str='';
    var i=0;
    for(var p in params)
    {
        str+=(i>0?'&':'') + p + '=' + (params[p] + '').replace(/\s/g,'$');
        i++;
    }
    return str;
};
var Window=function(stunning){
    var This=this;
    this.stunning=stunning;
    this.id=uniqueId();
    this.children=[];
    this.config={};
    this.toolIndexes={};
    this.set=function(params)
    {
        This.stunning.setWindowStyle(This.id,encodeParams(params));
        for(var p in params)
        {
            This.config[p]=params[p];
        }
    };
    this.createTool=function(toolObject,toolParent,toolType,params)
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
        This.stunning.createTool(This.id,toolParent==null?null:toolParent.id,toolObject.id,toolType,params);
    };
    this.trigger=function(eventName,data){
        for(var tool in This.toolIndexes)
        {
            if(This.toolIndexes[tool].events[eventName])
            {
                This.toolIndexes[tool].trigger(eventName,data);
            }
        }
    };
};
var Stunning=function(){
    var This=this;
    var args=['-cp',__dirname + '\\jars\\StunningRenderer.jar','com.bysness.stunningrenderer.StunningInstance'];
    var stunningInstance=spawn('java',args);
    var status={ready:false};
    this.windows={};
    var commands=[];
    var setupIO=function(){
        //console.log('java ' + args.join(' '));
        stunningInstance.stdout.setEncoding('utf8');
        stunningInstance.stdin.setEncoding('utf-8');
        var lines=[''];
        stunningInstance.stdout.on('data', function(data) {
            //Here is where the output goes
            if(!status.ready)
            {
                status.ready=true;
                This.emit('ready',{});
            }

            var dataFragments=data.split("\n");
            lines[lines.length-1]+=(dataFragments[0]);
            if(dataFragments.length>2)
            {
                for(var i=1;i<dataFragments.length;i++)
                {
                    lines.push(dataFragments[i]);
                }
            }

            //todo: find if JSON.parse is going to be good at performance, if not, what else to use?
            for(var i=0;i<lines.length;i++)
            {
                try
                {
                    var response=JSON.parse(lines[i]);
                    //console.log(response);
                }
                catch(err)
                {
                    //console.error('Error',err,lines[i]);
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
                        else if(
                            response.event=='click' ||
                            response.event=='mouseenter' ||
                            response.event=='mouseexit' ||
                            response.event=='mousedown' ||
                            response.event=='mouseup' ||
                            response.event=='drag' ||
                            response.event=='move' ||
                            response.event=='keypress' ||
                            response.event=='keydown' ||
                            response.event=='keyup'
                        ){
                            if(response.toolId)
                            {
                                This.windows[response.windowId].toolIndexes[response.toolId].trigger(response.event,response);
                            }
                            else
                            {
                                This.windows[response.windowId].trigger(response.event,response);
                            }
                        }
                    }
                }
            }
            lines.length=0;
            lines.push('');
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
        //console.log('Send->',command);
        stunningInstance.stdin.write(command + "\n");
    };
    this.setWindowStyle=function(windowId,params)
    {
        This.sendCommand("windowstyle:" + windowId + ":" + params);
    };
    this.setToolStyle=function(windowId,toolId,params)
    {
        This.sendCommand("toolstyle:" + windowId + ":" + toolId + ":" + params);
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
    this.createTool=function(windowId,parentId,toolId,type,params){
        if(status.ready)
        {
            This.sendCommand("createtool:" + windowId + ":" + (parentId||"") + ":" + toolId + ":" + type + ':' + params)
        }
    };
    this.attachEvent=function(windowId,toolId,event){
        if(status.ready)
        {
            This.sendCommand("attachevent:" + windowId + ":" + toolId + ":" + event);
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
function Container(window,styles){
    var This=this;
    this.id=uniqueId();
    this.window=window;
    this.children=[];
    this.config={};
    this.events={};
    this.set=function(params){
        This.window.stunning.setToolStyle(This.window.id,This.id,encodeParams(params));
        for(var p in params)
        {
            This.config[p]=params[p];
        }
    };
    this.create=function(){
        //todo: add a forceSync method that will re-get data from the renderer about this object
        This.window.createTool(This,null,'rectangle',encodeParams(styles));
    };
    this.trigger=function(eventName,data)
    {
        if(This.events[eventName])
        {
            for(var i=0;i<This.events[eventName].length;i++)
            {
                This.events[eventName][i](data);
            }
        }
    };
    this.event=function(eventName,callback)
    {
        if(!This.events[eventName])
        {
            This.events[eventName]=[];
        }
        This.events[eventName].push(callback);
        This.window.stunning.attachEvent(This.window.id,This.id,eventName);
    };
    this.create();
}

util.inherits(Container, EventEmitter);
util.inherits(Stunning, EventEmitter);
util.inherits(Window, EventEmitter);
module.exports={Container:Container,Stunning:new Stunning()};