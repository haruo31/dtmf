DTMC Decode & Encode with jquery

sample-url:
https://audio2text.satoru.net/dtmf/sample.html

useage:
<pre>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="module" src="DTMF_mod.js"></script>
<script src="tone.js"></script>

<script>

//Recv
$(function(){
	$(".mic").click(function(){
		$("body").trigger("dtmf_init"); // DTMF Deocrder init and mic start
	})

	$("body").bind("notice",function(e,n){ // Hz&Notice debug.
		$(".debug").val(n);
	});

	$("body").bind("code",function(e,n){ // Hits Result
		$(".res").val($(".res").val() + n);
	});
})

//Send
$(function(){

	$.getScript("tone.js").done(function(){
		tones = initTones();

		$(window).on("mouseup touchend", function(){
			tones.stopSound();
		});

		$(document).on("mousedown touchstart",".b",function(){
			var keyPressed = $(this).text();
			tones.startSound(keyPressed);
		});
	});

	$("0123456789*#".split("")).each(function(i,e){
		$("body").append("<button class='b'>"+e+"</button>")
	});

})
</script>
</pre>


fork:<br>
RECV:https://code4sabae.github.io/dtmf/<br>
SEND:https://codepen.io/edball/pen/EVMaVN
