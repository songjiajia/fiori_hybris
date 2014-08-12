//jQuery.sap.require("sap.ui.core.Element");
sap.ui.controller("poc.fiori.wechat.newAddress", {

	onInit : function() {
		
		var div = this.byId("div");
		div.addStyleClass("LabelPadding");
	},

	handleCancel : function(oEvent) {
		var href = window.location.href;
		window.open(href, "_self", "");
		window.close();
	},
	
	handleAccept: function() {
		var uripre = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001";
		//var uripre = "http://jones4.nat123.net:14606/poc.fiori.wechat/proxy/http/jones.nat123.net";
	 	var newAddressUri = uripre + "/ws410/rest/addresses/";	 	
		var xmlData = "<address><owner uid='jones.wu@sap.com'></owner><firstname>jones</firstname><lastname>wu</lastname><line1>address</line1><postalcode>200000</postalcode><shippingAddress>true</shippingAddress><title code='mrs'/></address>";
		$.ajax({
	      type: 'POST',
	      url: newAddressUri,
	      data: xmlData,
	      contentType: "application/xml",
	      success: function () {
	        alert(data);
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

});