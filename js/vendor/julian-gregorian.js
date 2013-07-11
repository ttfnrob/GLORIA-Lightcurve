/*julian-gregorian.js
<script src="/zeropad.js"></script>
<script src="/julian-gregorian.js"></script>
*/

//gregorian-julian calendar conversion routines.  do not use with
//gregorian dates under 1500AD.  cerain events occurred which interrupted
//the calendar.
//algorithm from http://en.wikipedia.org/wiki/Julian_day

/*


Author: Jim Michaels <jmichae3@yahoo.com>
Abstract: function library for conversion and time extraction from Julian and 
	Gregorian Dates and Javascript Date() objects.
Create Date:  , 2008
Current Date: Oct 24, 2009
Version 2.2


If you want to do Gregorian date differences based on Julian date differences, 
	make sure you add 4713 to the year component. e.g. 
		var y=GregorianY(jdiff)+4713;
	everything else is normal.



Copyright 2008,2009 Jim Michaels

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/





function fmod(a,b) {
	//return a/b - Math.floor(a/b);
	return a%b;
}
function fdiv(a,b) {
	return Math.floor(Math.floor(a)/Math.floor(b));
	//return a/b;
}

// epoch is julian(-4713,11,24,12,0,0); hours are 0..23, months are 1..12, days are 1..31, years start with -4713.
function GregorianToJulian(Y,Mo,D,H,Mi,S,ms) {
	var a=Math.floor((14-Mo)/12);
	var y=Y+4800-a;
	var m=Mo+(12*a)-3;
	return D + Math.floor((153*m+2)/5) + (365*y) + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045 + ((H-12)/24) + (Mi/1440) + (S/86400) + (ms/86400000);
}
function GregorianToDTime(Y,Mo,D,H,Mi,S,ms) {
	var a=Math.floor((14-Mo)/12);
	var y=Y/*+4800*/-a;
	var m=Mo+(12*a)-3;
	var JD = D + Math.floor((153*m+2)/5) + (365*y) + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045+32044+60;
	return (JD * 1000 * 60 * 60 * 24) + ((H-12)*60*60*1000) + (Mi*60*1000) + (S*1000) + ms;
}
function JulianFromDate(date) {
	var a=Math.floor((14-(date.getMonth()+1))/12);
	var y=date.getFullYear()+4800-a;
	var m=(date.getMonth()+1)+(12*a)-3;
	return date.getDate() + Math.floor((153*m+2)/5) + (365*y) + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045 + ((date.getHours()-12)/24) + (date.getMinutes()/1440) + (date.getSeconds()/86400) + (date.getMilliseconds()/86400000);
}
function DateToJulian(date) {
	var a=Math.floor((14-(date.getMonth()+1))/12);
	var y=date.getFullYear()+4800-a;
	var m=(date.getMonth()+1)+(12*a)-3;
	return date.getDate() + Math.floor((153*m+2)/5) + (365*y) + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045 + ((date.getHours()-12)/24) + (date.getMinutes()/1440) + (date.getSeconds()/86400) + (date.getMilliseconds()/86400000);
}

function GregorianToDTime(Y,Mo,D,H,Mi,S,ms) {
	var a=Math.floor((14-Mo)/12);
	var y=Y/*+4800*/-a;
	var m=Mo+(12*a)-3;
	var JDN=D + Math.floor((153*m+2)/5) + (365*y) + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045+32044+60;	
	return (JDN*1000*60*60*24) + (H*1000*60*60) + (Mi*1000*60) + (S*1000) + ms;
}
function DTimeFromDate(date) {
	var a=Math.floor((14-(date.getMonth()+1))/12);
	var y=date.getFullYear()/*+4800*/-a;
	var m=(date.getMonth()+1)+(12*a)-3;
	var JDN=date.getDate() + Math.floor((153*m+2)/5) + (365*y) + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045+32044+60;
	return (JDN*1000*60*60*24) + (date.getHours()*1000*60*60) + (date.getMinutes()*1000*60) + (date.getSeconds()*1000) + date.getMilliseconds();
}
function DateToDTime(date) {
	var a=Math.floor((14-(date.getMonth()+1))/12);
	var y=date.getFullYear()/*+4800*/-a;
	var m=(date.getMonth()+1)+(12*a)-3;
	var JDN=date.getDate() + Math.floor((153*m+2)/5) + (365*y) + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045+32044+60;
	return (JDN*1000*60*60*24) + (date.getHours()*1000*60*60) + (date.getMinutes()*1000*60) + (date.getSeconds()*1000) + date.getMilliseconds();
}


