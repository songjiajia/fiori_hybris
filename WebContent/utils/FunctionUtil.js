jQuery.sap.declare("utils.FunctionUtil");
jQuery.sap.require("model.ModelManager");

utils.FunctionUtil = {
		
};

utils.FunctionUtil.getUser = function(){
	var paras = "openID";
	var openid = "";
	var url = location.href;  
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
	var paraObj = {}; 
	for (var i=0; j=paraString[i]; i++){  
	paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);  
	}  
	var returnValue = paraObj[paras.toLowerCase()];  
	if(typeof(returnValue)=="undefined"){  
	 
	}else{  
	openid =  returnValue;  
	}
	
	var userid = "";
	var success = function(){
		userid = userModel.getProperty("/user/@uid");
	};
	
	var url = model.ModelManager.getModelUrlPre() + "/ws410/rest/users?user_attributes=description,uid&users_query=%7Bdescription%7D%20=%20%27" + openid + "%27";
	var userModel = new sap.ui.model.xml.XMLModel();
	userModel.attachRequestCompleted(success);
	userModel.loadData(url);
	return userid;
	

};