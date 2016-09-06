chrome插件开发浅析


昨天突然想做一个chrome插件，用来服务自己的博客的收藏夹，今天算是做出插件的V0.1.0版本了，现在自己的博客已经有了pc端、移动端、管理后台、chrome插件了。

现在做的相当简单，主要是熟悉过程。

总体过程是：写manifest.json文件->制作html、js->利用Google的开发者工具上传。

接下来我说说开发插件的过程和遇到的坑。

首先开发插件需要用Google的相关接口，传送门：https://developer.chrome.com/extensions/api_index


这里面我只用到了tabs，作用是获取当前页的tab信息，所以我的manifest.json：


```
{
  "manifest_version": 2,
  "icons": { "16": "icon16.png",
           "48": "icon48.png",
          "128": "icon128.png" },
  "name":"myCollec",
  "version":"0.1.0",
  "description":"a collection application",
  "browser_action": {  
    "default_icon": "icon.png",
    "default_title": "myCollec",
    "default_popup": "index.html"
  }, 
  "permissions":["tabs"]
}
```

注意：一开始我以为js要放在Content Scripts里，后来发现这里面操作的是当前页的DOM，而不是插件中的DOM，所以不行。当然也需要注意，虽然Content Scripts里面的js可以操作当前页面的DOM，但是和当前页面的js并不在一个上下文中，即不能互相调用。

实际上在index.html里面引入js即可(注意不能采用内嵌js，否则会报错)。

解决了在哪引用js的问题，接下来书写js会遇到如下几个问题：

1.由于插件最好轻量级，所以不应该引入多余的库，最好书写原生js
2.其中的数据请求应该用跨域的ajax

跨域ajax：

用了CORS跨域ajax，现在还有一个小问题就是必须要在我的app.js中对跨域请求进行反回头处理才行，直接在router 中处理不行。这个问题我暂时还没有很明白，希望以后能解决。

我的js代码：

```
    var urlarea = document.getElementById("url");
    var mypass = document.getElementById("pass");
    var mytitle = document.getElementById("title");
    var mytag = document.getElementById("tags");
    var mysuccess = document.getElementById("success");
    var submitcollec=document.getElementById("submitcollec");
 
	chrome.tabs.getSelected(function(tab) {
	        urlarea.innerHTML=tab.url;
	});

    var timestamp = (new Date()).valueOf();
    var mydata = {
        id:timestamp,
        pass:"",
        title:"",
        tag:"",
        content:""
    };

    submitcollec.addEventListener("click",function(){
        mydata.pass = mypass.value;
        mydata.title = mytitle.value;
        mydata.tag = mytag.value;
        mydata.content = urlarea.value||urlarea.innerHTML;

        var XHR = new XMLHttpRequest();
        XHR.open("POST", "http://115.29.102.81:8090/savemycollec");
        XHR.setRequestHeader('Content-Type', 'application/json');
        XHR.onreadystatechange = function(){
            if(XHR.status == 200){
                mysuccess.style.display="flex";
                submitcollec.disabled=true;
            }
        };
        XHR.send(JSON.stringify(mydata));
        return false;
    })


```
