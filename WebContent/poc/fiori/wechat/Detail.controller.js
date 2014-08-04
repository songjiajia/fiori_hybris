sap.ui.controller("poc.fiori.wechat.Detail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf poc.fiori.wechat.Detail
*/
	onInit: function() {
// L
		var oView = this.getView();
		oView.addEventDelegate({
			onBeforeShow: function(evt){
				var oPara = evt.data.oModel;
				var sPath = evt.data.sPath;
				sPath = sPath + "/@code";
			    oCode =	oPara.getProperty (sPath);
			    this.showDetail();
			    var tabBar = this.byId("TabBar");
			    tabBar.addStyleClass("BarMargin");
//			    var minus = this.byId("minus");
//			    var plus = this.byId("plus");
//			    minus.addStyleClass("button");
//			    plus.addStyleClass("button");
			    if (jQuery.device.is.iphone == true || jQuery.device.is.ipad == true)
			      {
			    	var tLabel = this.byId("tLabel");
				    tLabel.addStyleClass("LabelPadding");
				    var tDes = this.byId("tDes");
				    tDes.addStyleClass("LabelPadding");
			      }
			}	}, this);
		
	},
	
	showDetail: function(){
//		var uripre = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.151.248:9001/ws410/rest/";	
		var uripre = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
//		var producturi = uripre + "products?product_attributes=name,ean,code,europe1Prices,description&priceRow_attributes=price&products_query=%7Bname%7D%20LIKE%20%27%25Bandeau%25%27";
		var producturi = uripre + "/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/apparelstylevariantproducts/" + oCode + "?product_attributes=name,ean,code,europe1Prices,description,picture,summary&priceRow_attributes=price";
//		var producturi = uripre + "/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/apparelstylevariantproducts/" + 186828 + "?product_attributes=name,ean,code,europe1Prices,description,picture,summary&priceRow_attributes=price";
		var oModel = new sap.ui.model.xml.XMLModel();
		oModel.loadData(producturi,null,false);
		
	 	var oHeader = this.byId("ProductHead");
	 	oHeader.setModel(oModel);
	 	oHeader.bindProperty("title", "/name");
	 	oHeader.bindProperty("number", "/europe1Prices/priceRow/price");
	 	oHeader.setProperty("numberUnit", "EUR");
	 	var iconurl = "proxy/http/jones.nat123.net";
	 	iconurl += oModel.getProperty("/picture/@downloadURL");
	 	oHeader.setProperty("icon", iconurl);
	 	
	 	var oHeadAtt = this.byId("ProductAtt");
	 	oHeadAtt.setModel(oModel);
	 	oHeadAtt.bindProperty("text", "/ean");
	 	
	 	var oDes = this.byId("sDes");
	 	oDes.setModel(oModel);
	 	oDes.bindProperty("text", "/description");
//	 	var summary = oModel.getProperty("/summary");
//	 	summary = summary.replace(/<p>/g,"");
//	 	summary = summary.replace(/<\/p>/g,"");
//	 	oDes.setProperty("text", summary);
	 	
	 	var oLabel = this.byId("sLabel");
	 	oLabel.setModel(oModel);
	 	oLabel.bindProperty("text", "/@code");
	 	
	},
	
	onBack: function(){
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();
	},
	
	handleCart: function() {
		var oProduct = this.byId("ProductHead");
		var code = oProduct.getModel().getProperty("/@code");
		var quantity = this.byId("input").getValue();
		
//		var uripre = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.151.248:9001/ws410/rest/";
		var uripre = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
		var cartNoUrl = uripre + "/ws410/rest/customers/jones.wu@sap.com";
	 	var cartNoModel = new sap.ui.model.xml.XMLModel();
	 	cartNoModel.loadData(cartNoUrl,null,false);
	 	var cartNo = cartNoModel.getProperty("/carts/cart/@code");
	 	var addCartUri = uripre + "/ws410/rest/carts/"+cartNo+"/cartentries";	 	
		var xmlData = "<cartentry><product code='" + code + "'><catalogVersion version='Online'><catalog id='apparelProductCatalog'/></catalogVersion></product><quantity>" + quantity + "</quantity><unit code='pieces'/></cartentry>";
		$.ajax({
	      type: 'POST',
	      url: addCartUri,
	      data: xmlData,
	      contentType: "application/xml",
	      success: function () {
//	        alert(data);
	    	  setTimeout(function () {
				   sap.m.MessageToast.show("Item has added to Cart");
			   }, 100);
	    	  window.open("http://jones.nat123.net/yacceleratorstorefront/en/cart",'_self');
	      },
	      error: function (xhr, status, error) {
	          alert("Service Error:" + error);
	      },
	      dataType: 'xml'
	    });
	},
	
	onPress : function (oEvt){	       
	       var i = this.byId("input").getValue();	       
	       oEvt.getSource() === this.byId("plus") ? i++ : i-- ;	
	       if (999 > i > 0) 
	       {this.byId("input").setValue(i);}
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