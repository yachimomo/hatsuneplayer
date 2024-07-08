const Api = TextAliveApp;   //API読み込み
const {Player} = Api;       //Player作成

let buttonctl = {tf:true};  //ボタン有効無効切替制御
let scoreCounter = 0;       //スコア
let comboCounter = 0;       //コンボ
let timing = 0;             //タイミング調整

let media = document.querySelector("#media");           //メディア
let lyrics = document.getElementById("lyrics");         //歌詞のタグ読み込み
let playbutton = document.querySelector("#playbutton"); //再生ボタン
let nextsong = document.querySelector("#nextsong");     //次の曲
let backsong = document.querySelector("#backsong");     //前の曲
let button = document.querySelectorAll(".button");      //ボタン全般
let miku = document.getElementById("miku");             //ミク本体
let timingup = document.getElementById("timingup");     //タイミング調整ボタン
let timingdown = document.getElementById("timingdown"); //タイミング調整ボタン

//楽曲情報
let songnum = 0;            //再生楽曲制御用変数
const songdata=[
    {
        // SUPERHERO / めろくる
        url: "https://piapro.jp/t/hZ35/20240130103028",
        revHistory: {
            // 音楽地図訂正履歴
            beatId: 4592293,
            chordId: 2727635,
            repetitiveSegmentId: 2824326,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
            lyricId: 59415,
            lyricDiffId: 13962
        }
    },
    {
        //いつか君と話したミライは / タケノコ少年
        url: "https://piapro.jp/t/--OD/20240202150903",
        revHistory: {
            // 音楽地図訂正履歴
            beatId: 4592296,
            chordId: 2727636,
            repetitiveSegmentId: 2824327,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2F--OD%2F20240202150903
            lyricId: 59416,
            lyricDiffId: 13963
        }
    },
    {
        //フューチャーノーツ / shikisai
        url: "https://piapro.jp/t/XiaI/20240201203346",
        revHistory: {
            // 音楽地図訂正履歴
            beatId: 4592297,
            chordId: 2727637,
            repetitiveSegmentId: 2824328,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FXiaI%2F20240201203346
            lyricId: 59417,
            lyricDiffId: 13964
        }
    },
    {
        //未来交響曲 / ヤマギシコージ
        url: "https://piapro.jp/t/Rejk/20240202164429",
        revHistory: {
            // 音楽地図訂正履歴
            beatId: 4592298,
            chordId: 2727638,
            repetitiveSegmentId: 2824329,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FRejk%2F20240202164429
            lyricId: 59418,
            lyricDiffId: 13965
        }
    },
    {
        //リアリティ / 歩く人
        url: "https://piapro.jp/t/ELIC/20240130010349",
        revHistory: {
            // 音楽地図訂正履歴
            beatId: 4592299,
            chordId: 2727639,
            repetitiveSegmentId: 2824330,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FELIC%2F20240130010349
            lyricId: 59419,
            lyricDiffId: 13966
        }
    },
    {
        //The Marks / 2ouDNS
        url: "https://piapro.jp/t/xEA7/20240202002556",
        revHistory: {
            // 音楽地図訂正履歴
            beatId: 4592300,
            chordId: 2727640,
            repetitiveSegmentId: 2824331,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FxEA7%2F20240202002556
            lyricId: 59420,
            lyricDiffId: 13967
        }
    }
];

//背景のアニメーションコントロール
let backb = document.querySelector(".walkArea-bg");     //背景後ろ
let backf = document.querySelector(".walkArea-f");      //背景手前
let animb = document.querySelector(".walkArea .walkArea-bg").animate(   //後ろ
    [
        {transform: "translate(0, 0)"},
        {transform: "translate(-416vh, 0)"}
    ],
    {
        duration: 40000,
        easing: "linear",
        iterations: Infinity,
    },
);
let animf = document.querySelector(".walkArea .walkArea-f").animate(    //手前
    [
        {transform: "translate(0, 0)"},
        {transform: "translate(-416vh, 0)"}
    ],
    {
        duration: 20000,
        easing: "linear",
        iterations: Infinity,
    },
);

//ボタン有効無効切替
let buttonchange = () => {      //ボタンの透明度を変えて、制御変数を変える。
    if (buttonctl.tf) {
        buttonctl.tf=false
        button.forEach(element => {
            element.style.opacity=0.4;
        });
    }else{
        buttonctl.tf=true
        button.forEach(element => {
            element.style.opacity=1;
        });
    };
};

