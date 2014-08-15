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
				var appUri = "http://localhost:8080/poc.fiori.wechat/";
				proxyUri = "proxy/http/10.59.145.101:9001";
				uripre = appUri+proxyUri;
				var oPara = evt.data.context.oModel;
				var sPath = evt.data.context.sPath;
				sPathCode = sPath + "/@code";			
			    oCode =	oPara.getProperty (sPathCode);
			    if (oCode == null){
			    	sPathCode = sPath + "/code";			
				    oCode =	oPara.getProperty (sPathCode);
			    }
//				sPath = sPath + "/@code";
//			    oCode =	oPara.getProperty (sPath);
//				oCode = "121868";
			    var toCart = this.byId("tocart");
				toCart.setEnabled(true);
				var pcoloruri = uripre + "/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/apparelproducts/" + oCode;
				oModel = new sap.ui.model.xml.XMLModel();
				var success = function(oEvent){
					if (oEvent.getParameter("success") == false){
						console.log("Load Product Failed");
					}
				    this.showDetail(oEvent);
					var a = oModel.getObject("/variants/");
					var num = a.getElementsByTagName("variantProduct").length;
					if (num > 0){
						var infoTab = this.byId("InfoTab");
						infoTab.setVisible(true);
					    this.showColor(oEvent);
					    this.showInitialSize();
					    var noteTab = this.byId("NotesTab");
						noteTab.setVisible(true);
				    }
				};		
				oModel.attachRequestCompleted(jQuery.proxy(success, this));
				oModel.loadData(pcoloruri,null,true);
				
			    var tabBar = this.byId("TabBar");
			    tabBar.addStyleClass("BarMargin");
// CSS adjustment for mobile and ipad
//			    if (jQuery.device.is.iphone == true || jQuery.device.is.ipad == true)
//			      {
				    var tLabelSize = this.byId("tLabelSize");
				    tLabelSize.addStyleClass("LabelPadding").addStyleClass("LabelMiddle");
				    var tLabelColor = this.byId("tLabelColor");
				    tLabelColor.addStyleClass("LabelPadding").addStyleClass("LabelMiddle");
				    var tDes = this.byId("tDes");
				    tDes.addStyleClass("LabelPadding").addStyleClass("LabelMiddle");
				    var sDes = this.byId("sDes");
				    sDes.addStyleClass("LabelPadding");
				    var bColor = this.byId("bColors");
				    bColor.addStyleClass("LabelPadding");
				    var sSize = this.byId("sizeSelect");
				    sSize.addStyleClass("LabelPadding");
//			      }
			}	}, this);
