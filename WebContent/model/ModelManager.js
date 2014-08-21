jQuery.sap.declare("model.ModelManager");

model.ModelManager = {};
model.ModelManager.getModelUrlPre = function(){
	return "http://localhost:8080/poc.fiori.wechat/proxy/http/182.254.156.24:8000";
	//return "182.254.156.24:8000";
};

model.ModelManager.getPicUrlPre = function(){
	return "http://10.207.215.250:9001";
	//return "182.254.156.24:9001";
};