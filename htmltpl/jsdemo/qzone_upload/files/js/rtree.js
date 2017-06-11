/*
**RTree 1.4.3
**作者：黄齐峰
**更新日期：09-7-13
**可以不断添加新功能
**1.0.0实现了树的基本功能
**1.1.0添加了类似dtree的添加节点函数
**1.1.0添加了背景图片拉伸的函数
**1.2.0改成了类的方式
**1.2.0修改了添加背景图片的方法
**1.2.0添加了初始化节点关闭状态
**1.3.0改变了生成的方式，由不断向节点innerHTML改为先
**生成树的全部HTML字符，最后一起innerHTML进容器
**速度提高极大。
**1.3.1添加了默认为文件夹图标
**1.3.2出现个问题，id为字符时候节点不能打开关闭
**老问题，以前解决过，估计升级时遗漏了最新版本
**在alertTree(id)里加上&quot;问题解决
**1.3.3双击节点打开关闭节点
**1.3.4进行了一点修正
**1.3.5添加了双击可选，与根是否绑事件的选项
**1.4.0添加了延迟加载的方式，在造树的过程中最花时间的是html代码的生成
**加载数据并不占多少时间，所以数据一次性加载，构造在点击节点后进行
**1.4.1添加了点击节点改变节点背景的方法，要与jquery一起使用
**1.4.2添加了rteeImgPath，这样以后改图片路径就轻松了
**1.4.3添加了自定义打开关闭图标。现在一共8个参数
*/
//所有图片的文件夹路径
var rteeImgPath="images/";
//rTree类
function rTree(objectName){

	this.obj=objectName;
	this.icons={plus:rteeImgPath+"nolines_plus.gif",minus:rteeImgPath+"nolines_minus.gif",empty:rteeImgPath+"empty.gif",
				joinLine:rteeImgPath+"join.gif",joinBottom:rteeImgPath+"joinbottom.gif",line:rteeImgPath+"line.gif",
				plusLine:rteeImgPath+"plus.gif",minusLine:rteeImgPath+"minus.gif",plusBottom:rteeImgPath+"plusbottom.gif",
				minusBottom:rteeImgPath+"minusbottom.gif"};
	this.folder={fopen:rteeImgPath+"folderopen.gif",fclose:rteeImgPath+"folderclose.gif"};
	this.list=[];
	this.treeMap=[];
	this.hasBgImg=false;
	this.bgSrc=null;
	this.treeStr="";
	//根是否可以双击改变状态
	this.nodedbc=true;
	//根是否要绑定事件
	this.nodehref=true;
	//是否使用延迟加载，延迟加载的话，节点默认都是关闭
	this.lazy=false;
	//是否使用点击节点改变节点背景
	this.alterbg=false;
};

//设置根的几个属性
rTree.prototype.setNodedbc=function(bool){
	this.nodedbc=bool;
}
rTree.prototype.setNodehref=function(bool){
	this.nodehref=true;
}
rTree.prototype.setLazy=function(bool){
	this.lazy=bool;
}
rTree.prototype.canAlterbg=function(bool){
	this.alterbg=bool;
}

