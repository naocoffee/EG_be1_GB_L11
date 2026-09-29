// =====================================================================
// 編集ゾーン：問題を追加・修正するときはここだけを編集
// =====================================================================

const LESSON_TITLE = "Lesson 11　不定詞②（形容詞用法・副詞用法）";

// 学習記録：スプレッドシートの「Lesson」列に記録する名前
const LESSON_ID = "Lesson 11";

// 学習記録の送信先（Google Apps Script のウェブアプリ URL を "" の中に貼る）。空のままなら記録は送らない
const LOG_URL = "https://script.google.com/macros/s/AKfycbzmgGcLSJc50ijxHDKUCTmUPB8dhkbjAKqpgby6tvqltto-PMfC2qTDAHjoYE36-NHI/exec";

// 最初に選べる問題数（収録問題数を超える数は「全問」の数に置きかえて表示）
const COUNT_OPTIONS = [10, 20, 30];

// 指示文：問題の inst（なければ type）で選ばれる
const INSTRUCTIONS = {
  blanks:       "日本語に合うように，（　）に入る語を選びなさい。動詞は枠内の語群から選ぶこと。",
  form:         "日本語に合うように，［ ］の語を適切な形で使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
  order:        "日本語，または【状況】に合うように，語句を並べかえなさい。",
  orderMeaning: "意味の通る英文になるように，語句を並べかえなさい。"
};

// 語群（box：枠内に表示する文字，choices：語群から選ぶ空欄の選択肢）
const BOX_1 = { box: "wake / catch / watch / find / get", choices: ["wake", "catch", "watch", "find", "get"] };
const BOX_5 = { box: "eat / call / drive / trust / see",   choices: ["eat", "call", "drive", "trust", "see"] };

// type: "form"   … template の {} に入る語の組み合わせを3択で選ぶ（answer と dummies 2つ，いずれも {} の数と同じ長さの配列）
// type: "order"  … chunks（語群）を並べかえ（answer が正しい順番）。文頭チャンクは小文字で保存し表示時に大文字化
// type: "blanks" … template の {} ごとに選択。verb: true の空欄は語群（words の choices）から，それ以外は answer＋dummies の3択
// verb: ［ ］内に示す語句，words: 語群，ja: 問題文の日本語／状況，trans: 答え合わせ後に表示する訳，note: 答え合わせ後に表示する解説
// 文頭の {} に入る語は小文字で保存（表示時に大文字化）

