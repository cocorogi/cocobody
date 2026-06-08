<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>BodyLog</title>
<link rel="manifest" href="manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="こころぎ体重管理">
<meta name="theme-color" content="#1D9E75">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#fff;--bg2:#f7f7f5;--bg3:#f0efe9;
  --tx:#1a1a18;--tx2:#6b6b66;--tx3:#a0a09a;
  --br:rgba(0,0,0,0.1);--br2:rgba(0,0,0,0.18);
  --green:#1D9E75;--green-light:#E1F5EE;--green-dark:#085041;
  --red:#E24B4A;--red-light:#FCEBEB;--red-dark:#791F1F;
  --amber:#BA7517;--amber-light:#FAEEDA;--amber-dark:#633806;
  --blue:#185FA5;--blue-light:#E6F1FB;--blue-dark:#0C447C;
  --r:8px;--rlg:12px;
}
@media(prefers-color-scheme:dark){:root{
  --bg:#1e1e1c;--bg2:#282825;--bg3:#323230;
  --tx:#e8e7e0;--tx2:#9a9991;--tx3:#65645e;
  --br:rgba(255,255,255,0.1);--br2:rgba(255,255,255,0.2);
  --green-light:#085041;--green-dark:#9FE1CB;
  --red-light:#501313;--red-dark:#F09595;
  --amber-light:#412402;--amber-dark:#FAC775;
  --blue-light:#042C53;--blue-dark:#85B7EB;
}}
body{font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans',sans-serif;background:var(--bg3);color:var(--tx);font-size:14px;line-height:1.5;min-height:100vh}

/* ===== 共通 ===== */
.hidden{display:none!important}
button{font-family:inherit;font-size:13px;padding:7px 14px;border-radius:var(--r);border:0.5px solid var(--br2);background:transparent;color:var(--tx);cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s}
button:hover{background:var(--bg2)}
button:active{transform:scale(0.98)}
.btn-primary{background:var(--green);color:#fff;border-color:var(--green)}
.btn-primary:hover{background:#0F6E56;color:#fff}
.btn-danger{color:var(--red);border-color:var(--red)}
.card{background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:16px 20px;margin-bottom:16px}
.card-title{font-size:14px;font-weight:500;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.field{display:flex;flex-direction:column;gap:4px;margin-bottom:12px}
.field label{font-size:12px;color:var(--tx2)}
.field input,.field select,.field textarea{font-family:inherit;font-size:14px;padding:9px 12px;border:0.5px solid var(--br2);border-radius:var(--r);background:var(--bg);color:var(--tx);width:100%}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--green);box-shadow:0 0 0 3px rgba(29,158,117,.12)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.full{grid-column:1/-1}
.metric{background:var(--bg2);border-radius:var(--r);padding:12px 14px}
.metric-label{font-size:11px;color:var(--tx2);margin-bottom:4px}
.metric-value{font-size:22px;font-weight:500}
.metric-delta{font-size:11px;margin-top:2px}
.good{color:var(--green)}.bad{color:var(--red)}.muted{color:var(--tx2)}
.progress-bar{height:4px;background:var(--br);border-radius:2px;overflow:hidden;margin:6px 0 3px}
.progress-fill{height:100%;background:var(--green);border-radius:2px;transition:width .4s}
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:var(--r);font-size:11px}
.badge-success{background:var(--green-light);color:var(--green-dark)}
.badge-warning{background:var(--amber-light);color:var(--amber-dark)}
.badge-danger{background:var(--red-light);color:var(--red-dark)}
.badge-info{background:var(--blue-light);color:var(--blue-dark)}
.avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:500;flex-shrink:0;background:var(--green-light);color:var(--green-dark)}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(12px);background:var(--tx);color:var(--bg);padding:10px 20px;border-radius:20px;font-size:13px;z-index:9999;opacity:0;transition:all .2s;pointer-events:none;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.empty{text-align:center;padding:32px;color:var(--tx3);font-size:13px}
.chart-wrap{position:relative;height:200px}

/* ===== ログイン画面 ===== */
#screen-login{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px}
.login-card{background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:32px;width:100%;max-width:380px}
.login-logo{font-size:24px;font-weight:500;margin-bottom:4px;color:var(--green)}
.login-sub{font-size:13px;color:var(--tx2);margin-bottom:28px}
.login-tabs{display:flex;gap:0;border:0.5px solid var(--br2);border-radius:var(--r);padding:3px;margin-bottom:20px}
.login-tab{flex:1;padding:7px;text-align:center;border-radius:6px;cursor:pointer;font-size:13px;color:var(--tx2);transition:all .15s}
.login-tab.active{background:var(--green);color:#fff;font-weight:500}
.login-error{background:var(--red-light);color:var(--red-dark);border-radius:var(--r);padding:10px 12px;font-size:12px;margin-bottom:12px;display:none}

/* ===== スタッフ画面 ===== */
#screen-staff{display:none;min-height:100vh}
.staff-layout{display:grid;grid-template-columns:220px 1fr;min-height:100vh}
.sidebar{background:var(--bg);border-right:0.5px solid var(--br);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
.sidebar-logo{padding:16px;border-bottom:0.5px solid var(--br)}
.sidebar-logo-title{font-size:15px;font-weight:500;color:var(--green)}
.sidebar-logo-sub{font-size:11px;color:var(--tx2);margin-top:2px}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 16px;cursor:pointer;font-size:13px;color:var(--tx2);border-right:2px solid transparent;transition:all .15s}
.nav-item:hover{background:var(--bg2);color:var(--tx)}
.nav-item.active{background:var(--bg2);color:var(--tx);font-weight:500;border-right-color:var(--green)}
.nav-item i{font-size:16px}
.nav-section{padding:8px 16px 4px;font-size:10px;color:var(--tx3);letter-spacing:.05em;text-transform:uppercase;margin-top:8px}
.client-list-sidebar{flex:1;overflow-y:auto}
.client-item-sidebar{display:flex;align-items:center;gap:8px;padding:7px 16px;cursor:pointer;transition:background .1s}
.client-item-sidebar:hover,.client-item-sidebar.selected{background:var(--bg2)}
.staff-main{padding:20px;overflow-y:auto}
.staff-page{display:none}
.staff-page.active{display:block}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:12px;flex-wrap:wrap}
.page-title{font-size:18px;font-weight:500}
.page-sub{font-size:12px;color:var(--tx2);margin-top:2px}
.metrics4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
.log-table{width:100%;border-collapse:collapse;font-size:12px}
.log-table th{font-size:11px;color:var(--tx2);font-weight:400;padding:6px 8px;border-bottom:0.5px solid var(--br);text-align:left}
.log-table td{padding:7px 8px;border-bottom:0.5px solid var(--br)}
.log-table tr:last-child td{border-bottom:none}
.clients-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.client-card{background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:14px;cursor:pointer;transition:border-color .15s}
.client-card:hover{border-color:var(--br2)}
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;align-items:center;justify-content:center;padding:20px}
.modal-overlay.show{display:flex}
.modal{background:var(--bg);border-radius:var(--rlg);padding:24px;width:100%;max-width:440px;border:0.5px solid var(--br);max-height:90vh;overflow-y:auto}
.modal-title{font-size:16px;font-weight:500;margin-bottom:16px}
.modal-footer{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:16px;border-top:0.5px solid var(--br)}

