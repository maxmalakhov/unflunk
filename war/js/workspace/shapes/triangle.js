	function Triangle(board, p1, p2, p3) {
        var points = [];
		this._p1 = p1 || [50.0, 50.0];
		this._p2 = p2 || [200.0, 50.0];
		this._p3 = p3 || [200.0, 250.0];
		
		var triangle = this;
		
		this._p1 = board.create('point', this._p1,
				  { name : function() {
					  return JXG.Math.Geometry.trueAngle(triangle._p2, triangle._p1, triangle._p3).toFixed(2) + "&deg;";
				  },size:0.5
			  });
		this._p2 = board.create('point', this._p2,
				  { name : function() {
					  return JXG.Math.Geometry.trueAngle(triangle._p3, triangle._p2, triangle._p1).toFixed(2) + "&deg;";
                  },size:0.5
			  });
		this._p3 = board.create('point', this._p3,
				    { name : function() {
					  	return JXG.Math.Geometry.trueAngle(triangle._p1, triangle._p3, triangle._p2).toFixed(2) + "&deg;";
                    },size:0.5
				});

		this._polygon = board.create('polygon', [this._p1, this._p2, this._p3], { hasInnerPoints : true });
        points.push(this._p1);
        points.push(this._p2);
        points.push(this._p3);
        this._polygon.points = points;
		
		this._midpoint1 = board.create('midpoint', [this._p1, this._p2],
				  { size: 0, name : function() { 
					  return JXG.Math.Geometry.distance([triangle._p1.X(), triangle._p1.Y()], [triangle._p2.X(), triangle._p2.Y()]).toFixed(2);
						} 
				  });
		this._midpoint2 = board.create('midpoint', [this._p2, this._p3],
				  { size: 0, name : function() { 
					  return JXG.Math.Geometry.distance([triangle._p2.X(), triangle._p2.Y()], [triangle._p3.X(), triangle._p3.Y()]).toFixed(2);
						} 
				  });
		this._midpoint3 = board.create('midpoint', [this._p3, this._p1],
				  { size: 0, name : function() { 
					  return JXG.Math.Geometry.distance([triangle._p3.X(), triangle._p3.Y()], [triangle._p1.X(), triangle._p1.Y()]).toFixed(2);
						} 
				  });

		this.addSnapEvent(this._p1, this._p2, this._p3);
		this.addSnapEvent(this._p3, this._p1, this._p2);
		this.addSnapEvent(this._p2, this._p3, this._p1);

        return this._polygon;
	}
	

	Triangle.prototype.setProperty = function(params) {
		this._polygon.setProperty(params);
	}
	
	Triangle.prototype.hasPoint = function(x, y) {
		return this._polygon.hasPoint(x, y) || this._p1.hasPoint(x,y) || this._p2.hasPoint(x,y) || this._p3.hasPoint(x,y);
	}
	
	Triangle.prototype.addSnapEvent = function(p1, p2, p3) {
		  p3.on('mouseup', function() {
		    	var d1 = JXG.Math.Geometry.distance([p1.X(), p1.Y()], [p2.X(), p2.Y()]);
		    	var angle = JXG.Math.Geometry.rad([p1.X()+1, p1.Y()], [p1.X(), p1.Y()], [p2.X(), p2.Y()]);
		    	var p2_origin_x = p2.X()-p1.X();
		    	var p2_origin_y = p2.Y()-p1.Y();  //  adjust to be relative to the origin
		    	var p2_rotated_x = p2_origin_x*Math.cos(-angle) - p2_origin_y*Math.sin(-angle);
		    	var midpoint_x = p2_rotated_x/2;
		    	var quarterpointX_1 = p2_rotated_x/4;
		    	var quarterpointX_2 = p2_rotated_x*3/4;
		    	
		    	//TODO: account for rotation of borders[0]
		    	var attractors = new Array();
		    	
		    	// 30-degree attractor
		    	var a_distance = Math.sqrt(3)*d1;
		    	attractors.push({x: 0, y: a_distance});
		    	attractors.push({x: p2_rotated_x, y: a_distance});
		    	attractors.push({x: 0, y: -a_distance});
		    	attractors.push({x: p2_rotated_x, y: -a_distance});
		    	
		    	// 60-degree (for 30-60-90) attractor
		    	a_distance = Math.sqrt(3)/3*d1;
		    	attractors.push({x: 0, y: a_distance});
		    	attractors.push({x: p2_rotated_x, y: a_distance});
		    	attractors.push({x: 0, y: -a_distance});
		    	attractors.push({x: p2_rotated_x, y: -a_distance});
		    	
		    	// 90-degree (for 30-60-90) attractor
		    	a_distance = Math.sqrt(3)/4*d1;
		    	attractors.push({x: quarterpointX_1, y: a_distance});
		    	attractors.push({x: quarterpointX_2, y: a_distance});
		    	attractors.push({x: quarterpointX_1, y: -a_distance});
		    	attractors.push({x: quarterpointX_2, y: -a_distance});
		    	
		    	// 45-degree attractor
		    	a_distance = d1;
		    	attractors.push({x: 0, y: a_distance});
		    	attractors.push({x: p2_rotated_x, y: a_distance});
		    	attractors.push({x: 0, y: -a_distance});
		    	attractors.push({x: p2_rotated_x, y: -a_distance});
		    	
		    	// 90-degree (for 45-45-90) attractor
		    	a_distance = d1*.5;
		    	attractors.push({x: midpoint_x, y: a_distance});
		    	attractors.push({x: midpoint_x, y: -a_distance});
		    	
		    	// 60-degree attractor
		    	a_distance = d1*Math.sqrt(3)/2;
		    	attractors.push({x: midpoint_x, y: a_distance});
		    	attractors.push({x: midpoint_x, y: a_distance});
		    	
		    	for ( var i = 0; i < attractors.length; i++ ) {
		    		var x = attractors[i].x;
		    		var y = attractors[i].y;
		    		attractors[i].x = x*Math.cos(angle)-y*Math.sin(angle) + p1.X();
		    		attractors[i].y = x*Math.sin(angle)+y*Math.cos(angle) + p1.Y();
		    		
		    		var distanceFromAttractor = JXG.Math.Geometry.distance([p3.X(), p3.Y()], [attractors[i].x, attractors[i].y]);
		    		if ( distanceFromAttractor < 5 ) {
		    			p3.moveTo([attractors[i].x, attractors[i].y]);
		    			return;
		    		}
		    	}
		    	
		    	var p3_origin_x = p3.X() - p1.X();
		    	var p3_origin_y = p3.Y() - p1.Y();
		    	var p3_rotated_x = p3_origin_x*Math.cos(-angle)-p3_origin_y*Math.sin(-angle);
		    	var p3_rotated_y = p3_origin_x*Math.sin(-angle)+p3_origin_y*Math.cos(-angle);
		    	if ( Math.abs(p2_rotated_x - p3_rotated_x) < 5 ) {
		    		p3_rotated_x = p2_rotated_x;
		    	} else if ( Math.abs(p3_rotated_x) < 5 ) {
		    		p3_rotated_x = 0;
		    	}
		    	
		    	p3_x = p3_rotated_x*Math.cos(angle) - p3_rotated_y*Math.sin(angle) + p1.X();
		    	p3_y = p3_rotated_x*Math.sin(angle) + p3_rotated_y*Math.cos(angle) + p1.Y();
		    	p3.moveTo([p3_x, p3_y]);
		    }, p3);
	};