const QUESTIONS = [
  // ---- 1 ----
  { src: "1 ⑴", type: "blanks", words: BOX_1, ja: "彼女はテレビでサッカーの試合を見るために遅くまで起きていた。",
    template: "She stayed up late {} {} a soccer game on TV.",
    blanks: [ { answer: "to", dummies: ["for", "in"] }, { answer: "watch", verb: true } ],
    note: "〈to＋動詞の原形〉には「～するために」と目的を表す使い方がある（不定詞の副詞用法）。to watch a soccer game on TV で「テレビでサッカーの試合を見るために」。\nstay up late は「夜遅くまで起きている」。" },
  { src: "1 ⑵", type: "blanks", words: BOX_1, ja: "通りでタクシーを止めるには，手を挙げさえすればよい。",
    template: "{} {} a taxi on the street, just raise your hand.",
    blanks: [ { answer: "to", dummies: ["for", "in"] }, { answer: "catch", verb: true } ],
    note: "目的を表す〈to＋動詞の原形〉「～するために」を文の最初に置いた形。To catch a taxi で「タクシーをつかまえるために」。文頭なので To は大文字。\n「タクシーを止める」は，英語では catch（つかまえる）を使って表す。" },
  { src: "1 ⑶", type: "blanks", words: BOX_1, ja: "私たちはよい席を取るために劇場に急いだ。",
    template: "We hurried to the theater in {} {} {} good seats.",
    blanks: [ { answer: "order", dummies: ["case", "fact"] }, { answer: "to", dummies: ["for", "of"] }, { answer: "get", verb: true } ],
    note: "in order to ～ も「～するために」と目的を表す。to ～ だけよりも，目的であることがはっきり伝わる。in order to get good seats で「よい席を取るために」。\nhurry to ～ は「～へ急ぐ」。" },
  { src: "1 ⑷", type: "blanks", words: BOX_1, ja: "私は赤ちゃんを起こさないように静かに歩いた。",
    template: "I walked quietly so as {} {} {} the baby.",
    blanks: [ { answer: "not", dummies: ["for", "no"] }, { answer: "to", dummies: ["for", "of"] }, { answer: "wake", verb: true } ],
    note: "「～しないように」は，to の直前に not を置いて not to ～ とする。so as not to ～ / in order not to ～ の形で使うことが多い。so as not to wake the baby で「赤ちゃんを起こさないように」。\nnot の位置（to の前）に注意。" },
  { src: "1 ⑸", type: "blanks", words: BOX_1, ja: "彼は家に帰って，玄関のドアが開いているのを見つけた。",
    template: "He came home {} {} the front door open.",
    blanks: [ { answer: "to", dummies: ["for", "in"] }, { answer: "find", verb: true } ],
    note: "〈to＋動詞の原形〉が「（その結果）～した」という結果を表すことがある。came home to find ～ で「家に帰ると～だとわかった」。\nfind A open は「A が開いているのに気づく」。" },

  // ---- 2 ----
  { src: "2 ⑴", type: "order", inst: "orderMeaning",
    before: "Here are some", after: ".",
    chunks: ["show", "you", "to", "pictures"],
    answer: ["pictures", "to", "show", "you"],
    trans: "ここにあなたに見せたい写真があります。",
    note: "〈名詞＋to＋動詞の原形〉で「～するための（名詞）」「～すべき（名詞）」という意味になる（不定詞の形容詞用法）。pictures to show you で「あなたに見せるための写真」。\nto 以下は，前の名詞 pictures を後ろから説明している。" },
  { src: "2 ⑵", type: "order", inst: "orderMeaning",
    before: "I’ll make you", after: "if you are hungry.",
    chunks: ["eat", "hot", "to", "something"],
    answer: ["something", "hot", "to", "eat"],
    trans: "お腹がすいていたら，何か温かい食べ物を作りますよ。",
    note: "something を説明する形容詞は，something の後ろに置く（something hot：何か温かいもの）。さらに to eat（食べるための）も後ろに続けるので，something hot to eat の語順になる。\nmake A B は「A に B を作る」。" },
  { src: "2 ⑶", type: "order", inst: "orderMeaning",
    before: "We have a lot of", after: "at today’s meeting.",
    chunks: ["to", "about", "topics", "talk"],
    answer: ["topics", "to", "talk", "about"],
    trans: "今日の会議で話すべき話題がたくさんある。",
    note: "topics to talk about で「話すべき話題」。talk about topics（話題について話す）のように about が必要なので，最後に about が残る。about を忘れないこと。\na lot of は「たくさんの」。" },
  { src: "2 ⑷", type: "order", inst: "orderMeaning",
    before: "Who was", after: "a Nobel Prize?",
    chunks: ["win", "the first", "to", "woman"],
    answer: ["the first", "woman", "to", "win"],
    trans: "ノーベル賞をとった初の女性はだれですか。",
    note: "the first woman to win ～ で「～した最初の女性」。the first（最初の）がついた名詞を，to 以下が後ろから説明している。\nwin a Nobel Prize は「ノーベル賞をとる」。" },
  { src: "2 ⑸", type: "order", inst: "orderMeaning",
    before: "I didn’t", after: "a shower this morning.",
    chunks: ["take", "have", "to", "time"],
    answer: ["have", "time", "to", "take"],
    trans: "今朝はシャワーを浴びる時間がなかった。",
    note: "time to ～ で「～する時間」。have time to take a shower で「シャワーを浴びる時間がある」。didn’t のあとなので動詞は原形 have。\ntake a shower は「シャワーを浴びる」。" },

  // ---- 3 ----
  { src: "3 ⑴", type: "order", ja: "エネルギーを節約するために，家を出るときエアコンを消しなさい。",
    before: "Turn off", after: "when you leave home.",
    chunks: ["save", "energy", "the air conditioner", "to"],
    answer: ["the air conditioner", "to", "save", "energy"],
    note: "目的を表す〈to＋動詞の原形〉「～するために」。Turn off the air conditioner（エアコンを消しなさい）のあとに，to save energy（エネルギーを節約するために）を続ける。\nsave は「節約する」。turn off は「（電気製品など）を消す」。" },
  { src: "3 ⑵", type: "order", ja: "私の町には，訪ねるべきおもしろい場所がいくつかある。",
    before: "There are", after: "in my town.",
    chunks: ["visit", "interesting", "to", "places", "a few"],
    answer: ["a few", "interesting", "places", "to", "visit"],
    note: "「訪ねるべき場所」は places to visit。places の前に interesting（おもしろい），さらにその前に a few（いくつかの）を置き，a few interesting places to visit の順にする。" },
  { src: "3 ⑶", type: "order", ja: "彼は寝坊しないように，目覚まし時計を３つかけた。",
    before: "In", after: ", he set three alarm clocks.",
    chunks: ["not", "oversleep", "order", "to"],
    answer: ["order", "not", "to", "oversleep"],
    note: "「～しないように」は in order not to ～。not は to の直前に置く。In order not to oversleep で「寝坊しないように」。\noversleep は「寝坊する」。set an alarm clock は「目覚まし時計をかける」。" },
  { src: "3 ⑷", type: "order", ja: "【状況】メモを取ろうと思って鉛筆がないのに気づき，隣の友人にたずねました。",
    before: "“Can you lend", after: "?”",
    chunks: ["write", "me", "to", "with", "something"],
    answer: ["me", "something", "to", "write", "with"],
    trans: "「何か書くものを貸してくれますか」",
    note: "lend A B で「A に B を貸す」。something to write with で「書くための道具（何か書くもの）」。with は「～を使って」という意味で，write with a pencil（鉛筆で書く）の with が残る。\n「何か書く内容」なら something to write，「書くための紙」なら something to write on になる。" },

  // ---- 5 ----
  { src: "5 ⑴", type: "blanks", words: BOX_5, ja: "こんなに夜遅くにあなたに電話をしてすみません。",
    template: "I’m {} {} {} you so late at night.",
    blanks: [ { answer: "sorry", dummies: ["glad", "happy"] }, { answer: "to", dummies: ["for", "of"] }, { answer: "call", verb: true } ],
    note: "〈感情を表す語＋to＋動詞の原形〉で「～して（その気持ちだ）」と，その気持ちになった原因を表す。sorry to call you で「あなたに電話をしてすみません」。\nI’m は I am の短縮形。" },
  { src: "5 ⑵", type: "blanks", words: BOX_5, ja: "私は昨日，カフェであなたたち 2 人を見かけて驚いた。",
    template: "I was {} {} {} you two at the café yesterday.",
    blanks: [ { answer: "surprised", dummies: ["sorry", "glad"] }, { answer: "to", dummies: ["for", "of"] }, { answer: "see", verb: true } ],
    note: "surprised to see ～ で「～を見て驚いた」。to see が，驚いた原因を表している。\nsurprised（驚いて）のほか，glad / happy / sad なども同じ形で使える。" },
  { src: "5 ⑶", type: "blanks", words: BOX_5, ja: "あの男を信じるなんて，私はばかだった。",
    template: "{} was foolish {} me {} {} that man.",
    blanks: [ { answer: "it", dummies: ["this", "that"] }, { answer: "of", dummies: ["for", "to"] },
              { answer: "to", dummies: ["for", "of"] }, { answer: "trust", verb: true } ],
    note: "〈It is＋人の性質を表す語＋of＋人＋to＋動詞の原形〉で「～するとは（人）は…だ」。foolish（ばかな）のように人の性質を表す語のときは，for ではなく of を使う。\n過去の文なので It was foolish of me to trust that man。" },
  { src: "5 ⑷", type: "blanks", words: BOX_5, ja: "野菜をたくさん食べるとは，あなたは賢明だ。",
    template: "It is smart {} you {} {} a lot of vegetables.",
    blanks: [ { answer: "of", dummies: ["for", "to"] }, { answer: "to", dummies: ["for", "of"] }, { answer: "eat", verb: true } ],
    note: "⑶と同じく〈It is＋人の性質を表す語＋of＋人＋to＋動詞の原形〉の形。smart（賢い）は人の性質を表すので of you。\nfor を使うのは，easy / difficult など「行為の性質」を表す語のとき。" },
  { src: "5 ⑸", type: "blanks", words: BOX_5, ja: "私たちを車で家まで送ってくれるとは，アンはとても親切だった。",
    template: "Ann was very {} {} {} us home.",
    blanks: [ { answer: "kind", dummies: ["kindly", "kindness"] }, { answer: "to", dummies: ["for", "of"] }, { answer: "drive", verb: true } ],
    note: "〈人＋be動詞＋kind to＋動詞の原形〉で「～するとは（人）は親切だ」。was very kind to drive us home で「私たちを車で家まで送ってくれるとはとても親切だった」。\ndrive A home は「A を車で家まで送る」。home は「家へ」という意味なので，to home とはしない。" },

  // ---- 6 ----
  { src: "6 ⑴", type: "form", ja: "その水は飲んでも安全です。", verb: "safe",
    template: "The water is {} {} {}.",
    answer: ["safe", "to", "drink"], dummies: [["safe", "for", "drink"], ["safely", "to", "drink"]],
    note: "〈安全・難しさなどを表す語＋to＋動詞の原形〉で「～するのに…だ」。safe to drink で「飲むのに安全だ（飲んでも安全だ）」。\nbe動詞のあとなので safe（形容詞）を使い，safely（副詞）は使わない。" },
  { src: "6 ⑵", type: "form", ja: "私の担任の先生は話しかけやすい。", verb: "talk",
    template: "My homeroom teacher is {} {} {} to.",
    answer: ["easy", "to", "talk"], dummies: [["easy", "to", "talking"], ["easily", "to", "talk"]],
    note: "easy to talk to で「話しかけやすい」。最後の to は，talk to my teacher（先生に話しかける）の to が残ったもの。\nto のあとは原形 talk。be動詞のあとなので easy（形容詞）を使い，easily（副詞）は使わない。" },
  { src: "6 ⑶", type: "form", ja: "最近私は忙しすぎて，映画を観ることができない。", verb: "watch",
    template: "I’m {} busy {} {} movies these days.",
    answer: ["too", "to", "watch"], dummies: [["very", "to", "watch"], ["too", "for", "watch"]],
    note: "〈too … to＋動詞の原形〉で「…すぎて～できない」。too busy to watch movies で「忙しすぎて映画を観ることができない」。\nvery busy to ～ という形はない。these days は「最近」。" },
  { src: "6 ⑷", type: "form", ja: "この本は子どもが読むには難しすぎる。", verb: "for",
    template: "This book is {} difficult {} a child to {}.",
    answer: ["too", "for", "read"], dummies: [["too", "of", "read"], ["very", "for", "read"]],
    note: "〈too … for＋人＋to＋動詞の原形〉で「（人）が～するには…すぎる」。for a child は「子どもが」で，to read の動作をする人を表す（意味上の主語）。\ndifficult は人の性質ではなく行為の性質を表すので，of ではなく for を使う。" },
  { src: "6 ⑸", type: "form", ja: "彼はその天井に手が届くくらいの背の高さだった。", verb: "enough",
    template: "He was {} {} {} reach the ceiling.",
    answer: ["tall", "enough", "to"], dummies: [["enough", "tall", "to"], ["tall", "enough", "for"]],
    note: "〈… enough to＋動詞の原形〉で「～するのに十分…」「～できるほど…」。tall enough to reach ～ で「～に届くほど背が高い」。\nenough は形容詞（tall）の後ろに置く。enough tall は誤り。" },

  // ---- 7 ----
  { src: "7 ⑴", type: "order", ja: "新しいチームメンバーが入って，みんなうれしかった。",
    before: "Everyone was", after: "team member.",
    chunks: ["have", "happy", "a", "to", "new"],
    answer: ["happy", "to", "have", "a", "new"],
    note: "感情の原因を表す〈happy to＋動詞の原形〉「～してうれしい」。happy to have a new team member で「新しいチームメンバーを持ってうれしい」。\nEveryone（みんな）は単数扱いなので be動詞は was。" },
  { src: "7 ⑵", type: "order", ja: "彼はプライドが高すぎて，人の話を聞かない。",
    before: "He is", after: "to others.",
    chunks: ["proud", "listen", "of", "too", "himself", "to"],
    answer: ["too", "proud", "of", "himself", "to", "listen"],
    note: "〈too … to＋動詞の原形〉「…すぎて～できない」の … に，proud of himself（自分を誇りに思う＝プライドが高い）が入った形。\nlisten to others は「人の話を聞く」。" },
  { src: "7 ⑶", type: "order", ja: "ひとりで海外を旅行するとはアヤは勇敢だ。",
    before: "It is", after: "alone.",
    chunks: ["travel", "Aya", "brave", "to", "of", "abroad"],
    answer: ["brave", "of", "Aya", "to", "travel", "abroad"],
    note: "〈It is＋人の性質を表す語＋of＋人＋to＋動詞の原形〉「～するとは（人）は…だ」。brave（勇敢な）は人の性質を表すので of Aya。\ntravel abroad は「海外を旅行する」。" },
  { src: "7 ⑷", type: "order", ja: "【状況】妹の部屋がひどく散らかっています。理由を聞いたら，こんな返事が…。",
    before: "The reason for this", after: "a few words.",
    chunks: ["to", "hard", "is", "in", "explain"],
    answer: ["is", "hard", "to", "explain", "in"],
    trans: "これの理由を少ない言葉で説明するのは難しい。",
    note: "〈難しさを表す語＋to＋動詞の原形〉「～するのが…だ」。is hard to explain で「説明するのが難しい」。hard はここでは「難しい（= difficult）」の意味。\nin a few words は「少ない言葉で，簡潔に」。" }
];

