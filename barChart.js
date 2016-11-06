
(function(w) {
	w.Chart = function (obj) {
		this.obj = obj;
		this.ct = this.obj.getContext("2d");
		this.rect = {
			x1: 240,
			y1: 60,
			h: 900,
			w: 1200
		}
	}
	Chart.prototype = {
		constructor: Chart,
		init: function(data){
			this.obj.width = 1600;
			this.obj.height = 1200;
			this.initChart(data);
			this.fillChart(data);
		},
		// 工具方法  tween
		easeBoth:  function(t, b, c, d) {
			if ((t/=d/2) < 1) {
		    	return c/2*t*t + b;
			}
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},

		// 写入图表背景填充
		getPattern: function(){
			var data = { rect: 60, color:"tan"};
			var c = document.createElement("canvas");
			c.height = data.rect,
			c.width = data.rect;
			var ct = c.getContext("2d");
			ct.beginPath();
			ct.moveTo(0,0);
			ct.lineTo(0,data.rect);
			ct.moveTo(0,0);
			ct.lineTo(data.rect,0);
			
			ct.save();
			ct.strokeStyle = data.color;
			ct.strokeWidth = 1;
			ct.stroke();
			ct.restore();
			return c;
		},

		// 根据传入的数据 生成  坐标轴的 坐标位置 和  文本标记
		getPoint: function(data) {
			var len = data.stuffend ? data.items.length - 1 : data.items.length;
			var each = Math.round( data.width / len );
			return data.items.map(function(e,i){
				return {
					pos: i * each,
					text: data.items[i]
				}
			})
		},


		// 根据传入的数据 生成  数据对象 在运动的时候调用 tween
		getPartcles: function(data){
			return data.data.map(function(e,i){
				return {

					b: 0,
					c: e / data.itemsY[data.itemsY.length - 1] * this.rect.h,
					d: 200,
					t: -10 - 10*i
				}
			},this);
		},

		//  初始化表格 
		initChart: function(data){
			// 绘图区的背景 填充
			this.initCoordinate(this.getPattern());
			// 坐标轴的初始化_AxisX

			// 这个坐标需要存起来
			this.pointX = this.getPoint({
				items: data.itemsX,
				width: this.rect.w,
				stuffend: false
			});

			this.pointY = this.getPoint({
				items: data.itemsY,
				width: -this.rect.h,
				stuffend: true
			});
			this.drawAxisX(this.pointX);
			// 坐标轴的初始化_AxisY
			this.drawAxisY(this.pointY);
			this.drawLegend(data.legend)
		},

		// 数据的绘制
		fillChart: function(data){
			var _p = null;
			var arr = this.getPartcles(data);
			var _this =  this;
			console.log(arr)
			this.ct.fillStyle = data.legend.color;
			drawColumn();
			function drawColumn(){
				_this.ct.clearRect(0,0,_this.obj.width,_this.obj.height);
				_this.initChart(data);
				for (var i = 0; i < arr.length; i++) {
					_p = arr[i];
					if ( _p.t < _p.d ) {
						_p.t ++;
						if ( _p.t >= 0 ) {
							_p._c = Math.round(_this.easeBoth(_p.t,_p.b,_p.c,_p.d));
							_this.ct.fillRect( _this.pointX[i].pos + _this.rect.x1 + 60, _this.rect.h + _this.rect.y1 - _p._c , 100, _p._c );
						}
					}else {
						_this.ct.fillRect( _this.pointX[i].pos + _this.rect.x1 + 60, _this.rect.h + _this.rect.y1 - _p._c , 100, _p._c );
					}
				};
				requestAnimationFrame(drawColumn);
			}
		},

		// 初始化背景填充
		initCoordinate: function(pattern) {
			var pt = this.ct.createPattern( pattern,"repeat");
			this.ct.save();
			this.ct.fillStyle = pt;
			this.ct.fillRect( this.rect.x1, this.rect.y1, this.rect.w + 1, this.rect.h + 1);
			this.ct.restore();
		},

		// 初始化坐标系 AxisX
		drawAxisX: function(arr){
			this.ct.save();
			this.ct.fillStyle = "#999";
			this.ct.font = "normal 30px arial";
			this.ct.textAlign = "center";
			for (var i = 0; i < arr.length; i++) {
				this.ct.fillText( arr[i].text, arr[i].pos + this.rect.x1 + 100, 1000);
			};
			this.ct.restore();
		},

		// 初始化坐标系 AxisY
		drawAxisY: function(arr){
			this.ct.save();
			this.ct.fillStyle = "#999";
			this.ct.font = "normal 30px arial";
			this.ct.textAlign = "center";
			for (var i = 0; i < arr.length; i++) {
				this.ct.fillText( arr[i].text , this.rect.x1 - 80 , this.rect.h + this.rect.y1 + arr[i].pos + 12  );
			};
			this.ct.restore();
		},
		// 图例的绘制
		drawLegend: function(data){
			this.ct.save();
			this.ct.fillStyle = data.color;
			this.ct.fillRect( this.rect.w/2 + 40, this.rect.h + 160, 60, 40);
			this.ct.restore();
			this.ct.save();
			this.ct.fillStyle = "#333";
			this.ct.font = "normal 40px arial";
			this.ct.textAlign = "center";
			this.ct.textBaseline = "middle";
			this.ct.fillText(data.text, this.rect.w/2 + this.rect.x1, this.rect.h + 180);	
			this.ct.restore();
		}
	}
})(window)