animb.pause();//最初は一時停止
animf.pause();
buttonchange();//最初はボタン不可

//ミクの画像変更
let mikunum = 0;            //ミク のポーズ管理
const mikuchange=()=>{
    switch (mikunum) {
        case 0:
            miku.style.backgroundImage = "url(" + './img/miku/mikustop.png' + ")";
            mikunum++;
            break;
        case 1:
            miku.style.backgroundImage = "url(" + './img/miku/mikuwalk1.png' + ")";
            mikunum++;
            break;
        case 2:
            miku.style.backgroundImage = "url(" + './img/miku/mikustop.png' + ")";
            mikunum++;
            break;
        case 3:
            miku.style.backgroundImage = "url(" + './img/miku/mikuwalk2.png' + ")";
            mikunum = 0;
            break;
        default:
            mikunum = 0;
            break;
    };
};

//初期化
const player = new Player({ 
    app: {
      token: "sNA1Lp9PQkKS3rJV",    //トークン設定
    },

    //右下のメディアを作成
    mediaElement: media,
    mediaBannerPosition: "bottom right",
});


let lasttime;               //時間管理
let beats;                  //ビート
let songcontrol = 1;        //曲終了時の処理を制御 1は再生前か再生中、0は曲終了から次の曲に移るまで
//リスナ追加
player.addListener({
    onAppReady(app){
        //最初はSUPERHEROで設定
        player.createFromSongUrl(songdata[songnum].url ,songdata[songnum].revHistory);
    },
    onTimerReady: () => {
        console.log("timer ready");

        //ボタンを有効に
        buttonchange();

        lasttime=-1;
        beats=player.data.songMap;
        songcontrol = 1;
    },

    onTimeUpdate:(position)=>{
        if (songcontrol) {
            //歌詞の表示
            lyrics.textContent=player.video.findPhrase(position);
            
            //ビートに合わせた処理
            const beats = player.findBeatChange(lasttime,position);
            if (lasttime >= 0 && beats.entered.length>0) {
                //ビートに合わせてミクを動かす
                mikuchange();

                //ビートに合わせてアイテム動作
                itemli.forEach(itlielem => {
                    itlielem.forEach(itemelem => {
                        itemelem.classList.toggle("rotater");
                        itemelem.classList.toggle("rotatel");
                    });
                });

                //アイテムによるスコア生成
                itemct.forEach((element,index) => {
                    scoreCounter += Math.floor(element*itemgenescore[index] + 0.5);
                    numChange(scoredig,scoreCounter);
                });
            };

            //スコア不足でボタン無効
            for (let index = 0; index < 4; index++) {
                if (itemcost[index] > scoreCounter) {
                    itemButtonCtl[index].tf=false
                    itembtn[index].style.opacity=0.4;
                }else{
                    if (itemct[index] < itemmax[index]) {
                        itemButtonCtl[index].tf=true
                        itembtn[index].style.opacity=1;
                    }
                }
            };

            //時間更新
            lasttime = position;
        };

        //終了後処理
        if (player.timer.position >= player.video.duration - 300 && songcontrol) {
            songcontrol = 0;
            for (let index = 0; index < itemnum; index++) {
                //アイテムボタン不可
                itemButtonCtl[index].tf=false;
                itembtn[index].style.opacity=0.4;
            };
            //アイテムだけ後ろに流す
            itemli.forEach(element => {
                element.forEach(chelement => {
                    chelement.animate(
                        [
                            {transform: "translate(0, 0)"},
                            {transform: "translate(-416vh, 0)"}
                        ],
                        {
                            duration: 20000,
                            easing: "linear",
                            iterations: Infinity,
                        },
                    )
                });
            });
            //ビートがなくなってもミクを動かす
            let count = 0;
            const interval = setInterval(() => {
                mikuchange();
                count++;
                if (count >= 25) {
                  clearInterval(interval);
                  interval=null;
                }
            }, 300);
            setTimeout(() => {
                next();
            }, 300*26);
        };
    },
});

//ボタンクリックの関数
let btnpush = (obj,defimg,btnctl,func) =>{
    let ctl = 0;
    obj.addEventListener("mousedown",()=>{
        if (btnctl.tf) {
            obj.style.backgroundImage = "url(" + './img/' + defimg + "_push.png)";
            ctl = 1;
        };
    });
    obj.addEventListener("mouseup",()=>{
        if (btnctl.tf) {
            obj.style.backgroundImage = "url(" + './img/' + defimg + ".png)";
            func();
            ctl = 0;
        };
    });
    obj.addEventListener("mouseleave",()=>{
        if (ctl) {
            obj.style.backgroundImage = "url(" + './img/' + defimg + ".png)";
            ctl = 0;
        };
    });
};

