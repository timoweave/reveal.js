
var ranges = function() {
  var r = []; // list of [index, size]

  r.push.apply(r, [5, 6]); 
  r.push.apply(r, [5, 10]);
  r.push.apply(r, [5, 10]);
  r.push.apply(r, [5, 10]);
  r.push.apply(r, [9, 6]);

  r.push.apply(r, [1, 10]);
  r.push.apply(r, [9, 10]);

  r.push.apply(r, [1, 10]);
  r.push.apply(r, [9, 10]);

  r.push.apply(r, [1, 10]);
  r.push.apply(r, [9, 10]);

  r.push.apply(r, [1, 6]);
  r.push.apply(r, [13, 10]);
  r.push.apply(r, [13, 10]);
  r.push.apply(r, [13, 10]);
  r.push.apply(r, [13, 6]);

  return r;
}

var points = function(w, h, o, t) {
  var dw = (w - 2 * o) / t;
  var dh = (h - 2 * o) / t;
  
  var p = []

  for (var i = 0; i <= t ; ++i) {
    var dx = i*dw;
    var dy = 0;
    p.push.apply(p, [dx, dy]);
  }

  for (var j = 1; j <= t ; ++j) {
    var dx = t*dw;
    var dy = j*dh;
    p.push.apply(p, [dx, dy]);
  }

  for (var i = t - 1; 0 <= i ; --i) {
    var dx = i*dw;
    var dy = t*dh;
    p.push.apply(p, [dx, dy]);
  }

  for (var j = t - 1; 0 < j ; --j) {
    var dx = 0;
    var dy = j*dh;
    p.push.apply(p, [dx, dy]);
  }

  return p;

}

var mouse_in = function() {
  console.log("mouse in");
  this.animate({"stroke": "white", "fill": "white"}, 100, ">");
};
var mouse_out = function() {
  console.log("mouse out");
  this.animate({"stroke": "white", "fill": "white"}, 100, ">");
};

var corner = function(paper, color, p, t, i, s0, s1) {

  var j0 = i;
  var j1 = s0[0];

  var j = Math.floor(Math.random()*2);
  if (j == 1){
    j1 = s1[0];
    s1.splice(0, 1);
  } else {
    s0.splice(0, 1);	
  }

  var x0 = p[j0*2];
  var y0 = p[j0*2+1];
  var x1 = p[j1*2];
  var y1 = p[j1*2+1];
  var line = paper.path("M " + x0 + "," + y0 + " L " + x1 + "," + y1);

  line.attr({"stroke-width": (Math.random() * t+0.1), "stroke" : "white"});
  return line;
}

var cross = function(paper, color, p, t, s0, s1, s2, s3) {

  var s = [s0, s1, s2, s3];
  var max1 = 0;

  for (var i=0; i < 4; i++) {
    if (s[i].length != 0) {
      max1 = i;
    }
  }

  for (var i=0; i < 4; i++) {
    if ((0 != s[i].length) && (max1 != i) && (s[i].length > s[max1].length)) {
      max1 = i;
    }
  }

  var j0 = max1;
  var j1 = Math.floor(Math.random() * s.length);
  if ((j1 == j0) || (s[j1].length == 0)) {
    j1 = (Math.floor(Math.random() * s.length));
    while ((j1 == j0) || (s[j1].length == 0)) {
      j1 = (Math.floor(Math.random() * s.length));
    }
  }

  var j_0 = s[j0][0];
  var j_1 = s[j1][0];
  s[j0].splice(0,1);
  s[j1].splice(0,1);

  var x0 = p[j_0*2];
  var y0 = p[j_0*2+1];
  var x1 = p[j_1*2];
  var y1 = p[j_1*2+1];
  var line = paper.path("M " + x0 + "," + y0 + " L " + x1 + "," + y1);

  line.attr({"stroke-width": (Math.random() * t+0.1), "stroke" : "white"});
  return line;
}

