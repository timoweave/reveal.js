class Box {

  constructor(length=100, length_segments=5, shuffling=undefined) {

    this.side_length = length;
    this.side_length_segments = length_segments; // count
    this.pairs = this.init_pairs(); // [0] = i, [1] = i+1, ...
    this.points = this.init_points(); // [ [ [0,0], [d, 0], [2*d, 0], ...], [], [], [] ]
    this.shuffle(shuffling);
  }
  length() { return this.side_length; }
  length_segments() { return this.side_length_segments; }
  shuffle(shuffling /* integer or array */) {
    if (shuffling === undefined) {
      // no shuffling
      return;
    } else if (Array.isArray(shuffling) && (shuffling.length === this.side_length_segments*2)) {
      // given pattern
      this.pairs = shuffling;
      return;
    } else if (Number.isInteger(shuffling) && (shuffling === 0)) {
      // done shuffling
      return;
    } else if (Number.isInteger(shuffling)) {
      // shuffling number of times
      var beg1 = Math.floor(Math.random() * this.side_length_segments * 2);
      var beg2 = Math.floor(Math.random() * this.side_length_segments * 2);
      var end1 = this.pairs[beg1];
      var end2 = this.pairs[beg2];
      var a_ok = ((this.is_pairs_ok(beg1, end2)) &&
                  (this.is_pairs_ok(beg2, end1)) );
      if (a_ok) {
        var temp = this.pairs[beg1];
        this.pairs[beg1] = this.pairs[beg2];
        this.pairs[beg2] = temp;
        shuffling--;
      }
      this.shuffle(shuffling);
      return;
    }
  }

  is_pairs_ok(left, right) {
    if (left > right) {
      var swap_left = left; left = right; right = swap_left;
    }
    if ((right % this.side_length_segments) === 0) {
      right--;
    }
    if ((left === 0) && (right >= this.side_length_segments*3 - 1)) {
      right = 0;
    }

    var left_side = this.get_side(left);
    var right_side = this.get_side(right);
    return (left_side !== right_side);
  }

  get_side(number) {
    // top=0, right=1, bottom=2, left=3
    return Math.floor(number/ this.side_length_segments);
  }

  init_pairs() {
    var pairs = [];
    var size = this.side_length_segments * 2;
    for (var i = 0; i < size; i++) {
      pairs.push(size + i);
    }
    return pairs;
  }

  init_points() {
    var points = [];
    points = points.concat(this.make_points('top'));
    points = points.concat(this.make_points('right'));
    points = points.concat(this.make_points('bottom'));
    points = points.concat(this.make_points('left'));
    return points;
  }

  make_points(direction /* top=0, right=1, bottom=2, left=3 */) {

    var scale = [0.1, 0.8]; // [head/tail-scale, body-scale]
    var delta = (this.side_length / this.side_length_segments) * scale[1];
    var side = this.side_length * scale[1];
    var zero  = this.side_length * scale[0];

    var point = [0, 0];
    var points = [];
    for (var i = 0; i < this.side_length_segments; i++) {
      if ((direction === 0) || (direction === 'top')) {
        point = [ i * delta, 0 ];
      }
      if ((direction === 1) || (direction === 'right')) {
        point = [ side, i * delta ];
      }
      if ((direction === 2) || (direction === 'bottom')) {
        point = [ side - i * delta, side ];
      }
      if ((direction === 3) || (direction === 'left')) {
        point = [ 0, side - i * delta];
      }
      point[0] += zero;
      point[1] += zero;
      points.push(point);
    }
    return points;
  }

};

class RaphaelBox extends Box {

  constructor(element, length=100, length_segments=5, shuffling=undefined) {
    super(length, length_segments, shuffling);

    this.styles = {
      frame_color : "gray",
      frame_width : 0.5,
      line_color : "lightgrey",
      line_width : 2.75
    };
    this.shapes = { /* group : // set // frame : // frame // lines : // path */ };
    console.log(element, this.pairs);

    Raphael(element, this.length(), this.length(), init_frame_and_lines);

    var raphael_box = this; // NOTE: for init_frame_and_lines
    function init_frame_and_lines() {

      var paper = this; // NOTE : this = raphael paper, not instance of this object

      const group = paper.set();
      const frame = paper.rect(0, 0, raphael_box.length(), raphael_box.length());
      frame.attr({"stroke": raphael_box.styles.frame_color, "stroke-width": raphael_box.styles.frame_width });

      const lines = [];
      for (var i = 0; i < raphael_box.length_segments() * 2; i++) {
        var j = raphael_box.pairs[i];
        var p0 = raphael_box.points[i];
        var p1 = raphael_box.points[j];
        var line = paper.path("M " + p0[0] + "," + p0[1] + " L " + p1[0] + "," + p1[1]);
        line.attr({"stroke-width": raphael_box.styles.line_width, "stroke" : raphael_box.styles.line_color});
        lines.push(line);
        group.push(line);
      }

      raphael_box.shapes = { group : group, frame : frame, lines :lines};
      return raphael_box.shapes.group;
    }

  }

};

$(function() {
  var b1 = new RaphaelBox("canvas_icon", (window.innerHeight*0.15), 5, [13, 11, 12, 10, 18, 17, 16, 15, 19, 14]);
  var b2 = new RaphaelBox("canvas_base", (window.innerHeight*0.7), 5, [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  var b3 = new RaphaelBox("canvas_one", (window.innerHeight*0.7), 5, [11, 10, 12, 13, 14, 15, 16, 17, 18, 19]);
  var b4 = new RaphaelBox("canvas_few", (window.innerHeight*0.7), 5, [10, 11, 16, 18, 13, 17, 15, 14, 12, 19]);
  var thanks = [16,23,17,18,20,25,31,22,24,26,21,27,28,19,30,29];
  var b5 = new RaphaelBox("canvas_thanks", (window.innerHeight*0.4), 8, thanks);
});


