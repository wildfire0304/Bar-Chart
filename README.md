## 条形图插件

### 说明

> 在线地址 <https://wonderff.github.io/myChart/>

这是一个原生的基于canvas的绘制图表的插件，这个插件功能比较简陋，只能生成简单的条形图，配置项参数也很少，来看这个数据


	var data = {
		// legend: 图例的名称  和  条形图的颜色
		legend: {
			text: "输出伤害",
			color: "#f08080"
		}, 
		// itemsY: Y坐标轴内容
		itemsY: [ 0, 10000, 20000, 30000, 40000, 50000,60000,70000],
		// itemsX: X坐标轴内容，即数据名称
		itemsX: [ "上单","打野","中单","辅助","ADC","对面","野怪"],
		// 数据  
		data: [ 16423,25301,39591,10200,48214,35345,22572],
	};
		
然后 `index.html` 引入这个插件
	
	// 生成图表对象， 传入的参数为 canvas 元素  生成的canvas 长宽 比 为 4:3，可用 css 进行缩放
	var c = new Chart(document.querySelector("#chart1"));
	
	// init方法传入上面的图表配置项
	c.init(data);
	
这样我们就在页面中生成了一个 条形图，目前暴露出来的接口有限。



