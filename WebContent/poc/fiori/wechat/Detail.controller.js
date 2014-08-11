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
				var oPara = evt.data.context.oModel;
				var sPath = evt.data.context.sPath;
				sPath = sPath + "/@code";
			    oCode =	oPara.getProperty (sPath);
//				oCode = "122312";
			    this.showDetail(oCode);
			    this.showColor();
			    this.showInitialSize();
			    var tabBar = this.byId("TabBar");
			    tabBar.addStyleClass("BarMargin");
// CSS adjustment for mobile and ipad
//			    if (jQuery.device.is.iphone == true || jQuery.device.is.ipad == true)
//			      {
				    var tLabelSize = this.byId("tLabelSize");
				    tLabelSize.addStyleClass("LabelPadding");
				    var tLabelColor = this.byId("tLabelColor");
				    tLabelColor.addStyleClass("LabelPadding");
				    var tDes = this.byId("tDes");
				    tDes.addStyleClass("LabelPadding");
//			      }
			}	}, this);
// subscribe to event bus
	    var bus = sap.ui.getCore().getEventBus();
	    bus.subscribe("nav", "to", this.navToHandler, this);
	    this.app = sap.ui.getCore().byId("theApp");
		
	},
	
	showDetail: function(oCode){
		var uripre = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001";	
//		var uripre = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
//		var producturi = uripre + "/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/apparelsizevariantproducts/" + oCode + "?product_attributes=name,ean,code,europe1Prices,description,picture,summary&priceRow_attributes=price";
		var producturi = uripre + "/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/apparelproducts/" + oCode;
		var oModel = new sap.ui.model.xml.XMLModel();
		oModel.loadData(producturi,null,false);
		
	 	var oHeader = this.byId("ProductHead");
	 	oHeader.setModel(oModel);
	 	oHeader.bindProperty("title", "/name");
	 	
	 	var priceUri = oModel.getProperty("/europe1Prices/priceRow/@uri");
	 	var subpriceUri = priceUri.substring(25,priceUri.length);
	 	priceUri = uripre + subpriceUri;
	 	var rModel = new sap.ui.model.xml.XMLModel();
	 	rModel.loadData(priceUri,null,false);
	 	oHeader.setProperty("number", rModel.getProperty("/price"));
	 	oHeader.setProperty("numberUnit", rModel.getProperty("/currency/@isocode"));
	 	
//	 	var iconurl = "proxy/http/jones.nat123.net";
	 	var iconurl = "proxy/http/10.59.145.101:9001";
	 	iconurl += oModel.getProperty("/picture/@downloadURL");
	 	oHeader.setProperty("icon", iconurl);
	 	
	 	var oHeadAtt = this.byId("ProductAtt");
	 	oHeadAtt.setModel(oModel);
	 	oHeadAtt.bindProperty("text", "/@code");
	 	
	 	var oDes = this.byId("sDes");
	 	oDes.setModel(oModel);
//	 	oDes.bindProperty("text", "/description");
	 	var des = oModel.getProperty("/description");
	 	des = des.replace(/<p>/g,"");
	 	des = des.replace(/<\/p>/g,"");
	 	oDes.setProperty("text", des);
	 	
	 	
	},
	
	onBack: function(){
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();
	},
	
	handleCart: function() {
		var oHeadAtt = this.byId("ProductAtt");
		var code = oHeadAtt.getModel().getProperty("/@code");
		var quantity = this.byId("input").getValue();
		
       var uripre = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001";
		//var uripre = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
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
//	    	  window.open("http://jones.nat123.net/yacceleratorstorefront/en/cart",'_self');
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
	       if (i > 0) 
	       {this.byId("input").setValue(i);}
	    },
	
		showColor: function(){
        	var that = this;
//remove all colors in case duplicate display
        	var colorButton = this.byId("bColors");
        	colorButton.removeAllButtons();
			var uripre = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001";	
			var pcoloruri = uripre + "/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/apparelproducts/" + 122312;
			var cModel = new sap.ui.model.xml.XMLModel();
			cModel.loadData(pcoloruri,null,false);	
			var a = cModel.getObject("/variants/");
			var num = a.getElementsByTagName("variantProduct").length;
			var i = 0;
            while (i < num){
//loop to create buttons for different color of base product
            	var productUri = cModel.getProperty("/variants/variantProduct/"+i+"/@uri");
            	var subpUri = productUri.substring(26,productUri.length);
            	productUri = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001/"+subpUri;
            	var oModel = new sap.ui.model.xml.XMLModel();
            	oModel.loadData(productUri,null,false);
            	var productName = oModel.getProperty("/name");
            	var productCode = oModel.getProperty("/@code");
    			var iconurl = "proxy/http/10.59.145.101:9001";
    		 	iconurl += oModel.getProperty("/others/media/@downloadURL");
    		 	var sButton = this.byId("bColors");
    		 	var button = new sap.m.Button({
    		 		press : function (oEvent) {
//refresh header info when user chose color    		 			
		        		   that.refreshHeader(oEvent);
    		 		}
    		 	});
//Save product uri,name,code for other function
    		 	button.pUri = productUri;
    		 	button.pName = productName;
    		 	button.pCode = productCode;
    		 	button.setProperty("icon", iconurl);
    		 	sButton.addButton(button);
            	i++;
            }
		},
		
	refreshHeader: function(oEvent){
			var oHeader = this.byId("ProductHead");
		 	iconurl = oEvent.oSource.getIcon();
		 	oHeader.setProperty("icon", iconurl);
		 	oHeader.setProperty("title", oEvent.oSource.pName);
		 	var oHeadAtt = this.byId("ProductAtt");
		 	oHeadAtt.setProperty("text", oEvent.oSource.pCode);
		 	var oModel = new sap.ui.model.xml.XMLModel();
        	oModel.loadData(oEvent.oSource.pUri,null,false);
            this.showSize(oModel);       	
		},
		
	showInitialSize: function(){
			var color = this.byId("bColors").getButtons()[0];
			var uri = color.pUri;
			var oModel = new sap.ui.model.xml.XMLModel();
        	oModel.loadData(uri,null,false);
        	this.showSize(oModel);
		},
		
	showSize: function(oModel){
			var a = oModel.getObject("/variants/");
			var num = a.getElementsByTagName("variantProduct").length;
			var i = 0;
// remove all size selection when color updated
			var select = this.byId("sizeSelect");
    		select.removeAllItems();
// add initial text
    		var oText = new sap.ui.core.Item(
    				{
    					text: "Please select a size",
    					key: "initial"
    				}
    		);
    		select.addItem(oText);
// gray "add to cart" button when color updated 
    		var cartButton = this.byId("tocart");
    		cartButton.setEnabled(false);
// loop to create list for different size of product
			while (i < num){
        	var productUri = oModel.getProperty("/variants/variantProduct/"+i+"/@uri");
        	var subpUri = productUri.substring(26,productUri.length);
        	productUri = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001/"+subpUri;
        	var sModel = new sap.ui.model.xml.XMLModel();
        	sModel.loadData(productUri,null,false);
        	var size = sModel.getProperty("/variantAttributes/variantAttribute/@value");
    		var oItem = new sap.ui.core.Item(
    				{
    					text: size,
    					key: size 
    				}
    		);
    		select.addItem(oItem);  
    		oItem.pCode = sModel.getProperty("/@code");
        	i++;
			}
		},
		
	changeSize: function(oEvent){
			var sizeKey = oEvent.oSource.getSelectedKey();
		 	var cartButton = this.byId("tocart");
			if (sizeKey != 'initial') {
	    		var oHeadAtt = this.byId("ProductAtt");
			 	oHeadAtt.setProperty("text", oEvent.oSource.getSelectedItem().pCode);
			 	cartButton.setEnabled(true);
			}
			else
				cartButton.setEnabled(false);
		},
		
	displayCart: function(oEvent){
		var bus = sap.ui.getCore().getEventBus();
        bus.publish("nav", "to", { 
            id : "search",
            data : {
                context : this.byId("ProductAtt").getProperty("text")
            }
	});
	},
    
	navToHandler : function(channelId, eventId, data) {
	        if (data && data.id) {
	        	 if (this.app.getPage(data.id) === null) {
	                 jQuery.sap.log.info("now loading page '" + data.id + "'");
	                 this.app.addPage(sap.ui.xmlview(data.id, "poc.fiori.wechat." + data.id));
	              }
	            // Navigate to given page (include bindingContext)
	            this.app.to(data.id, data.data.context);
        } else {
	            jQuery.sap.log.error("nav-to event cannot be processed. Invalid data: " + data);
	        }
	    },

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