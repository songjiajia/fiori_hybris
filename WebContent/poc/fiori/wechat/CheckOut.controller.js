sap.ui.controller("poc.fiori.wechat.CheckOut", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf poc.fiori.wechat.CheckOut
*/
	onInit: function() {
		  var bus = sap.ui.getCore().getEventBus();
		    bus.subscribe("nav", "to", this.navToHandler, this);
		    this.app = sap.ui.getCore().byId("theApp");		
		    
		this.userid= "jones.wu@sap.com";
		
		
        this.cartid = "00024494";
        var oView = this.getView();
        var that = this;
        this.urlpre = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001/";
    	oView.addEventDelegate({
			onBeforeShow: function(evt){
				var url = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001/ws410/rest/carts/" + that.cartid + "?currency_attributes=name";
				var cartModel = new sap.ui.model.xml.XMLModel();
				cartModel.loadData(url);
				oView.byId("totalprice").setModel(cartModel);
				if(evt.data.fromwhere == "newpayment"){
					that.getView().byId("Credits").setVisible(true);
					var url = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001/ws410/rest/creditcardpaymentinfos?creditcardpaymentinfo_attributes=pk,ccowner,user,code,number,type,validFromMonth,validFromYear,validToMonth,validToYear,saved,duplicate";
				
					var creditJson = {};
				//	var that = this;
					
					var creditModel = new sap.ui.model.xml.XMLModel();
					var successfulRequest = function(){
						var xmlstr = creditModel.getXML();
						var xmlDoc;
						if (window.DOMParser)
						  {
						  parser=new DOMParser();
						  xmlDoc=parser.parseFromString(xmlstr,"text/xml");
						  }
						else // code for IE
						  {
						  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
						  xmlDoc.async=false;
						  xmlDoc.loadXML(xmlstr); 
						  } 
						creditJson = that.xmlToJson(xmlDoc); 
						var userscredit = creditJson.creditcardpaymentinfos.creditcardpaymentinfo.filter(function(item){
			                  if(item.user['@attributes'].uid === that.userid && item.duplicate["#text"] === "false"){
			                	  return item;
			                	  
			                  }
					});
						var actualJson = [];
						var paymentLen = userscredit.length;
						for(var i=0;i<paymentLen;i++){
							var actualJsonPiece = {};
							var payment = userscredit[i];
							actualJsonPiece.pk = payment['@attributes'].pk;
							actualJsonPiece.number = payment.number['#text'];
							actualJson.push(actualJsonPiece);
						}
						
						var creditJsonModel = new sap.ui.model.json.JSONModel(actualJson);
						that.getView().byId("Crd").setModel(creditJsonModel);
						//TODO: change selected to last item;
						var len = that.getView().byId("Crd").getItems().length;
						that.getView().byId("Crd").getItems()[len - 1].setSelected(true);
			           
			      };
					
			      creditModel.loadData(url);	
			      creditModel.attachRequestCompleted(successfulRequest);
					
				}
				
				
			}
    	}, this);
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
	
	
	xmlToJson : function(xml) {
		
		// Create the return object
		
		
		
		var obj = {};

		if (xml.nodeType == 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType == 3) { // text
			obj = xml.nodeValue;
		}

		// do children
		if (xml.hasChildNodes()) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = this.xmlToJson(item);
				} else {
					if (typeof(obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(this.xmlToJson(item));
				}
			}
		}
		return obj;
	},
	
	addNewAddress : function(){
		 var bus = sap.ui.getCore().getEventBus();
	        bus.publish("nav", "to", { 
	            id : "newAddress",
	            data : {
	                fromwhere : "checkout"
	            }
	});
	},
	
	addNewCredit : function(){
		 var bus = sap.ui.getCore().getEventBus();
	        bus.publish("nav", "to", { 
	            id : "newPayment",
	            data : {
	                fromwhere : "checkout"
	            }
	});
	},
	
	selectPickup : function(){
		this.getView().byId("ShipAddress").setVisible(false);
	},
	
	selectShip : function(){
		this.getView().byId("ShipAddress").setVisible(true);
		var url = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001/ws410/rest/users/" + this.userid + "?address_attributes=building,pk,appartment,country,company,line1,line2";
		var addressJson = {};
		var that = this;
		
		var addressModel = new sap.ui.model.xml.XMLModel();
		var successfulRequest = function(){
			
			var oFilter = new sap.ui.model.Filter("line1",
					 sap.ui.model.FilterOperator.NE, "");
			that.getView().byId("addresses").getBinding("items").filter(oFilter);
//			var xmlstr = AddressModel.getXML();
//			var xmlDoc;
//			if (window.DOMParser)
//			  {
//			  parser=new DOMParser();
//			  xmlDoc=parser.parseFromString(xmlstr,"text/xml");
//			  }
//			else // code for IE
//			  {
//			  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
//			  xmlDoc.async=false;
//			  xmlDoc.loadXML(xmlstr); 
//			  } 
//			addressJson = that.xmlToJson(xmlDoc); 
			
			
           
      };
		
		addressModel.loadData(url);			
		addressModel.attachRequestCompleted(successfulRequest);
		this.getView().byId("ShipAddress").setModel(addressModel);
		
	},
	
	selectCash : function(){
		this.getView().byId("Credits").setVisible(false);
	},
	
	selectWP : function(){
		this.getView().byId("Credits").setVisible(false);
	},
	
	handleOk : function(){
		
		this.createorder();
		
	},
	
	createorder : function(){
		var url = this.urlpre + "ws410/rest/carts/" + this.cartid + "?cmd=PlaceOrderCommand";
		var chosenAdd = "";
		var addresses = this.getView().byId("addresses").getItems();
		var addlen = addresses.length;
		for(var i =0;i<addlen;i++){
			var addradiobutton = addresses[i];
			if(addradiobutton.getSelected() === true){
				chosenAdd = addradiobutton.data("pk");
				break;
			}
		}
		
		var chosenPayment = "";
		var payments = this.getView().byId("Crd").getItems();
		var paymentlen = payments.length;
		for(var i =0;i<paymentlen;i++){
			var payradiobutton = payments[i];
			if(payradiobutton.getSelected() === true){
				chosenPayment = payradiobutton.data("pk");
				break;
			}
		}
		
		var that = this;
		var cartxml = '<cart code="'+this.cartid + '"><user uid="'+ this.userid + '"></user><paymentInfo pk="'+ chosenPayment + '"></paymentInfo><paymentAddress pk="' + chosenAdd + '"/></cart>';
		$.ajax({
		      type: 'POST',
		      url: url,
		      data: cartxml,
		      contentType: "application/xml",
		      success: function () {
		    	  var orderurl = that.urlpre + "ws410/rest/orders/" + that.cartid;
		    	  var orderxml = '<order code="'+that.cartid + '"><user uid="'+ that.userid + '"></user><paymentInfo pk="'+ chosenPayment + '"></paymentInfo><deliveryAddress pk="' + chosenAdd + '"/></order>';
		    	  $.ajax({
				      type: 'PUT',
				      url: orderurl,
				      data: orderxml,
				      contentType: "application/xml",
				      success: function () {
				    	  
				      },
				      error: function (xhr, status, error) {
				          alert("PUT Error:" + error);
				      },
				      dataType: 'xml'
				    });
//		        alert(data);
		    	 
//		    	  window.open("http://jones.nat123.net/yacceleratorstorefront/en/cart",'_self');
		      },
		      error: function (xhr, status, error) {
		          alert("POST Error:" + error);
		      },
		      dataType: 'xml'
		    });
		
		
	},
	
	selectCredit : function(){
		this.getView().byId("Credits").setVisible(true);
		var url = "http://localhost:8080/poc.fiori.wechat/proxy/http/10.59.145.101:9001/ws410/rest/creditcardpaymentinfos?creditcardpaymentinfo_attributes=pk,ccowner,user,code,number,type,validFromMonth,validFromYear,validToMonth,validToYear,saved,duplicate";
	
		var creditJson = {};
		var that = this;
		
		var creditModel = new sap.ui.model.xml.XMLModel();
		var successfulRequest = function(){
			var xmlstr = creditModel.getXML();
			var xmlDoc;
			if (window.DOMParser)
			  {
			  parser=new DOMParser();
			  xmlDoc=parser.parseFromString(xmlstr,"text/xml");
			  }
			else // code for IE
			  {
			  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			  xmlDoc.async=false;
			  xmlDoc.loadXML(xmlstr); 
			  } 
			creditJson = that.xmlToJson(xmlDoc); 
			var userscredit = creditJson.creditcardpaymentinfos.creditcardpaymentinfo.filter(function(item){
                  if(item.user['@attributes'].uid === that.userid && item.duplicate["#text"] === "false"){
                	  return item;
                	  
                  }
		});
			var actualJson = [];
			var paymentLen = userscredit.length;
			for(var i=0;i<paymentLen;i++){
				var actualJsonPiece = {};
				var payment = userscredit[i];
				actualJsonPiece.pk = payment['@attributes'].pk;
				actualJsonPiece.number = payment.number['#text'];
				actualJson.push(actualJsonPiece);
			}
			
			var creditJsonModel = new sap.ui.model.json.JSONModel(actualJson);
			that.getView().byId("Crd").setModel(creditJsonModel);
			
			
           
      };
		
      creditModel.loadData(url);	
      creditModel.attachRequestCompleted(successfulRequest);
	}
	
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf poc.fiori.wechat.CheckOut
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf poc.fiori.wechat.CheckOut
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf poc.fiori.wechat.CheckOut
*/
//	onExit: function() {
//
//	}

});