/* ===== 顧客画面 ===== */
#screen-client{display:none;max-width:480px;margin:0 auto;padding:0 0 80px}
.client-header{background:var(--bg);border-bottom:0.5px solid var(--br);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.client-header-name{font-size:15px;font-weight:500}
.client-header-sub{font-size:11px;color:var(--tx2)}
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--bg);border-top:0.5px solid var(--br);display:flex;z-index:10}
.bottom-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;padding:10px 4px;cursor:pointer;color:var(--tx3);transition:color .15s;font-size:10px;gap:3px}
.bottom-nav-item.active{color:var(--green)}
.bottom-nav-item i{font-size:22px}
.client-page{display:none;padding:16px}
.client-page.active{display:block}
.client-metrics{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.big-metric{background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:16px}
.big-metric-label{font-size:12px;color:var(--tx2);margin-bottom:4px}
.big-metric-value{font-size:28px;font-weight:500}
.big-metric-delta{font-size:12px;margin-top:4px}
.notif{background:var(--green-light);border:0.5px solid #5DCAA5;border-radius:var(--r);padding:10px 14px;font-size:12px;color:var(--green-dark);display:flex;align-items:center;gap:8px;margin-bottom:14px}
.section-label{font-size:12px;font-weight:500;color:var(--tx2);margin-bottom:8px;margin-top:4px}

/* ===== レスポンシブ ===== */
@media(max-width:640px){
  .staff-layout{grid-template-columns:1fr}
  .sidebar{display:none}
  .metrics4{grid-template-columns:1fr 1fr}
  .grid2{grid-template-columns:1fr}
  .staff-main{padding:14px}
  .page-header{flex-direction:column;gap:10px}
  #screen-staff .page-header .btn-row{width:100%;display:flex;gap:8px}
}
</style>
</head>
<body>

<!-- ===== ログイン画面 ===== -->
<div id="screen-login">
  <div class="login-card">
    <div class="login-logo">BodyLog</div>
    <div class="login-sub">ダイエット管理システム</div>
    <div class="login-tabs">
      <div class="login-tab active" id="tab-staff" onclick="switchLoginTab('staff')"><i class="ti ti-shield" style="font-size:14px"></i> スタッフ</div>
      <div class="login-tab" id="tab-client" onclick="switchLoginTab('client')"><i class="ti ti-user" style="font-size:14px"></i> 顧客</div>
    </div>
    <div class="login-error" id="login-error"></div>
    <div class="field"><label id="login-id-label">スタッフID</label><input id="login-id" placeholder="staff01" autocomplete="username"></div>
    <div class="field"><label>パスワード</label><input id="login-pw" type="password" placeholder="••••••" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()"></div>
    <button class="btn-primary" style="width:100%;justify-content:center;padding:11px" onclick="doLogin()">ログイン</button>
    <div style="margin-top:16px;padding:12px;background:var(--bg2);border-radius:var(--r);font-size:11px;color:var(--tx2)">
      <div style="font-weight:500;margin-bottom:4px;color:var(--tx)">デモ用アカウント</div>
      スタッフ: <code>staff01</code> / <code>pass123</code><br>
      顧客: 登録済み顧客の名前 / <code>1234</code>
    </div>
  </div>
</div>

<!-- ===== スタッフ画面 ===== -->
<div id="screen-staff">
  <div class="staff-layout">
    <div class="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-title">BodyLog</div>
        <div class="sidebar-logo-sub" id="staff-name-display"></div>
      </div>
      <div class="nav-item active" onclick="showStaffPage('dashboard')"><i class="ti ti-layout-dashboard"></i>ダッシュボード</div>
      <div class="nav-item" onclick="showStaffPage('clients')"><i class="ti ti-users"></i>顧客一覧</div>
      <div class="nav-item" onclick="showStaffPage('input')"><i class="ti ti-edit"></i>日報入力</div>
      <div class="nav-item" onclick="showStaffPage('report')"><i class="ti ti-chart-line"></i>体重レポート</div>
      <div class="nav-section">顧客を選択</div>
      <div class="client-list-sidebar" id="sidebar-client-list"></div>
      <div style="padding:12px 16px;border-top:0.5px solid var(--br);margin-top:auto">
        <button onclick="logout()" style="width:100%;justify-content:center;font-size:12px;color:var(--tx2)"><i class="ti ti-logout"></i>ログアウト</button>
      </div>
    </div>

    <div class="staff-main">
      <!-- ダッシュボード -->
      <div class="staff-page active" id="sp-dashboard">
        <div class="page-header">
          <div><div class="page-title">ダッシュボード</div><div class="page-sub" id="dash-date"></div></div>
          <div class="btn-row" style="display:flex;gap:8px">
            <button onclick="showStaffPage('input')"><i class="ti ti-plus"></i>日報入力</button>
            <button class="btn-primary" onclick="openClientModal()"><i class="ti ti-user-plus"></i>顧客登録</button>
          </div>
        </div>
        <div class="metrics4" id="dash-metrics"></div>
        <div class="grid2">
          <div class="card"><div class="card-title"><i class="ti ti-chart-bar" style="color:var(--green)"></i>進捗トップ5</div><div id="dash-top"></div></div>
          <div class="card"><div class="card-title"><i class="ti ti-bell" style="color:var(--amber)"></i>要チェック</div><div id="dash-alerts"></div></div>
        </div>
        <div class="card">
          <div class="card-title"><i class="ti ti-activity" style="color:var(--green)"></i>最近の日報</div>
          <table class="log-table"><thead><tr><th>顧客</th><th>日付</th><th>朝体重</th><th>変化</th><th>コメント</th></tr></thead><tbody id="dash-logs"></tbody></table>
        </div>
      </div>

      <!-- 顧客一覧 -->
      <div class="staff-page" id="sp-clients">
        <div class="page-header">
          <div><div class="page-title">顧客一覧</div><div class="page-sub" id="clients-count"></div></div>
          <button class="btn-primary" onclick="openClientModal()"><i class="ti ti-user-plus"></i>新規登録</button>
        </div>
        <div class="clients-grid" id="clients-grid"></div>
      </div>

      <!-- 日報入力（スタッフ） -->
      <div class="staff-page" id="sp-input">
        <div class="page-header">
          <div><div class="page-title">日報入力</div><div class="page-sub" id="staff-input-client">顧客を選択してください</div></div>
        </div>
        <div id="staff-input-empty" class="empty"><i class="ti ti-user" style="font-size:32px;display:block;margin-bottom:8px"></i>左のサイドバーから顧客を選んでください</div>
        <div id="staff-input-form" class="hidden">
          <div class="notif" id="staff-save-notif" style="display:none"><i class="ti ti-check"></i>保存しました</div>
          <div class="card">
            <div class="card-title"><i class="ti ti-scale" style="color:var(--green)"></i>体重</div>
            <div class="grid2">
              <div class="field"><label>朝体重 (kg)*</label><input id="si-m" type="number" step="0.1"></div>
              <div class="field"><label>夜体重 (kg)</label><input id="si-e" type="number" step="0.1"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-title"><i class="ti ti-moon" style="color:#534AB7"></i>睡眠・水分</div>
            <div class="grid2">
              <div class="field"><label>就寝</label><select id="si-sl"><option>22時台</option><option>23時台</option><option>24時台</option><option>25時以降</option></select></div>
              <div class="field"><label>起床</label><select id="si-wk"><option>5時台</option><option>6時台</option><option>7時台</option><option>8時以降</option></select></div>
              <div class="field"><label>睡眠の質</label><select id="si-sq"><option>ぐっすり</option><option>途中目が覚めた</option><option>眠れなかった</option></select></div>
              <div class="field"><label>水分量</label><select id="si-wt"><option>500ml未満</option><option>500ml〜1L</option><option>1L〜1.5L</option><option>1.5L〜2L</option><option>2L以上</option></select></div>
            </div>
          </div>
          <div class="card">
            <div class="card-title"><i class="ti ti-salad" style="color:#639922"></i>食事</div>
            <div id="si-meal-blocks">
              <!-- 朝食 -->
              <div class="meal-block" style="margin-bottom:16px;padding-bottom:16px;border-bottom:0.5px solid var(--br)">
                <div style="font-size:12px;font-weight:500;color:var(--tx2);margin-bottom:8px;display:flex;align-items:center;gap:6px"><i class="ti ti-sun" style="color:#BA7517"></i>朝食</div>
                <div class="grid2">
                  <div class="field"><label>食事時間</label><input id="si-bf-t" type="time"></div>
                  <div class="field"><label>食事量 (g) <span style="color:var(--tx3);font-size:10px">上限300g</span></label>
                    <input id="si-bf-g" type="number" min="0" max="300" placeholder="300" oninput="checkMealAmount(this,'si-bf-warn')">
                    <span id="si-bf-warn" style="display:none;font-size:11px;color:var(--red)">⚠ 300gを超えています</span>
                  </div>
                  <div class="field full"><label>内容</label><input id="si-bf" placeholder="例：白米、卵、味噌汁"></div>
                  <div class="field"><label>写真</label><input type="file" id="si-bf-img" accept="image/*" onchange="previewMeal(this,'si-bf-preview')" style="font-size:12px;padding:5px"></div>
                </div>
                <img id="si-bf-preview" src="" style="display:none;max-width:100%;max-height:160px;border-radius:var(--r);margin-top:6px;object-fit:cover">
              </div>
              <!-- 昼食 -->
              <div class="meal-block" style="margin-bottom:16px;padding-bottom:16px;border-bottom:0.5px solid var(--br)">
                <div style="font-size:12px;font-weight:500;color:var(--tx2);margin-bottom:8px;display:flex;align-items:center;gap:6px"><i class="ti ti-clock" style="color:#185FA5"></i>昼食</div>
                <div class="grid2">
                  <div class="field"><label>食事時間</label><input id="si-lu-t" type="time"></div>
                  <div class="field"><label>食事量 (g) <span style="color:var(--tx3);font-size:10px">上限300g</span></label>
                    <input id="si-lu-g" type="number" min="0" max="300" placeholder="300" oninput="checkMealAmount(this,'si-lu-warn')">
                    <span id="si-lu-warn" style="display:none;font-size:11px;color:var(--red)">⚠ 300gを超えています</span>
                  </div>
                  <div class="field full"><label>内容</label><input id="si-lu" placeholder="例：定食"></div>
                  <div class="field"><label>写真</label><input type="file" id="si-lu-img" accept="image/*" onchange="previewMeal(this,'si-lu-preview')" style="font-size:12px;padding:5px"></div>
                </div>
                <img id="si-lu-preview" src="" style="display:none;max-width:100%;max-height:160px;border-radius:var(--r);margin-top:6px;object-fit:cover">
              </div>
              <!-- 夕食 -->
              <div class="meal-block">
                <div style="font-size:12px;font-weight:500;color:var(--tx2);margin-bottom:8px;display:flex;align-items:center;gap:6px"><i class="ti ti-moon-2" style="color:#534AB7"></i>夕食</div>
                <div class="grid2">
                  <div class="field"><label>食事時間</label><input id="si-di-t" type="time"></div>
                  <div class="field"><label>食事量 (g) <span style="color:var(--tx3);font-size:10px">上限300g</span></label>
                    <input id="si-di-g" type="number" min="0" max="300" placeholder="300" oninput="checkMealAmount(this,'si-di-warn')">
                    <span id="si-di-warn" style="display:none;font-size:11px;color:var(--red)">⚠ 300gを超えています</span>
                  </div>
                  <div class="field full"><label>内容</label><input id="si-di" placeholder="例：鍋"></div>
                  <div class="field"><label>写真</label><input type="file" id="si-di-img" accept="image/*" onchange="previewMeal(this,'si-di-preview')" style="font-size:12px;padding:5px"></div>
                </div>
                <img id="si-di-preview" src="" style="display:none;max-width:100%;max-height:160px;border-radius:var(--r);margin-top:6px;object-fit:cover">
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-title"><i class="ti ti-run" style="color:var(--amber)"></i>運動・その他</div>
            <div class="grid2">
              <div class="field"><label>排尿回数</label><input id="si-ur" type="number" min="0" placeholder="例：6"></div>
              <div class="field"><label>排便回数</label><input id="si-st" type="number" min="0" placeholder="例：1"></div>
              <div class="field"><label>外食</label><select id="si-eo"><option>なし</option><option>あり</option></select></div>
              <div class="field"><label>運動</label><input id="si-ex" placeholder="ウォーキング30分"></div>
              <div class="field full"><label>コメント</label><textarea id="si-cm" rows="3" placeholder="体調の変化、気づきなど..."></textarea></div>
            </div>
          </div>
          <div style="display:flex;gap:8px;justify-content:flex-end">
            <button onclick="clearStaffInput()"><i class="ti ti-x"></i>クリア</button>
            <button class="btn-primary" onclick="saveLog('staff')"><i class="ti ti-device-floppy"></i>保存する</button>
          </div>
        </div>
      </div>

      <!-- 体重レポート -->
      <div class="staff-page" id="sp-report">
        <div class="page-header">
          <div><div class="page-title">体重レポート</div><div class="page-sub" id="report-name"></div></div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <select onchange="filterDays(this.value)" style="font-size:12px;padding:6px 10px;border:0.5px solid var(--br2);border-radius:var(--r);background:var(--bg);color:var(--tx)">
              <option value="30">直近30日</option><option value="60">直近60日</option><option value="90">直近90日</option><option value="999">全期間</option>
            </select>
            <button class="btn-danger" onclick="deleteClient()"><i class="ti ti-trash"></i>削除</button>
          </div>
        </div>
        <div class="metrics4" id="report-metrics"></div>
        <div class="card"><div class="card-title"><i class="ti ti-chart-line" style="color:var(--green)"></i>体重推移</div><div class="chart-wrap"><canvas id="staffWeightChart"></canvas></div></div>
        <div class="grid2">
          <div class="card">
            <div class="card-title"><i class="ti ti-list" style="color:var(--green)"></i>日別記録</div>
            <div style="max-height:280px;overflow-y:auto"><table class="log-table"><thead><tr><th>日付</th><th>朝体重</th><th>変化</th><th>コメント</th></tr></thead><tbody id="report-logs"></tbody></table></div>
          </div>
          <div class="card"><div class="card-title"><i class="ti ti-message" style="color:var(--blue)"></i>最近のコメント</div><div id="report-comments"></div></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 顧客登録モーダル -->
<div class="modal-overlay" id="modal-client">
  <div class="modal">
    <div class="modal-title" id="modal-client-title">新規顧客登録</div>
    <div class="grid2">
      <div class="field full"><label>氏名*</label><input id="c-name" placeholder="こころぎ 太郎"></div>
      <div class="field"><label>年齢</label><input id="c-age" type="number" placeholder="40"></div>
      <div class="field"><label>身長 (cm)</label><input id="c-height" type="number" placeholder="158"></div>
      <div class="field"><label>開始体重 (kg)*</label><input id="c-start" type="number" step="0.1" placeholder="65.0"></div>
      <div class="field"><label>目標体重 (kg)*</label><input id="c-goal" type="number" step="0.1" placeholder="52.0"></div>
      <div class="field"><label>ログインID（顧客用）</label><input id="c-lid" placeholder="tanaka01"></div>
      <div class="field"><label>パスワード（顧客用）</label><input id="c-lpw" placeholder="1234" type="password"></div>
    </div>
    <div class="modal-footer">
      <button onclick="closeModal()">キャンセル</button>
      <button class="btn-primary" onclick="saveClient()"><i class="ti ti-check"></i>登録</button>
    </div>
  </div>
</div>

<!-- ===== 顧客画面 ===== -->
<div id="screen-client">
  <div class="client-header">
    <div>
      <div class="client-header-name" id="client-header-name"></div>
      <div class="client-header-sub" id="client-header-sub"></div>
    </div>
    <button onclick="logout()" style="font-size:12px;color:var(--tx2);border:none;padding:6px"><i class="ti ti-logout"></i></button>
  </div>

  <!-- ホーム -->
  <div class="client-page active" id="cp-home">
    <div style="padding:16px 0 8px">
      <div class="client-metrics">
        <div class="big-metric">
          <div class="big-metric-label">現在の体重</div>
          <div class="big-metric-value" id="cl-current-w">—</div>
          <div class="big-metric-delta" id="cl-delta"></div>
        </div>
        <div class="big-metric">
          <div class="big-metric-label">目標まで</div>
          <div class="big-metric-value" id="cl-remain">—</div>
          <div class="big-metric-delta muted">kg</div>
        </div>
      </div>
      <!-- 前日夜→当日朝の増減 -->
      <div style="background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:14px;margin-bottom:10px">
        <div style="font-size:12px;color:var(--tx2);margin-bottom:8px;font-weight:500">🌙 前日の夜 → 今朝の増減</div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="text-align:center">
            <div style="font-size:11px;color:var(--tx3)">前日夜</div>
            <div style="font-size:18px;font-weight:500" id="cl-prev-eve">—</div>
          </div>
          <div style="font-size:20px;color:var(--tx3)">→</div>
          <div style="text-align:center">
            <div style="font-size:11px;color:var(--tx3)">今朝</div>
            <div style="font-size:18px;font-weight:500" id="cl-this-morn">—</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:11px;color:var(--tx3)">増減</div>
            <div style="font-size:20px;font-weight:500" id="cl-overnight-delta">—</div>
          </div>
        </div>
      </div>
      <!-- 今日の合計摂取量 -->
      <div style="background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:14px;margin-bottom:10px">
        <div style="font-size:12px;color:var(--tx2);margin-bottom:8px;font-weight:500">🍽 今日の合計摂取量</div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="flex:1">
            <div class="progress-bar" style="height:10px;margin:0"><div id="cl-intake-bar" class="progress-fill" style="width:0%;background:var(--amber)"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--tx3);margin-top:4px"><span>0g</span><span>上限900g</span></div>
          </div>
          <div style="font-size:22px;font-weight:500;min-width:70px;text-align:right" id="cl-intake-total">—</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px;font-size:11px;color:var(--tx2)" id="cl-intake-detail"></div>
      </div>
      <div style="background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:14px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--tx2);margin-bottom:6px">
          <span>目標進捗</span><span id="cl-prog-pct">0%</span>
        </div>
        <div class="progress-bar" style="height:8px;margin:0"><div class="progress-fill" id="cl-prog-bar" style="width:0%"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--tx3);margin-top:6px">
          <span id="cl-start-w"></span><span id="cl-goal-w"></span>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-chart-line" style="color:var(--green)"></i>体重の変化</div>
      <div class="chart-wrap"><canvas id="clientWeightChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-calendar" style="color:var(--tx2)"></i>直近の記録</div>
      <div id="cl-recent-logs"></div>
    </div>
  </div>

  <!-- 日報入力（顧客） -->
  <div class="client-page" id="cp-input">
    <div style="padding-top:8px">
      <div class="notif" id="cl-save-notif" style="display:none"><i class="ti ti-check"></i>記録を保存しました！</div>
      <div class="section-label">体重</div>
      <div class="grid2" style="margin-bottom:14px">
        <div class="field"><label>朝体重 (kg)*</label><input id="ci-m" type="number" step="0.1" inputmode="decimal"></div>
        <div class="field"><label>夜体重 (kg)</label><input id="ci-e" type="number" step="0.1" inputmode="decimal"></div>
      </div>
      <div class="section-label">睡眠・水分</div>
      <div class="grid2" style="margin-bottom:14px">
        <div class="field"><label>睡眠の質</label><select id="ci-sq"><option>ぐっすり</option><option>途中目が覚めた</option><option>眠れなかった</option></select></div>
        <div class="field"><label>水分量</label><select id="ci-wt"><option>500ml未満</option><option>500ml〜1L</option><option>1L〜1.5L</option><option>1.5L〜2L</option><option>2L以上</option></select></div>
      </div>
      <div class="section-label">食事</div>
      <!-- 朝食 -->
      <div style="background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:14px;margin-bottom:10px">
        <div style="font-size:12px;font-weight:500;margin-bottom:10px;display:flex;align-items:center;gap:6px"><i class="ti ti-sun" style="color:#BA7517"></i>朝食</div>
        <div class="grid2">
          <div class="field"><label>食事時間</label><input id="ci-bf-t" type="time"></div>
          <div class="field"><label>食事量 (g) <span style="color:var(--tx3);font-size:10px">上限300g</span></label>
            <input id="ci-bf-g" type="number" min="0" max="300" inputmode="numeric" placeholder="300" oninput="checkMealAmount(this,'ci-bf-warn')">
            <span id="ci-bf-warn" style="display:none;font-size:11px;color:var(--red)">⚠ 300gを超えています</span>
          </div>
        </div>
        <div class="field"><label>内容</label><input id="ci-bf" placeholder="例：白米、卵、味噌汁"></div>
        <div class="field"><label>写真</label><input type="file" id="ci-bf-img" accept="image/*" capture="environment" onchange="previewMeal(this,'ci-bf-preview')" style="font-size:13px;padding:6px"></div>
        <img id="ci-bf-preview" src="" style="display:none;width:100%;max-height:200px;border-radius:var(--r);margin-top:6px;object-fit:cover">
      </div>
      <!-- 昼食 -->
      <div style="background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:14px;margin-bottom:10px">
        <div style="font-size:12px;font-weight:500;margin-bottom:10px;display:flex;align-items:center;gap:6px"><i class="ti ti-clock" style="color:#185FA5"></i>昼食</div>
        <div class="grid2">
          <div class="field"><label>食事時間</label><input id="ci-lu-t" type="time"></div>
          <div class="field"><label>食事量 (g) <span style="color:var(--tx3);font-size:10px">上限300g</span></label>
            <input id="ci-lu-g" type="number" min="0" max="300" inputmode="numeric" placeholder="300" oninput="checkMealAmount(this,'ci-lu-warn')">
            <span id="ci-lu-warn" style="display:none;font-size:11px;color:var(--red)">⚠ 300gを超えています</span>
          </div>
        </div>
        <div class="field"><label>内容</label><input id="ci-lu" placeholder="例：定食"></div>
        <div class="field"><label>写真</label><input type="file" id="ci-lu-img" accept="image/*" capture="environment" onchange="previewMeal(this,'ci-lu-preview')" style="font-size:13px;padding:6px"></div>
        <img id="ci-lu-preview" src="" style="display:none;width:100%;max-height:200px;border-radius:var(--r);margin-top:6px;object-fit:cover">
      </div>
      <!-- 夕食 -->
      <div style="background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:14px;margin-bottom:14px">
        <div style="font-size:12px;font-weight:500;margin-bottom:10px;display:flex;align-items:center;gap:6px"><i class="ti ti-moon-2" style="color:#534AB7"></i>夕食</div>
        <div class="grid2">
          <div class="field"><label>食事時間</label><input id="ci-di-t" type="time"></div>
          <div class="field"><label>食事量 (g) <span style="color:var(--tx3);font-size:10px">上限300g</span></label>
            <input id="ci-di-g" type="number" min="0" max="300" inputmode="numeric" placeholder="300" oninput="checkMealAmount(this,'ci-di-warn')">
            <span id="ci-di-warn" style="display:none;font-size:11px;color:var(--red)">⚠ 300gを超えています</span>
          </div>
        </div>
        <div class="field"><label>内容</label><input id="ci-di" placeholder="例：鍋"></div>
        <div class="field"><label>写真</label><input type="file" id="ci-di-img" accept="image/*" capture="environment" onchange="previewMeal(this,'ci-di-preview')" style="font-size:13px;padding:6px"></div>
        <img id="ci-di-preview" src="" style="display:none;width:100%;max-height:200px;border-radius:var(--r);margin-top:6px;object-fit:cover">
      </div>
      <div class="section-label">運動・コメント</div>
      <div class="field" style="margin-bottom:8px"><label>今日の運動</label><input id="ci-ex" placeholder="ウォーキング30分など"></div>
      <div class="field" style="margin-bottom:16px"><label>今日の気持ち・コメント</label><textarea id="ci-cm" rows="3" placeholder="体調の変化、気づきなど..."></textarea></div>
      <button class="btn-primary" style="width:100%;justify-content:center;padding:13px;font-size:15px" onclick="saveLog('client')"><i class="ti ti-device-floppy"></i>今日の記録を保存する</button>
    </div>
  </div>

  <!-- 記録一覧（顧客） -->
  <div class="client-page" id="cp-history">
    <div style="padding-top:8px">
      <div class="card-title" style="margin-bottom:12px"><i class="ti ti-list" style="color:var(--green)"></i>記録一覧</div>
      <div id="cl-history"></div>
    </div>
  </div>

  <div class="bottom-nav">
    <div class="bottom-nav-item active" onclick="showClientPage('home',this)"><i class="ti ti-home"></i>ホーム</div>
    <div class="bottom-nav-item" onclick="showClientPage('input',this)"><i class="ti ti-edit"></i>記録する</div>
    <div class="bottom-nav-item" onclick="showClientPage('history',this)"><i class="ti ti-list"></i>履歴</div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
