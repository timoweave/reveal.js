class Box {

  constructor(length=100, length_segments=5, shuffling=undefined) {

    this.side_length = length;
    this.side_length_segments = length_segments; // count
    this.pairs = this.init_pairs(); // [[0, 2*N], [1, 2*N+1], ..., [2*N-1, 4*N-1]]
    this.points = this.init_points(); // [ [0,0], [d, 0], [2*d, 0], ..., [0, 2*d], [0, d] ]
    this.shuffle(shuffling);
  }
  length() { return this.side_length; }
  length_segments() { return this.side_length_segments; }
  sequence_numbers() { return this.pairs; }
  sequence() {
    return (this.side_length_segments + ":" + JSON.stringify(this.pairs));
  }
  shuffle(shuffling /* integer or sequence */) {
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
      var idx1 = Math.floor(Math.random() * this.side_length_segments * 2);
      var idx2 = Math.floor(Math.random() * this.side_length_segments * 2);

      var line1 = this.pairs[idx1];
      var line2 = this.pairs[idx2];

      console.log("idx", idx1, idx2);
      console.log("line", line1, line2);

      var beg1 = line1[0]; var end1 = line1[1];
      var beg2 = line2[0]; var end2 = line2[1];

      var zero_one = Math.round(Math.random());
      if (zero_one && this.is_swapped_ok(idx1, idx2, beg1, end2, beg2, end1)) {
        this.shuffle(shuffling - 1);
      }
      else if (this.is_swapped_ok(idx1, idx2, beg1, beg2, end1, end2)) {
        this.shuffle(shuffling - 1);
      }
      else {
        this.shuffle(shuffling);
      }
    }
  }

  is_swapped_ok(idx1, idx2, beg1, end1, beg2, end2) {
    var ok = ((this.is_pairs_ok(beg1, end1)) &&
              (this.is_pairs_ok(beg2, end2)) );
    
    if (ok) {
      this.pairs[idx1] = [beg1, end1];
      this.pairs[idx2] = [beg2, end2];
      return true;
    }
    return false;
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
        pairs.push([i, size + i]);
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
        var a_b = raphael_box.pairs[i];
        var a = a_b[0];
        var b = a_b[1];
        var p0 = raphael_box.points[a];
        var p1 = raphael_box.points[b];
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
  var b1 = new RaphaelBox("canvas_icon", (window.innerHeight*0.15), 5,
                          [[0,7],[1,19],[17,13],[3,16],[4,11],
                           [5,15],[6,14],[10,18],[8,2],[9,12]]);
  $('#canvas_icon_sequence').html(b1.sequence());
  var b2 = new RaphaelBox("canvas_base", (window.innerHeight*0.7), 5, 0);
  $('#canvas_base_sequence').text(b2.sequence());
  var b3 = new RaphaelBox("canvas_one", (window.innerHeight*0.7), 5,
                          [[0,6],[1,11],[2,12],[3,13],[4,14],
                           [5,15],[10,16],[7,17],[8,18],[9,19]]);
  $('#canvas_one_sequence').text(b3.sequence());
  var b4 = new RaphaelBox("canvas_few", (window.innerHeight*0.7), 5,
                          [[0,12],[1,13],[17,10],[3,11],[4,6],
                           [5,19],[14,2],[7,16],[8,18],[9,15]]);
  $('#canvas_few_sequence').text(b4.sequence());
  var b5 = new RaphaelBox("canvas_thanks", (window.innerHeight*0.4), 20, 40);
  $('#canvas_thanks_sequence').text(b5.sequence());
});


