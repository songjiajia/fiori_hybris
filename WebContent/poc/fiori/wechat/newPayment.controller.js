sap.ui.controller("poc.fiori.wechat.newPayment", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf poc.fiori.wechat.newPayment
*/
	onInit: function() {
       this.userid = "jones.wu@sap.com";
       
       var bus = sap.ui.getCore().getEventBus();
	    bus.subscribe("nav", "to", this.navToHandler, this);
	    this.app = sap.ui.getCore().byId("theApp");	
	    var that = this;
		this.getView().addEventDelegate({
			onBeforeShow: function(evt){
				if(evt.data.fromwhere === "checkout"){
					that.fromwhere = "checkout";
					that.userid = evt.data.userId;
				}
			}
		});
       
	},
	
	handleCancel : function(oEvent) {
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();
	},
	
	chooseCType : function(evt){
		var chooseitem = evt.getSource();
		var text = chooseitem.getText();
		if(text === "American Express"){
			text = "Exp";
		}else if(text === "China Unionpay"){
			text = "uni";
		}
		this.getView().byId("iCreType").setValue(text);
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
	
	handleAccept : function(){
		var uripre = "http://182.254.156.24:8000/";
		//var uripre = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
	 	var newCreditUri = uripre + "/ws410/rest/creditcardpaymentinfos/";	
	 	var code = this.getView().byId("iVnum").getValue();
	 	var owner = this.getView().byId("iName").getValue();
	 	var number = this.getView().byId("iCardnum").getValue();
	 	var type = this.getView().byId("iCreType").getValue();
	 	var validtomonth = this.getView().byId("monthSelect").getSelectedKey();
	 	var validtoyear = this.getView().byId("yearSelect").getSelectedKey();
		var xmlData = '<creditcardpaymentinfo><code>' + code +'</code><user uid="' + this.userid +'"></user><ccOwner>' + owner + '</ccOwner><number>' + number + '</number><type>' + type + '</type><validToMonth>' + validtomonth + '</validToMonth><validToYear>' + validtoyear + '</validToYear></creditcardpaymentinfo>';
		$.ajax({
	      type: 'POST',
	      url: newCreditUri,
	      data: xmlData,
	      contentType: "application/xml",
	      success: function () {
	    	  
	    	  //TODO :return to the checkout page
	    	  
	    		 var bus = sap.ui.getCore().getEventBus();
	 	        bus.publish("nav", "to", { 
	 	            id : "CheckOut",
	 	            data : {
	 	                fromwhere : "newpayment"
	 	            }
	 	});
	      //  alert(data);
//	    	  setTimeout(function () {
//				   sap.m.MessageToast.show("New address has been added");
//			   }, 100);
//	    	  window.open("http://jones.nat123.net/yacceleratorstorefront/en/cart",'_self');
	      },
	      error: function (xhr, status, error) {
	          alert("Service Error:" + error);
	      },
	      dataType: 'xml'
	    });
	},
	
	onBack: function(){ 
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf poc.fiori.wechat.newPayment
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf poc.fiori.wechat.newPayment
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf poc.fiori.wechat.newPayment
*/
//	onExit: function() {
//
//	}

});