sap.ui.controller("poc.fiori.wechat.CategoryDetail", {


	onInit: function() {
		var oView = this.getView();
		oView.addEventDelegate({
			onBeforeShow: function(evt){
				var oPara = evt.data.context;
				if (oPara == "sunglasses" || oPara =="shirts" ||oPara =="shoes" || oPara =="caps" || oPara =="clothes" || oPara =="tools")
				{					
//				var url = "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.145.101:9001/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/categories/" + oPara +"?category_attributes=products&product_attributes=name";
				 url = "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.145.101:9001/rest/v1/apparel-uk/catalogs/apparelProductCatalog/Online/categories/" + oPara +"?options=PRODUCTS";
				}
				else
			    {
				  url = "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.145.101:9001/ws410/rest/products?product_attributes=name,ean,picture,code&products_query=%7Bname%7D%20LIKE%20'%25" + oPara +"%25'"+"&catalogs=apparelProductCatalog&catalogversions=Online";	
			    };
				
				var sunGlassesModel = new sap.ui.model.xml.XMLModel();
		    	sunGlassesModel.loadData(url);				
				
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
					var getUrl = function(){
//			        	  var loadUrl = oModel.getProperty("/product/picture/@downloadURL");
			              var iconUrl = "http://10.59.145.101:9001";
//			              var iconUrl = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
			              var oItems = that.byId("idCatList").getItems();
			              for (var i=0;i<oItems.length;i++){
			            	  oItems[i].setProperty("icon", iconUrl + oItems[i].getProperty("icon"));
			              } 
			             
			        };
			        sunGlassesModel.attachRequestCompleted(getUrl);
			        
//				 	oItems.bindProperty("title","@code").bindProperty("description","ean/text()");
			        
//			        oItems.bindProperty("title","name/text()").bindProperty("description","ean/text()").bindProperty("icon","picture/@downloadURL");
			    	if (oPara == "sunglasses" || oPara =="shirts" ||oPara =="shoes" || oPara =="caps" || oPara =="clothes" || oPara =="tools")
					{					
					   oItems.bindProperty("title","name/text()").bindProperty("icon","images/0/image/url");;
				        oList.setModel(sunGlassesModel);
					 	oList.bindItems("/products/product", oItems);
					}
					else
				    {     
						  var aFilters = [];
						  oItems.bindProperty("title","name/text()").bindProperty("description","ean/text()").bindProperty("icon","picture/@downloadURL");
						 	oList.setModel(sunGlassesModel);
						 	oList.bindItems("/product", oItems);
						    if (oPara && oPara.length > 0) {
						      var filter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Starts, oPara);
						      aFilters.push(filter);
						    }
				    };
			
			}	}, this);

	    },
	    onCatBack: function(){
			 this.app = sap.ui.getCore().byId("theApp");
			 this.app.back();
		},
	
});