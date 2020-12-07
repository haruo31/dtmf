import { DTMF } from "./DTMF.js";
import { FFT } from "./FFT.js";

const init = async () => {
  document.body.onclick = null;
  const fftsize = 13;
  const fft = new FFT();
  await fft.init(fftsize);
  
  let buf = fft.getFreqs()
  let bkcode = null;
  let bkf = null;

  const loop = function() {
    buf = fft.getFreqs()
    for (let i = 0; i < buf.length; i++) {
      const n = buf[i]
    }
    const formant = fft.getFormant(buf)
    if (formant.length > 1) {
      const freq = formant[0][0];
      const freq2 = formant[1][0];
      const code = DTMF.decode(freq, freq2);
      if (bkcode == null && code) {
        bkcode = code;
        $("body").trigger("code",code);
      }
      if (!code) {
        bkcode = code;
      }
      bkf = Math.floor(freq + .5) + "Hz " +  Math.floor(freq2 + .5) + "Hz " + code;
    } else {
      bkf = null;
      bkcode = null;
    }
    if(bkf){
     $("body").trigger("notice",bkf);
    }
    requestAnimationFrame(loop);
  }
  loop()
};

$("body").bind("dtmf_init",init);
