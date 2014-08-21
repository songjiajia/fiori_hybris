jQuery.sap.require("model.ModelManager");

sap.ui.controller("poc.fiori.wechat.shoppingCart", {
	onInit:function(){
		urlpre= model.ModelManager.getModelUrlPre(); 
	    picpre = model.ModelManager.getPicUrlPre ();
//		  var bus = sap.ui.getCore().getEventBus();
//		    bus.subscribe("nav", "to", this.navToHandler, this);
//		    this.app = sap.ui.getCore().byId("theApp");		
		    
		var ProductList=this.byId("ProductList");
		ProductList.setVisible(false);//initial cart,list not visible
		userId="jones.wu@sap.com";
//		userId="jiajing.hu@sap.com";
		var userUrl= urlpre + "/ws410/rest/customers/";
		var oView = this.getView();
		url= userUrl + userId;
		oView.addEventDelegate({
			onBeforeShow: function(evt){
			
		var oModel = new sap.ui.model.xml.XMLModel();
	    cartCode = "";
	    var getUrl = function(){
	    	cartCode = oModel.getProperty("/carts/cart/@code");
	    };
        oModel.attachRequestCompleted(getUrl);
	    oModel.loadData(url,"",false);
	    if(cartCode==""){	//when cartCode is null,there is no product in shopping cart
	    	this.setVisibleFalse();
	    	return;
	    }
	    cModel = new sap.ui.model.xml.XMLModel();
	    var cartListUrl = urlpre + "/ws410/rest/carts/"+ cartCode+"?cartentry_attributes=info,totalPrice,quantity,basePrice";
	    cModel.loadData(cartListUrl,"",false);

	    if(cModel.getObject("/entries/").getElementsByTagName("entry").length==0){//cModel is null,there is no product in shopping cart
	    	this.setVisibleFalse();
	    	return;
	    }
	    cModel.getObject("/entries/entry").setAttribute("imageUri","");
	    cModel.getObject("/entries/entry").setAttribute("number","");
	    cModel.getObject("/entries/entry").setAttribute("numberUnit","");
	    var oCart = cModel.getObject("/entries/");
        cartNum =oCart.getElementsByTagName("entry").length;
	    this.getImageUri(cModel);
	    var noProduct=this.byId("noProduct");
	    noProduct.setVisible(false);	
		ProductList.setVisible(true);//cart has products,list visible
        ProductList.setModel(cModel);
        var totalPrice = this.byId("totalPrice");
        var totalCartPrice = 0;
        var numberUnit = cModel.getProperty("/entries/entry/"+0+"/@numberUnit").split(" ")[0];
        for(var i=0;i<cartNum;i++){
        	var price = parseFloat(cModel.getProperty("/entries/entry/"+i+"/@number"))*cModel.getProperty("/entries/entry/"+i+"/quantity");
        	totalCartPrice += price;
        }
        totalPrice.setText("Total: "+totalCartPrice.toFixed(2)+" "+numberUnit);
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
	  getImageUri : function(cModel){
		  var oCart = cModel.getObject("/entries/");
          cartNum =oCart.getElementsByTagName("entry").length;
 //         var baseUri ="http://182.254.156.24:8000";
//          var baseUri ="http://182.254.156.24:8000/poc.fiori.wechat/proxy/http/";
          var i = 0;
          while(i<cartNum){
                var cartNumEntryUri = cModel.getProperty("/entries/entry/"+i+"/@uri");//entry uri
                var index = cartNumEntryUri.indexOf("/ws410/rest");
                cartNumEntryUri = urlpre + cartNumEntryUri.substring(index); 
                var oCartEntryModel = new sap.ui.model.xml.XMLModel();
                oCartEntryModel.loadData(cartNumEntryUri,null,false);
                var productUri=oCartEntryModel.getProperty("/product/@uri");// product uri
                productUri =  urlpre + productUri.substring(index);
			    var oProductModel =  new sap.ui.model.xml.XMLModel();
			     oProductModel.loadData(productUri,null,false);
			    var basePriceUri = oProductModel.getProperty("/europe1Prices/priceRow/1/@uri");
			    basePriceUri =  urlpre + basePriceUri.substring(index);
			    var bModel = new sap.ui.model.xml.XMLModel();
			    bModel.loadData(basePriceUri,"",false);
			    var unit = bModel.getProperty("/currency/@isocode")+" / UNIT";
			    cModel.setProperty("/entries/entry/"+i+"/@number",bModel.getProperty("/price"));//set unitPrice
			    cModel.setProperty("/entries/entry/"+i+"/@numberUnit",unit);// set numberUnit
			    var imageUri=oProductModel.getProperty("/baseProduct/@uri");// baseProduct uri
			    imageUri = urlpre+ imageUri.substring(index);
                var oImageModel = new sap.ui.model.xml.XMLModel();
                oImageModel.loadData(imageUri,null,false);
                var image = oImageModel.getProperty("/picture/@downloadURL");//picture   "http://182.254.156.24:8000/poc.fiori.wechat/proxy/http/182.254.156.24:9001
                image = picpre + image;
                cModel.setProperty("/entries/entry/"+i+"/@imageUri",image);
                i++;
          }
          return cModel;
	  },
	  setVisibleFalse : function(){					//when cart is null.
	    	var noProduct=this.byId("noProduct");
	    	noProduct.setVisible(true);//when cartCode is null,there is no product in the shopping cart
	    	var totalPrice = this.byId("totalPrice");
	    	totalPrice.setVisible(false);
	    	var CheckOut = this.byId("CheckOut");
	    	CheckOut.setVisible(false);
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
        totalPrice.setText("Total: "+totalCartPrice.toFixed(2)+" "+unit);     //new totalCartPrice
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
        totalPrice.setText("Total: "+totalCartPrice.toFixed(2)+" "+unit);
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
		return "Size : "+size;
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
  		tPrice.setText("Total: "+totalPrice.toFixed(2)+" "+unit); 			
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
// 	selectChange : function(object){  //when each item checkbox selectChange
// 		var isSelected = object.getParameters();
// 		var itemId = isSelected.listItem.getId();//__item0-shoppingCart--ProductList-0
// 		var priceId = "price"+itemId.substring(7);
// 		var plusId = "plus"+itemId.substring(7);
// 		var minuId = "minu"+itemId.substring(7);
// 		var plus = this.byId(plusId);
// 		var minu = this.byId(minuId);
// 		var price = parseFloat(this.byId(priceId).getText());//each item totalprice
// 		var tPrice = this.byId("totalPrice");
// 		var totalPrice = parseFloat(tPrice.getText().split(" ")[1]);//Total: 0 EUR
// 		var check = this.byId("CheckOut");
// 		var checkout = parseInt(check.getText().replace(/[^0-9]/ig,""));//Checkout(0)
// 		if(isSelected.selected){
// 			totalPrice += price;
// 			checkout += 1;
// 			plus.setEnabled(false);
// 			minu.setEnabled(false);
// 		}
// 		else{
// 			totalPrice -= price;
// 			checkout -= 1;
// 			plus.setEnabled(true);
// 			minu.setEnabled(true);
// 		}
// 		check.setText("Checkout("+checkout+")");	
// 		tPrice.setText("Total: "+totalPrice.toFixed(2)+" EUR");
// 		
// 	},
//	selectedAll : function(){           //select all items
//		var isSelect = this.byId("selectedAll");
//		var productList = this.byId("ProductList");
//		var totalPrice = this.byId("totalPrice");
//		var CheckOut = this.byId("CheckOut");
//		
//		var items = productList.getItems();
//		var i = items.length-1;
//		if(isSelect.getSelected()){			//when id('selectAll') is checked
//			while(i>=0){
//				if(items[i].getSelected()){//if there are some items are selected? then continue
//					i--;
//					continue;
//				}
//				items[i].setSelected(true);
//				this.selectItem(items[i]);	//call selectItem(itemId) to handle the TotalPrice
//				i--;
//			}
//		}else{								//when id('selectAll') is not checked
//			while(i>=0){
//				items[i].setSelected(false);
//				this.selectItem(items[i]);
//				i--;
//			}
//			totalPrice.setText("Total: 0 ");
//			CheckOut.setText("Checkout(0)");
//		}
//	},
//	selectItem : function(item){//
//	    var itemId = item.getId();
//		var priceId = "price"+itemId.substring(7);
// 		var plusId = "plus"+itemId.substring(7);
// 		var minuId = "minu"+itemId.substring(7);
// 		var plus = this.byId(plusId);
// 		var minu = this.byId(minuId);
// 		var price = parseFloat(this.byId(priceId).getText());//each item totalprice
// 		var tPrice = this.byId("totalPrice");
// 		var totalPrice = parseFloat(tPrice.getText().split(" ")[1]);//Total: 0 EUR
// 		var check = this.byId("CheckOut");
// 		var checkout = parseInt(check.getText().replace(/[^0-9]/ig,""));//Checkout(0)
//		totalPrice += price;
//		checkout += 1;
//		if(item.getSelected()){
//			plus.setEnabled(false);
//			minu.setEnabled(false);
//		}
//		else{
//			plus.setEnabled(true);
//			minu.setEnabled(true);
//		}
// 		check.setText("Checkout("+checkout+")");	
// 		tPrice.setText("Total: "+totalPrice.toFixed(2)+" EUR");
//	},
	
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
	},
	cartProductDetail : function(oEvent){
		var m = oEvent.oSource.getBindingContext();
		return ;		
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