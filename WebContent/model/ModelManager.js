jQuery.sap.declare("model.ModelManager");

model.ModelManager = {};
model.ModelManager.getModelUrlPre = function(){
	return "http://localhost:8080/poc.fiori.wechat/proxy/http/182.254.156.24:9001";
	//return "http://182.254.156.24:8000";
};

model.ModelManager.getPicUrlPre = function(){
	//return "http://10.59.145.101:9001";
	return "http://182.254.156.24:9001";
};


model.ModelManager.getDetailUrl = function(){
	//return "http://localhost:8980";
	return "http://182.254.156.24:8000";
};

