$(function(){
	$(".menu").click(function(){

		$(".menu_selected").removeClass("menu_selected");
		$(this).addClass("menu_selected");
		var val = $(this).attr("val");

		if(val.match(/^(recv|send)$/)){

			$(".box").hide();
			$(".box_"+val).show();


		} else {
			$(".box").show();
		}


	})

})


function loadRecv(){
	$("body").trigger("dtmf_init");
};

$(function(){

	$("body").bind("notice",function(e,n){
		$("info").html(n);
	});

	$("body").bind("code",function(e,n){
		$("#input").text($("#input").text() + n).trigger("change");
		check_input();
		
	});

	$("body").bind("notice",function(e,n){
		$("info").html(n);
	});
	

	$(".clearButton").click(function(e){
		$("#input,#result").html("").trigger("change");
		e.preventDefault();
	}).trigger("change");

		$("#input,#result").bind("change",function(){
			$("byte_recv").html(
			$("#result").val().length + " / " + $("#input").val().length + "byte"
		);

		});
	
})

	function viewFG(){

		var fg = $("<div style='z-index:10000;position:fixed;top:0px;left:0px;background:rgba(0,0,0,.3);width:100%;height:100%;text-align:center'></div>");
		$("body").append(fg);
		
		fg.append("<div style='margin-top:100px;display:inline-block;padding:10px;background:white'>電話のピコピコ音(DTMF)を文字変換できるよ。<br>マイクを近づけて試してね。<div><input autofocus style='margin:10px' type=button class=recv_button value='はい'></div></div>");

		$(document).on("click",".recv_button",function(){
			$(fg).remove();
			loadRecv();
		})
	};

$(function(){
	$("body").bind("init",function(){
		loadSend();
	})

	viewFG();
})

$(function(){
	$("body").trigger("init");
})


$(function(){

	$(".playBt").click(function(){
		var texts = $($(".tt").val().split(""));
		playIndex=0;
		playLoop(texts);
		$(this).prop("disabled",true);
		
	});

	$(".playBt").bind("playFinish",function(){
		$(this).prop("disabled","");
		
		$("body").trigger("SEND_FINISH");
		
		if($(".is_loop").is(":checked")){
			setTimeout(function(){
				$(".playBt").click();
			},500);
		}
		
	});

	var playIndex=0;
	var v = {"*":"a","#":"s"};
	var h = {"e":"*","f":"#"};

	function playLoop(lists){
	
		var speed = parseInt($(".speed").val())/100;

		tones.stopSound();

		if(playIndex < lists.length){

			var char = lists[playIndex] in h ? h[lists[playIndex]] : lists[playIndex].toUpperCase();
			console.log(lists[playIndex] + ":" + char);
			
			tones.startSound(char);

			$(".selected").removeClass("selected");
			$("[k=" + (lists[playIndex] in v ? v[lists[playIndex]] : lists[playIndex]) + "]").addClass("selected");

			setTimeout(function(){
				if(playIndex>0){
					tones.stopSound();
					setTimeout(function(){
						playLoop(lists);
					},500 - (400 * speed) );
				} else {
					playLoop(lists);
				}
			},300- (200 * speed));
		} else {
			tones.stopSound();
			$(".playBt").trigger("playFinish");
		}
		playIndex++;

	}

	$(".speed").on("input",function(){
		$("speed").html($(this).val());
	}).trigger("input");
});

var tones;

function loadSend(){

	$.getScript("tone.js?v2"+new Date().getTime()).done(function(){
		tones = initTones();

		$(window).on("mouseup touchend", function(){
			tones.stopSound();
		});

		$(document).on("mousedown touchstart",".b",function(){
			var keyPressed = $(this).text();
			tones.startSound(keyPressed);
		});

	});
}




$(function(){
	$("body").bind("SEND_FINISH",function(){
		convertBin2Text();
	})
})

function check_input(){
	if($("#input").text().match(/0000$/)){
		$("body").trigger("SEND_FINISH");
	}
}