function to2DigitString(n) {
	var s=n.toString();
	if (s.length==1) {s='0'+s;}
	return s;
}


function JulianToDate(JDN) {
	var J = JDN+0.5; //shifts epoch 1/2 day
	var j = J + 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=J-Math.floor(J);
    var HH=fmod(24*t+12, 24);
    t=fdiv(24*t+12, 24);
    var MM=fmod(60*t, 60);
    t=fdiv(60*t, 60);
    var SS=fmod(60*t, 60);
    t=fdiv(60*t, 60);
    var MS=fmod(1000*t, 1000);
    t=fdiv(1000*t, 1000);

    var date=new Date(Y, Mo-1, D, HH, MM, SS, MS);

	return date;
}
function DTimeToDate(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);

    var date=new Date(Y, Mo-1, D, HH, MM, SS, MS);

	return date;
}
function DateFromJulian(JDN) {
	var J = JDN+0.5;
	var j = J + 32044;
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a;
	var m = fdiv((da * 5 + 308) , 153) - 2;
	var d = da - fdiv((m + 4) * 153 , 5) + 122;
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=J-Math.floor(J);
    var HH=fmod(24*t+12, 24);
    t=fdiv(24*t+12, 24);
    var MM=fmod(60*t, 60);
    t=fdiv(60*t, 60);
    var SS=fmod(60*t, 60);
    t=fdiv(60*t, 60);
    var MS=fmod(1000*t, 1000);
    t=fdiv(1000*t, 1000);

    var date=new Date(Y, Mo-1, D, HH, MM, SS, MS);

	return date;
}
function DateFromDTime(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);

    var date=new Date(Y, Mo-1, D, HH, MM, SS, MS);

	return date;
}




function JulianToGregorianY(JDN) {
	var J = JDN+0.5;
	var j = J + 32044;
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a;
	var m = fdiv((da * 5 + 308) , 153) - 2;
	var d = da - fdiv((m + 4) * 153 , 5) + 122;
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
	var H = (d - Math.floor(d))*24;
	var Mi= (H - Math.floor(H))*60;
	var S= (Mi - Math.floor(Mi))*60;
	var Ms = (S - Math.floor(S))*1000;
	return Y;
}
function DTimeToGregorianY(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);
	return Y;
}

function JulianToGregorianMo(JDN) {
	var J = JDN+0.5;
	var j = J /+ 32044;
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a;
	var m = fdiv((da * 5 + 308) , 153) - 2;
	var d = da - fdiv((m + 4) * 153 , 5) + 122;
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
	var H = (d - Math.floor(d))*24;
	var Mi= (H - Math.floor(H))*60;
	var S= (Mi - Math.floor(Mi))*60;
	var Ms = (S - Math.floor(S))*1000;
	return Mo;
}
function DTimeToGregorianMo(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);
	return Mo;
}

function JulianToGregorianD(JDN) {
	var J = JDN+0.5;
	var j = J + 32044;
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a;
	var m = fdiv((da * 5 + 308) , 153) - 2;
	var d = da - fdiv((m + 4) * 153 , 5) + 122;
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
	var H = (d - Math.floor(d))*24;
	var Mi= (H - Math.floor(H))*60;
	var S= (Mi - Math.floor(Mi))*60;
	var Ms = (S - Math.floor(S))*1000;
	return Math.floor(D);
}
function DTimeToGregorianD(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);
	return Math.floor(D);
}

function JulianToGregorianH(JDN) {
	var J = JDN+0.5;
	var j = J + 32044;
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a;
	var m = fdiv((da * 5 + 308) , 153) - 2;
	var d = da - fdiv((m + 4) * 153 , 5) + 122;
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
	var H = (d - Math.floor(d))*24;
	var Mi= (H - Math.floor(H))*60;
	var S= (Mi - Math.floor(Mi))*60;
	var Ms = (S - Math.floor(S))*1000;
	return Math.floor(H);
}
function DTimeToGregorianH(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);
	return Math.floor(HH);
}

function JulianToGregorianMi(JDN) {
	var J = JDN+0.5;
	var j = J + 32044;
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a;
	var m = fdiv((da * 5 + 308) , 153) - 2;
	var d = da - fdiv((m + 4) * 153 , 5) + 122;
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
	var H = (d - Math.floor(d))*24;
	var Mi= (H - Math.floor(H))*60;
	var S= (Mi - Math.floor(Mi))*60;
	var Ms = (S - Math.floor(S))*1000;
	return Math.floor(Mi);
}
function DTimeToGregorianMi(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);
	return Math.floor(MM);
}