//节点
//参数 id，父id，显示字符，关闭时图片路径，打开时图片路径，href的路劲/调的js方法，目标，是否关闭（lazy=true时无效）
function leaf(id,pid,value,src1,src2,url,target,isClose){

	this.id=id;
	this.pid=pid;
	this.value=value;
	//自定义图标的设置
	//没有一号图标，就使用默认的文件夹图标
	if(!src1){
		this.src1=rteeImgPath+"folderclose.gif";
		this.src2=rteeImgPath+"folderclose.gif";
	}
	//有一号图标，看2号有没有，没有的话2号图标等于自定义图标1
	else if(src1){
		this.src1=src1;
		this.src2=src2?src2:src1;
	}
	this.url=url?url:null;
	this.target=target?target:null;
	this.isClose=isClose?isClose:false;
};
//添加节点
rTree.prototype.add=function(id,pid,value,src,url,target,isClose){

	this.list[id] = new leaf(id,pid,value,src,url,target,isClose);
};
//转换成需要的数据类型
rTree.prototype.toTreeMap=function(){
	for(i in this.list){
		var id=this.list[i].id;
		var pid=this.list[i].pid;
		if(this.treeMap[pid]==null){
			this.treeMap[pid]=[];
		}
		this.treeMap[pid][id]=this.list[i];
	}
};
//造树
rTree.prototype.makeTreeHasLine=function(pid,leftHtml){

	var count=1;
	var size=this.sonSize(this.treeMap[pid]);
	for(id in this.treeMap[pid]){
		//当使用延迟加载后，treeMap中的单个节点会多一个marginLeft键
		//遇到时跳过
		if(this.lazy==true&&id=="marginLeft"){
			continue;
		}
		
		//父节点Div，1.2.0版本要使用的对象，现在已经过时
		//father=document.getElementById("tDiv"+pid);
		//有子元素
		hasSon=false;
		//是否时底部，当使用了延迟加载后，在不是最根节点的情况下，size要-1
		isBottom=(this.lazy&&pid!=0)?(count==size-1):(count==size);
		//判断是否有子节点
		if(this.treeMap[id]!=null){
			hasSon=true;
		}
		//节点对象
		node=this.treeMap[pid][id];
		dkey="tDiv"+id;
		ikey="tImg"+id;
		//图标的id
		ikeyT="tImgT"+id;
		marginLeft=leftHtml;
		useMinus=isBottom?this.icons.minusBottom:this.icons.minusLine;
		useLine=isBottom?this.icons.joinBottom:this.icons.joinLine;
		//控制按钮
		control=hasSon?"<img src='"+useMinus+"' id='"+ikey+"' onclick='"+this.obj+".alterTree(&quot;"+id+"&quot;)' class='croImg'/>":"<img src='"+useLine+"'/>";
		src=node.src1;
		if(hasSon&&!(this.lazy||node.isClose)){
			src=node.src2;
		}
		//图标
		icon="<img id='"+ikeyT+"' src='"+src+"' style='height:18px;width:18px'/>";
		//内容与跳转目标
		target=node.target?"target='"+node.target+"'":"";
		dbclick="";
		
		if(this.nodedbc){
			dbclick="ondblclick='"+this.obj+".alterTree(&quot;"+id+"&quot;)'";
		}
		rootHref="";
		if(this.nodehref&&hasSon){
			rootHref="href='"+node.url+"' ";
		}
		if(node.url){
			title=(!hasSon)?"<span class='treeTitle' ><a href='"+node.url+"' "+target+" onclick='point(this)'>"+node.value+"</a></span>"
				:"<span class='treeTitle' "+dbclick+"><a "+rootHref+" "+target+" onclick='point(this)'>"+node.value+"</a></span>";
		}else{
			title=(!hasSon)?"<span class='treeTitle'>"+node.value+"</span>":"<span class='treeTitle' "+dbclick+">"+node.value+"</span>";
		}
		
		//拼接
		str=marginLeft+control+icon+title+"<br>"+(hasSon?"<div id='"+dkey+"' style='display:block'>":"");
		//由于要使用文件夹格式，临时改成这样，默认全是关闭的文件夹图标
		//有子节点，默认是打开，所以换成打开的坐标图片
		if(hasSon&&(this.lazy||node.isClose)){
			//层隐藏，图标加号
			str=str.replace("block","none");
			str=str.replace("minus","plus");
		}	
		this.treeStr+=str;
		if(hasSon){
			useEmpty=isBottom?this.icons.empty:this.icons.line;
			marginLeft+="<img src='"+useEmpty+"'/>";
			if(this.lazy){
				this.treeMap[id]["marginLeft"]=marginLeft;
			}else{
				this.makeTreeHasLine(id,marginLeft);
			}
			this.treeStr+="</div>";
		}
		count++;
	}
};
//子元素的数量
rTree.prototype.sonSize=function(map){

	var size=0;
	for(obj in map){
		size++;
	}
	return size;
};
//改变节点的显示与隐藏
rTree.prototype.alterTree=function(id){

	divTarget=document.getElementById("tDiv"+id);
	if(divTarget.style.display=="block"){
		this.closeNode(id);
	}else{
	    //this.openNode(id);
	}
};
//打开节点
rTree.prototype.openNode=function(id){
	var divTarget=document.getElementById("tDiv"+id);
	var imgTarget=document.getElementById("tImg"+id);
	var iconTarget=document.getElementById("tImgT"+id);
	divTarget.style.display="block";
	//不管是哪种类型的加减号，转换字符串就行了
	imgTarget.src=imgTarget.src.replace("plus","minus");
	//文件夹图标的打开
	iconTarget.src=this.list[id].src2;
	if(this.lazy==true&&divTarget.innerHTML==''){
		this.treeStr="";
		this.makeTreeHasLine(id,this.treeMap[id]["marginLeft"]);
		divTarget.innerHTML+=this.treeStr;
		
		if(this.alterbg){
			alterBg();
		}
	}
};
//关闭节点
rTree.prototype.closeNode=function(id){

	var divTarget=document.getElementById("tDiv"+id);
	var imgTarget=document.getElementById("tImg"+id);
	var iconTarget=document.getElementById("tImgT"+id);
	divTarget.style.display="none";
	imgTarget.src=imgTarget.src.replace("minus","plus");
	//文件夹图标的关闭
	iconTarget.src=this.list[id].src1;
	
};


//使用背景图片
rTree.prototype.useBgImg=function(src){

	this.bgSrc=src;
	this.hasBgImg=true;
};
//开始树的生成
rTree.prototype.startTree=function(){

	var mainDiv=document.getElementById("main");
	this.treeStr="<div id='tDiv0' >";
	if(this.hasBgImg){
		var bgStr='<img src="'+this.bgSrc+'" width="100%" height="100%" style="position:absolute;z-index:-1;"/>';
		mainDiv.innerHTML=bgStr+mainDiv.innerHTML;
	}
	this.toTreeMap();
	this.makeTreeHasLine(0,"");
	this.treeStr+="</div>";
	mainDiv.innerHTML+=this.treeStr;
	if(this.alterbg){
		alterBg();
	}
};