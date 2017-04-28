
(function(){
	function menuBody(id,name,ifvalidate,defaultLable,defaultValue){ 
		var htmlstr = '<div class="dropdown myMenu">'+
			'<div class="input-group">'+
				'<input type="text" readonly="readonly" class="form-control validate_spical '+ifvalidate+'" value="'+defaultLable+'"/>'+ 
				'<input name="' + name + '" type="hidden" value="'+defaultValue+'"/> '+
				'<span class="input-group-addon"> '+
					'<i class="fa fa-angle-down"></i>'+
				'</span>'+
			'</div>'+
			'<div class="dropdown-menu">'+
				'<div class="treeMenu">'+
					'<ul id="menuTree-'+ id +'" class="ztree ztree-basic" style="min-height: 0"></ul>'+
				'</div>'+
				'<div class="menuButtonBar menubuttons">'+
					'<a class="dropdown-cfm">确定</a>'+
					'<!-- data-choiseMode 设置是否只有最末尾节点执行动作 分别为：all、rootOnly-->'+
					'<a class="dropdown-cnl">清除</a>'+
				'</div>'+
			'</div>'+
		'</div>';
		return $(htmlstr);
	}
	
	var setting = {
		view:{selectedMulti:false,dblClickExpand:false},
//		check:{enable:"${checked}",nocheckInherit:true},
		data:{simpleData:{enable:true}},
		callback:{
			onClick:function(event, treeId, treeNode){
				console.log(treeId);
			},
//			onCheck: function(e, treeId, treeNode){
//				var nodes = tree.getCheckedNodes(true);
//				for (var i=0, l=nodes.length; i<l; i++) {
//					tree.expandNode(nodes[i], true, false, false);
//				}
//				return false;
//			},
//			onAsyncSuccess: function(event, treeId, treeNode, msg){
//				var nodes = tree.getNodesByParam("pId", treeNode.id, null);
//				for (var i=0, l=nodes.length; i<l; i++) 
//				{
//					try{tree.checkNode(nodes[i], treeNode.checked, true);}catch(e){}
//					//tree.selectNode(nodes[i], false);
//				}
//				//selectCheckNode();
//			},
//			onDblClick: function()
//			{
//				$this.parents(".dropdown").find("a[class='dropdown-cfm']").trigger("click");
//			}
		}
	};
	
	treeMenu = function(settings){
		this.id = settings.id;
		this.altname = settings.altname;
		this.dataloadedfunc = settings.dataloaded;
		this.menuBody = menuBody(settings.id,settings.name,settings.ifvalidate,settings.defaultLable,settings.defaultValue);
		var treethis = this;
		$("#"+this.id).append(this.menuBody);
		this.unload = true;
		
		this.menuBody.find(".input-group").click(function(){
			treethis.clickToDisapear();
			if(treethis.unload){
				treethis.loadAjaxData(settings.url);
			}
			var menu = treethis.menuBody.find(".dropdown-menu");
			if (menu.is(":hidden"))
			{
				$(".dropdown-menu").hide();
				menu.show();
			}else
			{
				menu.hide();
			}
		});
		this.menuBody.find('.dropdown-cfm').click(function(){
			treethis.clickOkButton();
		});
		this.menuBody.find('.dropdown-cnl').click(function(){
			treethis.clickCancelButton();
		});
	}
	
	treeMenu.prototype.clickToDisapear = function(){
		$(document).click(function()
		{
			$(".dropdown-menu").hide();
		});
		$('.dropdown').click(function(e)
		{
			e.stopPropagation();
		});
	}
	treeMenu.prototype.loadAjaxData = function(url){
		// 点击加载数据
		var thistree = this;
		$.get(url, function(zNodes){
			// 初始化树结构
			// zNodes = [
			// 	{
			// 		id : Math.random(),
			// 		bankName : "111"
			// 	},
			// 	{
			// 		id : Math.random(),
			// 		bankName : "222"
			// 	},
			// 	{
			// 		id : Math.random(),
			// 		bankName : "333",
			// 		children : [
			// 			{
			// 				id : Math.random(),
			// 				name : "333111"
			// 			}
			// 		]
			// 	},
			// ]

			
			//console.log(zNodes);
			thistree.treeul = thistree.menuBody.find("#menuTree-"+thistree.id);
			// 修改名称字段
			thistree.dataloadedfunc();
			if(thistree.altname){
				zNodes.forEach(function(node){
					node.name = node[thistree.altname];
				});
			}
			thistree.tree = $.fn.zTree.init(thistree.treeul, setting, zNodes);
			thistree.unload = false;
		});
	}
	
	treeMenu.prototype.clickOkButton = function(){
		var ids = [], names = [], nodes = [];
		nodes = this.tree.getSelectedNodes();
		for(var i=0; i<nodes.length; i++) 
		{
//			//<c:if test="${notAllowSelectRoot}">
//			if (nodes[i].level == 0)
//			{
//				alert("不能选择根节点（"+nodes[i].name+"）请重新选择");
//				return false;
//			}
//			//</c:if><c:if test="${notAllowSelectParent}">
//			if (nodes[i].isParent)
//			{
//				alert("不能选择父节点（"+nodes[i].name+"）请重新选择");
//				return false;
//			}
//			//</c:if>
			ids.push(nodes[i].id);
			names.push(nodes[i].name);//<c:if test="${!checked}">
//			break; // 如果为非复选框选择，则返回第一个选择  </c:if>
		}
		
		this.menuBody.find("input[type=text]").attr("value",names.join(","));
		this.menuBody.find("input[type=hidden]").attr("value",ids.join(",").replace(/u_/ig,""));
		this.menuBody.find(".dropdown-menu").hide();
	}
	
	treeMenu.prototype.clickCancelButton = function(){
		this.menuBody.find("input[type=text]").attr("value",'');
		this.menuBody.find("input[type=hidden]").attr("value",'');
		this.tree.cancelSelectedNode();
	}
	
})()