var lines = function(paper, p, r, t) {
  var bag = paper.set();
  bag.attr({"fill" : "transparent"});
  var len = p.length/2;
  
  var color = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink'];
  var s = [[1, 2, 3],
	   [5, 6, 7],
	   [9, 10, 11],
	   [13, 14, 15]];
  
  for (var i = 0 ; i < 4; i++ ) {
    s[i].sort(function() {return 0.5 - Math.random()});
  }
  for (var i = 0 ; i < 4; i++ ) {
    var c = corner(paper, color, p, t, (i*4), s[(i+1)%4], s[(i+2)%4]);
    bag.push(c);
  } 

  for (var i = 0 ; i < 4; i++ ) {
    var x = cross(paper, color, p, t, s[0], s[1], s[2], s[3]);
    bag.push(x);
  }
  return bag;
}

var dots = function(paper, p, t) {
  var bag = paper.set();
  bag.attr({"fill" : "transparent"});
  for (var i = 0; i <= p.length/2; ++i) {
    var j = i*2;
    var dx = p[j];
    var dy = p[j+1];
    var d = paper.circle(dx, dy, 0.0);
    // Math.floor(Math.random() * t));
    // d.attr({fill: "lightgrey"});
    bag.push(d);
  }
  return bag;
}

var box = function(paper, w, h, t, o, p, r) {
  var bag = paper.set();
  bag.attr({"fill" : "transparent"});
  var frame = paper.rect(0, 0, w, h);
  frame.attr({"stroke": "white", "fill": "transparent", "stroke-width": 0.1});
  bag.push(frame);
  // frame.pair.push(frame);
  var d = dots(paper, p, t);
  d.translate(o,o);
  bag.push(d);
  // bag.pair.push(d);
  var l = lines(paper, p, r, t);
  l.translate(o,o);
  bag.push(l);
  // // bag.pair.push(l);
  // var start = function () {
  // 	console.log("start");
  //     this.ox = this.attr("x");
  //     this.oy = this.attr("y");
  // 	this.strokeWidth = this.attr("stroke-width");
  //     this.animate({"stroke-width": this.strokeWidth*2}, 100, ">");
  // };
  // var move = function (dx, dy) {
  // 	console.log("move");
  //     // this.attr({x: this.ox + dx, y: this.oy + dy});
  // 	var destination = "t" + this.ox + dx + "," + this.oy + dy ;
  // 	this.transform(destination);
  // };
  // var up = function () {
  // 	console.log("up");

  //     this.animate({"stroke-width": this.strokeWidth}, 100, ">");
  // };

  // bag.mouseover(mouse_in);
  // bag.mouseout(mouse_out);
  // bag.drag(move, start, up);
  //l.drag(move, start, up);

  // bag.transform("t10,100r15");
  return bag;
}

var changes = function(paper, t) {
  return;
  paper.forEach(function(elem) {
    var width = Math.floor(Math.random()*t);
    var time = Math.floor(Math.random()*t);
    elem.animation({
      "stroke-width": width,
      opacity: 1
    }, time).repeat(Infinity);
  });
}

function make_shuffles(element, times) {
  var paper = Raphael(element, window.innerHeight*0.8, (window.innerHeight*0.8), function() {
                // console.log("canvas raphael", this);
                var g = this.set();
                g.attr({"fill" : "transparent"});

                var t = 8.0;
                var w = (window.innerHeight*0.8)/times;
                var h = (window.innerHeight*0.8)/times;
                var o = w/10;

                var p = points(w, h, o, 4);
                var r = ranges();

                var f = this.rect(0, 0, w*times, h*times);
                f.attr({stroke: "white", "stroke-width": 0.2 });
                g.push(f);

                for (var i = 0; i <= times ; ++i) {
	          for (var j = 0; j <= times ; ++j) {
	            var x = i*w;
	            var y = j*h;
	            var b = box(this, w, h, t, o, p, r);
	            b.translate(x, y);
	            g.push(b);
	          }
                }
              });
}

make_shuffles("canvas_4x4", 4);
make_shuffles("canvas_6x6", 6);
make_shuffles("canvas_8x8", 8);
make_shuffles("canvas_10x10", 10);
make_shuffles("canvas_12x12", 12);


