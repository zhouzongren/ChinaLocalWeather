/*
weather api by juhe
*/
// http://ofn9ip9vx.bkt.clouddn.com/icon120px/day/1.png
//http://ofn9ip9vx.bkt.clouddn.com/weatherback/13.jpg
var local="";
var week=["一","二","三","四","五","六","天"]
//baidu map api
function getCity(result){
	var cityName = result.name;	
	//alert("当前定位城市:"+cityName);
	local=cityName;
	getWeather(local);
}

//
function getTemp(weather){
	var preTemp=[];
	for (var i = 1; i <=3; i++) {
		var threeTemp=[];
		threeTemp.push(parseInt(weather[i].info.day[2]));
		threeTemp.push(parseInt(weather[i].info.dawn[2]));
		threeTemp.push(parseInt(weather[i].info.night[2]));
		threeTemp.sort(function(a,b){
			return a-b;
		});
		preTemp.push(" "+threeTemp[0]+"°/"+threeTemp[2]+"°");
	}
	return preTemp;
}



function getWeather(local){
	var appKey="&key=9a6cdd0afa436f64a39f9893f5562654";
	var apiUrl="http://op.juhe.cn/onebox/weather/query";
	var apiParam=encodeURI(local);
	$.ajax({
		url:apiUrl+"?cityname="+apiParam+appKey,
		//url:"http://op.juhe.cn/onebox/weather/query?cityname=%E6%B8%A9%E5%B7%9E&dtype=&key=9a6cdd0afa436f64a39f9893f5562654",
		dataType:"jsonp",
		success:function(response){
			if(response.reason=="successed!"){
			$("#error-msg").html("");
			var realtime=response.result.data.realtime;
			var weather=response.result.data.weather;
			//console.log(response);
			$("body").css("background","url(http://ofn9ip9vx.bkt.clouddn.com/weatherback/"+realtime.weather.img+".jpg) no-repeat center center fixed");
			//$("body").css("background-repeat","norepeat");
			$("body").css("background-size","cover");
			$("#cityname").html(local);
			$("#cityname_input").val("");
			$("#cityname_input").attr("placeholder",local);
			$("#date").html(realtime.date+" 星期"+week[realtime.week-1]);
			$("#realtimeweather").html(realtime.weather.info);
			$("#temperature").html(realtime.weather.temperature+"℃");
			var preTemp=getTemp(weather);
			$("#pre_1").html("明天："+weather[1].info.day[1]+"</br>"+preTemp[0]);
			$("#pre_2").html("后天："+weather[2].info.day[1]+"</br>"+preTemp[1]);
			$("#pre_3").html("大后天："+weather[3].info.day[1]+"</br>"+preTemp[2]);
			//alert(parseInt("22"));
			if(parseInt(realtime.time.slice(0,2))<=18&&parseInt(realtime.time.slice(0,2))>6)
				$("#weather-icon").attr("src","http://ofn9ip9vx.bkt.clouddn.com/icon120px/day/"+realtime.weather.img+".png");
			else
				$("#weather-icon").attr("src","http://ofn9ip9vx.bkt.clouddn.com/icon120px/night/"+realtime.weather.img+".png");
			}
			else{
				$("#error-msg").html(response.reason);
			}
		},
		error:function(response){
			alert(response.statusText);
		}
	});

}

$(document).ready(function(){	
	var myCity = new BMap.LocalCity();
	myCity.get(getCity);
	$("#cityname_input").keyup(function(){
		if(event.keyCode==13)
			getWeather($(this).val());
	});
})