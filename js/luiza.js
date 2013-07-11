var exampleURL = "http://193.0.87.199/cgi-bin/run_luiza_demonstrator.cgi?98.7427872+15.33213114+1.5+0+1";
// var exampleURL = "js/luizatest.txt";

Array.prototype.transpose = function() {
  // Calculate the width and height of the Array
  var a = this,
    w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;
  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }
  var i, j, t = [];
  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {
    // Insert a new row (array)
    t[i] = [];
    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {
      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }
  return t;
};

function parseLuizaLightCurve(a) {
	textArray = a.split("\n");
	var cleanData = ""
	$.each( textArray, function( k, line ) {
		line = line.replace(/\s+/g, ',');
	    if (!(line.substring(0,1)==='#') && (line.length > 0)) {
	    	cleanData = cleanData+line+"\n";
	    }
	});
	return cleanData;
}

function luiza2jqplot(a) {
	textArray = a.split("\n");
	var cleanData = [];
	$.each( textArray, function( k, line ) {
		line = line.replace(/\s+/g, ',');
	    if (!(line.substring(0,1)==='#') && (line.length > 0)) {
	    	x = parseFloat(line.split(",")[0]);
	    	y = parseFloat(line.split(",")[1]);
	    	cleanData.push([x,y]);
	    }
	});

	//FOR TESTING
	return [cleanData, []];
}

function sineGen(points,P,phi) {
	var trigdata = [];
	
	xmin = Math.min.apply(Math, points.transpose()[0]);
	xmax = Math.max.apply(Math, points.transpose()[0]);
	xint = (xmax-xmin)/1000;

	A = 0.4;
	w = 2*3.14159265359/P;
	y0 = 7.05;
	for (x=xmin; x<xmax; x+=xint) {
		y = A*Math.sin(w*x+phi) + y0;
		trigdata.push([x,y]);
	}
	// console.log(A,P,w,phi,y0);
	return trigdata;
}