//数字→数字用画像関数
let scoredig = document.querySelectorAll("ul.score > .scoredig");
let combodig = document.querySelectorAll("ul.combo > .combodig");
let scoreplus = document.querySelector(".scoreplus");
const muncolor = ['blue_','red_','white_'];
let numChange = (obj, num, color = 0) => {
    let tmp = num;
    if (num <= 99999) {
        for (let index = obj.length - 1; index >= 0; index--) {
            obj[index].style.backgroundImage = "url(" + './img/num/num_' + muncolor[color] + tmp % 10 + ".png)";
            tmp = Math.floor(tmp / 10);
            scoreplus.style.backgroundImage = "url( )";
        };
    }else{
        for (let index = obj.length - 1; index >= 0; index--) {
            obj[index].style.backgroundImage = "url(" + './img/num/num_' + muncolor[color] + 9 + ".png)";
            scoreplus.style.backgroundImage = "url(./img/num/plus.png)";
        };
    };
};

//ミクのクリックによるエフェクト
let effects = document.querySelectorAll(".effect");
let efcnum = 0;
const effect = (num,event)=>{
    setTimeout(() => {
        effects[efcnum].style.backgroundImage = "url(" + './img/uiandeffect/note_' + num + ".png)"
        effects[efcnum].style.top = 'calc(-7vh/2 + ' + event.clientY + 'px)';
        effects[efcnum].style.left = 'calc(-7vh/2 + ' + event.clientX + 'px)';
        effects[efcnum].style.opacity = 1;  
        effects[efcnum].animate(
            [
                {transform: "translate(0, 0) rotate(0)", opacity: 1 },
                {transform: "translate(-20vh, 0) rotate(45deg)", opacity: 0 },
            ],
            {
                duration: 1000,
                easing: "linear",
                fill: "forwards",
            },
        );
        efcnum = (efcnum + 1) % effects.length;
    }, 10);
};

//クリックでのスコア生成
let scoreinc = 1;
let mikuct = 0;
miku.addEventListener("mousedown",(event)=>{
    // effect(1,event);
    miku.style.height = '59.5vh';   //クリックが分かるようわずかに縮める
    let beat=player.findBeat(player.timer.position);
    let beatc=beat.startTime + timing;
    let pos=player.timer.position;

    if (buttonctl.tf&&player.isPlaying) {
        if (Math.abs(beatc-pos)<100) {
            effect(2,event);
            scoreCounter += comboCounter*3 + scoreinc;
            comboCounter++;
            numChange(scoredig,scoreCounter);
            numChange(combodig,comboCounter,1);
        }else{
            effect(1,event);
            scoreCounter += scoreinc;
            comboCounter=0;
            numChange(scoredig,scoreCounter);
            numChange(combodig,comboCounter,1);
        };
    };
    mikuct = 1;
});
miku.addEventListener("mouseup",()=>{
    miku.style.height = '60vh';
});
miku.addEventListener("mouseleave",()=>{
    miku.style.height = '60vh';
});



