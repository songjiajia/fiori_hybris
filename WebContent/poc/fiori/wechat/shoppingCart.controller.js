sap.ui.controller("poc.fiori.wechat.shoppingCart", {
	
	onInit:function(){
		var ProductList=this.byId("ProductList");
		ProductList.setVisible(false);//initial cart,list not visible
		var userId="jiajing.hu@sap.com";
		var baseUrl="http://localhost:8980/poc.fiori.wechat/proxy/http/";
		var userUrl="10.59.145.101:9001/ws410/rest/customers/";
		var url= baseUrl + userUrl + userId;
		var cartProductBaseUrl="10.59.145.101:9001/rest/v1/apparel-uk/products/";
		var productCode = null;
//	    var url = "http://localhost:8980/poc.fiori.wechat/proxy/http/10.59.145.101:9001/ws410/rest/customers/jiajing.hu@sap.com";
		var oModel = new sap.ui.model.xml.XMLModel();
	    var cartCode = "";
	    var getUrl = function(){
	    	cartCode = oModel.getProperty("/carts/cart/@code");
	    };
        oModel.attachRequestCompleted(getUrl);
	    oModel.loadData(url,"",false);
	    
	    var noProduct=this.byId("noProduct");
	    if(cartCode==""){
	    	noProduct.setVisible(true);//when cartCode is null,there is no product in the shopping cart
	    	return;
	    }
	    
	    var cModel = new sap.ui.model.xml.XMLModel();
	    var cartListUrl = baseUrl + "10.59.145.101:9001/ws410/rest/carts/"+ cartCode+"?cartentry_attributes=info,totalPrice,quantity";
	    cModel.loadData(cartListUrl,"",false);

	    if(cModel==null){//cModel is null,there is no product in shopping cart
	    	noProduct.setVisible(true);
	    	return;
	    }
	    cModel.getObject("/entries/entry").setAttribute("size","L");
//	    cModel.getObject("/entries/entry").setAttribute("imageUri","");
	    this.sizeAndImage(cModel);
	    noProduct.setVisible(false);	
		ProductList.setVisible(true);//cart has products,list visible
        ProductList.setModel(cModel);
	  },

	  sizeAndImage : function(cModel){
		  var oCart = cModel.getObject("/entries/");
          var cartNum =oCart.getElementsByTagName("entry").length;
          
          var baseUri ="http://localhost:8980/poc.fiori.wechat/proxy/http/";
          var i = 0;
          while(i<cartNum){
                var cartNumEntryUri = cModel.getProperty("/entries/entry/"+i+"/@uri");
                var cartNumEntryUri = baseUri + cartNumEntryUri.substring(7); 
                var oCartEntryModel = new sap.ui.model.xml.XMLModel();
                oCartEntryModel.loadData(cartNumEntryUri,null,false);
                var productUri=oCartEntryModel.getProperty("/product/@uri");
                productUri = baseUri + productUri.substring(7);
			    var oProductModel =  new sap.ui.model.xml.XMLModel();
			     oProductModel.loadData(productUri,null,false);
			    var size = oProductModel.getProperty("/size");
			    cModel.setProperty("/entries/entry/"+i+"/@size",size);
//			    var imageUri=oProductModel.getProperty("/baseProduct/@uri");
//			    imageUri = baseUri + imageUri.substring(7);
//                var oImageModel = new sap.ui.model.xml.XMLModel();
//                oImageModel.loadData(imageUri,null,false);
//                var image = oImageModel.getProperty("/picture/@uri");
//                image = baseUri + image.substring(7);
//                cModel.setProperty("/entries/entry/"+i+"/@imageUri",image);
                i++;
          }
          return cModel;
	  },
	onPressMinus : function (object){
		var itemId = object.getSource();
		var minuId = itemId.getId();//shoppingCart--minu-shoppingCart--ProductList-0
		var id = "inputQuantity"+minuId.substring(18);//relpace "shoppingCart--minu"
		var inputQuantity = this.byId(id);
		var quantity = parseInt(inputQuantity.getValue());
		var priceId = "price"+minuId.substring(18);//"price-shoppingCart--ProductList-0"
		var price = this.byId(priceId);
		var priceValue= parseFloat(price.getText());;
        var singlePrice = priceValue/quantity;
		if(quantity<=1)
			return;
		else
			quantity-=1;
		inputQuantity.setValue(quantity);
		var singleTotalPrice = singlePrice * quantity;
        price.setText(singleTotalPrice.toFixed(2));
	},
	
	onPressPlus : function (object){
		var item = object.getSource();
		var plusId = item.getId();//shoppingCart--plus-shoppingCart--ProductList-0
		var id = "inputQuantity"+plusId.substring(18);//relpace "shoppingCart--plus"
		var inputQuantity = this.byId(id);
		var quantity = parseInt(inputQuantity.getValue());
		var priceId = "price"+plusId.substring(18);//"price-shoppingCart--ProductList-0"
		var price = this.byId(priceId);
		var priceValue= parseFloat(price.getText());
        var singlePrice = priceValue/quantity;
        quantity+=1;
        inputQuantity.setValue(quantity);
        var singleTotalPrice = singlePrice * quantity;
        price.setText(singleTotalPrice.toFixed(2));
        //if item is selected
//        var itemId = "__item"+plusId.substring(45)+plusId.substring(18);
//        var isSelected = this.byId(itemId);
//        alert(isSelected.getSelected());
//        if(isSelected.getSelected()){
//        	var tPrice = this.byId("totalPrice");
//     		var totalPrice = parseFloat(tPrice.getText().split(" ")[1]);
//        	totalPrice += singlePrice;
//            tPrice.setText("Total: "+totalPrice+" EUR"); 
//        }        		
 	},
 	selectChange : function(object){  //when each item checkbox selectChange
 		var isSelected = object.getParameters();
 		var itemId = isSelected.listItem.getId();//__item0-shoppingCart--ProductList-0
 		var priceId = "price"+itemId.substring(7);
 		var plusId = "plus"+itemId.substring(7);
 		var minuId = "minu"+itemId.substring(7);
 		var plus = this.byId(plusId);
 		var minu = this.byId(minuId);
 		var price = parseFloat(this.byId(priceId).getText());//each item totalprice
 		var tPrice = this.byId("totalPrice");
 		var totalPrice = parseFloat(tPrice.getText().split(" ")[1]);//Total: 0 EUR
 		var check = this.byId("CheckOut");
 		var checkout = parseInt(check.getText().replace(/[^0-9]/ig,""));//Checkout(0)
 		if(isSelected.selected){
 			totalPrice += price;
 			checkout += 1;
 			plus.setEnabled(false);
 			minu.setEnabled(false);
 		}
 		else{
 			totalPrice -= price;
 			checkout -= 1;
 			plus.setEnabled(true);
 			minu.setEnabled(true);
 		}
 		check.setText("Checkout("+checkout+")");	
 		tPrice.setText("Total: "+totalPrice.toFixed(2)+" EUR");
 		
 	},
	deleteCart : function(oEvent){  //delete product
		var o
		if(confirm("Are sure delete the shopping cart?")){
			alert("try again");
		}
	},
	selectedAll : function(){           //select all items
		var isSelect = this.byId("selectedAll");
		var productList = this.byId("ProductList");
		var totalPrice = this.byId("totalPrice");
		var CheckOut = this.byId("CheckOut");
		
		var items = productList.getItems();
		var i = items.length-1;
		if(isSelect.getSelected()){			//when id('selectAll') is checked
			while(i>=0){
				if(items[i].getSelected()){//if there are some items are selected? then continue
					i--;
					continue;
				}
				items[i].setSelected(true);
				this.selectItem(items[i]);	//call selectItem(itemId) to handle the TotalPrice
				i--;
			}
		}else{								//when id('selectAll') is not checked
			while(i>=0){
				items[i].setSelected(false);
				this.selectItem(items[i]);
				i--;
			}
			totalPrice.setText("Total: 0 ");
			CheckOut.setText("Checkout(0)");
		}
	},
	selectItem : function(item){//
	    var itemId = item.getId();
		var priceId = "price"+itemId.substring(7);
 		var plusId = "plus"+itemId.substring(7);
 		var minuId = "minu"+itemId.substring(7);
 		var plus = this.byId(plusId);
 		var minu = this.byId(minuId);
 		var price = parseFloat(this.byId(priceId).getText());//each item totalprice
 		var tPrice = this.byId("totalPrice");
 		var totalPrice = parseFloat(tPrice.getText().split(" ")[1]);//Total: 0 EUR
 		var check = this.byId("CheckOut");
 		var checkout = parseInt(check.getText().replace(/[^0-9]/ig,""));//Checkout(0)
		totalPrice += price;
		checkout += 1;
		if(item.getSelected()){
			plus.setEnabled(false);
			minu.setEnabled(false);
		}
		else{
			plus.setEnabled(true);
			minu.setEnabled(true);
		}
 		check.setText("Checkout("+checkout+")");	
 		tPrice.setText("Total: "+totalPrice.toFixed(2)+" EUR");
	},
	onBack: function(){//back to pre_page
		 this.app = sap.ui.getCore().byId("theApp");
		 this.app.back();
	},
	toDetail : function(){  //view product detail info 
		alert("toDetail");
	},
	formatName : function(info){  //handle info and get product name
		var infoFormat = info.replace(/"/ig,"@!");
		var name = infoFormat.split("@!")[3];
		return name;
	},
	formatSize : function(info){  //handle info and get product size
		var infoFormat = info.replace(/"/ig,"@!");
		var name = infoFormat.split("@!")[3];
		var infoSize = name.split(" ");
		var size = infoSize[infoSize.length-1];
		return "Size : "+size;
	},
});