jQuery.sap.declare("model.ModelManager");

model.ModelManager = {};
model.ModelManager.getModelUrlPre = function(){
	return "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.157.120:9001";
	//return "http://182.254.156.24:8000";
};

model.ModelManager.getPicUrlPre = function(){
	return "http://10.59.157.120:9001";
//	return "http://182.254.156.24:9001";
};


model.ModelManager.getDetailUrl = function(){
	return "http://localhost:8980";
//	return "http://182.254.156.24:8000";
};





model.ModelManager.getLanHeader = function(){
	var type = arguments[0]?arguments[0]:"ws410";
	var header = {};
	var lan = sap.ui.getCore().getConfiguration().getLanguage();
	if(lan.length >=2){
		lan = lan.substr(0,2);
	}
	header = {"Accept-Language" : lan};
	if(type === "ws410"){
		
	
	return header;
	}else{
		return lan;
	}
	};