//アイテム関係宣言
const itemnum = 4;                                              //アイテムの種類数
const item = document.querySelectorAll(".item");                //アイテム配置用
let itembtn = document.querySelectorAll(".itembtn");            //アイテム生成ボタン
let itembtnmax = document.querySelectorAll(".itembtnmax");      //アイテム上限のMAX表示
let cost = document.querySelectorAll(".cost");                  //コスト表示
const costobj = [];                                             //コストの各桁を入れる
cost.forEach(costElement => {
    const costdigs = costElement.querySelectorAll('.costdig');
    costobj.push(Array.from(costdigs));
});
let iticon = document.querySelectorAll(".iticon");              //アイテムボタンのアイコン
let itemli=[ [], [], [], []];                                   //生成するアイテムを入れる配列
let itemct=[0,0,0,0];                                           //アイテムを生成した個数カウント
const itemgenescore = [0.5,5,25,100];                           //アイテム生成スコア
const itemcost = [39, 393, 3939, 9999];                         //必要コスト
const itemmax = [20, 6, 4, 2];                                  //出現上限
//アイテムボタン有効無効管理
let itemButtonCtl = [
    {tf:true},
    {tf:true},
    {tf:true},
    {tf:true},
];
//アイテムのスタンダードスタイル
const itemstdstyle = [
    ["display", "inline-block"],
    ["position", "fixed"],
    ["top", "10vh"],
    ["left", "10vh"],
    ["backgroundSize", "auto 100%"],
    ["backgroundRepeat", 'no-repeat'],
    ["backgroundPosition", "top center"],
];
//各アイテム別スタイル
const itemstyle=[
    [
        ["width", "5vh"],
        ["height", "15vh"],        
        ["backgroundImage", "url(" + './img/item/penlight_0'+ ".png)"],
    ],
    [
        ["width", "25vh"],
        ["height", "20vh"],
        ["backgroundImage", "url(" + './img/item/headphone.png' + ")"],
    ],
    [
        ["width", "10vh"],
        ["height", "20vh"],
        ["backgroundImage", "url(" + './img/item/microphone.png' + ")"],
    ],
    [
        ["width", "7vh"],
        ["height", "30vh"],
        ["backgroundImage", "url(" + './img/item/leek.png' + ")"],
    ]
];
//ボタンのアイコンに画像を設定
iticon.forEach((element,index) => {
    if (index==1) {
        element.style.transform = 'rotate(0deg)';
        element.style.height = '7vh';
    };
    element.style.backgroundImage = itemstyle[index][2][1];
});
//コストを画像化
costobj.forEach((element,index) => {
    numChange(element,itemcost[index],2);
});
//アイテムの出現箇所(縦軸)を制限
const itempos=[
    [15,65],
    [15,20],
    [30,35],
    [55,55]
];
let toppos;         //生成アイテムのポジション決定に使用
let leftpos;        //生成アイテムのポジション決定に使用

//アイテム作成。
for (let index = 0; index < itemnum; index++) {
    btnpush(itembtn[index],'item/item_btn',itemButtonCtl[index],()=>{
        if (scoreCounter >= itemcost[index]) {
            //エレメント生成
            const li = document.createElement('itemli');
            
            //スタイル適用
            itemstdstyle.forEach(element => {
                li.style[element[0]]=element[1];
            });
            itemstyle[index].forEach((element,chindex) => {
                if (index==0 && chindex==2) {
                    if (songnum==0) {
                        li.style[element[0]]="url(" + './img/item/penlight_' + (Math.floor(Math.random()*2)+2) + ".png)";
                    }else{
                        li.style[element[0]]="url(" + './img/item/penlight_' + Math.floor(Math.random()*2) + ".png)";
                    }
                }else{
                    li.style[element[0]]=element[1];
                }
            });

            //ポジション決定
            toppos=Math.random()*(itempos[index][1]-itempos[index][0])+itempos[index][0];
            li.style.top=toppos + "vh";
            //50%でミクの前後どちらかに出現
            if (Math.random()<0.5) {
                leftpos=Math.random()*(0.85-0.05)+0.05;
                li.style.left='calc((((100vw - 75vh)/2) - 20vh)*'+ leftpos + ")";
            } else {
                leftpos = Math.random();
                let vw=(50+(100-50)*leftpos);
                let vh=(19.5+(80-19.5)*leftpos)
                //100vw - 70vh
                //50vw - 19.5vh
                li.style.left='calc(' + vw +'vw - ' + vh + 'vh)';
            };
            li.classList.add("rotatel");

            //生成したアイテムを配列に入れる & カウント
            itemli[index].push(item[index].appendChild(li));
            itemct[index]++;

            //アイテム数が最大になったらボタン不可に
            if (itemct[index] >= itemmax[index]) {
                itembtnmax[index].style.backgroundImage = "url(./img/item/max.png)";
                itemButtonCtl[index].tf=false
                itembtn[index].style.opacity=0.4;
            };
    
            //スコア消費
            scoreCounter -= itemcost[index];
            numChange(scoredig,scoreCounter);

            //全アイテム上限で背景を豪華に
            if (itemct[0]>=itemmax[0] && itemct[1]>=itemmax[1] && itemct[2]>=itemmax[2] && itemct[3]>=itemmax[3]) {
                backb.style.backgroundImage = "url(./img/background/sky_2.png)";
                backf.style.backgroundImage = "url(./img/background/fence_2.png)";
            };
        };

        //アイテム増加でクリックによるスコアもアップ
        scoreinc = 1 + itemct[0] + itemct[1]*4 + itemct[2]*6 + itemct[3]*12
    });
};

