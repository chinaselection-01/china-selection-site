/* China Selection — order/shipment lookup (client-side demo)
 * Reads data/shipment-data.json. Production: replace JSON source with backend API.
 */
(function () {
  "use strict";
  var box = document.getElementById("result");
  var err = document.getElementById("err");
  var input = document.getElementById("q");
  function hide(a) { a.style.display = "none"; }
  function render(o, data) {
    var stages = data.stages;
    var tl = "";
    for (var i = 0; i < stages.length; i++) {
      var cls = i < o.stage ? "done" : (i === o.stage ? "current" : "");
      var ev = (o.events || []).filter(function (e) { return e.stage === i; })[0];
      var date = ev ? '<div class="meta-date">' + ev.date + "</div>" : "";
      var note = ev ? '<div class="muted small">' + ev.note + "</div>" : "";
      tl += '<div class="tl-step ' + cls + '"><div class="dot">' + (i + 1) + '</div>' +
            '<div class="tl-card"><div class="t">' + stages[i] + "</div>" + date + note + "</div></div>";
    }
    var keys = [];
    if (o.orderNo) keys.push("Order: " + o.orderNo);
    if (o.blNo) keys.push("B/L: " + o.blNo);
    if (o.containerNo) keys.push("Container: " + o.containerNo);
    box.innerHTML =
      '<div class="kv">' +
        '<div class="k">Product</div><div>' + (o.product || "—") + "</div>" +
        '<div class="k">Quantity</div><div>' + (o.qty || "—") + "</div>" +
        '<div class="k">Reference</div><div>' + (o.buyerRef || "—") + "</div>" +
        '<div class="k">Last updated</div><div>' + (o.updated || "—") + "</div>" +
        '<div class="k">Lookup keys</div><div>' + keys.map(function (k) { return '<span class="tag-pill">' + k + "</span>"; }).join("") + "</div>" +
      "</div>" +
      '<h3 style="margin-top:22px">Shipment progress</h3>' +
      '<div class="timeline">' + tl + "</div>" +
      '<p class="lift">Status is updated by the factory and the freight forwarder. China Selection does not hold funds or guarantee delivery dates. For disputes, see <a href="/rules/">How Buying Works</a>.</p>';
    box.style.display = "block";
    err.style.display = "none";
  }
  function fail() {
    box.style.display = "none";
    err.style.display = "block";
  }
  function go() {
    var v = (input.value || "").trim().toLowerCase();
    if (!v) { fail(); return; }
    fetch("../data/shipment-data.json").then(function (r) { return r.json(); }).then(function (data) {
      var hit = (data.orders || []).filter(function (o) {
        return (o.orderNo && o.orderNo.toLowerCase() === v) ||
               (o.blNo && o.blNo.toLowerCase() === v) ||
               (o.containerNo && o.containerNo.toLowerCase() === v);
      })[0];
      if (hit) { render(hit, data); } else { fail(); }
    }).catch(function () { fail(); });
  }
  document.getElementById("btn").addEventListener("click", go);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
})();
