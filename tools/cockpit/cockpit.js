/* ============================================================
   早會駕駛艙　共用引擎 cockpit.js
   自動注入工具列（畫筆／抽夥伴／演練計時器）＋翻頁邏輯。
   頁面只要有 <div id="stage"> 內含 .slide 就會生效。

   可選設定（在載入本檔前設定）：
   <script>window.COCKPIT_CONFIG={
     seatMin:1, seatMax:30,      // 抽夥伴座號預設範圍
     timerDefault:3,             // 計時器預設分鐘
     handout:'handout.html',     // 有單頁手卡就填路徑，會顯示左上角連結；沒有就省略
     hint:'← → 翻頁　·　F 全螢幕　·　D 畫筆　R 抽人　T 計時'
   };</script>

   操作：← → / 空白 / 點畫面左右 翻頁；Home/End 首末頁；
        F 全螢幕；D 畫筆；R 抽人；T 計時；Esc 關彈窗。
   ============================================================ */
(function(){
  var cfg = Object.assign({
    seatMin:1, seatMax:30, timerDefault:3, handout:null,
    hint:'← → 翻頁　·　F 全螢幕　·　D 畫筆　R 抽人　T 計時'
  }, window.COCKPIT_CONFIG || {});

  function pad(n){return String(n).padStart(2,'0');}
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }

  ready(function(){
    var stage=document.getElementById('stage');
    if(!stage){console.warn('[cockpit] 找不到 #stage 容器');return;}
    var slides=[].slice.call(stage.querySelectorAll('.slide'));
    if(!slides.length){console.warn('[cockpit] #stage 內沒有 .slide');return;}

    /* ---- 注入 UI ---- */
    var handoutHTML = cfg.handout
      ? '<a class="handout" href="'+cfg.handout+'" target="_blank">📄 單頁手卡</a>' : '';
    document.body.insertAdjacentHTML('beforeend',
      handoutHTML +
      '<canvas id="board"></canvas>'+
      '<div id="palette">'+
        '<div class="swatch sel" data-c="#e5484d" style="background:#e5484d" title="紅"></div>'+
        '<div class="swatch" data-c="#e8850c" style="background:#e8850c" title="橘"></div>'+
        '<div class="swatch" data-c="#2f9e6f" style="background:#2f9e6f" title="綠"></div>'+
        '<div class="swatch" data-c="#2f6fe0" style="background:#2f6fe0" title="藍"></div>'+
        '<div class="swatch" data-c="#12312e" style="background:#12312e" title="墨"></div>'+
        '<button class="pbtn" id="eraser" title="板擦">🧽</button>'+
        '<button class="pbtn" id="clearBoard" title="清除全部">🗑️</button>'+
      '</div>'+
      '<div id="cockpit">'+
        '<div class="tool" id="btnPen" title="畫筆 (D)">✏️<small>畫筆</small></div>'+
        '<div class="tool" id="btnPick" title="抽夥伴 (R)">🎲<small>抽人</small></div>'+
        '<div class="tool" id="btnTimer" title="計時 (T)">⏱️<small>計時</small></div>'+
      '</div>'+
      '<div class="modal" id="mPick"><div class="panel">'+
        '<span class="x" data-close>×</span><h3>🎲 隨機抽夥伴</h3>'+
        '<div class="rangebar">座號 <input type="number" id="pMin" value="'+cfg.seatMin+'" min="1"> 到 '+
          '<input type="number" id="pMax" value="'+cfg.seatMax+'" min="1"></div>'+
        '<div class="pickface" id="pFace">–</div>'+
        '<div class="btnrow"><button class="bigbtn" id="pGo">抽！</button>'+
          '<button class="bigbtn ghost" id="pReset">重置</button></div>'+
        '<label class="chk"><input type="checkbox" id="pNoRepeat" checked> 不重複（抽過的先跳過）</label>'+
      '</div></div>'+
      '<div class="modal" id="mTimer"><div class="panel">'+
        '<span class="x" data-close>×</span><h3>⏱️ 演練計時器</h3>'+
        '<div class="presets"><button class="preset" data-min="1">1 分</button>'+
          '<button class="preset" data-min="2">2 分</button>'+
          '<button class="preset" data-min="3">3 分</button>'+
          '<button class="preset" data-min="5">5 分</button></div>'+
        '<div class="timeface" id="tFace">'+pad(cfg.timerDefault)+':00</div>'+
        '<div class="btnrow"><button class="bigbtn" id="tStart">開始</button>'+
          '<button class="bigbtn ghost" id="tReset">歸零</button></div>'+
      '</div></div>'+
      '<div id="counter">1 / '+slides.length+'</div>'+
      '<div id="hint">'+cfg.hint+'</div>'+
      '<div id="hud"><div id="bar"></div></div>'
    );

    /* ---- 翻頁 ---- */
    var counter=document.getElementById('counter'), bar=document.getElementById('bar');
    var board=document.getElementById('board'), bctx=board.getContext('2d');
    var i=0;
    function show(n){
      i=Math.max(0,Math.min(slides.length-1,n));
      slides.forEach(function(s,k){s.classList.toggle('active',k===i);});
      counter.textContent=(i+1)+' / '+slides.length;
      bar.style.width=((i+1)/slides.length*100)+'%';
      bctx.clearRect(0,0,board.width,board.height);
    }
    function next(){show(i+1)} function prev(){show(i-1)}

    /* ---- 彈窗 ---- */
    var mPick=document.getElementById('mPick'), mTimer=document.getElementById('mTimer');
    function openModal(m){m.classList.add('show')}
    function closeModal(m){m.classList.remove('show')}
    function anyModalOpen(){return !!document.querySelector('.modal.show');}
    document.querySelectorAll('[data-close]').forEach(function(x){x.onclick=function(){closeModal(x.closest('.modal'));};});
    document.querySelectorAll('.modal').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m)closeModal(m);});});

    /* ---- 畫筆 ---- */
    function sizeBoard(){board.width=innerWidth;board.height=innerHeight;bctx.lineCap='round';bctx.lineJoin='round';}
    sizeBoard(); addEventListener('resize',sizeBoard);
    var drawMode=false, penColor='#e5484d', eraser=false, drawing=false;
    var btnPen=document.getElementById('btnPen'), palette=document.getElementById('palette');
    function setDraw(on){drawMode=on;board.classList.toggle('draw',on);btnPen.classList.toggle('on',on);palette.classList.toggle('show',on);}
    btnPen.onclick=function(){setDraw(!drawMode);};
    document.querySelectorAll('.swatch').forEach(function(s){s.onclick=function(){
      penColor=s.dataset.c;eraser=false;
      document.getElementById('eraser').classList.remove('on');
      document.querySelectorAll('.swatch').forEach(function(x){x.classList.remove('sel');});s.classList.add('sel');
    };});
    document.getElementById('eraser').onclick=function(){eraser=true;this.classList.add('on');
      document.querySelectorAll('.swatch').forEach(function(x){x.classList.remove('sel');});};
    document.getElementById('clearBoard').onclick=function(){bctx.clearRect(0,0,board.width,board.height);};
    board.addEventListener('pointerdown',function(e){if(!drawMode)return;drawing=true;bctx.beginPath();bctx.moveTo(e.clientX,e.clientY);});
    board.addEventListener('pointermove',function(e){if(!drawing)return;
      bctx.globalCompositeOperation=eraser?'destination-out':'source-over';
      bctx.strokeStyle=penColor;bctx.lineWidth=eraser?30:5;
      bctx.lineTo(e.clientX,e.clientY);bctx.stroke();});
    addEventListener('pointerup',function(){drawing=false;});

    /* ---- 抽夥伴 ---- */
    var pFace=document.getElementById('pFace'); var drawn=new Set();
    document.getElementById('btnPick').onclick=function(){openModal(mPick);};
    document.getElementById('pReset').onclick=function(){drawn.clear();pFace.textContent='–';};
    document.getElementById('pGo').onclick=function(){
      var lo=parseInt(document.getElementById('pMin').value)||1;
      var hi=parseInt(document.getElementById('pMax').value)||lo;
      if(hi<lo){var t=lo;lo=hi;hi=t;}
      var noRep=document.getElementById('pNoRepeat').checked;
      var pool=[];for(var n=lo;n<=hi;n++)if(!(noRep&&drawn.has(n)))pool.push(n);
      if(!pool.length){pFace.textContent='✓';setTimeout(function(){pFace.textContent='抽完了';},400);return;}
      var ticks=0,total=16;
      var iv=setInterval(function(){
        pFace.textContent=pool[Math.floor(Math.random()*pool.length)];
        if(++ticks>=total){clearInterval(iv);
          var pick=pool[Math.floor(Math.random()*pool.length)];
          pFace.textContent=pick;drawn.add(pick);}
      },55);
    };

    /* ---- 演練計時 ---- */
    var tFace=document.getElementById('tFace');
    var tSecs=cfg.timerDefault*60, tLeft=tSecs, tIv=null, tRun=false;
    var tStart=document.getElementById('tStart');
    function fmt(s){return pad(Math.floor(s/60))+':'+pad(s%60);}
    function renderT(){tFace.textContent=fmt(Math.max(0,tLeft));tFace.classList.toggle('warn',tLeft<=10);}
    function stopT(){tRun=false;tStart.textContent='開始';clearInterval(tIv);}
    function startT(){if(tLeft<=0)tLeft=tSecs;tRun=true;tStart.textContent='暫停';
      tIv=setInterval(function(){tLeft--;renderT();if(tLeft<=0){stopT();beep();}},1000);}
    function beep(){try{var a=new(window.AudioContext||window.webkitAudioContext)();
      var o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);
      o.type='sine';o.frequency.value=880;o.start();
      g.gain.setValueAtTime(.25,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+1.4);
      o.stop(a.currentTime+1.4);}catch(e){}}
    document.getElementById('btnTimer').onclick=function(){openModal(mTimer);};
    document.querySelectorAll('.preset').forEach(function(p){p.onclick=function(){stopT();tSecs=tLeft=(+p.dataset.min)*60;renderT();};});
    document.getElementById('tReset').onclick=function(){stopT();tLeft=tSecs;renderT();};
    tStart.onclick=function(){tRun?stopT():startT();};
    renderT();

    /* ---- 鍵盤 & 點擊 ---- */
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){document.querySelectorAll('.modal.show').forEach(function(m){m.classList.remove('show');});return;}
      if(e.target.tagName==='INPUT')return;               // 打字時不翻頁
      if(['ArrowRight','ArrowDown',' ','PageDown'].indexOf(e.key)>=0){e.preventDefault();next();}
      else if(['ArrowLeft','ArrowUp','PageUp'].indexOf(e.key)>=0){e.preventDefault();prev();}
      else if(e.key==='Home'){show(0);}
      else if(e.key==='End'){show(slides.length-1);}
      else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}
      else if(e.key==='d'||e.key==='D'){setDraw(!drawMode);}
      else if(e.key==='r'||e.key==='R'){openModal(mPick);}
      else if(e.key==='t'||e.key==='T'){openModal(mTimer);}
    });
    stage.addEventListener('click',function(e){
      if(drawMode||anyModalOpen())return;
      if(e.target.closest('a'))return;
      (e.clientX>window.innerWidth/2)?next():prev();
    });

    show(0);
  });
})();
