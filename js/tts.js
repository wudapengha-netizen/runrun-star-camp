/* ============================================================
   tts.js —— 朗读。用浏览器自带的 Web Speech API。
   Windows Chrome 自带中文（Microsoft Huihui / Yaoyao）和英文（Zira / David）。
   语速默认放慢到 0.85，适合三年级孩子跟读。
   ============================================================ */
(function () {
  'use strict';

  var synth = window.speechSynthesis;
  var voices = [];
  var zhVoice = null, enVoice = null;
  var ready = false;

  function pick() {
    if (!synth) return;
    voices = synth.getVoices() || [];
    if (!voices.length) return;

    // 中文：优先大陆普通话
    zhVoice = voices.filter(function (v) { return /^zh[-_]CN/i.test(v.lang); })[0]
           || voices.filter(function (v) { return /^zh/i.test(v.lang); })[0]
           || null;

    // 英文：优先美音
    enVoice = voices.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0]
           || voices.filter(function (v) { return /^en[-_]GB/i.test(v.lang); })[0]
           || voices.filter(function (v) { return /^en/i.test(v.lang); })[0]
           || null;

    ready = true;
  }

  if (synth) {
    pick();
    // Chrome 的语音列表是异步加载的
    synth.addEventListener('voiceschanged', pick);
    // 兜底轮询
    var tries = 0;
    var t = setInterval(function () {
      if (ready || tries++ > 20) return clearInterval(t);
      pick();
    }, 250);
  }

  function available() { return !!synth && (!!zhVoice || !!enVoice || hasClips()); }

  /* ---------- 预生成的英语音频 ----------
     Chrome 在很多 Windows 上只暴露中文语音包（这台就是），
     直接让 speechSynthesis 念英文会用中文引擎发音，孩子会学错。
     所以英语一律优先播放 audio/en/ 下预先用 Zira 生成好的 mp3。 */
  var clipAudio = null;

  function hasClips() {
    return !!(window.AUDIO_EN && Object.keys(window.AUDIO_EN).length);
  }

  function clipFor(text) {
    if (!window.AUDIO_EN) return null;
    var k = window.AUDIO_EN[String(text || '').trim()];
    return k ? ('audio/en/' + k + '.mp3') : null;
  }

  /** 播放预生成音频；返回 true 表示已接管，false 表示没有对应文件 */
  function playClip(text, opt) {
    opt = opt || {};
    var src = clipFor(text);
    if (!src) return false;
    stopClip();
    clipAudio = new Audio(src);
    clipAudio.playbackRate = opt.rate || 1;
    clipAudio.onended = function () { if (opt.onend) opt.onend(); };
    clipAudio.onerror = function () {
      // 文件缺失就退回浏览器语音，不要静默失败
      clipAudio = null;
      speakSynth(text, opt);
    };
    clipAudio.play().catch(function () {
      clipAudio = null;
      speakSynth(text, opt);
    });
    return true;
  }

  function stopClip() {
    if (clipAudio) { try { clipAudio.pause(); } catch (e) {} clipAudio = null; }
  }

  /** 英语是否有把握读准：有预生成音频，或者真有英语语音包 */
  function englishOK(text) { return !!clipFor(text) || !!enVoice; }


  function isEnglish(text) {
    // 没有汉字就当成英文
    return !/[一-龥]/.test(text);
  }

  function rate() {
    return (window.Store && Store.state && Store.state.settings.ttsRate) || 0.85;
  }

  function stop() {
    stopClip();
    if (synth) try { synth.cancel(); } catch (e) {}
  }

  /**
   * 朗读一段文字
   * @param {string} text
   * @param {object} opt  { lang:'zh'|'en'|auto, rate, onend, onstart }
   */
  function speak(text, opt) {
    opt = opt || {};
    var en = opt.lang ? opt.lang === 'en' : isEnglish(text);
    // 英语优先用预生成音频（发音准），中文才走浏览器语音
    if (en) { stop(); if (playClip(text, opt)) return; }
    return speakSynth(text, opt);
  }

  function speakSynth(text, opt) {
    opt = opt || {};
    if (!synth || !text) { if (opt.onend) opt.onend(); return; }
    stop();

    var en = opt.lang ? opt.lang === 'en' : isEnglish(text);
    var u = new SpeechSynthesisUtterance(text);
    var v = en ? enVoice : zhVoice;
    if (v) u.voice = v;
    u.lang = en ? (v ? v.lang : 'en-US') : (v ? v.lang : 'zh-CN');
    u.rate = opt.rate || (en ? Math.max(0.7, rate() - 0.05) : rate());
    u.pitch = opt.pitch || 1;
    u.volume = 1;
    if (opt.onstart) u.onstart = opt.onstart;
    u.onend = function () { if (opt.onend) opt.onend(); };
    u.onerror = function () { if (opt.onend) opt.onend(); };

    // Chrome 有个老 bug：长文本会在 ~15 秒后卡住，靠 resume 续命
    synth.speak(u);
    if (!en && text.length > 60) keepAlive();
    return u;
  }

  var kaTimer = null;
  function keepAlive() {
    clearInterval(kaTimer);
    kaTimer = setInterval(function () {
      if (!synth.speaking) return clearInterval(kaTimer);
      synth.pause(); synth.resume();
    }, 9000);
  }

  /**
   * 逐句朗读，每句开始时回调（用于高亮课文）
   * @param {string[]} sentences
   * @param {function(number)} onSentence  参数是句子下标，结束时传 -1
   */
  function speakSequence(sentences, onSentence, opt) {
    opt = opt || {};
    var i = 0;
    var cancelled = false;

    function next() {
      if (cancelled || i >= sentences.length) {
        if (onSentence) onSentence(-1);
        if (opt.onend) opt.onend();
        return;
      }
      var idx = i++;
      if (onSentence) onSentence(idx);
      speak(sentences[idx], {
        lang: opt.lang,
        rate: opt.rate,
        onend: function () { setTimeout(next, 160); }
      });
    }
    next();
    return { cancel: function () { cancelled = true; stop(); if (onSentence) onSentence(-1); } };
  }

  /** 读两遍（英语听力题用） */
  function speakTwice(text, opt) {
    opt = opt || {};
    speak(text, {
      lang: opt.lang || 'en',
      rate: opt.rate,
      onend: function () {
        setTimeout(function () {
          speak(text, { lang: opt.lang || 'en', rate: opt.rate, onend: opt.onend });
        }, 850);
      }
    });
  }

  /** 把课文切成句子，用于逐句朗读高亮 */
  function splitSentences(text) {
    return text
      .replace(/\s+/g, '')
      .split(/(?<=[。！？；…])/)
      .filter(function (s) { return s.trim().length > 0; });
  }

  window.TTS = {
    speak: speak, speakSequence: speakSequence, speakTwice: speakTwice,
    stop: stop, available: available, splitSentences: splitSentences,
    hasClip: function (t) { return !!clipFor(t); }, englishOK: englishOK,
    get zh() { return zhVoice; }, get en() { return enVoice; }
  };
})();