// 全体共通の語群（問題ごとの words がないときに使う）
const VERB_BOX = "";
const VERB_CHOICES = [];

// =====================================================================
// ここから下はロジック（通常は編集不要）
// =====================================================================

// 旧形式（before / answer / after）の form 問題を template 形式にそろえる
QUESTIONS.forEach(q => {
  if (q.type === "form" && !q.template) {
    q.template = [q.before, "{}", q.after].filter(Boolean).join(" ");
    q.answer = [q.answer];
    q.dummies = q.dummies.map(d => [d]);
  }
});

const app = document.getElementById("app");
const progressEl = document.getElementById("progress");

let queue = [];    // 出題する問題（QUESTIONS のインデックス）
let records = [];  // 各問の解答状態 { result, choice, sels, picked, pool }
let pos = 0;
let studentId = "";
let sessionLabel = "";  // 記録用：出題数（例：「10問」「復習5問」）

// ---------- 学籍番号の保存（この端末のブラウザに記憶） ----------
function loadId() {
  try { return localStorage.getItem("studentId") || ""; } catch (e) { return ""; }
}
function saveId(id) {
  try { localStorage.setItem("studentId", id); } catch (e) {}
}

// ---------- 学習記録の送信 ----------
const RESULT_LABELS = { correct: "正解", wrong: "不正解", skipped: "とばした" };

