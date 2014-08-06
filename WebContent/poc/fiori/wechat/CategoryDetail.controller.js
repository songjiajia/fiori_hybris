sap.ui.controller("poc.fiori.wechat.CategoryDetail", {


	onInit: function() {
		var oView = this.getView();
		oView.addEventDelegate({
			onBeforeShow: function(evt){
				var oPara = evt.data.context;
				var url = "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.145.101:9001/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/categories/" + oPara +"?category_attributes=products&product_attributes=name";
				var sunGlassesModel = new sap.ui.model.xml.XMLModel();
		    	sunGlassesModel.loadData(url,null,false);
		    	 var oList = this.byId("idCatList");
			        var oItems = new sap.m.StandardListItem();
			        oItems.setProperty("type", "Active");
			        oItems.attachPress(function(oEvent){
			        	  var bus = sap.ui.getCore().getEventBus();
					        bus.publish("nav", "to", { 
					            id : "Detail",
					            data : {
					                context : oEvent.oSource.getBindingContext()
					            }
			        	});
			        });
			        var that = this;
//				 	oItems.bindProperty("title","@code").bindProperty("description","ean/text()");
			        var getUrl = function(){
//			        	  var loadUrl = oModel.getProperty("/product/picture/@downloadURL");
			              var iconUrl = "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.145.101:9001";
//			              var iconUrl = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
			              var itemNum = that.byId("idCatList").getItems();
			              for (i in itemNum){
//			            	  oItems[i].setProperty("icon", iconUrl + oItems[i].getProperty("icon"));
//			            	  oItems.setProperty("icon",iconUrl);
			              } 
			             
			        };
			        sunGlassesModel.attachRequestCompleted(getUrl);
//			        oItems.bindProperty("title","name/text()").bindProperty("description","ean/text()").bindProperty("icon","picture/@downloadURL");
			        oItems.bindProperty("title","name/text()");
			        oList.setModel(sunGlassesModel);
				 	oList.bindItems("/products/product", oItems);
			
			}	}, this);

	    },
	    onCatBack: function(){
			 this.app = sap.ui.getCore().byId("theApp");
			 this.app.back();
		},
	
});