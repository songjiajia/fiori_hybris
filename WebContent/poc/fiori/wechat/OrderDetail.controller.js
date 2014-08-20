jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.controller("poc.fiori.wechat.OrderDetail", {


	onInit: function() {
		var oView = this.getView();
		oView.addEventDelegate({
			onBeforeShow: function(evt){
				var oPara = evt.data.context;
				var sPath = evt.data.context.sPath;
				sPathCode = sPath + "/@code";			
			    oCode =	oPara.getProperty (sPathCode); 
//				 uripre = "http://jones01.nat123.net/poc.fiori.wechat/proxy/http/182.254.156.24:9001";	
			    uriPreEntries= "http://182.254.156.24:8000/";
			    uripre = "http://182.254.156.24:8980/poc.fiori.wechat/proxy/http";	
				 orderuri = uriPreEntries + "/ws410/rest/orders/"+ oCode +"?orderentry_attributes=basePrice,quantity,info,calculated&address_attributes=streetname,town";
				oModel = new sap.ui.model.xml.XMLModel();
				oModel.loadData(orderuri,null,false);
				oView.setModel(oModel);
				this.getSizePic();
	    } }, this);
		       
		},
		
		getSizePic: function(){
			oModel.getObject("/entries/entry").setAttribute("size","null");
			oModel.getObject("/entries/entry").setAttribute("downloadURL","null");
			oModel.getObject("/entries/entry").setAttribute("productName","null");
			var oOrders = oModel.getObject("/entries/");
			var orderNum =oOrders.getElementsByTagName("entry").length;
			var i = 0;
			while(i<orderNum){
				var orderEntryUri = oModel.getProperty("/entries/entry/"+i+"/@uri");
				orderEntryUri = orderEntryUri.substring(27,orderEntryUri.length);
				orderEntryUri = uriPreEntries + orderEntryUri;
				var oOrderEntryModel = new sap.ui.model.xml.XMLModel();
				oOrderEntryModel.loadData(orderEntryUri,null,false);
				var productUri=oOrderEntryModel.getProperty("/product/@uri");
				productUri = productUri.substring(27,productUri.length);
				productUri = uriPreEntries + productUri;
               var oProductModel =  new sap.ui.model.xml.XMLModel();
                oProductModel.loadData(productUri,null,false);
                var size = oProductModel.getProperty("/size");
				var productCode=oOrderEntryModel.getProperty("/product/@code");
				var productPicUri = uriPreEntries + "/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/products/" + productCode + "?product_attributes=name,picture" ;
				var oProductPicModel =  new sap.ui.model.xml.XMLModel();
				oProductPicModel.loadData(productPicUri,null,false);
				var picUri = oProductPicModel.getProperty("/picture/@downloadURL");
				picUri = uriPreEntries + picUri;
				var oProdcutName = oProductPicModel.getProperty("/name");
				oModel.setProperty("/entries/entry/"+i+"/@productName",oProdcutName);
				oModel.setProperty("/entries/entry/"+i+"/@downloadURL",picUri);
				var oProductPicModel = new sap.ui.model.xml.XMLModel();
				 oProductPicModel.loadData(productPicUri,null,false);				 
				  oModel.setProperty("/entries/entry/"+i+"/@size",size);				
				i++;
			}
		},
		 onOrderDetailBack: function(){
			 this.app = sap.ui.getCore().byId("theApp");
			 this.app.back();
		},
		formatSize: function(value){
			return "Size: " + value;
			},
			
		formatQuantity: function(value){
			return "Quantity: " + value;
		},
		
		formatOrderNumber: function(value){
			 return "Order Number: " + value;
		},
		
		formatAddress : function (street, town){
			return "Address: " + street +"  " + town;
		},
		
		formatDate: function(date){
			var oDate = date.substring(0,10);
//			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "dd/MM/yyyy",style:"short"});
//    		ofdate = oDateFormat.parse(oDate);
			return oDate;
		}
	
});