function chosenText(q, rec) {
  if (rec.result === "skipped") return "";
  if (q.type === "form") return optionLabel(q, rec.options[rec.choice]);
  if (q.type === "blanks") return rec.sels.join(" / ");
  return rec.picked.map(pi => rec.pool[pi]).join(" ");
}

function sendLog(q, rec) {
  if (!LOG_URL) return;
  const body = JSON.stringify({
    student: studentId,
    lesson: LESSON_ID,
    question: q.src,
    result: RESULT_LABELS[rec.result],
    choice: chosenText(q, rec),
    count: sessionLabel
  });
  try {
    fetch(LOG_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body })
      .catch(() => {});
  } catch (e) {}
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function joinSentence(parts) {
  return parts.filter(Boolean).join(" ").replace(/ ([.,?!])/g, "$1");
}

function fullAnswer(q) {
  if (q.type === "form") return fillTemplate(q.template, q.answer);
  if (q.type === "order") return cap(joinSentence([q.before, ...q.answer, q.after]));
  return fillTemplate(q.template, q.blanks.map(b => b.answer));
}

function fillTemplate(template, words) {
  let i = 0;
  return cap(template.replace(/\{\}/g, () => words[i++]));
}

// 選択肢の表示：隣り合う空所はスペース，離れた空所は「…」でつなぐ
function optionLabel(q, words) {
  const parts = q.template.split("{}");
  const atStart = q.template.startsWith("{}");
  return words.map((w, k) => (k === 0 && atStart ? cap(w) : w) +
    (k < words.length - 1 ? (parts[k + 1].trim() === "" ? " " : " … ") : "")).join("");
}

