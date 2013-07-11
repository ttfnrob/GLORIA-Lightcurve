function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function roundTo(n, dps) {
  return Math.round( n*Math.pow(10,dps) )/Math.pow(10,dps);
}

var isArray = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
},
getNumWithSetDec = function( num, numOfDec ){
  var pow10s = Math.pow( 10, numOfDec || 0 );
  return ( numOfDec ) ? Math.round( pow10s * num ) / pow10s : num;
},
getAverageFromNumArr = function( numArr, numOfDec ){
  if( !isArray( numArr ) ){ return false; }
  var i = numArr.length, 
    sum = 0;
  while( i-- ){
    sum += numArr[ i ];
  }
  return getNumWithSetDec( (sum / numArr.length ), numOfDec );
},
getVariance = function( numArr, numOfDec ){
  if( !isArray(numArr) ){ return false; }
  var avg = getAverageFromNumArr( numArr, numOfDec ), 
    i = numArr.length,
    v = 0;
 
  while( i-- ){
    v += Math.pow( (numArr[ i ] - avg), 2 );
  }
  v /= numArr.length;
  return getNumWithSetDec( v, numOfDec );
},
getStandardDeviation = function( numArr, numOfDec ){
  if( !isArray(numArr) ){ return false; }
  var stdDev = Math.sqrt( getVariance( numArr, numOfDec ) );
  return getNumWithSetDec( stdDev, numOfDec );
};


function plotIt(ra,dec) {

  if (ra==999 && dec==999) {
    // var dataURL = "http://193.0.87.199/cgi-bin/run_luiza_demonstrator.cgi?"+98.7427872+"+"+15.33213114+"+1.5+0+1";
    var dataURL = "js/luizatest.txt"      
  } else {
    var dataURL = "http://193.0.87.199/cgi-bin/run_luiza_demonstrator.cgi?"+ra+"+"+dec+"+1.5+0+1";
  }
  var cleanData = "";

  $.get(dataURL, function(data) {
    $('.result').html(data);
    console.log('Load was performed for '+ra+', '+dec);
    cleanData = luiza2jqplot(data);

    if (ra==999 && dec==999) {
      cleanData[0] = simulateData();
    }

    window.plot1_original_data = cleanData;
  
    $('#chart').empty();
    window.plot1 = $.jqplot('chart', cleanData, { 
      axesDefaults:{
         pad: 1.1,
         borderWidth: 2.0,
         borderColor: '#555555'
      },
      series:[  { 
                  color:'#337DFF',
                  showLine: false
                },
                { 
                  color:'#5B616D',
                  showLine: true,
                  showMarker: false,
                  shadow: false,
                  linePattern: 'dashed'
                }
             ]
    });

    $("#estimatePeriod").show();
    startSliders();
    tidySliders();

  });

}

// PERIOD MATH BUTTONS
$("#big-minus").click(function() {
  incrementPeriod(-0.5);
});
$("#small-minus").click(function() {
  incrementPeriod(-0.01);
});
$("#big-plus").click(function() {
  incrementPeriod(0.5);
});
$("#small-plus").click(function() {
  incrementPeriod(0.01);
});

$("#d7").click(function() {
  multiplyPeriod(1/7.0);
});
$("#d5").click(function() {
  multiplyPeriod(0.2);
});
$("#d3").click(function() {
  multiplyPeriod((1/3.0));
});
$("#d2").click(function() {
  multiplyPeriod(0.5);
});
$("#x2").click(function() {
  multiplyPeriod(2.0);
});
$("#x3").click(function() {
  multiplyPeriod(3.0);
});
$("#x5").click(function() {
  multiplyPeriod(5.0);
});

