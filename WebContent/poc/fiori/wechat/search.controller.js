sap.ui.controller("poc.fiori.wechat.search", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf poc.fiori.wechat.search
*/
	onInit: function() {
		 var oImage = this.byId("idImage");
		 oImage.setVisible(true);
		 var oList = this.byId("idList");
		 oList.setVisible(false);
	  // subscribe to event bus
    var bus = sap.ui.getCore().getEventBus();
    bus.subscribe("nav", "to", this.navToHandler, this);
//    bus.subscribe("nav", "to", this.navBackHandler, this);
    this.app = sap.ui.getCore().byId("theApp");
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

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf poc.fiori.wechat.search
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf poc.fiori.wechat.search
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf poc.fiori.wechat.search
*/
//	onExit: function() {
//
//	}

	 onSearch : function (oEvt) {
		 var oImage = this.byId("idImage");
		 oImage.setVisible(false) ;
		 var oList = this.byId("idList");
		 oList.setVisible(true);
		    // add filter for search
		    var aFilters = [];
		    var sQuery = oEvt.getSource().getValue();
//		    var url = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.151.248:9001/ws410/rest/products?product_attributes=name,ean,picture,code&products_query=%7Bname%7D%20LIKE%20'%25" + sQuery +"%25'"+"&catalogs=apparelProductCatalog&catalogversions=Online";
		    var url = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net/ws410/rest/products?product_attributes=name,ean,picture,code&products_query=%7Bname%7D%20LIKE%20'%25" + sQuery +"%25'"+"&catalogs=apparelProductCatalog&catalogversions=Online";
		    var oModel = new sap.ui.model.xml.XMLModel();
	        oModel.loadData(url);
//	        var oList = this.byId("idList");
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
//		 	oItems.bindProperty("title","@code").bindProperty("description","ean/text()");
	        var getUrl = function(){
//	        	  var loadUrl = oModel.getProperty("/product/picture/@downloadURL");
//	              var iconUrl = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.151.248:9001";
	              var iconUrl = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
	              var oItems = that.byId("idList").getItems();
	              for (i in oItems){
	            	  oItems[i].setProperty("icon", iconUrl + oItems[i].getProperty("icon"));
//	            	  oItems.setProperty("icon",iconUrl);
	              }
	             
	        };
	        oModel.attachRequestCompleted(getUrl);
	        oItems.bindProperty("title","name/text()").bindProperty("description","ean/text()").bindProperty("icon","picture/@downloadURL");
		 	oList.setModel(oModel);
		 	oList.bindItems("/product", oItems);
		    if (sQuery && sQuery.length > 0) {
		      var filter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Contains, sQuery);
		      aFilters.push(filter);
		    }

		    // update list binding
/*		    var list = this.getView().byId("idList");
		    var binding = list.getBinding("items");
		    binding.filter(aFilters, "Application"); */
		  },
/*		  onItemPress : function(oEvent) {
			  var oSelectedItem   = oEvent.oSource.getSelectedItem();
//			  var bus = sap.ui.getCore().getEventBus();
//		        bus.publish("nav", "to", { 
//		            id : "DetailPage",
//		            data : {
//		                context : bindingContext
//		            }
//		       });
		  },*/
	/*	  onSelectionChange : function (oEvt) {

			    var oList = oEvt.getSource();
			    var oLabel = this.getView().byId("idFilterLabel");
//			    var oInfoToolbar = this.getView().byId("idInfoToolbar");

			    // With the 'getSelectedContexts' function you can access the context paths
			    // of all list items that have been selected, regardless of any current
			    // filter on the aggregation binding.
			    var aContexts = oList.getSelectedContexts(true);

			    // update UI
			    var bSelected = (aContexts && aContexts.length > 0);
			    var sText = (bSelected) ? aContexts.length + " selected" : null;
//			    oInfoToolbar.setVisible(bSelected);
			    oLabel.setText(sText);
			  } */

});