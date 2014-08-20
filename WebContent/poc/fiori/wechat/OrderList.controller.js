jQuery.sap.require("sap.ui.core.Element");
sap.ui.controller("poc.fiori.wechat.OrderList", {


	onInit: function() {
		   var bus = sap.ui.getCore().getEventBus();
		    bus.subscribe("nav", "to", this.navToHandler, this);
		    this.app = sap.ui.getCore().byId("theApp");		
		    this.byId("test");
			    
   url = "http://182.254.156.24:8000/ws410/rest/customers/jones.wu@sap.com?order_attributes=date,status,totalPrice,code";
   var orderListModel = new sap.ui.model.xml.XMLModel();
    orderListModel.loadData(url,null,false);	
    this.getView().setModel(orderListModel);
    var oList=this.byId("idOrderList");
	var items = oList.getBinding("items");
 	var oSorter = new sap.ui.model.Sorter("date",true);
 	items.sort(oSorter);
 //      var oOrderNumber= this.byId("idOrderNumber");
/*      oOrderlist=this.byId("idOrderListItem");
       oOrderlist.attachPress(function(oEvent){
     	  var bus = sap.ui.getCore().getEventBus();
	        bus.publish("nav", "to", { 
	            id : "OrderDetail",
	            data : {
	                context : oEvent.oSource.getBindingContext()
	            }
  	});
        
	    });  */
	},
	    onCatBack: function(){
			 this.app = sap.ui.getCore().byId("theApp");
			 this.app.back();
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
	    

		
		onOrderDetail: function(oEvent){
			 var bus = sap.ui.getCore().getEventBus();
		        bus.publish("nav", "to", { 
		            id : "OrderDetail",
		            data : {
		                context : oEvent.oSource.getBindingContext()
		            }
		});
		},
		formatOrderNumber: function(code){
			return "No. " + code;
		},
		formatDate: function(date){
				var oDate = date.substring(0,10);
//				var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "dd/MM/yyyy",style:"short"});
//	    		ofdate = oDateFormat.parse(oDate);
				return oDate;
			
		}
	
});