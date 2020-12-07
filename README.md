**DTMC Decode & Encode with jquery

useae sample:<br>
https://satorunet.github.io/dtmf/

Minimam-Sample: (for newbe)<br>
https://satorunet.github.io/dtmf/mini-sample.html

useage:
<pre>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="module" src="lib/recv/DTMF_mod.js"></script>
<script src="lib/recv/tone.js"></script>

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