/* ===== Supabase設定 ===== */
const SUPABASE_URL = 'https://turtmiiofprajatbywlp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kjp9yy30BqcQ8C4hAS-QTw_Jk0knW6R';

const S_SESSION = 'bl:session';
let clients=[], logs=[], session=null, currentClientId=null, currentDays=30;
let staffChart=null, clientChart=null, editingId=null, loginMode='staff';

/* ===== Supabase APIラッパー ===== */
async function sbFetch(path, method='GET', body=null){
  const opts={method, headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json','Prefer':'return=representation'}};
  if(body) opts.body=JSON.stringify(body);
  const res=await fetch(SUPABASE_URL+'/rest/v1/'+path, opts);
  if(!res.ok){const e=await res.text();throw new Error(e);}
  const text=await res.text();
  return text?JSON.parse(text):[];
}

/* ===== データ読み込み ===== */
async function load(){
  try{
    const [cs,ls]=await Promise.all([
      sbFetch('clients?select=*&order=created_at.asc'),
      sbFetch('logs?select=*&order=date.asc'),
    ]);
    clients=cs.map(r=>({id:r.id,name:r.name,age:r.age,height:r.height,startWeight:r.start_weight,goalWeight:r.goal_weight,loginId:r.login_id,loginPw:r.login_pw,loginPwHash:r.login_pw_hash,staff:r.staff,createdAt:r.created_at}));
    logs=ls.map(r=>({id:r.id,clientId:r.client_id,date:r.date,morning:r.morning,evening:r.evening,sleepQuality:r.sleep_quality,water:r.water,breakfast:r.breakfast,breakfastTime:r.breakfast_time,breakfastG:r.breakfast_g,breakfastImg:r.breakfast_img,lunch:r.lunch,lunchTime:r.lunch_time,lunchG:r.lunch_g,lunchImg:r.lunch_img,dinner:r.dinner,dinnerTime:r.dinner_time,dinnerG:r.dinner_g,dinnerImg:r.dinner_img,urineCount:r.urine_count,stoolCount:r.stool_count,exercise:r.exercise,comment:r.comment}));
  } catch(e){console.error('load error',e);clients=[];logs=[];}
  try{session=JSON.parse(localStorage.getItem(S_SESSION)||'null');}catch(e){session=null;}
}

/* ===== 顧客保存 ===== */
async function saveClientToDb(c){
  const row={id:c.id,name:c.name,age:c.age,height:c.height,start_weight:c.startWeight,goal_weight:c.goalWeight,login_id:c.loginId,login_pw:c.loginPw,login_pw_hash:c.loginPwHash,staff:c.staff,created_at:c.createdAt};
  await sbFetch('clients?on_conflict=id','POST',[row]);
}

/* ===== 日報保存 ===== */
async function saveLogToDb(l){
  const row={id:l.id,client_id:l.clientId,date:l.date,morning:l.morning,evening:l.evening,sleep_quality:l.sleepQuality,water:l.water,breakfast:l.breakfast,breakfast_time:l.breakfastTime,breakfast_g:l.breakfastG,breakfast_img:l.breakfastImg,lunch:l.lunch,lunch_time:l.lunchTime,lunch_g:l.lunchG,lunch_img:l.lunchImg,dinner:l.dinner,dinner_time:l.dinnerTime,dinner_g:l.dinnerG,dinner_img:l.dinnerImg,urine_count:l.urineCount,stool_count:l.stoolCount,exercise:l.exercise,comment:l.comment};
  await sbFetch('logs?on_conflict=id','POST',[row]);
}

/* ===== 削除 ===== */
async function deleteClientFromDb(id){
  await sbFetch(`logs?client_id=eq.${id}`,'DELETE');
  await sbFetch(`clients?id=eq.${id}`,'DELETE');
}
async function deleteLogFromDb(id){
  await sbFetch(`logs?id=eq.${id}`,'DELETE');
}

/* ===== セッション（localStorageに保存） ===== */
function saveSession(){localStorage.setItem(S_SESSION,JSON.stringify(session));}
function clearSession(){localStorage.removeItem(S_SESSION);}

/* ===== save関数（後方互換のため残す） ===== */
async function save(){/* Supabase版では個別保存なので不要 */}

function toast(msg,ms=2500){
  const el=document.getElementById('toast');
  el.textContent=msg; el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),ms);
}
function initials(n){const p=n.trim().split(/\s+/);return p.length>=2?p[0][0]+p[1][0]:n.slice(0,2)}
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function fmtDate(s){if(!s)return '';const d=new Date(s);return `${d.getMonth()+1}/${d.getDate()}`}
function clientLogs(id,days=999){
  const cut=new Date(); cut.setDate(cut.getDate()-days);
  return logs.filter(l=>l.clientId===id&&new Date(l.date)>=cut).sort((a,b)=>a.date.localeCompare(b.date));
}