// 文頭にくる語句だけ大文字で表示
function displayChunk(q, text, isFirst) {
  return isFirst && !q.before ? cap(text) : text;
}

// 答え合わせ済み、またはとばした問題は解答を確定（解説を表示）
function isChecked(rec) { return !!rec.result; }

// 練習を始めたときに1行送る（sessions シート用）
function sendSession() {
  if (!LOG_URL) return;
  const body = JSON.stringify({ type: "session", student: studentId, lesson: LESSON_ID, count: sessionLabel });
  try {
    fetch(LOG_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body })
      .catch(() => {});
  } catch (e) {}
}

// ---------- 画面：問題数の選択 ----------
function renderHome() {
  progressEl.textContent = "";
  const counts = [...new Set(COUNT_OPTIONS.map(n => Math.min(n, QUESTIONS.length)))];
  let html = `<p class="ja">学籍番号（4桁）</p>`;
  html += `<p><input type="text" id="sid" inputmode="numeric" maxlength="4" autocomplete="off" value="${esc(studentId || loadId())}"></p>`;
  html += `<p class="ja">問題数を選んでください（全${QUESTIONS.length}問から出題）</p><div class="actions">`;
  html += counts.map(n => `<button class="primary count" data-n="${n}">${n}問</button>`).join("");
  html += `</div>`;
  app.innerHTML = html;

  const sid = document.getElementById("sid");
  const buttons = app.querySelectorAll("button.count");
  const update = () => {
    sid.value = sid.value.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
                         .replace(/\D/g, "").slice(0, 4);
    buttons.forEach(b => b.disabled = !/^\d{4}$/.test(sid.value));
  };
  sid.addEventListener("input", update);
  update();

  buttons.forEach(b => b.addEventListener("click", () => {
    studentId = sid.value;
    saveId(studentId);
    start(shuffle(QUESTIONS.map((_, i) => i)).slice(0, Number(b.dataset.n)), `${b.dataset.n}問`);
  }));
}

