jQuery.sap.require("model.ModelManager");

sap.ui.controller("poc.fiori.wechat.Detail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf poc.fiori.wechat.Detail
*/
	onInit: function() {
// L
		this.oModel = new sap.ui.model.xml.XMLModel();
		var success = function(oEvent){
			if (oEvent.getParameter("success") == false){
				console.log("Load Product Failed");
			}
		    this.showDetail(oEvent);
			var a = this.oModel.getObject("/variants/");
			var num = a.getElementsByTagName("variantProduct").length;
			if (num > 0){
				var infoTab = this.byId("InfoTab");
				infoTab.setVisible(true);
			    this.showColor(oEvent);
			    this.setInitColor();
			    this.setInitSize();
			    var noteTab = this.byId("NotesTab");
				noteTab.setVisible(true);
		    }
			this.busyDialog.close();
		};		
		this.oModel.attachRequestCompleted(jQuery.proxy(success, this));
		var oView = this.getView();
		oView.addEventDelegate({
			onBeforeShow: function(evt){
				var bundle = this.getView().getModel("i18n").getResourceBundle();
			 	var busyTitle = bundle.getText("BUSY_TITLE");
				this.busyDialog = new sap.m.BusyDialog({
					   showCancelButton : false,
					   title : busyTitle
				   });
				this.busyDialog.open();
// Use global variant for url				
				uripre= model.ModelManager.getModelUrlPre();
				picpre = model.ModelManager. getPicUrlPre();
				var oCode = this.requestPara("Para");
			    var toCart = this.byId("tocart");
				toCart.setEnabled(true);
				var pcoloruri = uripre + "/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/apparelproducts/" + oCode;
				
				this.oModel.loadData(pcoloruri,null,true);
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
				    sSize.addStyleClass("SizePadding");
				    var tabBar = this.byId("TabBar");
				    tabBar.addStyleClass("BarMargin");
//			      }
			}	}, this);
// subscribe to event bus
	    var bus = sap.ui.getCore().getEventBus();
	    bus.subscribe("nav", "to", this.navToHandler, this);
	    this.app = sap.ui.getCore().byId("theApp");
		
	},
	
	requestPara: function (paras){ 
		  var url = location.href;  
		  var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
		  var paraObj = {}  
		  for (i=0; j=paraString[i]; i++){  
		  paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);  
		  }  
		  var returnValue = paraObj[paras.toLowerCase()];  
		  if(typeof(returnValue)=="undefined"){  
		  return "";  
		  }else{  
		  return returnValue;  
		  }  
		  },
	
	showDetail: function(oEvent){
//		var that = this;
		this.oModel = oEvent.oSource;		
	 	var oHeader = this.byId("ProductHead");
	 	oHeader.setProperty("title", this.oModel.getProperty("/name"));
// Get price of Europe currency
	 	var priceIndex = this.oModel.getObject("/europe1Prices/").getElementsByTagName("priceRow").length;
	 	if (priceIndex > 0) {
	 		for (var i=0; i<priceIndex; i++) 
		 	{
			 	var priceUri = this.oModel.getProperty("/europe1Prices/priceRow/"+i+"/@uri");
			 	var index = priceUri.indexOf("/ws410/rest");
			 	var subpriceUri = priceUri.substring(index,priceUri.length);
			 	priceUri = uripre + subpriceUri;
			 	var rModel = new sap.ui.model.xml.XMLModel();
			 	rModel.loadData(priceUri,null,false);
			 	var currency = rModel.getProperty("/currency/@isocode");
			 	if (currency == "EUR")
				 	{
				 	 oHeader.setProperty("number", rModel.getProperty("/price"));
					 oHeader.setProperty("numberUnit", rModel.getProperty("/currency/@isocode"));
				 	}
		 	}
	 	}
	 	else {
	 		oHeader.setProperty("number", "");
			oHeader.setProperty("numberUnit", "");
	 	}
	 	
	 	iconurl = picpre+this.oModel.getProperty("/picture/@downloadURL");
	 	oHeader.setProperty("icon", iconurl);
	 	
	 	var oHeadAtt = this.byId("ProductAtt");
	 	oHeadAtt.setProperty("text", this.oModel.getProperty("/@code"));
	 	
	 	var oDes = this.byId("sDes");
	 	var des = this.oModel.getProperty("/summary");
	 	des = des.replace(/<p>/g,"");
	 	des = des.replace(/<\/p>/g,"");
	 	des = des.replace(/<br>/g,"");
	 	des = des.replace(/<\/br>/g,"");
	 	oDes.setProperty("text", des);

// Initialize quantity	 	
	 	var quantity = this.byId("input");
	 	quantity.setValue("1");
	 	 	
	},
	
