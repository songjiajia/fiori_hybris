jQuery.sap.declare("poc.fiori.wechat.Component");

sap.ui.core.UIComponent.extend("poc.fiori.wechat.Component",{
	metadata : {
		routing : {
			config : { 
				viewType:"XML",
				viewPath:"poc.fiori.wechat",
				targetControl:"navContainer",
				targetAggregation:"pages",
				clearTarget : false
			},
			routes : [
			          {
			        	  pattern : "",
			        	  name:"Overview",
			        	  view:"Overview"
			          },
			          {
			        	  pattern : "SecondPage/{id}",
			        	  name : "SecondPage",
			        	  view : "SecondPage"
			          }]
		}
	}
});

poc.fiori.wechat.Component.prototype.init = function(){
	jQuery.sap.require("sap.ui.core.routing.History");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
	
	sap.ui.core.UIComponent.prototype.init.apply(this);
	
	var router = this.getRouter();
	this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
	router.initialize();
};
poc.fiori.wechat.Component.prototype.destroy = function(){
	if(this.routeHandler){
		this.routeHandler.destroy();
	}
	sap.ui.core.UIComponent.destroy.apply(this,arguments);
};
poc.fiori.wechat.Component.prototype.createContent = function(){
	this.view = sap.ui.view({id:"app",viewName:"sapui5tutorial1.App",type:sap.ui.core.mvc.ViewType.JS});
	return this.view;
};