function text2bin(text){
	return string_to_utf8_hex_string(text);
}

function bin2text(text){
	return utf8_hex_string_to_string(text);
}


function convertBin2Text(){
	var bin = $("#input").text();
	    bin = bin.replace(/0000$/,"");
	    bin = bin.replace(/^\s+/g,"");
	    bin = bin.replace(/\*/g,"e");
	    bin = bin.replace(/#/g,"f");

	console.log("[" + bin + "]");

	$("#result").html(utf8_hex_string_to_string(bin)).trigger("change");
}


$(function(){
	$(".char").on("input",function(){


		var bin = "";
		$($(this).val().split("")).each(function(i,e){
			bin += text2bin(e);
		})
		$(".tt").val(bin + "0000"); //fin文字を付ける

		$("byte_send").html(
			$(".char").val().length + " / " + $(".tt").val().length + "byte"
		);


		if($(this).val()){
			$(".playBt").prop("disabled","");
		} else {
			$(".playBt").prop("disabled","true");
		}

	})
})



/* https://yasuhallabo.hatenadiary.org/entry/20140211/1392131668 */

// 文字列UTF8の16進文字列に変換
function string_to_utf8_hex_string(text)
{
	var bytes1 = string_to_utf8_bytes(text);
	var hex_str1 = bytes_to_hex_string(bytes1);
	return hex_str1;
}


// UTF8の16進文字列を文字列に変換
function utf8_hex_string_to_string(hex_str1)
{
	var bytes2 = hex_string_to_bytes(hex_str1);
	var str2 = utf8_bytes_to_string(bytes2);
	return str2;
}



// 文字列をUTF8のバイト配列に変換
function	string_to_utf8_bytes(text)
{
    var result = [];
    if (text == null)
        return result;
    for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (c <= 0x7f) {
            result.push(c);
        } else if (c <= 0x07ff) {
            result.push(((c >> 6) & 0x1F) | 0xC0);
            result.push((c & 0x3F) | 0x80);
        } else {
            result.push(((c >> 12) & 0x0F) | 0xE0);
            result.push(((c >> 6) & 0x3F) | 0x80);
            result.push((c & 0x3F) | 0x80);
        }
    }
    return result;
}

// バイト値を16進文字列に変換
function	byte_to_hex(byte_num)
{
	var digits = (byte_num).toString(16);
    if (byte_num < 16) return '0' + digits;
    return digits;
}

// バイト配列を16進文字列に変換
function	bytes_to_hex_string	(bytes)
{
	var	result = "";

	for (var i = 0; i < bytes.length; i++) {
		result += byte_to_hex(bytes[i]);
	}
	return result;
}

// 16進文字列をバイト値に変換
function	hex_to_byte(hex_str)
{
	return parseInt(hex_str, 16);
}

// バイト配列を16進文字列に変換
function	hex_string_to_bytes(hex_str)
{
	var	result = [];

	for (var i = 0; i < hex_str.length; i+=2) {
		result.push(hex_to_byte(hex_str.substr(i,2)));
	}
	return result;
}

// UTF8のバイト配列を文字列に変換
function utf8_bytes_to_string (arr)
{
    if (arr == null)
        return null;
    var result = "";
    var i;
    while (i = arr.shift()) {
        if (i <= 0x7f) {
            result += String.fromCharCode(i);
        } else if (i <= 0xdf) {
            var c = ((i&0x1f)<<6);
            c += arr.shift()&0x3f;
            result += String.fromCharCode(c);
        } else if (i <= 0xe0) {
            var c = ((arr.shift()&0x1f)<<6)|0x0800;
            c += arr.shift()&0x3f;
            result += String.fromCharCode(c);
        } else {
            var c = ((i&0x0f)<<12);
            c += (arr.shift()&0x3f)<<6;
            c += arr.shift() & 0x3f;
            result += String.fromCharCode(c);
        }
    }
    return result;
}