/*	onBack: function(){
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();
//		 this.setDefaultTab();
//		window.open("http://localhost:8080/poc.fiori.wechat/",'_self');
	},*/
	
	handleCart: function() {
		var oHeadAtt = this.byId("ProductAtt");
		var code = oHeadAtt.getProperty("text");
		var quantity = this.byId("input").getValue();
		
//        var user = "jones.wu@sap.com";
        var user = "jones02@sap.com";
		var cartNoUrl = uripre + "/ws410/rest/customers/" + user + "?time=" + new Date();
	 	var cartNoModel = new sap.ui.model.xml.XMLModel();
	 	var header = model.ModelManager.getLanHeader();
	 	cartNoModel.loadData(cartNoUrl,null,false,"GET",false,header);
	 	var cartNo = cartNoModel.getProperty("/carts/cart/@code");
	 	var userPK = cartNoModel.getProperty("/@pk");
	 	
	 	var bundle = this.getView().getModel("i18n").getResourceBundle();
	 	var successMsg = bundle.getText("CARTSUCINFO");
// Create a new cart for user if no existing cartNo	 	
	 	if(!cartNo) {
	 		cartNoUrl = uripre + "/ws410/rest/users/" + user + "?time=" + new Date();
	 		var header = model.ModelManager.getLanHeader();
		 	cartNoModel.loadData(cartNoUrl,null,false,"GET",false,header);
		 	cartNo = cartNoModel.getProperty("/carts/cart/@code");
		 	userPK = cartNoModel.getProperty("/@pk");
		 	if(!cartNo){
			    var newCartUri = uripre + "/ws410/rest/carts";
			    var xmlData = "<cart><user uid='"+user+"' pk='"+userPK+"'></user></cart>";
			 	$.ajax({
					      type: 'POST',
					      url: newCartUri,
					      data: xmlData,
					      contentType: "application/xml",
					      async: false,
					      success: function (data) {
			 				  cartNo = data.getElementsByTagName("cart")[0].getAttribute("code");
					      },
					      error: function (xhr, status, error) {
					          console.log("New Cart Error:" + error);
					      },
					      dataType: 'xml'
				       });	 
		 	       }
	 	    };
// Add entry to cart	
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
				   sap.m.MessageToast.show(successMsg);
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
// Refresh all colors first
        	var colorButton = this.byId("bColors");
        	colorButton.removeAllButtons();
        	cModel = oEvent.oSource;	
			var variants = cModel.getObject("/variants/");
			var num = variants.getElementsByTagName("variantProduct").length;
			var i = 0;
            while (i < num){
// Loop to create buttons for different color of base product
            	var productUri = cModel.getProperty("/variants/variantProduct/"+i+"/@uri");
            	var index = productUri.indexOf("/ws410/rest");
            	var subpUri = productUri.substring(index,productUri.length);
            	productUri = uripre+subpUri;
            	var oModel = new sap.ui.model.xml.XMLModel();
            	var header = model.ModelManager.getLanHeader();
            	oModel.loadData(productUri,null,false,"GET",false,header);
            	var productName = oModel.getProperty("/name");
            	var productCode = oModel.getProperty("/@code");
            	var productDes = oModel.getProperty("/summary");
    		 	var iconurl = picpre+oModel.getProperty("/others/media/@downloadURL");
    		 	var sButton = this.byId("bColors");
    		 	var button = new sap.m.Button({
    		 		press : function (oEvent) {    		 			
		        		   that.refreshHeader(oEvent);
    		 		}
    		 	});
// Save Product uri,name,code,description for other function
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
		 	var s = oEvent.oSource;
		 	oHeader.setProperty("icon", s.getIcon());
		 	oHeader.setProperty("title", s.pName);
		 	var oHeadAtt = this.byId("ProductAtt");
		 	oHeadAtt.setProperty("text", s.pCode);
		 	var oDes = this.byId("sDes");
		 	oDes.setProperty("text", s.pDes);
		 	var oModel = new sap.ui.model.xml.XMLModel();
		 	var success = function(oEvent){
				if (oEvent.getParameter("success") == false){
					console.log("Load Size Failed");
				}
				else{
					this.showSize(oModel);
				}
		 	};
		 	oModel.attachRequestCompleted(jQuery.proxy(success, this));
		 	var header = model.ModelManager.getLanHeader();
		 	oModel.loadData(s.pUri,null,true,"GET",false,header);  
		},
		
	setInitColor: function(){
			var colors = this.byId("bColors");
			var colorSelected = colors.getButtons()[0];
			colors.setSelectedButton(colorSelected);
			var oHeader = this.byId("ProductHead");
			var iconurl = colorSelected.getIcon();
			var name = colorSelected.pName;
	        var desc = colorSelected.pDes;			
			oHeader.setProperty("icon", iconurl);
			oHeader.setProperty("title", name);
			var oHeadAtt = this.byId("ProductAtt");
		 	var oDes = this.byId("sDes");
		 	oDes.setProperty("text", desc);
	},
	
	setInitSize: function(){
		 	var colors = this.byId("bColors");
			var colorSelected = colors.getButtons()[0];
			var pUri = colorSelected.pUri;
		 	var oModel = new sap.ui.model.xml.XMLModel();
		 	var success = function(oEvent){
				if (oEvent.getParameter("success") == false){
					console.log("Load Initial Size Failed");
				}
				else{
					this.showSize(oModel);
					var select = this.byId("sizeSelect");
					var selectedItem = select.getItems()[0];
					select.setSelectedItem(selectedItem);
					var oHeadAtt = this.byId("ProductAtt");
					oHeadAtt.setProperty("text", selectedItem.pCode);
				}
			};
			oModel.attachRequestCompleted(jQuery.proxy(success, this));
	    	oModel.loadData(pUri,null,true);
//			colors._buttonPressed = function(){};
//			colorSelected.firePress();
//		 	colors._buttonPressed = function(e){
//				var l=this.getSelectedButton(),
//				c=e.getSource();
//				if(l!==c.getId()){
//				c.$().addClass('sapMSegBBtnSel');
//				sap.ui.getCore().byId(l).$().removeClass('sapMSegBBtnSel');
//				this.setAssociation('selectedButton',c,true);
//				}
//			};			
		},
		
	showSize: function(oModel){
			var a = oModel.getObject("/variants/");
			var num = a.getElementsByTagName("variantProduct").length;
			var i = 0;
// Refresh all sizes first
			var select = this.byId("sizeSelect");
    		select.removeAllItems();
    		var bundle = this.getView().getModel("i18n").getResourceBundle();
    		var sizeInit = bundle.getText("SIZE_INIT");
    		var oText = new sap.ui.core.Item(
    				{
    					text: sizeInit,
    					key: "initial"
    				}
    		);
// add initial text if more than one size  		
    		if (num > 1) {
    			select.addItem(oText);
// gray "add to cart" button when color updated 
        		var cartButton = this.byId("tocart");
        		cartButton.setEnabled(false);
    		};
    			
// loop to create list for different size of product
			while (i < num){
	        	var productUri = oModel.getProperty("/variants/variantProduct/"+i+"/@uri");
	        	var index = productUri.indexOf("/ws410/rest");
	        	var subpUri = productUri.substring(index,productUri.length);
	        	productUri = uripre+subpUri;
	        	var sModel = new sap.ui.model.xml.XMLModel();
	        	var header = model.ModelManager.getLanHeader();
	        	sModel.loadData(productUri,null,false,"GET",false,header);
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
			
			if (num = 1){
    			// when only one size, select automatically
    			var selectedItem = select.getItems()[0];
				select.setSelectedItem(selectedItem);
				var oHeadAtt = this.byId("ProductAtt");
				oHeadAtt.setProperty("text", selectedItem.pCode);
    		};
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
	    
/*	 setDefaultTab : function() {
	     var infoTab = this.byId("InfoTab");
		 var tabBar = this.byId("TabBar");
		 tabBar.setSelectedItem(infoTab);
     },*/
	    
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