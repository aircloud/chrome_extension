


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