function startSliders(){
  
  xmin = Math.min.apply(Math, window.plot1_original_data[0].transpose()[0]);
  xmax = Math.max.apply(Math, window.plot1_original_data[0].transpose()[0]);
  this_p = (xmax-xmin)/2;
  this_off = 0.5;
  $(".control").show();

  changePeriod(this_p,this_off);
  $("#period-display").text(this_p);
  $("#phase-display").text(this_off);
  
  //SET UP PERIOD SLIDER
  $( "#period-slider" ).slider({
      min: xmin, 
      max: xmax, 
      step: 0.01,
      value: this_p,
      slide: function( event, ui ) {
          changePeriod(ui.value,$("#phase-slider").slider('value'));
          $("#period-display").text(ui.value);
      }
  });

  //SET UP PHASE SLIDER
  $( "#phase-slider" ).slider({
      min: 0, 
      max: 1,
      orientation: 'vertical', 
      step: 0.02,
      value: this_off, // default value of slider
      slide: function( event, ui ) {
          changePeriod($("#period-slider").slider('value'),ui.value);
          $("#phase-display").text(ui.value);
      }
  });
}

$("#estimatePeriod").click(function() {
  $(this).hide();
  console.log('Running routine...');
  
  xmin = Math.min.apply(Math, window.plot1_original_data[0].transpose()[0]);
  xmax = Math.max.apply(Math, window.plot1_original_data[0].transpose()[0]);

  result = createFT(window.plot1_original_data[0], {'start':1,'end':100,'inc':0.01});
  console.log(result.slice(0,10));
  period_best = parseFloat(result[1].period);
  phase_best = 0.5;
  $(".control").show();

  changePeriod(period_best,phase_best);
  $("#period-display").text(period_best);
  $("#phase-display").text(phase_best);
  
  //SET UP PERIOD SLIDER
  $( "#period-slider" ).slider({
      min: xmin, 
      max: xmax,
      step: 0.01,
      value: period_best,
      slide: function( event, ui ) {
          changePeriod(ui.value,$("#phase-slider").slider('value'));
          $("#period-display").text(ui.value);
      }
  });

  //SET UP PHASE SLIDER
  $( "#phase-slider" ).slider({
      min: 0,
      max: 1,
      orientation: 'vertical',
      step: 0.02,
      value: phase_best,
      slide: function( event, ui ) {
          changePeriod($("#period-slider").slider('value'),ui.value);
          $("#phase-display").text(ui.value);
      }
  });
  console.log('...complete');
  tidySliders();
});

function tidySliders() {
  window.period = roundTo(window.period,2);
  changePeriod(window.period,$("#phase-slider").slider('value'));
  $("#period-display").text(window.period);

  $( "#period-slider" ).slider({
      min: roundTo($("#period-slider").slider('option','min'),2),
      max: roundTo($("#period-slider").slider('option','max'),2),
      step: $("#period-slider").slider('option','step'),
      value: window.period,
      slide: function( event, ui ) {
          changePeriod(ui.value,$("#phase-slider").slider('value'));
          $("#period-display").text(ui.value);
      }
  });

}

function multiplyPeriod(n) {
  window.period = window.period*n;
  changePeriod(window.period,$("#phase-slider").slider('value'));
  $("#period-display").text(window.period);

  $( "#period-slider" ).slider({
      min: $("#period-slider").slider('option','min'),
      max: $("#period-slider").slider('option','max'),
      step: $("#period-slider").slider('option','step'),
      value: window.period,
      slide: function( event, ui ) {
          changePeriod(ui.value,$("#phase-slider").slider('value'));
          $("#period-display").text(ui.value);
      }
  });
  tidySliders();
}

function incrementPeriod(n) {
  window.period = window.period+n;
  changePeriod(window.period,$("#phase-slider").slider('value'));
  $("#period-display").text(window.period);

  $( "#period-slider" ).slider({
      min: $("#period-slider").slider('option','min'),
      max: $("#period-slider").slider('option','max'),
      step: $("#period-slider").slider('option','step'),
      value: window.period,
      slide: function( event, ui ) {
          changePeriod(ui.value,$("#phase-slider").slider('value'));
          $("#period-display").text(ui.value);
      }
  });
  tidySliders();
}

function changePeriod(P,offset) {
  window.period = P;
  var new_data = [];
  
  $.each( window.plot1_original_data[0], function(k,v) {
    new_data.push([ v[0]%P, v[1] ]);
  });
  
  window.plot1.series[0].data = new_data;
  window.plot1.series[1].data = sineGen(new_data,P,(offset*2*3.14159265359));
  
  window.plot1.drawSeries({}, 0);
  window.plot1.drawSeries({}, 1);

  // REPLOT CHART
  window.plot1.replot({resetAxes:true});
}

