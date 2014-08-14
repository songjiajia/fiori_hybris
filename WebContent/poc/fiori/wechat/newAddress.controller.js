//jQuery.sap.require("sap.ui.core.Element");
sap.ui.controller("poc.fiori.wechat.newAddress", {

	onInit : function() {
		var div = this.byId("div");
		div.addStyleClass("LabelPadding");
		
	},
	
	handleChange: function() {
		this.byId("save").setEnabled(false);
		var lastName = this.byId("lName").getValue();
		var firstName = this.byId("fName").getValue();
		var address = this.byId("tAddr").getValue();		
		if (lastName && firstName && address) {
			this.byId("save").setEnabled(true);
		}
	},
	
	handleAccept: function() {
		var uripre = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001";
		//var uripre = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
		var user = "jones.wu@sap.com";
		var userUri = uripre + "/ws410/rest/users/" + user;
		var uModel = new sap.ui.model.xml.XMLModel();
		uModel.loadData(userUri,null,false);
		var userPK = uModel.getProperty("/@pk");		
		
		var lName = this.byId("lName");
		var lastName = lName.getValue();
		var fName = this.byId("fName");
		var firstName = fName.getValue();
		var tAddr = this.byId("tAddr");
		var address = tAddr.getValue();
		var bSave = this.byId("save");
	 	var newAddressUri = uripre + "/ws410/rest/addresses/";	 	
		var xmlData = "<address><owner pk='"+userPK+"'></owner><firstname>"+firstName+"</firstname><lastname>"+lastName+"</lastname><streetname>"+address+"</streetname><shippingAddress>true</shippingAddress></address>";
		$.ajax({
	      type: 'POST',
	      url: newAddressUri,
	      data: xmlData,
	      contentType: "application/xml",
	      success: function (data) {
//	        alert(data);
	    	  lName.setEditable(false);
	    	  fName.setEditable(false);
	    	  tAddr.setEditable(false);
	    	  bSave.setEnabled(false);
	    	  setTimeout(function () {
				   sap.m.MessageToast.show("New address has been added");
			   }, 100);
	      },
	      error: function (xhr, status, error) {
	          alert("Service Error:" + error);
	      },
	      dataType: 'xml'
	    });
	},

	onBack: function(){
		 var href = window.location.href;
	 	 window.open(href, "_self", "");
	   	 window.close();
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();
	},
});