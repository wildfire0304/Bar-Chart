
(function(w) {
	w.Chart = function (obj) {
		this.obj = obj;
		this.ct = this.obj.getContext("2d");
		this.rect = {
			x1: 240,
			y1: 120,
			h: 900,
			w: 1200
		};
		this.animationId = null;
	};


	Chart.prototype = {
		constructor: Chart,
		init: function(data){
			this.obj.width = 1600;
			this.obj.height = 1200;
			this.distanceX = this.rect.w / data.itemsX.length;
			this.mousePos = {
				mouseX: 0,
				mouseY: 0
			}
			// 这个是  纵向比例尺      
			this.scaleY =  this.rect.h / data.itemsY[data.itemsY.length - 1]; 

			// 图标的  初始化
			this.initChart(data);

			// 这个是初始生成 数据的 对象

			this.fillChart(data);
			var _this = this;
			this.obj.addEventListener("mousemove", function(ev){
				_this.mousePos = _this.getMousePostion(ev);
				//console.log(_this.mousePos)
			}, false);
			
		},
		

		getMousePostion: function(ev){
			return {
				mouseX: (ev.pageX - chart1.getBoundingClientRect().left - document.body.scrollLeft )*2,
				mouseY: (ev.pageY - chart1.getBoundingClientRect().top - document.body.scrollTop )*2
			}
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
			// data.stuffend 端点是否填充
			var len = data.stuffend ? data.items.length - 1 : data.items.length;
			this.each = Math.round( data.width / len );
			return data.items.map(function(e,i){
				return {
					pos: i * this.each,
					text: data.items[i]
				}
			},this)
		},


		uploadParticles: function(data){
			return this.particles.map(function(e,i){
				return e.map(function(e,j){
					return {
						b: e._c || 0,
						c: Math.round( data[i].data[j] * this.scaleY ) - e._c,
						d: 200,
						t: 0
					}
				},this)
			},this)
		},


		// 根据传入的数据 生成  数据对象 在运动的时候调用 tween
		getPartcles: function(data){

			return data.map(function(e){
				return e.data.map(function(e,i){
					return {
						b: 0,
						c: Math.round( e * this.scaleY ),
						d: 200,
						t: -10 - 20*i
					}
				},this)
			},this)	
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
			this.drawLegend(data.series)
		},



		// 数据的绘制
		fillChart: function(data){
			var _p = null;
			this.particles = this.getPartcles(data.series);
			var _this =  this;
			drawColumn();
			function drawColumn(){
				_this.ct.clearRect(0,0,_this.obj.width,_this.obj.height);
				_this.initChart(data);
				var _p = null;
				// console.log(arr)
				for (var i = 0; i < _this.particles.length; i++) {
					
					for (var j = 0; j < _this.particles[i].length; j++) {
						_p = _this.particles[i][j];
						if ( _p.t < _p.d ) {
							_p.t ++;
							if ( _p.t >= 0 ) {
								
								_p._c = Math.round(_this.easeBoth(_p.t,_p.b,_p.c,_p.d));
								_this.ct.beginPath();
								_this.ct.rect( _this.pointX[j].pos + _this.rect.x1 + _this.distanceX/2 - 50, _this.rect.h + _this.rect.y1 - _p._c , 100, _p._c );

								_this.ct.closePath();
								
								
								_this.ct.save();
								_this.ct.fillStyle = data.series[i].color;
								_this.ct.fill();
								_this.ct.restore();
							}
						}else {
							_this.ct.beginPath();
							_this.ct.rect( _this.pointX[j].pos + _this.rect.x1 + _this.distanceX/2 - 50, _this.rect.h + _this.rect.y1 - _p._c , 100, _p._c );
							_this.ct.closePath();
							
							_this.ct.save();
							_this.ct.fillStyle = data.series[i].color;
							_this.ct.fill();
							_this.ct.restore();
							if (_this.ct.isPointInPath(_this.mousePos.mouseX,_this.mousePos.mouseY)) {
								_this.ct.clearRect(_this.mousePos.mouseX + 10, _this.mousePos.mouseY - 70 ,120,60);
								_this.ct.beginPath();
								_this.ct.fillStyle = "rgba(0,0,0,0.6)";
								_this.ct.fillRect(_this.mousePos.mouseX + 10, _this.mousePos.mouseY - 70 ,120,60);
								_this.ct.closePath();
								_this.ct.beginPath();
								_this.ct.fillStyle = "#fff";
								_this.ct.font = "normal 30px arial";
								_this.ct.textAlign = "center";
								_this.ct.textBaseline = "middle";
								_this.ct.fillText(data.series[i].data[j],_this.mousePos.mouseX + 70, _this.mousePos.mouseY - 40 );
								_this.ct.closePath();
							}
						};

					};
					
				};	
				_this.animationId = requestAnimationFrame(drawColumn);
			}
		},
		uploadData: function(data){
			cancelAnimationFrame(this.animationId);
			var _p = null;
			this.particles = this.uploadParticles(data.series);
			var _this =  this;
			drawColumn();
			function drawColumn(){
				_this.ct.clearRect(0,0,_this.obj.width,_this.obj.height);
				_this.initChart(data);
				var _p = null;
				// console.log(arr)
				for (var i = 0; i < _this.particles.length; i++) {
					_this.ct.save();
					_this.ct.fillStyle = data.series[i].color;
					for (var j = 0; j < _this.particles[i].length; j++) {
						_p = _this.particles[i][j];
						if ( _p.t < _p.d ) {
							_p.t ++;
							if ( _p.t >= 0 ) {
								_this.ct.beginPath();
								_p._c = Math.round(_this.easeBoth(_p.t,_p.b,_p.c,_p.d));
								_this.ct.rect( _this.pointX[j].pos + _this.rect.x1 + _this.distanceX/2 - 50, _this.rect.h + _this.rect.y1 - _p._c , 100, _p._c );
								_this.ct.closePath();
								_this.ct.save();
								_this.ct.fillStyle = data.series[i].color;
								_this.ct.fill();
								_this.ct.restore();

							}
						}else {
							_this.ct.beginPath();
							_this.ct.rect( _this.pointX[j].pos + _this.rect.x1 + _this.distanceX/2 - 50, _this.rect.h + _this.rect.y1 - _p._c , 100, _p._c );
							_this.ct.closePath();
							_this.ct.save();
							_this.ct.fillStyle = data.series[i].color;
							_this.ct.fill();
							_this.ct.restore();
							if (_this.ct.isPointInPath(_this.mousePos.mouseX,_this.mousePos.mouseY)) {
								_this.ct.clearRect(_this.mousePos.mouseX + 10, _this.mousePos.mouseY - 70 ,120,60);
								_this.ct.beginPath();
								_this.ct.fillStyle = "rgba(0,0,0,0.6)";
								_this.ct.fillRect(_this.mousePos.mouseX + 10, _this.mousePos.mouseY - 70 ,120,60);
								_this.ct.closePath();
								_this.ct.beginPath();
								_this.ct.fillStyle = "#fff";
								_this.ct.font = "normal 30px arial";
								_this.ct.textAlign = "center";
								_this.ct.textBaseline = "middle";
								_this.ct.fillText(data.series[i].data[j],_this.mousePos.mouseX + 70, _this.mousePos.mouseY - 40 );
								_this.ct.closePath();
							}
						};

					};
					_this.ct.restore();
				};	
				_this.animationId = requestAnimationFrame(drawColumn);
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
				this.ct.fillText( arr[i].text, arr[i].pos + this.rect.x1 + this.distanceX/2, this.rect.y1 + this.rect.h + 40);
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
			// console.log(data)
			//  n个 宽   100    
			var len = data.length;
			for (var i = 0; i < data.length; i++) {
				this.ct.save();
				this.ct.fillStyle = data[i].color;
				this.ct.fillRect( (this.obj.width)/2 - 30 + i*300 - 300*(len-1)/2, this.rect.h + this.rect.y1 + 70, 60, 40);
				this.ct.restore();
				this.ct.save();
				this.ct.fillStyle = "#666";
				this.ct.font = "normal 30px arial";
				this.ct.textAlign = "center";
				this.ct.textBaseline = "middle";
				this.ct.fillText(data[i].legend, (this.obj.width)/2 + i*300 - 300*(len-1)/2, this.rect.h + this.rect.y1 + 140);	
				this.ct.restore();	
			};		
		},
		easeBoth: function(t, b, c, d) {
			if ((t/=d/2) < 1) {
		    	return c/2*t*t + b;
			}
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	}
})(window)