function JulianToGregorianS(JDN) {
	var J = JDN+0.5;
	var j = J + 32044;
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a;
	var m = fdiv((da * 5 + 308) , 153) - 2;
	var d = da - fdiv((m + 4) * 153 , 5) + 122;
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
	var H = (d - Math.floor(d))*24;
	var Mi= (H - Math.floor(H))*60;
	var S= (Mi - Math.floor(Mi))*60;
	var Ms = (S - Math.floor(S))*1000;
	return Math.floor(S);
}
function DTimeToGregorianS(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);
	return Math.floor(SS);
}

function JulianToGregorianMs(JDN) {
	var J = JDN+0.5;
	var j = J + 32044;
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a;
	var m = fdiv((da * 5 + 308) , 153) - 2;
	var d = da - fdiv((m + 4) * 153 , 5) + 122;
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
	var H = (d - Math.floor(d))*24;
	var Mi= (H - Math.floor(H))*60;
	var S= (Mi - Math.floor(Mi))*60;
	var Ms = (S - Math.floor(S))*1000;
	return Math.floor(Ms);
}
function DTimeToGregorianMs(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);
	return Math.floor(MS);
}

function JulianToGregorianFracSec(JDN) {
	var J = JDN+0.5;
	var j = J + 32044;
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a;
	var m = fdiv((da * 5 + 308) , 153) - 2;
	var d = da - fdiv((m + 4) * 153 , 5) + 122;
	var Y = y - 4800 + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
	var H = (d - Math.floor(d))*24;
	var Mi= (H - Math.floor(H))*60;
	var S= (Mi - Math.floor(Mi))*60;
	var fracSec = S - Math.floor(S);
	return fracSec;
}
function DTimeToGregorianFracSec(dtime) {
	var J = Math.floor(dtime/(1000*60*60*24)); //shifts epoch 1/2 day
	var j = J - 60;//+ 32044; //shifts epoch back to astronomical year -4800
	var g = fdiv(j , 146097);
	var dg = fmod(j , 146097);
	var c = fdiv((fdiv(dg , 36524) + 1) * 3 , 4);
	var dc = dg - (c * 36524);
	var b = fdiv(dc , 1461);
	var db = fmod(dc , 1461);
	var a = fdiv((fdiv(db , 365) + 1) * 3 , 4);
	var da = db - (a * 365);
	var y = (g * 400) + (c * 100) + (b * 4) + a; //integer number of full years elapsed since March 1, 4801 BC at 00:00 UTC
	var m = fdiv((da * 5 + 308) , 153) - 2; //integer number of full months elapsed since the last March 1 at 00:00 UTC
	var d = da - fdiv((m + 4) * 153 , 5) + 122; //number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day
	var Y = y /*- 4800*/ + fdiv((m + 2), 12);
	var Mo = fmod((m + 2) , 12) + 1;
	var D = d + 1;
    var t=dtime % (1000*60*60*24);
    var MS=fmod(t, 1000);
    t=fdiv(t, 1000);
    var SS=fmod(t, 60);
    t=fdiv(t, 60);
    var MM=fmod(t, 60);
    t=fdiv(t, 60);
    var HH=fmod(t, 24);
    t=fdiv(t, 24);
	return SS+(MS/1000);
}
function Julian1Day() { //multipler or divisor for 1 day
	return 1;
}
function DTime1Day() { //multipler or divisor for 1 day
	return 1000*60*60*24;
}
function GregorianDiffWithEpoch(yr1,mo1,dy1,hr1,mi1,sec1,ms1, yr2,mo2,dy2,hr2,mi2,sec2,ms2) {
	var dt1=GregorianToDTime(yr1,mo1,dy1,hr1,mi1,sec1,ms1);
	var dt2=GregorianToDTime(yr2,mo2,dy2,hr2,mi2,sec2,ms2);
	var epoch=GregorianToDTime(0,1,1,12,0,0,0);
	return dt1-dt2+epoch;
}
function GregorianDiffWithoutEpoch(yr1,mo1,dy1,hr1,mi1,sec1,ms1, yr2,mo2,dy2,hr2,mi2,sec2,ms2) {
	var dt1=GregorianToDTime(yr1,mo1,dy1,hr1,mi1,sec1,ms1);
	var dt2=GregorianToDTime(yr2,mo2,dy2,hr2,mi2,sec2,ms2);
	return dt1-dt2;
}




