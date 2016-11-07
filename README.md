## 条形图插件

### 说明

> 在线地址 <https://wonderff.github.io/myChart/>

这是一个原生的基于canvas的绘制图表的插件，这个插件功能比较简陋，只能生成简单的条形图，配置项参数也很少，来看这个数据

	var data = {
		title: {
			text: "战队数据分析",
		},
		itemsX: [ "上单","打野","中单","辅助","ADC"],
		itemsY: [ 0, 10000, 20000, 30000, 40000, 50000,60000,70000],
		series: [
			{
				legend: "对普通野怪造成的伤害",
				color: "#afeeee",
				data: [30423,65301,59591,25200,68214]
			},
			{
				legend: "对英雄造成的伤害",
				color: "#87cefa",
				data: [16423,45301,49591,10200,58214]
			},
			{
				legend: "对史诗野怪造成的伤害",
				color: "#00bfff",
				data: [12000,30024,39591,8000,50020]
			}
		]
	};
		
然后 `index.html` 引入这个插件
	
	// 生成图表对象，传入的参数为 canvas 元素  生成的canvas 长宽 比 为 4:3，可用 css 进行缩放
	var c = new Chart(document.querySelector("#chart1"));
	
	// init方法传入上面的图表配置项
	c.init(data);
	
这样我们就在页面中生成了一个 条形图，目前暴露出来的接口有限。

动画效果借助 `tween算法` 实现，动画采用了`requestAnimationFrame`方案，对于不支持的浏览器不做兼容，可自行使用 `polyfill`降级



