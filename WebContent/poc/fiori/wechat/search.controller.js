sap.ui.controller("poc.fiori.wechat.search", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf poc.fiori.wechat.search
*/
	onInit: function() {
		
/*		 var oImage = this.byId("idImage");
		 oImage.setVisible(true);
		 var oList = this.byId("idList");
		 oList.setVisible(false);  */
		
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
	            this.app.to(data.id, data.data);
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
/*	 onGlassesPress : function (oEvent) {
		 var bus = sap.ui.getCore().getEventBus();
		 var para = "sunglasses";
	        bus.publish("nav", "to", { 
	            id : "CategoryDetail",
	            data : {
	                context : para
	            }
 	});
		
	 },*/
	// get which category button is pressed, and add it as a parameter to detail page
	 onCatButtonsPress : function (oEvent) {
		 var bus = sap.ui.getCore().getEventBus();
		 var catId = oEvent.oSource.getId();
		 switch (catId) {
		   case this.byId("idSunglasses").getId():
		     para = "sunglasses";
		     break;
		   case this.byId("idShirt").getId():
			 para = "shirts";
		     break;
		   case this.byId("idShoes").getId():
			 para = "shoes";
			 break;
		   case this.byId("idCaps").getId():
			 para = "caps";
			 break;
		   case this.byId("idClothes").getId():
			 para = "clothes";
			 break;
		   case this.byId("idTools").getId():
		     para = "tools";
			 break;   
						};
	        bus.publish("nav", "to", { 
	            id : "CategoryDetail",
	            data : {
	                context : para
	            }
 	});
		
	 },
	 onSearch : function (oEvt) {

		    // add filter for search
		    var aFilters = [];
		    var sQuery = oEvt.getSource().getValue();
		    if(sQuery !== ""){
		    	
		    
		    var bus = sap.ui.getCore().getEventBus();
		        bus.publish("nav", "to", { 
		            id : "CategoryDetail",
		            data : {
		                context : sQuery
		            }
		        });		    
		    }
		        
		  }, 
		  onCartPress: function(oEvt){
			   var bus = sap.ui.getCore().getEventBus();
		        bus.publish("nav", "to", { 
		            id : "shoppingCart"
		        });		 
		  }

});