function simulateData(){
  var trigdata = [];
  
  xmin = 10;
  xmax = 1000;
  xint = (xmax-xmin)/2000;

  P = 5 + 15*Math.random();
  A = 0.4;
  phi = 2*3.14159265359*Math.random();
  console.log("Simulated data has period=",P,", phi=",phi/(2*3.14159265359));
  w = 2*3.14159265359/P;
  y0 = 7.05;
  
  for (x=1; x<500; x+=xint) {
    y = A*Math.sin(w*x+phi) + y0 + 0.05*Math.random() - 0.05*Math.random();
    x1 = x + 5*xint*Math.random() - 5*xint*Math.random();
    trigdata.push([x1,y]);
  }
  
  for (x=600; x<700; x+=xint) {
    y = A*Math.sin(w*x+phi) + y0 + 0.06*Math.random() - 0.06*Math.random();
    x1 = x + 5*xint*Math.random() - 5*xint*Math.random();
    trigdata.push([x1,y]);
  }

  for (x=850; x<1000; x+=xint) {
    y = A*Math.sin(w*x+phi) + y0 + 0.1*Math.random() - 0.1*Math.random();
    x1 = x + 5*xint*Math.random() - 5*xint*Math.random();
    trigdata.push([x1,y]);
  }
  // console.log(A,P,w,phi,y0);
  return trigdata;
}

function getSDForPeriod(d,period){
  stdevs = {};
  roundedPs = {};
  sum = null;
  
  // LOOP THROUGH DATA
  $.each( d, function(k,v) {
    rP=roundTo(v[0]%period, 4);
    if (rP in roundedPs) {
      roundedPs[rP].push(v[1]);
      stdevs[rP] = getStandardDeviation( roundedPs[rP], 10)/roundedPs[rP].length;
    } else {
      roundedPs[rP] = [v[1]];
    }

  });
  // SUM DEVIATIONS
  $.each( stdevs, function(k, v) {
    sum+=v;
  });

  return sum;
}

function createFT(d,options){
    
    var start = typeof options['start'] !== 'undefined' ? options['start'] : 1;
    var end = typeof options['end'] !== 'undefined' ? options['end'] : 1000;
    var inc = typeof options['inc'] !== 'undefined' ? options['inc'] : 1;
    var sums = {};
    var ordered_sums = new Array();

    $("#loading").show();

    var periods = new Array((end-start)/inc);
    for(var i=start;i<periods.length;i++){
      periods[i] = start+(i*inc);
    }

    // LOOP THROUGH PERIODS
    $.each( periods, function(k, period) {
      sums[period]=getSDForPeriod(d,period);
    });

    $.each( sums, function(k, v) {
        if (v!==null && k!==undefined && k!==null) { ordered_sums.push({period: k, value: v}) }
    });

    best_fits = ordered_sums.sort(function(a,b) {
        return a.value - b.value;
    });

    result = best_fits.slice(0,10).sort(function(a,b) {
        return a.period - b.period;
    });

    $("#loading").hide();
    return result; 
}

function plotData(ra,dec) {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.mag); });

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dataURL = "http://193.0.87.199/cgi-bin/run_luiza_demonstrator.cgi?"+ra+"+"+dec+"+1.5+0+1";

  $.get(dataURL, function(data) {
    $('.result').html(data);
    console.log('Load was performed.');
  });

  d3.text(dataURL, function(error, text) {
    
    cleanText = parseLuizaLightCurve(text);

    var data = d3.csv.parseRows(cleanText).map(function(row) {
      row.date = parseFloat(row[0]);
      row.mag = parseFloat(row[1]);
      row.err = parseFloat(row[2]);
      return row;
    });

    x.domain(d3.extent(data, function(d) { return d.date;}));
    y.domain(d3.extent(data, function(d) { return d.mag; }));

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Julian Date");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Magnitude")

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2.0)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.mag); });

  });
}