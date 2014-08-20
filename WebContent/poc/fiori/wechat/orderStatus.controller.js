sap.ui.controller("poc.fiori.wechat.orderStatus", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf poc.fiori.wechat.orderStatus
*/
	onInit: function() {
	    
		var oView = this.getView();
		oView.addEventDelegate({
			onBeforeShow: function(evt){

	if (evt.data.order){
     var oderId = evt.data.order;
     
	var url = "http://182.254.156.24:8000/ws410/rest/orders/" + oderId;
    var oModel = new sap.ui.model.xml.XMLModel();
	oModel.loadData(url,null,false);
	
	var oDateLabel = this.getView().byId("DateLabel");
	var date1 = new Date(oModel.getProperty("/date"));
	var oOrderDate = date1.toLocaleDateString();
	oDateLabel.setProperty("text", oOrderDate);
	
	
	var oOrderHead = this.getView().byId("OrderHead");
 	oOrderHead.setModel(oModel);
 	oOrderHead.setProperty("title", "Hi, your order was successful!");
 	oOrderHead.bindProperty("number", "/totalPrice");
 	oOrderHead.bindProperty("numberUnit", "/currency/@isocode");
 	
 	var oOrderStatus=this.getView().byId("OrderSta");
 	oOrderStatus.setModel(oModel);
 	oOrderStatus.bindProperty("text", "/status");
 	
 	var oOrderId=this.getView().byId("OrderId");
 	var orderNumber = oModel.getProperty("/@code");
 	orderNumber = "Order Number:" + orderNumber;
 	oOrderId.setProperty("text",orderNumber);
 	
 	var oAddress=this.getView().byId("Address");
 	var deliveryPK = oModel.getProperty("/deliveryAddress/@pk");
 	var deliveryUrl = "http://182.254.156.24:8000/ws410/rest/addresses/" + deliveryPK;
 	var oDeliveryModel = new sap.ui.model.xml.XMLModel();
 	oDeliveryModel.loadData(deliveryUrl,null,false);
 	var deliveryAddress1 = oDeliveryModel.getProperty("/line1");
 	//var deliveryAddress2 = oDeliveryModel.getProperty("/line2");
 	var deliveryAddress =  "Address:"+ deliveryAddress1 
 	//+ deliveryAddress2;
 	oAddress.setProperty("text",deliveryAddress);
 	
// 	 var isoCode = oModel.getProperty("/currency/@isocode");
// 	var currUrl = "http://jones01.nat123.net/shytest1/proxy/http/jones02.nat123.net:18229/ws410/rest/currencies/" + isoCode;
// 	var oModelCurrency = new sap.ui.model.xml.XMLModel();
// 	oModelCurrency.loadData(currUrl,null,false);
// 	var currencyName = oModelCurrency.getProperty("/name");
// 	oOrderHead.setProperty("numberUnit", currencyName);
	}
			}
		},this);
		},
	
	onStatusBack:function(){
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();

	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf poc.fiori.wechat.orderStatus
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf poc.fiori.wechat.orderStatus
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf poc.fiori.wechat.orderStatus
*/
//	onExit: function() {
//
//	}

});