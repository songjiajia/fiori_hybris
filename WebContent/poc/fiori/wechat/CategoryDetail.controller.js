jQuery.sap.require("model.ModelManager");
sap.ui.controller("poc.fiori.wechat.CategoryDetail", {


	onInit: function() {
		var oView = this.getView();
		urlpre= model.ModelManager.getModelUrlPre(); 
	    picpre = model.ModelManager.getPicUrlPre ();
		oView.addEventDelegate({
			onBeforeShow: function(evt){
				 oBundle = this.getView().getModel("i18n").getResourceBundle();
				var oPara = evt.data.context;
				if (oPara == "160700" || oPara =="shirts" ||oPara =="shoes" || oPara =="caps" || oPara =="260700" || oPara =="tools")
				{					
//				var url = "http://182.254.156.24:8980/poc.fiori.wechat/proxy/http/182.254.156.24:9001/ws410/rest/catalogs/apparelProductCatalog/catalogversions/Online/categories/" + oPara +"?category_attributes=products&product_attributes=name";
				 url = urlpre + "/rest/v1/apparel-uk/catalogs/apparelProductCatalog/Online/categories/" + oPara +"?options=PRODUCTS";
				}
				else
			    {
//				  url = "http://182.254.156.24:8000//rest/v1/apparel-uk/catalogs/apparelProductCatalog/Online?options=CATEGORIES,PRODUCTS";
					url = urlpre + "/ws410/rest/products?product_attributes=name,ean,picture,code&products_query=%7Bname%7D%20LIKE%20'%25" + oPara +"%25'"+"&catalogs=apparelProductCatalog&catalogversions=Online"; 
			    };
				
				var catProductsModel = new sap.ui.model.xml.XMLModel();
				catProductsModel.loadData(url);	
				var oList = this.getView().byId("idCatList");
			      this.sNoDataText = oList.getNoDataText();
			     
			      oList.setNoDataText(oBundle.getText("BUSY_TITLE"));
			      // Request completed
			      catProductsModel.attachRequestCompleted(jQuery.proxy(function(oEvent) {

			        // Restore the NoDataText
			        this.getView().byId("idCatList").setNoDataText(this.sNoDataText);

			      }, this));

			        var that = this;
				
			    	if (oPara == "160700" || oPara =="shirts" ||oPara =="shoes" || oPara =="caps" || oPara =="260700" || oPara =="tools")
					{	
			    		  var oItems = new sap.m.CustomListItem(
					    		  {
					    			  content : [ new sap.m.HBox({
//							        	   justifyContent : "Center",
							        	   alignItems : "Center",
							        	  items:[new sap.m.Image(
													{
														width:"3rem",
														height:"3rem",
														src : picpre + "{images/0/image/url}",
													}),
													new sap.m.Link({
														text : "{name/text()}",
														href :"http://localhost:8980/poc.fiori.wechat/detailPage.html?Para="+"{code}"
													})
							        	         ] 
							           })]
					    		  });
					        oItems.setProperty("type", "Active");	
		//			   oItems.bindProperty("title","name/text()").bindProperty("icon","images/0/image/url");;
				        oList.setModel(catProductsModel);
					 	oList.bindItems("/products/product", oItems);
					 	var items = oList.getBinding("items");
					 	var oFilter = new sap.ui.model.Filter("variantType",sap.ui.model.FilterOperator.EQ,"ApparelStyleVariantProduct");
					 	items.filter(oFilter);
					}
					else
				    {     
						  var aFilters = [];
						  var oItems = new sap.m.CustomListItem(
					    		  {
					    			  content : [ new sap.m.HBox({
//							        	   justifyContent : "Center",
							        	   alignItems : "Center",
							        	  items:[new sap.m.Image(
													{
														width:"3rem",
														height:"3rem",
														src : picpre + "{picture/@downloadURL}",
													}),
													new sap.m.Link({
														text : "{name/text()}",
														href :"http://localhost:8980/poc.fiori.wechat/detailPage.html?Para="+"{@code}"
													})
							        	         ] 
							           })]
					    		  });
					        oItems.setProperty("type", "Active");
						  var aFilters = [];
	//					  oItems.bindProperty("title","name/text()").bindProperty("description","ean/text()").bindProperty("icon","picture/@downloadURL");
						 	oList.setModel(catProductsModel);
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
		  onCartPress: function(oEvt){
			   var bus = sap.ui.getCore().getEventBus();
		        bus.publish("nav", "to", { 
		            id : "shoppingCart"
		        });		 
		  }

	
});