/* ===== ログイン ===== */
function switchLoginTab(mode){
  loginMode=mode;
  document.getElementById('tab-staff').classList.toggle('active',mode==='staff');
  document.getElementById('tab-client').classList.toggle('active',mode==='client');
  document.getElementById('login-id-label').textContent=mode==='staff'?'スタッフID':'ログインID（顧客）';
  document.getElementById('login-id').placeholder=mode==='staff'?'staff01':'kokorogi01';
}

/* ===== パスワードハッシュ化 ===== */
async function hashPassword(pw){
  const buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

/* ===== ログイン ===== */
function switchLoginTab(mode){
  loginMode=mode;
  document.getElementById('tab-staff').classList.toggle('active',mode==='staff');
  document.getElementById('tab-client').classList.toggle('active',mode==='client');
  document.getElementById('login-id-label').textContent=mode==='staff'?'スタッフID':'ログインID（顧客）';
  document.getElementById('login-id').placeholder=mode==='staff'?'staff01':'kokorogi01';
}

async function doLogin(){
  const id=document.getElementById('login-id').value.trim();
  const pw=document.getElementById('login-pw').value;
  const errEl=document.getElementById('login-error');
  errEl.style.display='none';
  if(loginMode==='staff'){
    const staff=[{id:'staff01',pw:'pass123',name:'山本 スタッフ'},{id:'staff02',pw:'pass123',name:'佐藤 スタッフ'}];
    const found=staff.find(s=>s.id===id&&s.pw===pw);
    if(!found){errEl.textContent='IDまたはパスワードが違います';errEl.style.display='block';return;}
    session={role:'staff',id,name:found.name}; saveSession(); enterStaff();
  } else {
    const hash=await hashPassword(pw);
    // ハッシュ化パスワードで照合（平文フォールバックあり）
    const c=clients.find(c=>c.loginId===id&&(c.loginPwHash===hash||c.loginPw===pw));
    if(!c){errEl.textContent='IDまたはパスワードが違います';errEl.style.display='block';return;}
    session={role:'client',clientId:c.id,name:c.name}; saveSession(); enterClient(c.id);
  }
}

function logout(){
  clearSession(); session=null; currentClientId=null;
  ['screen-login','screen-staff','screen-client'].forEach(id=>document.getElementById(id).style.display='');
  document.getElementById('screen-login').style.display='flex';
  document.getElementById('screen-staff').style.display='none';
  document.getElementById('screen-client').style.display='none';
  document.getElementById('login-id').value='';
  document.getElementById('login-pw').value='';
}

function enterStaff(){
  document.getElementById('screen-login').style.display='none';
  document.getElementById('screen-staff').style.display='block';
  document.getElementById('screen-client').style.display='none';
  document.getElementById('staff-name-display').textContent=session.name;
  renderSidebarClients();
  buildDashboard();
  if(clients.length) selectClient(clients[0].id,'staff');
}

function enterClient(cid){
  currentClientId=cid;
  document.getElementById('screen-login').style.display='none';
  document.getElementById('screen-staff').style.display='none';
  document.getElementById('screen-client').style.display='block';
  const c=clients.find(x=>x.id===cid);
  document.getElementById('client-header-name').textContent=c.name;
  document.getElementById('client-header-sub').textContent='目標 '+c.goalWeight+'kg';
  buildClientHome();
}

/* ===== サイドバー顧客リスト ===== */
function renderSidebarClients(){
  const el=document.getElementById('sidebar-client-list');
  if(!clients.length){el.innerHTML='<div class="empty" style="padding:12px;font-size:11px">顧客がいません</div>';return;}
  el.innerHTML=clients.map(c=>`
    <div class="client-item-sidebar ${c.id===currentClientId?'selected':''}" id="sbc-${c.id}" onclick="selectClient('${c.id}','staff')">
      <div class="avatar" style="width:26px;height:26px;font-size:10px">${initials(c.name)}</div>
      <div><div style="font-size:12px;font-weight:500">${c.name}</div><div style="font-size:10px;color:var(--tx2)">目標 ${c.goalWeight}kg</div></div>
    </div>`).join('');
}

function selectClient(id,role){
  currentClientId=id;
  const c=clients.find(x=>x.id===id);
  if(!c)return;
  document.querySelectorAll('.client-item-sidebar').forEach(el=>el.classList.remove('selected'));
  const el=document.getElementById('sbc-'+id);
  if(el)el.classList.add('selected');
  document.getElementById('staff-input-client').textContent='顧客: '+c.name;
  document.getElementById('staff-input-empty').classList.add('hidden');
  document.getElementById('staff-input-form').classList.remove('hidden');
  document.getElementById('report-name').textContent=c.name+' — 開始体重 '+c.startWeight+'kg';
  if(document.getElementById('sp-report').classList.contains('active'))buildReport();
}

/* ===== スタッフページ切替 ===== */
function showStaffPage(name){
  document.querySelectorAll('.staff-page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('sp-'+name).classList.add('active');
  const labels={dashboard:'ダッシュ',clients:'顧客一覧',input:'日報入力',report:'体重レポート'};
  document.querySelectorAll('.nav-item').forEach(n=>{if(n.textContent.trim().includes(labels[name]||'_'))n.classList.add('active');});
  if(name==='dashboard')buildDashboard();
  if(name==='clients')buildClientsGrid();
  if(name==='report'&&currentClientId)buildReport();
}

/* ===== 顧客ページ切替 ===== */
function showClientPage(name,el){
  document.querySelectorAll('.client-page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('cp-'+name).classList.add('active');
  el.classList.add('active');
  if(name==='home')buildClientHome();
  if(name==='history')buildClientHistory();
}

/* ===== 顧客登録モーダル ===== */
function openClientModal(idToEdit=null){
  editingId=idToEdit;
  document.getElementById('modal-client-title').textContent=idToEdit?'顧客情報を編集':'新規顧客登録';
  const fields=['c-name','c-age','c-height','c-start','c-goal','c-lid','c-lpw'];
  if(idToEdit){
    const c=clients.find(x=>x.id===idToEdit);
    if(c){
      document.getElementById('c-name').value=c.name;
      document.getElementById('c-age').value=c.age||'';
      document.getElementById('c-height').value=c.height||'';
      document.getElementById('c-start').value=c.startWeight;
      document.getElementById('c-goal').value=c.goalWeight;
      document.getElementById('c-lid').value=c.loginId||'';
      document.getElementById('c-lpw').value=c.loginPw||'';
    }
  } else {fields.forEach(f=>document.getElementById(f).value='');}
  document.getElementById('modal-client').classList.add('show');
}
function closeModal(){document.getElementById('modal-client').classList.remove('show');}
async function saveClient(){
  const name=document.getElementById('c-name').value.trim();
  const start=parseFloat(document.getElementById('c-start').value);
  const goal=parseFloat(document.getElementById('c-goal').value);
  const loginPw=document.getElementById('c-lpw').value;
  if(!name||isNaN(start)||isNaN(goal)){toast('氏名・開始体重・目標体重は必須です');return;}
  const pwHash=loginPw?await hashPassword(loginPw):null;
  let c;
  if(editingId){
    c=clients.find(x=>x.id===editingId);
    if(c){
      c.name=name;c.age=parseInt(document.getElementById('c-age').value)||null;
      c.height=parseInt(document.getElementById('c-height').value)||null;
      c.startWeight=start;c.goalWeight=goal;
      c.loginId=document.getElementById('c-lid').value.trim();
      if(loginPw){c.loginPw=null;c.loginPwHash=pwHash;}
    }
  } else {
    c={id:'c_'+Date.now(),name,age:parseInt(document.getElementById('c-age').value)||null,height:parseInt(document.getElementById('c-height').value)||null,startWeight:start,goalWeight:goal,loginId:document.getElementById('c-lid').value.trim(),loginPw:null,loginPwHash:pwHash,createdAt:today()};
    clients.push(c);
  }
  try{
    await saveClientToDb(c);
    toast(editingId?'更新しました':'登録しました');
  }catch(e){toast('保存エラー: '+e.message);return;}
  closeModal(); renderSidebarClients(); buildClientsGrid(); buildDashboard();
}
async function deleteClient(){
  if(!currentClientId){toast('顧客を選択してください');return;}
  const c=clients.find(x=>x.id===currentClientId);
  if(!c||!confirm(c.name+'さんを削除しますか？'))return;
  try{
    await deleteClientFromDb(currentClientId);
    clients=clients.filter(x=>x.id!==currentClientId);
    logs=logs.filter(x=>x.clientId!==currentClientId);
    currentClientId=null;
    renderSidebarClients(); buildClientsGrid(); buildDashboard(); showStaffPage('clients');
    toast('削除しました');
  }catch(e){toast('削除エラー: '+e.message);}
}

/* ===== 食事量チェック・写真プレビュー ===== */
function checkMealAmount(input,warnId){
  const v=parseInt(input.value);
  const warn=document.getElementById(warnId);
  if(v>300){input.style.borderColor='var(--red)';warn.style.display='block';}
  else{input.style.borderColor='';warn.style.display='none';}
}
function previewMeal(input,previewId){
  const file=input.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{const img=document.getElementById(previewId);img.src=e.target.result;img.style.display='block';};
  reader.readAsDataURL(file);
}
function readFileAsBase64(inputId){
  return new Promise(resolve=>{
    const el=document.getElementById(inputId);
    const file=el?.files?.[0];
    if(!file){resolve(null);return;}
    const r=new FileReader();
    r.onload=e=>resolve(e.target.result);
    r.readAsDataURL(file);
  });
}
function hasMealOverLimit(p){
  return ['bf','lu','di'].some(m=>{const v=parseInt(document.getElementById(`${p}-${m}-g`)?.value||'0');return v>300;});
}

/* ===== 日報保存 ===== */
async function saveLog(role){
  const isStaff=role==='staff';
  const p=isStaff?'si':'ci';
  const morning=parseFloat(document.getElementById(`${p}-m`).value);
  if(isNaN(morning)){toast('朝体重を入力してください');return;}
  if(hasMealOverLimit(p)){if(!confirm('300gを超えている食事があります。このまま保存しますか？'))return;}
  const [bfImg,luImg,diImg]=await Promise.all([
    readFileAsBase64(`${p}-bf-img`),
    readFileAsBase64(`${p}-lu-img`),
    readFileAsBase64(`${p}-di-img`),
  ]);
  const existing=logs.find(l=>l.clientId===currentClientId&&l.date===today());
  const log={
    id:existing?existing.id:'l_'+Date.now(),
    clientId:currentClientId, date:today(), morning,
    evening:parseFloat(document.getElementById(`${p}-e`).value)||null,
    sleepQuality:document.getElementById(`${p}-sq`).value,
    water:document.getElementById(`${p}-wt`).value,
    breakfast:document.getElementById(`${p}-bf`).value,
    breakfastTime:document.getElementById(`${p}-bf-t`)?.value||null,
    breakfastG:parseInt(document.getElementById(`${p}-bf-g`)?.value)||null,
    breakfastImg:bfImg||existing?.breakfastImg||null,
    lunch:document.getElementById(`${p}-lu`).value,
    lunchTime:document.getElementById(`${p}-lu-t`)?.value||null,
    lunchG:parseInt(document.getElementById(`${p}-lu-g`)?.value)||null,
    lunchImg:luImg||existing?.lunchImg||null,
    dinner:document.getElementById(`${p}-di`).value,
    dinnerTime:document.getElementById(`${p}-di-t`)?.value||null,
    dinnerG:parseInt(document.getElementById(`${p}-di-g`)?.value)||null,
    dinnerImg:diImg||existing?.dinnerImg||null,
    urineCount:parseInt(document.getElementById(`${p}-ur`)?.value)||null,
    stoolCount:parseInt(document.getElementById(`${p}-st`)?.value)||null,
    exercise:document.getElementById(`${p}-ex`).value,
    comment:document.getElementById(`${p}-cm`).value
  };
  if(existing){if(!confirm('今日の記録があります。上書きしますか？'))return;}
  try{
    await saveLogToDb(log);
    const idx=logs.findIndex(l=>l.id===log.id);
    if(idx>=0)logs[idx]=log; else logs.push(log);
    toast('保存しました');
    const nel=document.getElementById(isStaff?'staff-save-notif':'cl-save-notif');
    nel.style.display='flex'; setTimeout(()=>nel.style.display='none',3000);
    if(!isStaff)buildClientHome();
  }catch(e){toast('保存エラー: '+e.message);}
}
function clearStaffInput(){
  ['si-m','si-e','si-bf','si-bf-g','si-lu','si-lu-g','si-di','si-di-g','si-ex','si-cm'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['si-bf-img','si-lu-img','si-di-img'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['si-bf-preview','si-lu-preview','si-di-preview'].forEach(id=>{const el=document.getElementById(id);if(el){el.src='';el.style.display='none';}});
  ['si-bf-warn','si-lu-warn','si-di-warn'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
}
/* ===== ダッシュボード ===== */
function buildDashboard(){
  document.getElementById('dash-date').textContent=new Date().toLocaleDateString('ja-JP',{year:'numeric',month:'long',day:'numeric',weekday:'short'});
  const total=clients.length;
  const wk=new Date(); wk.setDate(wk.getDate()-7);
  const sub=new Set(logs.filter(l=>new Date(l.date)>=wk).map(l=>l.clientId)).size;
  const rate=total?Math.round(sub/total*100):0;
  let dsum=0,dcnt=0;
  clients.forEach(c=>{const ls=clientLogs(c.id);if(ls.length>=2){dsum+=ls[ls.length-1].morning-ls[0].morning;dcnt++;}});
  const avg=dcnt?(dsum/dcnt).toFixed(1):'—';
  document.getElementById('dash-metrics').innerHTML=`
    <div class="metric"><div class="metric-label">登録顧客数</div><div class="metric-value">${total}</div><div class="metric-delta muted">人</div></div>
    <div class="metric"><div class="metric-label">平均減量</div><div class="metric-value">${avg!=='—'?(avg<0?avg:'+'+avg)+'kg':'—'}</div><div class="metric-delta ${avg<0?'good':'muted'}">開始比</div></div>
    <div class="metric"><div class="metric-label">今週提出率</div><div class="metric-value">${rate}%</div><div class="metric-delta muted">${sub}/${total}人</div></div>
    <div class="metric"><div class="metric-label">累計記録</div><div class="metric-value">${logs.length}</div><div class="metric-delta muted">件</div></div>`;

  if(!clients.length){document.getElementById('dash-top').innerHTML='<div class="empty">顧客を登録してください</div>';document.getElementById('dash-alerts').innerHTML='';document.getElementById('dash-logs').innerHTML='';return;}
  const ranked=clients.map(c=>{const ls=clientLogs(c.id);const d=ls.length>=2?ls[ls.length-1].morning-ls[0].morning:0;const p=ls.length?Math.min(100,Math.max(0,Math.round((c.startWeight-ls[ls.length-1].morning)/(c.startWeight-c.goalWeight)*100))):0;return{c,d,p,last:ls[ls.length-1]};}).sort((a,b)=>a.d-b.d).slice(0,5);
  document.getElementById('dash-top').innerHTML=ranked.map(r=>`
    <div style="padding:7px 0;border-bottom:0.5px solid var(--br)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:8px"><div class="avatar" style="width:22px;height:22px;font-size:9px">${initials(r.c.name)}</div><span style="font-size:12px;font-weight:500">${r.c.name}</span></div>
        <span style="font-size:12px;font-weight:500;color:${r.d<0?'var(--green)':'var(--red)'}">${r.d<0?r.d.toFixed(1):'+'+r.d.toFixed(1)}kg</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${r.p}%"></div></div>
      <div style="font-size:10px;color:var(--tx2)">進捗 ${r.p}% / 残り ${r.last?(r.last.morning-r.c.goalWeight).toFixed(1)+'kg':'—'}</div>
    </div>`).join('');
  const stale=clients.filter(c=>{const ls=clientLogs(c.id,7);return !ls.length;}).slice(0,4);
  document.getElementById('dash-alerts').innerHTML=stale.length?stale.map(c=>`
    <div style="padding:7px 0;border-bottom:0.5px solid var(--br)">
      <div style="display:flex;align-items:center;gap:8px"><span class="badge badge-warning"><i class="ti ti-clock"></i>記録途絶</span><span style="font-size:12px">${c.name}</span></div>
      <div style="font-size:11px;color:var(--tx2);margin-top:3px">7日以上記録なし</div>
    </div>`).join(''):'<div style="padding:12px;font-size:12px;color:var(--tx2)">要チェック顧客はいません</div>';
  const recent=[...logs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10);
  document.getElementById('dash-logs').innerHTML=recent.map(l=>{
    const c=clients.find(x=>x.id===l.clientId);
    const prev=clientLogs(l.clientId).filter(x=>x.date<l.date).pop();
    const d=prev?+(l.morning-prev.morning).toFixed(2):null;
    return `<tr><td>${c?c.name.split(' ')[0]:'?'}</td><td style="color:var(--tx2)">${fmtDate(l.date)}</td><td style="font-weight:500">${l.morning}kg</td><td style="color:${d===null?'var(--tx2)':d<0?'var(--green)':'var(--red)'}">${d===null?'—':(d<0?d:'+'+d)+'kg'}</td><td style="color:var(--tx2);max-width:120px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${l.comment||'—'}</td></tr>`;
  }).join('')||'<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--tx3)">日報がありません</td></tr>';
}

/* ===== 顧客グリッド ===== */
function buildClientsGrid(){
  document.getElementById('clients-count').textContent='全 '+clients.length+' 名';
  document.getElementById('clients-grid').innerHTML=clients.map(c=>{
    const ls=clientLogs(c.id); const last=ls[ls.length-1];
    const delta=last?(last.morning-c.startWeight).toFixed(1):null;
    const prog=last?Math.min(100,Math.max(0,Math.round((c.startWeight-last.morning)/(c.startWeight-c.goalWeight)*100))):0;
    return `<div class="client-card" onclick="selectClient('${c.id}','staff');showStaffPage('report')">
      <div style="width:40px;height:40px;border-radius:50%;background:var(--green-light);color:var(--green-dark);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:500;margin-bottom:8px">${initials(c.name)}</div>
      <div style="font-size:13px;font-weight:500">${c.name}</div>
      <div style="font-size:11px;color:var(--tx2)">${c.age?c.age+'歳 · ':''}目標 ${c.goalWeight}kg</div>
      <div style="font-size:11px;color:var(--tx2);margin-top:4px">現在 <strong>${last?last.morning+'kg':'未記録'}</strong>${delta!==null?' ('+(delta<0?delta:'+'+delta)+'kg)':''}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${prog}%"></div></div>
      <div style="font-size:10px;color:var(--tx2)">進捗 ${prog}%</div>
    </div>`;
  }).join('')||'<div class="empty" style="grid-column:1/-1">顧客を登録してください</div>';
}

/* ===== スタッフ レポート ===== */
function filterDays(v){currentDays=parseInt(v);buildReport();}
function buildReport(){
  if(!currentClientId)return;
  const c=clients.find(x=>x.id===currentClientId); if(!c)return;
  const ls=clientLogs(c.id,currentDays); const last=ls[ls.length-1];
  const delta=last?(last.morning-c.startWeight).toFixed(1):'—';
  const prog=last?Math.min(100,Math.max(0,Math.round((c.startWeight-last.morning)/(c.startWeight-c.goalWeight)*100))):0;
  document.getElementById('report-metrics').innerHTML=`
    <div class="metric"><div class="metric-label">現在体重</div><div class="metric-value">${last?last.morning+'kg':'—'}</div><div class="metric-delta ${delta<0?'good':'bad'}">${delta!=='—'?(delta<0?delta:'+'+delta)+'kg':''}</div></div>
    <div class="metric"><div class="metric-label">目標体重</div><div class="metric-value">${c.goalWeight}kg</div><div class="metric-delta muted">残り ${last?(last.morning-c.goalWeight).toFixed(1)+'kg':'—'}</div></div>
    <div class="metric"><div class="metric-label">進捗</div><div class="metric-value">${prog}%</div><div class="metric-delta ${prog>=50?'good':'muted'}"></div></div>
    <div class="metric"><div class="metric-label">記録日数</div><div class="metric-value">${ls.length}</div><div class="metric-delta muted">日</div></div>`;
  document.getElementById('report-logs').innerHTML=[...ls].reverse().map((l,i,arr)=>{
    const prev=arr[i+1]; const d=prev?+(l.morning-prev.morning).toFixed(2):null;
    return `<tr><td style="color:var(--tx2)">${fmtDate(l.date)}</td><td style="font-weight:500">${l.morning}kg</td><td style="color:${d===null?'var(--tx2)':d<0?'var(--green)':'var(--red)'}">${d===null?'—':(d<0?d:'+'+d)+'kg'}</td><td style="color:var(--tx2);max-width:100px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${l.comment||'—'}</td></tr>`;
  }).join('')||'<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--tx3)">記録がありません</td></tr>';
  document.getElementById('report-comments').innerHTML=[...ls].filter(l=>l.comment).reverse().slice(0,6).map(l=>`
    <div style="padding:8px 0;border-bottom:0.5px solid var(--br)"><div style="font-size:11px;color:var(--tx2);margin-bottom:3px">${fmtDate(l.date)} — ${l.morning}kg</div><div style="font-size:12px">${l.comment}</div></div>`).join('')||'<div class="empty">コメントはありません</div>';
  buildStaffChart(ls,c);
}
function buildStaffChart(ls,c){
  if(staffChart){staffChart.destroy();staffChart=null;}
  const ctx=document.getElementById('staffWeightChart').getContext('2d');
  const dark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  const grid=dark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.06)'; const tc=dark?'#6b6b66':'#888';
  staffChart=new Chart(ctx,{type:'line',data:{labels:ls.map(l=>fmtDate(l.date)),datasets:[
    {label:'朝体重',data:ls.map(l=>l.morning),borderColor:'#1D9E75',backgroundColor:'rgba(29,158,117,0.08)',borderWidth:2,pointRadius:3,tension:0.3,fill:true},
    {label:'夜体重',data:ls.map(l=>l.evening),borderColor:'#378ADD',backgroundColor:'transparent',borderWidth:1.5,pointRadius:2,tension:0.3,borderDash:[4,2]},
    {label:'目標',data:ls.map(()=>c.goalWeight),borderColor:'#E24B4A',backgroundColor:'transparent',borderWidth:1,borderDash:[6,3],pointRadius:0}
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:11},color:tc,usePointStyle:true,boxWidth:20}}},scales:{x:{grid:{color:grid},ticks:{font:{size:10},color:tc,maxTicksLimit:8}},y:{grid:{color:grid},ticks:{font:{size:11},color:tc,callback:v=>v+'kg'}}}}});
}

/* ===== 顧客ホーム ===== */
function buildClientHome(){
  const c=clients.find(x=>x.id===currentClientId); if(!c)return;
  const ls=clientLogs(c.id); const last=ls[ls.length-1];
  const delta=last?(last.morning-c.startWeight).toFixed(1):null;
  const prog=last?Math.min(100,Math.max(0,Math.round((c.startWeight-last.morning)/(c.startWeight-c.goalWeight)*100))):0;
  document.getElementById('cl-current-w').textContent=last?last.morning+'kg':'未記録';
  document.getElementById('cl-delta').innerHTML=delta?`<span class="${delta<0?'good':'bad'}">${delta<0?delta:'+'+delta}kg（開始比）</span>`:'';
  document.getElementById('cl-remain').textContent=last?(last.morning-c.goalWeight).toFixed(1):'—';
  document.getElementById('cl-prog-pct').textContent=prog+'%';
  document.getElementById('cl-prog-bar').style.width=prog+'%';
  document.getElementById('cl-start-w').textContent='開始 '+c.startWeight+'kg';
  document.getElementById('cl-goal-w').textContent='目標 '+c.goalWeight+'kg';

  // 前日夜→当日朝の増減
  const prev=ls[ls.length-2];
  const prevEve=prev?.evening||null;
  const thisMorn=last?.morning||null;
  document.getElementById('cl-prev-eve').textContent=prevEve?prevEve+'kg':'—';
  document.getElementById('cl-this-morn').textContent=thisMorn?thisMorn+'kg':'—';
  if(prevEve&&thisMorn){
    const od=+(thisMorn-prevEve).toFixed(2);
    const el=document.getElementById('cl-overnight-delta');
    el.textContent=(od<0?od:'+'+od)+'kg';
    el.style.color=od<0?'var(--green)':'var(--red)';
  } else {
    document.getElementById('cl-overnight-delta').textContent='—';
  }

  // 今日の合計摂取量
  const todayLog=ls.find(l=>l.date===today());
  const bf=todayLog?.breakfastG||0;
  const lu=todayLog?.lunchG||0;
  const di=todayLog?.dinnerG||0;
  const total=bf+lu+di;
  const limit=900;
  document.getElementById('cl-intake-total').textContent=total?total+'g':'—';
  document.getElementById('cl-intake-bar').style.width=Math.min(100,Math.round(total/limit*100))+'%';
  document.getElementById('cl-intake-bar').style.background=total>limit?'var(--red)':total>600?'var(--amber)':'var(--green)';
  document.getElementById('cl-intake-detail').innerHTML=[
    bf?`<span>🌅 朝 ${bf}g</span>`:'',
    lu?`<span>☀️ 昼 ${lu}g</span>`:'',
    di?`<span>🌙 夜 ${di}g</span>`:'',
  ].filter(Boolean).join('<span style="color:var(--br2)">｜</span>')||'<span>まだ記録なし</span>';

  document.getElementById('cl-recent-logs').innerHTML=[...ls].reverse().slice(0,5).map((l,i,arr)=>{
    const prev=arr[i+1]; const d=prev?+(l.morning-prev.morning).toFixed(2):null;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:0.5px solid var(--br)">
      <span style="color:var(--tx2);font-size:12px">${fmtDate(l.date)}</span>
      <span style="font-weight:500">${l.morning}kg</span>
      <span style="font-size:12px;color:${d===null?'var(--tx2)':d<0?'var(--green)':'var(--red)'}">${d===null?'—':(d<0?d:'+'+d)+'kg'}</span>
      <span style="font-size:11px;color:var(--tx2);max-width:80px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${l.comment||''}</span>
    </div>`;
  }).join('')||'<div class="empty">まだ記録がありません</div>';
  buildClientChart(ls,c);
}
function buildClientChart(ls,c){
  if(clientChart){clientChart.destroy();clientChart=null;}
  const ctx=document.getElementById('clientWeightChart').getContext('2d');
  const dark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  const grid=dark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.06)'; const tc=dark?'#6b6b66':'#888';
  clientChart=new Chart(ctx,{type:'line',data:{labels:ls.map(l=>fmtDate(l.date)),datasets:[
    {label:'体重',data:ls.map(l=>l.morning),borderColor:'#1D9E75',backgroundColor:'rgba(29,158,117,0.1)',borderWidth:2,pointRadius:3,tension:0.3,fill:true},
    {label:'目標',data:ls.map(()=>c.goalWeight),borderColor:'#E24B4A',backgroundColor:'transparent',borderWidth:1,borderDash:[5,3],pointRadius:0}
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:11},color:tc,usePointStyle:true,boxWidth:16}}},scales:{x:{grid:{color:grid},ticks:{font:{size:10},color:tc,maxTicksLimit:6}},y:{grid:{color:grid},ticks:{font:{size:11},color:tc,callback:v=>v+'kg'}}}}});
}
function mealRow(label,icon,content,grams,img){
  if(!content&&!grams&&!img)return '';
  const over=grams>300;
  return `<div style="margin-top:8px;padding:8px;background:var(--bg2);border-radius:var(--r)">
    <div style="font-size:11px;font-weight:500;color:var(--tx2);margin-bottom:4px;display:flex;align-items:center;gap:4px">${icon}${label}</div>
    ${content?`<div style="font-size:12px">${content}</div>`:''}
    ${grams?`<div style="font-size:11px;margin-top:3px;color:${over?'var(--red)':'var(--tx2)'}">食事量: ${grams}g${over?' ⚠ 300g超':'/ 300g以内'}</div>`:''}
    ${img?`<img src="${img}" style="width:100%;max-height:180px;border-radius:var(--r);margin-top:6px;object-fit:cover">`:''}
  </div>`;
}
function buildClientHistory(){
  const ls=clientLogs(currentClientId);
  document.getElementById('cl-history').innerHTML=[...ls].reverse().map((l,i,arr)=>{
    const prev=arr[i+1]; const d=prev?+(l.morning-prev.morning).toFixed(2):null;
    return `<div style="background:var(--bg);border:0.5px solid var(--br);border-radius:var(--rlg);padding:12px 14px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-weight:500">${fmtDate(l.date)}</span>
        <span style="font-size:18px;font-weight:500">${l.morning}kg <span style="font-size:12px;color:${d===null?'var(--tx2)':d<0?'var(--green)':'var(--red)'}">${d===null?'':( d<0?d:'+'+d)+'kg'}</span></span>
      </div>
      ${l.comment?`<div style="font-size:12px;color:var(--tx2);margin-bottom:4px">${l.comment}</div>`:''}
      ${mealRow('朝食','🌅',l.breakfast,l.breakfastG,l.breakfastImg)}
      ${mealRow('昼食','☀️',l.lunch,l.lunchG,l.lunchImg)}
      ${mealRow('夕食','🌙',l.dinner,l.dinnerG,l.dinnerImg)}
    </div>`;
  }).join('')||'<div class="empty">記録がありません</div>';
}

/* ===== 初期化 ===== */
(async()=>{
  await load();
  if(session){
    if(session.role==='staff')enterStaff();
    else if(session.role==='client')enterClient(session.clientId);
  } else {
    document.getElementById('screen-login').style.display='flex';
    document.getElementById('screen-staff').style.display='none';
    document.getElementById('screen-client').style.display='none';
  }
})();

// Service Worker一時無効化中
// if('serviceWorker' in navigator){
//   navigator.serviceWorker.register('/cocobody/sw.js').catch(e=>console.log('SW error',e));
// }
</script>
</body>
</html>
