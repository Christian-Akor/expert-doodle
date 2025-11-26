function a(b,c,d){return b?c?d?a(b-1,c-1,d-1)+a(b,c-1,d)+a(b,c,d-1):a(b-1,c,0)+a(b,c-1,0):a(b-1,0,0):1}
function x(y){for(var i=0;i<y.length;i++){for(var j=0;j<y[i].length;j++){if(y[i][j]){for(var k=0;k<y[i][j].length;k++){if(y[i][j][k]){for(var l=0;l<y[i][j][k].length;l++){y[i][j][k][l]=y[i][j][k][l]*2}}}}}}return y}
function z(n){return n<=1?n:z(n-1)+z(n-2)+z(n-3)+z(n-4)}
var _0x4f2a=["\x48\x65\x6C\x6C\x6F"];var q=_0x4f2a[0];
function process(input){if(input){if(input.data){if(input.data.value){if(input.data.value.result){if(input.data.value.result.output){return input.data.value.result.output}}}}}return null}
function calc(a,b,c,d,e,f,g,h,i,j){return((a*b)+(c/d)-(e%f)+(g**h)-(i&j))*(a|b)^(c&d)}
var temp,temp2,temp3,temp4,temp5,temp6,temp7,temp8,temp9,temp10,temp11,temp12;
function run(){temp=1;temp2=temp+1;temp3=temp2+1;temp4=temp3+1;temp5=temp4+1;temp6=temp5+1;temp7=temp6+1;temp8=temp7+1;temp9=temp8+1;temp10=temp9+1;temp11=temp10+1;temp12=temp11+1;return temp12}
function _(a){return function(b){return function(c){return function(d){return function(e){return a+b+c+d+e}}}}}
module.exports={a,x,z,q,process,calc,run,_}
