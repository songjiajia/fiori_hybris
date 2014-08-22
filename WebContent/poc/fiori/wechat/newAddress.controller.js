jQuery.sap.require("model.ModelManager");

sap.ui.controller("poc.fiori.wechat.newAddress", {

	onInit : function() {
		var div = this.byId("div");
		div.addStyleClass("LabelPadding");
		  var bus = sap.ui.getCore().getEventBus();
		    bus.subscribe("nav", "to", this.navToHandler, this);
		    this.app = sap.ui.getCore().byId("theApp");		
		this.fromwhere = "";
		this.userid = "jones.wu@sap.com";
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
	
	handleChange: function() {
		this.byId("save").setEnabled(false);
		var lastName = this.byId("lName").getValue().trim();
		var firstName = this.byId("fName").getValue().trim();
		var address = this.byId("tAddr").getValue().trim();		
		if (lastName && firstName && address) {
			this.byId("save").setEnabled(true);
		}
	},
	
	handleAccept: function() {
//		var appUri = "http://182.254.156.24:8980/poc.fiori.wechat/";
//		var proxyUri = "proxy/http/182.254.156.24:9001";
//		var uripre = "http://182.254.156.24:8000/";
		var uripre= model.ModelManager.getModelUrlPre();
		var user = this.userid;
		var userUri = uripre + "/ws410/rest/users/" + user;
		var uModel = new sap.ui.model.xml.XMLModel();
		uModel.loadData(userUri,null,false);
		var userPK = uModel.getProperty("/@pk");		
		var fromwhere = this.fromwhere;
		var lName = this.byId("lName");
		var lastName = lName.getValue();
		var fName = this.byId("fName");
		var firstName = fName.getValue();
		var tAddr = this.byId("tAddr");
		var address = tAddr.getValue();
  		var uAddr = this.byId("uAddr");
		var bSave = this.byId("save");
		var bundle = this.getView().getModel("i18n").getResourceBundle();
	 	var successMsg = bundle.getText("NEWADD_MSG");
	 	var newAddressUri = uripre + "/ws410/rest/addresses/";	 	
		var xmlData = "<address><owner pk='"+userPK+"'></owner><firstname>"+firstName+"</firstname><lastname>"+lastName+"</lastname><streetname>"+address+"</streetname><shippingAddress>true</shippingAddress></address>";
		$.ajax({
	      type: 'POST',
	      url: newAddressUri,
	      data: xmlData,
	      contentType: "application/xml",
	      success: function (data) {
//	        alert(data);
//Set input field to uneditable and hide text area border
	    	  lName.setEditable(false);
	    	  fName.setEditable(false);
	    	  tAddr.setEditable(false);
	    	  bSave.setEnabled(false);
	    	  tAddr.setVisible(false);
	  		  uAddr.setVisible(true);
	  		  uAddr.setValue(address);
	  		  uAddr.setEnabled(false);
	    	  setTimeout(function () {
				   sap.m.MessageToast.show(successMsg);
			   }, 100);
	    	  
	    	  if(fromwhere === "checkout"){
	    		  var bus = sap.ui.getCore().getEventBus();
	  	        bus.publish("nav", "to", { 
	  	            id : "CheckOut",
	  	            data : {
	  	                fromwhere : "address"
	  	            }
	  	});
	    	  }
	      },
	      error: function (xhr, status, error) {
	          console.log("Add new address failed:" + error);
	      },
	      dataType: 'xml'
	    });
	},

	onBack: function(){
//Initialize input field and save button		
		 var lName = this.byId("lName");
		 var fName = this.byId("fName");
		 var tAddr = this.byId("tAddr");
		 var uAddr = this.byId("uAddr");
		 var bSave = this.byId("save");
		 lName.setValue();
		 fName.setValue();
		 tAddr.setValue();
		 uAddr.setValue();
		 lName.setEditable(true);
	  	 fName.setEditable(true);
	  	 tAddr.setEditable(true);
	  	 bSave.setEnabled(false);
//If nav from Order Page, back; If nav from ME, close 	  	 
		 this.app = sap.ui.getCore().byId("theApp");
		 var initialPage = this.app.getInitialPage();
		 if (initialPage == "newAddress") {
			 var href = window.location.href;
		 	 window.open(href, "_self", "");
		   	 window.close();
		 }
		 else {
			 this.app.back();
		 }
	},
	
});