function start(indices, label) {
  sessionLabel = label;
  sendSession();
  queue = shuffle(indices);
  records = queue.map(() => ({}));
  pos = 0;
  renderQuestion();
}

// ---------- 画面：問題 ----------
function renderQuestion() {
  const q = QUESTIONS[queue[pos]];
  const rec = records[pos];
  const checked = isChecked(rec);
  progressEl.textContent = `${studentId}｜${pos + 1} / ${queue.length}`;

  let html = `<p class="source">EXERCISES ${esc(q.src)}</p>`;
  html += `<p class="instruction">${INSTRUCTIONS[q.inst || q.type]}</p>`;
  if (q.ja) html += `<p class="ja">${esc(q.ja)}</p>`;

  if (q.type === "form") {
    if (!rec.options) rec.options = shuffle([q.answer, ...q.dummies]);
    const fills = rec.choice === undefined ? null : rec.options[rec.choice];
    const atStart = q.template.startsWith("{}");
    let i = 0;
    const body = esc(q.template).replace(/\{\}/g, () => {
      const k = i++;
      return `<span class="slot">${fills ? esc(k === 0 && atStart ? cap(fills[k]) : fills[k]) : "&nbsp;"}</span>`;
    });
    if (q.verb) html += `<p class="hint">［ ${esc(q.verb)} ］</p>`;
    html += `<p class="sentence">${body}</p>`;
    html += `<div class="pool" id="options">` + rec.options.map((o, oi) =>
      `<button class="chunk${oi === rec.choice ? " selected" : ""}" data-i="${oi}" ${checked ? "disabled" : ""}>${esc(optionLabel(q, o))}</button>`
    ).join("") + `</div>`;
  }

  if (q.type === "blanks") {
    if (!rec.sels) rec.sels = q.blanks.map(() => "");
    if (!rec.opts) rec.opts = q.blanks.map(b => b.verb ? (q.words ? q.words.choices : VERB_CHOICES) : shuffle([b.answer, ...b.dummies]));
    const atStart = q.template.startsWith("{}");
    let i = 0;
    const body = esc(q.template).replace(/\{\}/g, () => {
      const k = i++;
      const opts = rec.opts[k].map(o =>
        `<option value="${esc(o)}" ${o === rec.sels[k] ? "selected" : ""}>${esc(k === 0 && atStart ? cap(o) : o)}</option>`
      ).join("");
      return `<select data-k="${k}" ${checked ? "disabled" : ""}><option value="">―</option>${opts}</select>`;
    });
    const box = q.words ? q.words.box : VERB_BOX;
    if (box) html += `<div class="verbs">${esc(box)}</div>`;
    html += `<p class="sentence">${body}</p>`;
  }

  if (q.type === "order") {
    if (!rec.pool) {
      do { rec.pool = shuffle(q.chunks); } while (rec.pool.join(" ") === q.answer.join(" "));
      rec.picked = [];
    }
    html += `<p class="sentence" id="line"></p><div class="pool" id="pool"></div>`;
  }

  html += `<div class="actions">`;
  html += `<button id="back" ${pos === 0 ? "disabled" : ""}>もどる</button>`;
  if (!checked) html += `<button id="skip">とばす</button>`;
  html += `<button class="primary" id="main">${checked ? (pos + 1 < queue.length ? "次へ" : "結果を見る") : "答え合わせ"}</button>`;
  html += `</div><div id="fb"></div>`;
  app.innerHTML = html;

  document.getElementById("back").addEventListener("click", () => { pos--; renderQuestion(); });
  if (!checked) document.getElementById("skip").addEventListener("click", onSkip);
  document.getElementById("main").addEventListener("click", onMain);

  if (q.type === "form" && !checked) {
    app.querySelectorAll("#options button").forEach(b => b.addEventListener("click", () => {
      rec.choice = Number(b.dataset.i);
      renderQuestion();
    }));
  }
  if (q.type === "blanks" && !checked) {
    app.querySelectorAll("select").forEach(el => el.addEventListener("change", () => {
      rec.sels[Number(el.dataset.k)] = el.value;
      updateMain(q, rec);
    }));
  }
  if (q.type === "order") renderOrder(q, rec, checked);

  if (checked) renderFeedback(q, rec.result);
  else updateMain(q, rec);
}