// subscribe to event bus
	    var bus = sap.ui.getCore().getEventBus();
	    bus.subscribe("nav", "to", this.navToHandler, this);
	    this.app = sap.ui.getCore().byId("theApp");
		
	},
	
	showDetail: function(oEvent){
		var oModel = oEvent.oSource;		
	 	var oHeader = this.byId("ProductHead");
	 	oHeader.setProperty("title", oModel.getProperty("/name"));
//Get price	of Europe currency
	 	if (oModel.getObject("/europe1Prices/").getElementsByTagName("priceRow").length > 0) {
		 	var priceUri = oModel.getProperty("/europe1Prices/priceRow/1/@uri");
		 	var index = priceUri.indexOf("/ws410/rest");
		 	var subpriceUri = priceUri.substring(index,priceUri.length);
		 	priceUri = uripre + subpriceUri;
		 	var rModel = new sap.ui.model.xml.XMLModel();
		 	var success = function(oEvent){
				if (oEvent.getParameter("success") == false){
					console.log("Load Product Price Failed");
				}
				oHeader.setProperty("number", rModel.getProperty("/price"));
				oHeader.setProperty("numberUnit", rModel.getProperty("/currency/@isocode"));
		 	};
		 	rModel.attachRequestCompleted(jQuery.proxy(success, this));
		 	rModel.loadData(priceUri,null,true);
	 	};
	 	
	 	iconurl = proxyUri+oModel.getProperty("/picture/@downloadURL");
	 	oHeader.setProperty("icon", iconurl);
	 	
	 	var oHeadAtt = this.byId("ProductAtt");
	 	oHeadAtt.setProperty("text", oModel.getProperty("/@code"));
	 	
	 	var oDes = this.byId("sDes");
	 	var des = oModel.getProperty("/summary");
	 	des = des.replace(/<p>/g,"");
	 	des = des.replace(/<\/p>/g,"");
	 	des = des.replace(/<br>/g,"");
	 	des = des.replace(/<\/br>/g,"");
	 	oDes.setProperty("text", des);

// Initialize quantity	 	
	 	var quantity = this.byId("input");
	 	quantity.setValue("1");
	 	 	
	},
	
	onBack: function(){
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();
//		 this.setDefaultTab();
	},
	
	handleCart: function() {
		var oHeadAtt = this.byId("ProductAtt");
		var code = oHeadAtt.getProperty("text");
		var quantity = this.byId("input").getValue();
		
        var user = "jones.wu@sap.com";
		var cartNoUrl = uripre + "/ws410/rest/customers/" + user;
	 	var cartNoModel = new sap.ui.model.xml.XMLModel();
	 	cartNoModel.loadData(cartNoUrl,null,false);
	 	var cartNo = cartNoModel.getProperty("/carts/cart/@code");
	 	var userPK = cartNoModel.getProperty("/@pk");
//Create a new cart for user if no existing cartNo	 	
	 	if(!cartNo) {
		    var newCartUri = uripre + "/ws410/rest/carts";
		    var xmlData = "<cart><user uid='"+user+"' pk='"+userPK+"'></user></cart>";
		 	$.ajax({
				      type: 'POST',
				      url: newCartUri,
				      data: xmlData,
				      contentType: "application/xml",
				      async: false,
				      success: function (data) {
	//			        alert(data);
		 				cartNo = data.getElementsByTagName("cart")[0].getAttribute("code");
				      },
				      error: function (xhr, status, error) {
				          console.log("New Cart Error:" + error);
				      },
				      dataType: 'xml'
			       });	 	 		
	 	    };
//Add entry to cart	
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
	          alert("Add to Cart Failed:" + error);
	      },
	      dataType: 'xml'
	    });
	},
	
	onPress : function (oEvt){	       
	       var i = this.byId("input").getValue();	       
	       oEvt.getSource() === this.byId("plus") ? i++ : i-- ;	
	       if (i > 0 && i < 100) 
	       {this.byId("input").setValue(i);}
	    },
	
    showColor: function(oEvent){
        	var that = this;
//remove all colors in case duplicate display
        	var colorButton = this.byId("bColors");
        	colorButton.removeAllButtons();
        	cModel = oEvent.oSource;	
			var variants = cModel.getObject("/variants/");
			var num = variants.getElementsByTagName("variantProduct").length;
			var i = 0;
            while (i < num){
//loop to create buttons for different color of base product
            	var productUri = cModel.getProperty("/variants/variantProduct/"+i+"/@uri");
            	var index = productUri.indexOf("/ws410/rest");
            	var subpUri = productUri.substring(index,productUri.length);
            	productUri = uripre+subpUri;
            	var oModel = new sap.ui.model.xml.XMLModel();
            	oModel.loadData(productUri,null,false);
            	var productName = oModel.getProperty("/name");
            	var productCode = oModel.getProperty("/@code");
            	var productDes = oModel.getProperty("/summary");
    		 	var iconurl = proxyUri+oModel.getProperty("/others/media/@downloadURL");
    		 	var sButton = this.byId("bColors");
    		 	var button = new sap.m.Button({
    		 		press : function (oEvent) {
//refresh header info when user chose color    		 			
		        		   that.refreshHeader(oEvent);
    		 		}
    		 	});
//Save Product uri,name,code,description for other function
    		 	button.pUri = productUri;
    		 	button.pName = productName;
    		 	button.pCode = productCode;
    		 	button.pDes = productDes;
    		 	button.setProperty("icon", iconurl);
    		 	sButton.addButton(button);
            	i++;
            }
		},
		
	refreshHeader: function(oEvent){
			var oHeader = this.byId("ProductHead");
		 	var iconurl = oEvent.oSource.getIcon();
		 	oHeader.setProperty("icon", iconurl);
		 	oHeader.setProperty("title", oEvent.oSource.pName);
		 	var oHeadAtt = this.byId("ProductAtt");
		 	oHeadAtt.setProperty("text", oEvent.oSource.pCode);
		 	var oDes = this.byId("sDes");
		 	oDes.setProperty("text", oEvent.oSource.pDes);
		 	var oModel = new sap.ui.model.xml.XMLModel();
		 	var success = function(oEvent){
				if (oEvent.getParameter("success") == false){
					console.log("Refresh Header Failed");
				};
	            this.showSize(oModel);
			};
			oModel.attachRequestCompleted(jQuery.proxy(success, this));
        	oModel.loadData(oEvent.oSource.pUri,null,true);       	
		},
		
	showInitialSize: function(){
			var color = this.byId("bColors").getButtons()[0];
			var uri = color.pUri;
			var oModel = new sap.ui.model.xml.XMLModel();
			var success = function(oEvent){
				if (oEvent.getParameter("success") == false){
					console.log("Load Initial Size Failed");
				};
	        	this.showSize(oModel);
			};
			oModel.attachRequestCompleted(jQuery.proxy(success, this));
        	oModel.loadData(uri,null,true);
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
//				var uripre = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001";
	        	var productUri = oModel.getProperty("/variants/variantProduct/"+i+"/@uri");
	        	var index = productUri.indexOf("/ws410/rest");
	        	var subpUri = productUri.substring(index,productUri.length);
	        	productUri = uripre+subpUri;
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
            id : "shoppingCart",
//            data : {
//                context : this.byId("ProductAtt").getProperty("text")
//            }
	});
	},
    
	navToHandler : function(channelId, eventId, data) {
//	        if (data && data.id) {
		if (data.id) {
	        	 if (this.app.getPage(data.id) === null) {
	                 jQuery.sap.log.info("now loading page '" + data.id + "'");
	                 this.app.addPage(sap.ui.xmlview(data.id, "poc.fiori.wechat." + data.id));
	              }
//Navigate to target page (include bindingContext)
//	            this.app.to(data.id, data.data.context);
	        	this.app.to(data.id);
        } else {
	            jQuery.sap.log.error("nav-to event cannot be processed. Invalid data: " + data);
	        }
	    },
	    
//    setDefaultTab : function() {
//		     var infoTab = this.byId("InfoTab");
//			 var tabBar = this.byId("TabBar");
//			 tabBar.setSelectedItem(infoTab);
//	  },
	    
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