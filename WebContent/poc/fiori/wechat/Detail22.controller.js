sap.ui.controller("poc.fiori.wechat.Detail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf poc.fiori.wechat.Detail
*/
	onInit: function() {
//start  added by Lisa
		var bus = sap.ui.getCore().getEventBus();
	    bus.subscribe("nav", "to", this.navToHandler, this);
//end    added by Lida	
		var uripre = "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.151.248:9001/ws410/rest/";
					 	
		var producturi = uripre + "products?product_attributes=name,ean,code,europe1Prices,description&priceRow_attributes=price&products_query=%7Bname%7D%20LIKE%20%27%25Bandeau%25%27";
		var oModel = new sap.ui.model.xml.XMLModel();
		oModel.loadData(producturi);
		
	 	var oHeader = this.byId("ProductHead");
	 	oHeader.setModel(oModel);
	 	oHeader.bindProperty("title", "/product/name");
	 	oHeader.bindProperty("number", "/product/europe1Prices/priceRow/price");
	 	oHeader.setProperty("numberUnit", "EUR");
	 	
	 	var oHeadAtt = this.byId("ProductAtt");
	 	oHeadAtt.setModel(oModel);
	 	oHeadAtt.bindProperty("text", "/product/ean");
	 	
	 	var oDes = this.byId("sDes");
	 	oDes.setModel(oModel);
	 	oDes.bindProperty("text", "/product/description");
	 	
	 	var oLabel = this.byId("sLabel");
	 	oLabel.setModel(oModel);
	 	oLabel.bindProperty("text", "/product/@code");
	 	
	 	var cartUri = uripre + "carts/00000025/cartentries/8796093710380";
	 	var oCartModel = new sap.ui.model.xml.XMLModel();
	 	oCartModel.loadData(cartUri);
	 	var oCart = this.byId("tocart");
	 	oCart.setModel(oCartModel);
	 	
	},
// Start Added by Lisa
	navToHandler: function(channelId, eventId, data) {
		var view = this.getView();
	},
// End added by Lisa
	handleCart: function() {
		var oProduct = this.byId("ProductHead");
		var productModel = oProduct.getModel();
		var code = productModel.getProperty("/product/@code");
		
		var uripre = "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.151.248:9001/ws410/rest/";
	 	var addCartUri = uripre + "carts/00000025/cartentries";	
		var oCart = this.byId("tocart");
//		var cartUri = uripre + addCartUri + "/8796093775916";
//		var oCartModel = new sap.ui.model.xml.XMLModel();
//		oCartModel.loadData(cartUri);
//		oCart.setModel(oCartModel);
//		var cartModel = oCart.getModel();
		var quantity = this.byId("productInput").getValue();
		var xml = oCart.getModel().getXML();
		var xmlData = "<cartentry><product code='" + code + "'><catalogVersion version='Online'><catalog id='clothescatalog'/></catalogVersion></product><quantity>" + quantity + "</quantity><unit code='pieces'/></cartentry>";
		$.ajax({
	      type: 'POST',
	      url: addCartUri,
	      data: xmlData,
	      contentType: "application/xml",
	      success: function (data) {
	        alert(data);
	      },
	      error: function (xhr, status, error) {
	          alert("Service Error:" + error);
	      },
	      dataType: 'xml'
	    });
	}

//	handleCancel : function(oEvent) {
//	   },
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf poc.fiori.wechat.Detail
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf poc.fiori.wechat.Detail
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf poc.fiori.wechat.Detail
*/
//	onExit: function() {
//
//	}
//
});