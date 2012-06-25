( function($) {
	
	$.fn["izspeedometer"] = function(options,arg2){
		if(typeof(options)=="string"){
			if(options=="setValue"){
				$(this).data("val",arg2);
			}
			return this;
		}
		
		return this.each( function(){
			// Standard init option stuff
			var opts	= $(this).data("options");
			if(!opts){
				  opts = $.extend({}, $.fn.izspeedometer.defaults, options);
			}else{
				$.extend(opts, options);
				$(this).data('options', opts);
			}
			/////////////////////////////////////
			// Lets render the speedometer
			if(opts.height=="auto"){
				opts.height=opts.width*1.3;
			}
			
			var p	= Raphael($(this).get(0),opts.width,opts.height);
			var cX	= opts.width/2;
			var cY	= 0;
			var r	= opts.width/2-1;
			var angle	= Math.PI*0.66;

			/////////////////////////////////////
			// Title
			cY+=6;
			p.text(cX,cY, opts.title).attr({
				"font-family":"Arial",
				"font-size":"12px",
				fill:opts.textColor
				});
			cY+=11;
			
			/////////////////////////////////////
			// Requirement arrow
			var arrowWidth	= 11;
			var arrowPath	=
					"M"+(cX-arrowWidth*0.5)+
					","+(cY)+
					"L"+(cX+arrowWidth*0.5)+
					","+(cY)+
					"L"+(cX)+
					","+(cY+arrowWidth/Math.SQRT2)+
					"Z"+
					"M"+(cX)+
					","+(cY+arrowWidth/Math.SQRT2)+
					"L"+(cX)+
					","+(cY+arrowWidth+opts.margin+opts.thickness)
					;
			cY+=arrowWidth;
			
			/////////////////////////////////////
			// Draw background
			cY	+= opts.width/2;
			p.path(
				"M"+(cX-r*Math.sin(angle))+
				","+(cY-r*Math.cos(angle))+
				"A"+r+
				","+r+
				" 0 1 1"+
				" "+(cX-r*Math.sin(-angle))+
				" "+(cY-r*Math.cos(-angle))+
				"A"+1.4*r+
				","+r+
				" 0 0 0"+
				" "+(cX-r*Math.sin(angle))+
				" "+(cY-r*Math.cos(angle))+
				"z"
				).attr({
					fill:"#fff",
					stroke: opts.borderColor,
					'stroke-width':1
				});

			

			angle	= Math.PI*0.64;
			var currentAngle	= angle;
			var valPath	= false;
			r	= opts.width/2-opts.margin-opts.thickness*0.5;
			
			/////////////////////////////////////
			// Draw bar background
			p.path(
					"M"+(cX-r*Math.sin(angle))+
					","+(cY-r*Math.cos(angle))+
					"A"+r+
					","+r+
					" 0 1 1"+
					" "+(cX-r*Math.sin(-angle))+
					" "+(cY-r*Math.cos(-angle))
					).attr({
						fill:"none",
						stroke:opts.barBackgroundColor,
						'stroke-width':opts.thickness
					});
			
			/////////////////////////////////////
			// Draw requirement arrow
			var arrowColor	= opts.requirementColor?opts.requirementColor:opts.barColor;
			p.path(arrowPath).attr({
				fill:arrowColor,
				stroke:arrowColor,
				'stroke-width':1
			});
			
			$(this).data('val',opts.value);
			var obj	= $(this);
			var drawText	= false;
			
			var pathInterval=setInterval( function(){
				if(!obj.data('val')){
					return;
				}
				var value	= obj.data('val');
				/////////////////////////////////////
				// Draw value (text)
				if(!drawText){
					drawText	= true;
					var unit	= value+opts.unit;
					if(typeof(opts.unit)=="function"){
						unit	= opts.unit(value);
					}
					
					p.text(cX,cY-r*0.4, unit ).attr({
						"font-family":"Arial",
						"font-size":"16px",
						"font-weight":"bold",
						fill:opts.barColor
						});
					p.text(cX,cY, opts.valueText ).attr({
						"font-family":"Arial",
						"font-size":"10px",
						fill:opts.textColor,
						width: 50
						});
				}
				
				
				/////////////////////////////////////
				// Animate value
				var val		= (value-opts.min)/(opts.max-opts.min);
				if(val>2){ val=2.0; }
				var valAngle	= angle*2*(1-val*0.5)-angle;
				
				if(currentAngle!=valAngle){
					currentAngle	= currentAngle+(valAngle-currentAngle)*0.1;
					if(Math.round(currentAngle*100)==Math.round(valAngle*100)){
						currentAngle=valAngle;
						clearInterval(pathInterval);
					}
					var largeCircle	= ((currentAngle-angle)*0.5 < (-Math.PI/2))?1:0;
					if(valPath){ valPath.remove();}
					valPath	= p.path(
						"M"+(cX-r*Math.sin(angle))+
						","+(cY-r*Math.cos(angle))+
						"A"+r+
						","+r+
						" 0 "+largeCircle+" 1"+
						" "+(cX-r*Math.sin(currentAngle))+
						" "+(cY-r*Math.cos(currentAngle))
						).attr({
							fill:"none",
							stroke:opts.barColor,
							'stroke-width':opts.thickness
						});
				}
			},30);				
		});
		
	};

	$.fn.izspeedometer.defaults = {
		title: 'Speedometer',
		min: 0,
		max: 100,
		value: null,
		unit: '%',
		valueText: '',
		width: 135,
		height: "auto",
		thickness: 6,
		margin:4,
		barColor: "#79bfa8",
		requirementColor: false,
		barBackgroundColor: "#efefef",
		borderColor: "#d7d7d7",
		textColor: "#666"
	};
	
})(jQuery);