function renderOrder(q, rec, checked) {
  const line = document.getElementById("line");
  const poolEl = document.getElementById("pool");

  const chosen = rec.picked.map((pi, k) =>
    `<button class="chunk" data-k="${k}" ${checked ? "disabled" : ""}>${esc(displayChunk(q, rec.pool[pi], k === 0))}</button>`
  ).join(" ");
  const slots = rec.picked.length < rec.pool.length ? ` <span class="slot">&nbsp;</span>` : "";
  line.innerHTML = joinSentence([esc(q.before), chosen + slots, esc(q.after)]);

  poolEl.innerHTML = rec.pool.map((text, pi) =>
    rec.picked.includes(pi) ? "" : `<button class="chunk" data-pi="${pi}" ${checked ? "disabled" : ""}>${esc(text)}</button>`
  ).join("");

  if (checked) return;
  line.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    rec.picked.splice(Number(b.dataset.k), 1);
    renderOrder(q, rec, false);
  }));
  poolEl.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    rec.picked.push(Number(b.dataset.pi));
    renderOrder(q, rec, false);
  }));
  updateMain(q, rec);
}

function isReady(q, rec) {
  if (q.type === "form") return rec.choice !== undefined;
  if (q.type === "blanks") return rec.sels.every(v => v);
  return rec.picked.length === rec.pool.length;
}