//リセット
const reset=()=>{
    //アイテム消去
    for (let index = 0; index < itemnum; index++) {
        itemli[index].forEach(element => {
            element.remove();
        });
        itemli[index].splice(0,itemli[index].length,);
        itemct[index]=0;
        
        //アイテムボタン不可&マックス表示消し
        itembtnmax[index].style.backgroundImage = "url( )";
        itemButtonCtl[index].tf=false;
        itembtn[index].style.opacity=0.4;
    };

    //スコアリセット
    scoreCounter = 0;
    comboCounter = 0;
    scoreinc = 1;
    numChange(scoredig,scoreCounter);
    numChange(combodig,comboCounter,1);

    //背景戻す
    backb.style.backgroundImage = "url(" + './img/background/sky_1.png' + ")";
    backf.style.backgroundImage = "url(" + './img/background/fence_1.png' + ")";

    //ミクを立ちに
    miku.style.backgroundImage = "url(" + './img/miku/mikustop.png' + ")";
    mikunum=0;
};


//スタートストップ
let pbctl = 0;
playbutton.addEventListener("mousedown",()=>{
    if (buttonctl.tf) {
        if (player.isPlaying) {
            playbutton.style.backgroundImage = "url(" + './img/player/btn_stop_push.png' + ")";
        } else {
            playbutton.style.backgroundImage = "url(" + './img/player/btn_start_push.png' + ")";
        };
        pbctl = 1;
    };
});
playbutton.addEventListener("mouseup",()=>{
    if (buttonctl.tf) {
        lyrics.textContent = " ";
        lyrics.style.fontSize = '6vh';
        if (player.isPlaying) {
            console.log("pause!");
            player.requestPause();
            animb.pause();
            animf.pause();
            playbutton.style.backgroundImage = "url(" + './img/player/btn_start.png' + ")";
        } else {
            console.log("play!");
            lyrics.style.backgroundImage = "url()";
            player.requestPlay();
            animb.play();
            animf.play();
            playbutton.style.backgroundImage = "url(" + './img/player/btn_stop.png' + ")";
        };
        pbctl = 0;
    };
});
playbutton.addEventListener("mouseleave",()=>{
    if (buttonctl.tf && pbctl) {
        if (player.isPlaying) {
            playbutton.style.backgroundImage = "url(" + './img/player/btn_stop.png' + ")";
        } else {
            playbutton.style.backgroundImage = "url(" + './img/player/btn_start.png' + ")";
        };
        pbctl = 0;
    };
});

//次の曲へ
const next = () =>{
    player.requestPause();  //曲を一時停止
    lyrics.textContent="";  //歌詞表示を消去

    //アニメーション停止
    animb.pause();
    animf.pause();

    //ボタン変更&透過
    playbutton.style.backgroundImage = "url(" + './img/player/btn_start.png' + ")";
    nextsong.style.backgroundImage = "url(" + './img/player/btn_next.png' + ")";
    buttonchange();

    //再生楽曲制御変数を変更
    songnum = (songnum + 1) % songdata.length;

    //楽曲情報読み込み
    player.createFromSongUrl(songdata[songnum].url ,songdata[songnum].revHistory);

    reset();
};
btnpush(nextsong,'player/btn_next',buttonctl,()=>{
    next();
});
//前の曲へ
btnpush(backsong,'player/btn_prev',buttonctl,()=>{
    player.requestPause();  //曲を一時停止
        lyrics.textContent="";  //歌詞表示を消去

        //アニメーション停止
        animb.pause();
        animf.pause();

        //ボタン変更&透過
        playbutton.style.backgroundImage = "url(" + './img/player/btn_start.png' + ")";
        backsong.style.backgroundImage = "url(" + './img/player/btn_prev.png' + ")";
        buttonchange();

        //再生楽曲制御変数を変更
        songnum = (songnum - 1 + songdata.length) % songdata.length;
        
        //楽曲情報読み込み
        player.createFromSongUrl(songdata[songnum].url ,songdata[songnum].revHistory);
        
        reset();
});

//タイミング+
btnpush(timingup,'player/btn_plus',buttonctl,()=>{
    timing+=10;
    console.log(timing);
});
//タイミング-
btnpush(timingdown,'player/btn_minus',buttonctl,()=>{
    timing-=10;
    console.log(timing);
});