jQuery.sap.require("model.ModelManager");

sap.ui.controller("poc.fiori.wechat.shoppingCart", {
	onInit:function(){
		urlpre= model.ModelManager.getModelUrlPre(); 
	    picpre = model.ModelManager.getPicUrlPre ();
		  var bus = sap.ui.getCore().getEventBus();
		    bus.subscribe("nav", "to", this.navToHandler, this);
		    this.app = sap.ui.getCore().byId("theApp");		
		    
		var ProductList=this.byId("ProductList");
		 var noProduct=this.byId("noProduct");
		    noProduct.setVisible(false);
		ProductList.setVisible(false);//initial cart,list not visible
//		userId="jones.wu@sap.com";
		userId="jones02@sap.com";
//		userId="jiajing.hu@sap.com";
		userUrl= urlpre + "/ws410/rest/customers/";
		var oView = this.getView();
		
		oView.addEventDelegate({                       //beforeShow
			onBeforeShow: function(evt){
				oBundle = this.getView().getModel("i18n").getResourceBundle();
		url= userUrl + userId + "?time="+ new Date();
		var oModel = new sap.ui.model.xml.XMLModel();
	    var that = this;
	    var getUrl = function(){
	    	cartCode = oModel.getProperty("/carts/cart/@code");
	    	if(!cartCode){	//when cartCode is null or undefined,there is no product in shopping cart
	    		var noProduct=that.byId("noProduct");
		    	noProduct.setVisible(true);//when cartCode is null,there is no product in the shopping cart
		    	var totalPrice = that.byId("totalPrice");
		    	totalPrice.setVisible(false);
		    	var CheckOut = that.byId("CheckOut");
		    	CheckOut.setVisible(false);
		    	return;
		    }
		    cModel = new sap.ui.model.xml.XMLModel();
		    var cartUri = urlpre + "/ws410/rest/carts/"+ cartCode;
		    var uModel = new sap.ui.model.xml.XMLModel();
		    uModel.loadData(cartUri,"",false);
		    cartUnit = uModel.getProperty("/currency/@isocode"); //cartUnit
		    var cartListUrl = urlpre + "/ws410/rest/carts/"+ cartCode+"?cartentry_attributes=info,totalPrice,quantity,basePrice&time="+new Date();
		    cModel.loadData(cartListUrl,"",false);

		    if(cModel.getObject("/entries/").getElementsByTagName("entry").length==0){//cModel is null,there is no product in shopping cart
		    	var noProduct=that.byId("noProduct");
		    	noProduct.setVisible(true);//when cartCode is null,there is no product in the shopping cart
		    	var totalPrice = that.byId("totalPrice");
		    	totalPrice.setVisible(false);
		    	var CheckOut = that.byId("CheckOut");
		    	CheckOut.setVisible(false);
		    	return;
		    }
		    cModel.getObject("/entries/entry").setAttribute("imageUri","");
		    cModel.getObject("/entries/entry").setAttribute("number","");
		    cModel.getObject("/entries/entry").setAttribute("numberUnit","");
		    cModel.getObject("/entries/entry").setAttribute("code","");
		    var oCart = cModel.getObject("/entries/");
	        cartNum =oCart.getElementsByTagName("entry").length;
	        var m = 0;
	          while(m<cartNum){
	                var cartNumEntryUri = cModel.getProperty("/entries/entry/"+m+"/@uri");//entry uri
	                var index = cartNumEntryUri.indexOf("/ws410/rest");
	                cartNumEntryUri = urlpre + cartNumEntryUri.substring(index); 
	                var oCartEntryModel = new sap.ui.model.xml.XMLModel();
	                oCartEntryModel.loadData(cartNumEntryUri,null,false);
	                var productUri=oCartEntryModel.getProperty("/product/@uri");// product uri
	                if(!productUri){
	                	var noProduct=that.byId("noProduct");
	    		    	noProduct.setVisible(true);//when cartCode is null,there is no product in the shopping cart
	    		    	var totalPrice = that.byId("totalPrice");
	    		    	totalPrice.setVisible(false);
	    		    	var CheckOut = that.byId("CheckOut");
	    		    	CheckOut.setVisible(false);
	    		    	return;
	                }
	                productUri =  urlpre + productUri.substring(index);
				    var oProductModel =  new sap.ui.model.xml.XMLModel();
				     oProductModel.loadData(productUri,null,false);
				    for(var j=0;j<oProductModel.getObject("/europe1Prices/").getElementsByTagName("priceRow").length;j++){ //write numberUnit="EUR"
				    	var basePriceUri = oProductModel.getProperty("/europe1Prices/priceRow/"+j+"/@uri");
					    basePriceUri =  urlpre + basePriceUri.substring(index) + "?time=" + new Date();
					    var bModel = new sap.ui.model.xml.XMLModel();
					    bModel.loadData(basePriceUri,"",false);
					    var unit = bModel.getProperty("/currency/@isocode");
					    if(unit=="EUR"){
					    	var numberUnit = bModel.getProperty("/currency/@isocode");
					    	cModel.setProperty("/entries/entry/"+m+"/@number",bModel.getProperty("/price"));//set unitPrice
						    cModel.setProperty("/entries/entry/"+m+"/@numberUnit",numberUnit);// set numberUnit
					    }
				    } 
				    var imageUri=oProductModel.getProperty("/baseProduct/@uri");// baseProduct uri
				    imageUri = urlpre+ imageUri.substring(index);
	                var oImageModel = new sap.ui.model.xml.XMLModel();
	                oImageModel.loadData(imageUri,null,false);
	                var image = oImageModel.getProperty("/picture/@downloadURL");//picture   "http://182.254.156.24:8000/poc.fiori.wechat/proxy/http/182.254.156.24:9001
	                image = picpre + image;
	                cModel.setProperty("/entries/entry/"+m+"/@imageUri",image);
	                var baseProductUri = oImageModel.getProperty("/baseProduct/@uri").split("/");
	                var productId = baseProductUri[baseProductUri.length-1];
	                cModel.setProperty("/entries/entry/"+m+"/@code",productId);                       //baseProduct code 
	                m++;
	          }
			ProductList.setVisible(true);//cart has products,list visible
	        ProductList.setModel(cModel);
	        var totalPrice = that.byId("totalPrice");
	        var totalCartPrice = 0;
	        for(var i=0;i<cartNum;i++){
	        	var price = parseFloat(cModel.getProperty("/entries/entry/"+i+"/@number"))*cModel.getProperty("/entries/entry/"+i+"/quantity");
	        	totalCartPrice += price;
	        }
	        totalPrice.setText(oBundle.getText("TOTAL")+" "+totalCartPrice.toFixed(2)+" "+oBundle.getText("EUR"));
	    };
	    oModel.loadData(url);
	    oModel.attachRequestCompleted(getUrl);
	}
	  },this);
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
	onPressMinus : function (object){
		var itemId = object.getSource();
		var minuId = itemId.getId();//shoppingCart--minu-shoppingCart--ProductList-0
		var minuIndex = minuId.indexOf("-shoppingCart--");
		var id = "inputQuantity"+ minuId.substring(minuIndex);//relpace "shoppingCart--minu"
		var inputQuantity = this.byId(id);
		var quantity = parseInt(inputQuantity.getValue());
		var priceId = "price"+ minuId.substring(minuIndex);//"price-shoppingCart--ProductList-0"
		var price = this.byId(priceId);
		var basePrice= parseFloat(price.getText());        //unitPrice
		var unitId = "unit"+ minuId.substring(minuIndex);//"price-shoppingCart--ProductList-0"
		var priceUnit = this.byId(unitId);
		var unit = priceUnit.getText().split(" ")[0];
		if(quantity<=1)
			return;
		else
			quantity-=1;
		inputQuantity.setValue(quantity);             //new quantity		
        var totalPrice = this.byId("totalPrice");
        totalCartPrice = parseFloat(totalPrice.getText().split(" ")[1]);
        totalCartPrice -= basePrice;
        totalPrice.setText(oBundle.getText("TOTAL")+" "+totalCartPrice.toFixed(2)+" "+oBundle.getText("EUR"));     //new totalCartPrice
      //update backend
        var itemId = minuId.split("-");
		var i = itemId[itemId.length-1];   //press No.i item
		var entryUri = cModel.getProperty("/entries/entry/"+i+"/@uri");//"http://182.254.156.24:9001/ws410/rest/carts/00024518/cartentries/8796717285420"
		var entries = entryUri.split("/");
		var cartentryPk = entries[entries.length-1];
		var totalPrice = quantity * basePrice;
		var index = entryUri.indexOf("/ws410/rest");
		var updateCartUri = urlpre + entryUri.substring(index); //http://182.254.156.24:8000/poc.fiori.wechat/proxy/http/182.254.156.24:9001/ws410/rest/carts/00024518/cartentries/8796717285420
		var xmlData = "<cartentry pk='"+cartentryPk+"' uri='"+entryUri+"'><quantity>"+quantity+"</quantity><totalPrice>"+totalPrice+"</totalPrice></cartentry>";
		$.ajax({
	      type: 'PUT',
	      url: updateCartUri,
	      data: xmlData,
	      contentType: "application/xml",
	      success: function (data) {
	    	  cModel.refresh();
	      },
		});
	},
	onPressPlus : function (object){
		var item = object.getSource();
		var plusId = item.getId();//shoppingCart--plus-shoppingCart--ProductList-0
		var plusIndex = plusId.indexOf("-shoppingCart--");
		var id = "inputQuantity" + plusId.substring(plusIndex);//relpace "shoppingCart--plus"
		var inputQuantity = this.byId(id);
		var quantity = parseInt(inputQuantity.getValue());
		var priceId = "price" + plusId.substring(plusIndex);//"price-shoppingCart--ProductList-0"
		var price = this.byId(priceId);
		var basePrice= parseFloat(price.getText());        //unitPrice
		var unitId = "unit"+ plusId.substring(plusIndex);//"price-shoppingCart--ProductList-0"
		var priceUnit = this.byId(unitId);
		var unit = priceUnit.getText().split(" ")[0];
        quantity+=1;
        inputQuantity.setValue(quantity);        //new quantity
        var totalPrice = this.byId("totalPrice");
        totalCartPrice = parseFloat(totalPrice.getText().split(" ")[1]);
        totalCartPrice += basePrice;        
        totalPrice.setText(oBundle.getText("TOTAL")+" "+totalCartPrice.toFixed(2)+" "+oBundle.getText("EUR"));
        //update backend
        var itemId = plusId.split("-");
		var i = itemId[itemId.length-1];   //press No.i item
		var entryUri = cModel.getProperty("/entries/entry/"+i+"/@uri");//"http://182.254.156.24:9001/ws410/rest/carts/00024518/cartentries/8796717285420"
		var entries = entryUri.split("/");
		var cartentryPk = entries[entries.length-1];
		var totalPrice = quantity * basePrice;
		var index = entryUri.indexOf("/ws410/rest");
		var updateCartUri = urlpre + entryUri.substring(index); //http://182.254.156.24:8000/poc.fiori.wechat/proxy/http/182.254.156.24:9001/ws410/rest/carts/00024518/cartentries/8796717285420
		var xmlData = "<cartentry pk='"+cartentryPk+"' uri='"+entryUri+"'><quantity>"+quantity+"</quantity><totalPrice>"+totalPrice+"</totalPrice></cartentry>";
		$.ajax({
	      type: 'PUT',
	      url: updateCartUri,
	      data: xmlData,
	      contentType: "application/xml",
	      success: function (data) {
	    	  cModel.refresh();
	      },
		});
 	},
 	onBack: function(){//back to pre_page
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();
	},
	
	formatName : function(info){  //handle info and get product name
		var infoFormat = info.replace(/"/ig,"@!");
		var info = infoFormat.split("@!")[3].split(" ");
		var name="";
		for(var i=0;i<info.length-1;i++)
			name =name + info[i]+" ";
		return name;
	},
	formatSize : function(info){  //handle info and get product size
		var infoFormat = info.replace(/"/ig,"@!");
		var name = infoFormat.split("@!")[3];
		var infoSize = name.split(" ");
		var size = infoSize[infoSize.length-1];
		return "尺码 : "+size;
	},
	
	handleDelete: function(evt) {
		var itemId = evt.getParameter("listItem").getId();
		var items = itemId.split("--");
 		var priceId = "price-"+items[0].split("-")[1]+"--"+items[1];
 		var id = "inputQuantity-"+items[0].split("-")[1]+"--"+items[1];//relpace "shoppingCart--plus"
		var inputQuantity = this.byId(id);
		var quantity = parseInt(inputQuantity.getValue());
 		var basePrice = parseFloat(this.byId(priceId).getText());//each item totalprice
 		var unitId = "unit-"+items[0].split("-")[1]+"--"+items[1];
 		var priceUnit = this.byId(unitId).getText();
 		var unit = priceUnit.split(" ")[0];
 		var tPrice = this.byId("totalPrice");
 		var order = this.byId("CheckOut");
 		var totalPrice = parseFloat(tPrice.getText().split(" ")[1]);//Total: 0 EUR
 		totalPrice = totalPrice-basePrice * quantity;
 		if(totalPrice==0){
  		  tPrice.setVisible(false);
  		  order.setVisible(false);
  	  }else
  		tPrice.setText(oBundle.getText("TOTAL")+" "+totalPrice.toFixed(2)+" "+oBundle.getText("EUR")); 			
	    evt.getSource().removeItem(evt.getParameter("listItem"));
//	    urlpre = "http://182.254.156.24:8000";
		var deleteCartProductUri = urlpre + "/ws410/rest/carts/"+cartCode;
		var oModel =   new sap.ui.model.xml.XMLModel();
	     oModel.loadData(deleteCartProductUri);
	     var oPara = evt.getParameter("listItem").getBindingContext();
			var sPath = oPara.sPath;
			sPathProducts = sPath + "/@uri";			
		    oDelProductUri =	oPara.getProperty (sPathProducts);
		    var index = oDelProductUri.indexOf("/ws410/rest");
		    oDelProductUri = oDelProductUri.substring(index);
		    oDelProductUri = urlpre + oDelProductUri;
			$.ajax({
			      type: 'DELETE',
			      url: oDelProductUri,
			      contentType: "application/xml",
			      success: function () {
			    	  cModel.refresh();
			      },
			      error: function (xhr, status, error) {
			          alert("Service Error:" + error);
			      },
			      dataType: 'xml'
			    });
	  },
	
	checkOut : function(oEvent){
		var bus = sap.ui.getCore().getEventBus();
        bus.publish("nav", "to", { 
            id : "CheckOut",
            data : {
                cartCode : cartCode,
                userId : userId,
                fromwhere : "cart"
            }
     });
        bus.publish("to", "checkout", { 
            id : "CheckOut",
            data : {
                cartCode : cartCode,
                userId : userId,
                fromwhere : "cart"
            }
     });
	},
	productDetail : function(oEvent){
		return;
		 var bus = sap.ui.getCore().getEventBus();
	        bus.publish("nav", "to", { 
	            id : "Detail",
	            data : {
	                context : oEvent.oSource.getBindingContext()
	            }
	     });
	},
	backHome : function(){
		var bus = sap.ui.getCore().getEventBus();
        bus.publish("nav", "to", { 
            id : "search",
            data : {
            }
     });		
	},
});