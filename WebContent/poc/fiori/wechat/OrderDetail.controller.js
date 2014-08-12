
sap.ui.controller("poc.fiori.wechat.OrderDetail", {


	onInit: function() {
		var oView = this.getView();
		oView.addEventDelegate({
			onBeforeShow: function(evt){
				var oPara = evt.data.context;
/*				var sPath = evt.data.context.sPath;
				sPathCode = sPath + "/@code";			
			    oCode =	oPara.getProperty (sPathCode); */
				var uripre = "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.145.101:9001";	
				var orderuri = uripre + "/ws410/rest/orders/"+ "00024082" +"?orderentry_attributes=basePrice,quantity,info&address_attributes=streetname,town";
				var oModel = new sap.ui.model.xml.XMLModel();
				oModel.loadData(orderuri,null,false);
				oView.setModel(oModel);
				
	},
	   
	
});
		
		},
		
		 onOrderDetailBack: function(){
			 this.app = sap.ui.getCore().byId("theApp");
			 this.app.back();
		},
	
});