function updateMain(q, rec) {
  document.getElementById("main").disabled = !isReady(q, rec);
}

function judge(q, rec) {
  if (q.type === "form") return rec.options[rec.choice].join(" ") === q.answer.join(" ");
  if (q.type === "blanks") return q.blanks.every((b, i) => rec.sels[i] === b.answer);
  return rec.picked.map(pi => rec.pool[pi]).join(" ") === q.answer.join(" ");
}

function renderFeedback(q, result) {
  const marks = {
    correct: `<p class="mark ok">○ 正解</p>`,
    wrong:   `<p class="mark ng">× 不正解</p>`,
    skipped: `<p class="mark">とばした問題</p>`
  };
  let fb = `<div class="feedback">`;
  fb += marks[result];
  fb += `<p class="answer">${esc(fullAnswer(q))}</p>`;
  if (q.trans) fb += `<p>${esc(q.trans)}</p>`;
  if (q.note) fb += `<p class="note">${esc(q.note).replace(/\n/g, "<br>")}</p>`;
  fb += `</div>`;
  document.getElementById("fb").innerHTML = fb;
}

function onMain() {
  const q = QUESTIONS[queue[pos]];
  const rec = records[pos];
  if (isChecked(rec)) { next(); return; }
  rec.result = judge(q, rec) ? "correct" : "wrong";
  sendLog(q, rec);
  renderQuestion();
  document.getElementById("main").focus();
}

function onSkip() {
  records[pos].result = "skipped";
  sendLog(QUESTIONS[queue[pos]], records[pos]);
  renderQuestion();
  document.getElementById("main").focus();
}

function next() {
  pos++;
  if (pos < queue.length) renderQuestion();
  else renderResult();
}

// ---------- 画面：結果 ----------
function renderResult() {
  progressEl.textContent = "";
  const score = records.filter(r => r.result === "correct").length;
  const skipped = records.filter(r => r.result === "skipped").length;
  const missed = queue.filter((_, i) => records[i].result !== "correct");

  let html = `<p class="result">${score} / ${queue.length} 問正解</p>`;
  if (skipped) html += `<p class="ja">とばした問題：${skipped}問</p>`;
  html += `<div class="actions">`;
  if (missed.length) html += `<button class="primary" id="retryWrong">間違えた・とばした問題（${missed.length}問）</button>`;
  html += `<button id="home">問題数を選び直す</button></div>`;
  app.innerHTML = html;

  if (missed.length) document.getElementById("retryWrong").addEventListener("click", () => start(missed, `復習${missed.length}問`));
  document.getElementById("home").addEventListener("click", renderHome);
}

document.getElementById("title").textContent = LESSON_TITLE;
renderHome();
