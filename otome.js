/* Otome-style 128x128 anime pixel portraits. Loaded after graphics.js. */
(() => {
  const px = (ctx, color, x, y, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };

  const poly = (ctx, color, points) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
  };

  const stroke = (ctx, color, x1, y1, x2, y2, width = 1) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(Math.round(x1), Math.round(y1));
    ctx.lineTo(Math.round(x2), Math.round(y2));
    ctx.stroke();
  };

  function palette(character) {
    const skins = {
      fair: ["#f3c9ad", "#ffe0ca", "#d89578", "#9f6254"],
      warm: ["#d9a17c", "#f1bd97", "#b17258", "#7d493e"],
      deep: ["#8d5c45", "#b57a5c", "#6a4034", "#492a27"]
    };
    const hairs = {
      black: ["#25242c", "#4b4855", "#15151b", "#0b0c10"],
      brown: ["#6a4335", "#a06a50", "#4b2e25", "#321d19"],
      blonde: ["#c99249", "#e3ba73", "#97642f", "#69431f"]
    };
    const eyes = {
      brown: ["#704535", "#e1bca2"],
      green: ["#50765c", "#bfdfc9"],
      blue: ["#49739c", "#c0dbf1"]
    };

    if (character === "player") {
      const s = skins[state.player.skin] || skins.warm;
      const h = hairs[state.player.hair] || hairs.brown;
      const e = eyes[state.player.eyes] || eyes.brown;
      return {
        skin: s[0], skinLight: s[1], skinShade: s[2], skinDeep: s[3],
        hair: h[0], hairLight: h[1], hairShade: h[2], hairDeep: h[3],
        eye: e[0], eyeLight: e[1], outline: "#2b1b22",
        blazer: "#26375f", blazerLight: "#3e527c", blazerShade: "#172542",
        shirt: "#fff9f1", trim: "#dfb96f", accent: "#913650", accentDark: "#642338"
      };
    }

    if (character === "ethan") {
      return {
        skin: "#deb08f", skinLight: "#f2cbb0", skinShade: "#b97d63", skinDeep: "#835247",
        hair: "#232730", hairLight: "#505563", hairShade: "#141820", hairDeep: "#090b10",
        eye: "#496f99", eyeLight: "#c3d9ef", outline: "#171b23",
        blazer: "#26375e", blazerLight: "#3c5075", blazerShade: "#172441",
        shirt: "#f8f7f4", trim: "#dbb36b", accent: "#8c4353", accentDark: "#602b37"
      };
    }

    return {
      skin: "#edc19d", skinLight: "#fbd9b9", skinShade: "#d19a77", skinDeep: "#9e6952",
      hair: "#c28b53", hairLight: "#e2b17c", hairShade: "#986438", hairDeep: "#6c4223",
      eye: "#77568f", eyeLight: "#d9c8ed", outline: "#2a1e1a",
      blazer: "#29395e", blazerLight: "#43577c", blazerShade: "#192643",
      shirt: "#fbf8f1", trim: "#dfb86e", accent: "#8e4351", accentDark: "#642f3a"
    };
  }

  function backHair(ctx, p, character) {
    if (character === "player") {
      poly(ctx, p.hairDeep, [[28,39],[36,23],[51,14],[70,12],[88,18],[100,34],[99,72],[95,110],[84,126],[74,109],[55,109],[44,126],[32,110],[28,73]]);
      poly(ctx, p.hair, [[31,40],[38,25],[52,17],[70,15],[86,21],[96,36],[94,73],[90,106],[82,120],[76,101],[53,101],[47,120],[37,105],[32,72]]);
      poly(ctx, p.hairShade, [[32,53],[27,78],[31,108],[39,119],[43,87],[41,55]]);
      poly(ctx, p.hairShade, [[95,51],[101,78],[97,108],[88,120],[84,88],[87,54]]);
      stroke(ctx, p.hairLight, 35, 49, 37, 101, 2);
      stroke(ctx, p.hairLight, 91, 47, 89, 101, 2);
    } else if (character === "ethan") {
      poly(ctx, p.hairDeep, [[29,42],[35,25],[49,16],[65,14],[82,19],[96,33],[101,47],[95,76],[87,99],[75,109],[56,107],[41,98],[33,79]]);
      poly(ctx, p.hair, [[32,42],[38,27],[51,19],[66,17],[80,22],[92,34],[97,47],[91,73],[83,94],[73,102],[57,101],[44,93],[36,76]]);
      poly(ctx, p.hairShade, [[33,47],[27,61],[32,83],[41,93],[44,63]]);
      poly(ctx, p.hairShade, [[95,43],[101,60],[96,82],[87,93],[84,61]]);
    } else {
      poly(ctx, p.hairDeep, [[31,41],[39,23],[55,14],[74,14],[91,23],[99,38],[100,55],[94,77],[84,98],[72,107],[55,104],[42,95],[34,76]]);
      poly(ctx, p.hair, [[34,41],[42,25],[57,17],[73,17],[88,26],[95,39],[96,54],[90,74],[81,92],[70,100],[56,98],[45,91],[37,74]]);
      poly(ctx, p.hairShade, [[35,46],[30,62],[35,82],[44,92],[46,61]]);
      poly(ctx, p.hairShade, [[94,42],[100,58],[94,80],[84,91],[83,59]]);
    }
  }

  function uniform(ctx, p, character) {
    poly(ctx, "rgba(20,12,18,.25)", [[15,128],[22,105],[41,88],[54,82],[75,82],[92,89],[108,106],[114,128]]);
    poly(ctx, p.blazerShade, [[17,128],[24,104],[41,90],[55,85],[74,85],[91,91],[106,105],[111,128]]);
    poly(ctx, p.blazer, [[22,128],[28,106],[43,94],[53,90],[75,90],[88,95],[101,107],[107,128]]);
    poly(ctx, p.blazerLight, [[27,125],[31,108],[45,98],[49,99],[43,127]]);
    poly(ctx, p.blazerLight, [[102,125],[98,108],[85,98],[80,99],[87,127]]);
    poly(ctx, p.shirt, [[50,84],[61,91],[64,109],[42,94]]);
    poly(ctx, p.shirt, [[78,84],[67,91],[64,109],[86,94]]);
    stroke(ctx, p.trim, 42, 94, 31, 108, 2);
    stroke(ctx, p.trim, 86, 94, 98, 108, 2);
    px(ctx, p.skinShade, 56, 78, 16, 10);
    px(ctx, p.skin, 58, 76, 12, 12);

    if (character === "player") {
      poly(ctx, p.accent, [[63,91],[51,91],[43,98],[52,106],[63,101]]);
      poly(ctx, p.accent, [[65,91],[77,91],[85,98],[76,106],[65,101]]);
      poly(ctx, p.accentDark, [[60,100],[68,100],[66,116],[62,116]]);
      px(ctx, p.trim, 62, 97, 4, 3);
    } else {
      poly(ctx, p.accent, [[60,89],[68,89],[70,98],[64,118],[58,98]]);
      poly(ctx, p.accentDark, [[61,92],[66,92],[64,112],[60,102]]);
      px(ctx, p.trim, 93, 108, 5, 7);
    }
  }

  function face(ctx, p) {
    poly(ctx, p.skinDeep, [[40,38],[47,28],[58,22],[72,22],[84,29],[91,41],[91,65],[84,82],[74,93],[64,97],[54,93],[44,83],[38,67],[38,47]]);
    poly(ctx, p.skin, [[42,38],[49,29],[59,24],[71,24],[82,30],[89,42],[89,64],[82,79],[73,88],[64,92],[55,88],[46,79],[40,65],[40,47]]);
    poly(ctx, p.skinLight, [[46,38],[52,30],[61,27],[70,27],[77,31],[73,35],[56,35],[48,44],[47,61],[51,73],[57,82],[51,79],[44,66],[44,47]]);
    poly(ctx, p.skinShade, [[80,31],[87,42],[87,63],[80,76],[73,85],[76,73],[78,58],[77,39]]);
    px(ctx, p.skinShade, 34, 49, 7, 20);
    px(ctx, p.skin, 35, 51, 6, 16);
    px(ctx, p.skinLight, 36, 54, 2, 8);
    px(ctx, p.skinShade, 89, 49, 7, 20);
    px(ctx, p.skin, 89, 51, 6, 16);
    px(ctx, p.skinLight, 92, 54, 2, 8);
  }

  function frontHair(ctx, p, character) {
    if (character === "player") {
      poly(ctx, p.hair, [[35,38],[42,24],[55,17],[72,16],[88,23],[96,37],[88,39],[82,35],[77,44],[70,37],[64,48],[57,39],[50,48],[43,40],[38,45]]);
      poly(ctx, p.hairLight, [[44,27],[56,19],[70,19],[82,24],[75,27],[60,27],[49,31]]);
      poly(ctx, p.hairShade, [[46,32],[55,42],[54,61],[47,70],[43,50]]);
      poly(ctx, p.hairShade, [[76,31],[84,40],[83,59],[76,69],[72,47]]);
      poly(ctx, p.accent, [[83,23],[93,27],[98,36],[94,49],[87,45],[85,34]]);
      poly(ctx, p.accent, [[85,28],[78,23],[79,39]]);
      poly(ctx, p.accent, [[94,28],[102,23],[100,40]]);
      px(ctx, p.trim, 87, 27, 3, 3);
    } else if (character === "ethan") {
      poly(ctx, p.hair, [[30,40],[37,25],[50,17],[64,15],[78,18],[91,27],[99,39],[91,40],[85,47],[77,39],[70,50],[63,40],[55,51],[48,42],[40,50],[34,46]]);
      poly(ctx, p.hairLight, [[42,27],[53,20],[66,19],[79,23],[74,28],[58,27],[48,32]]);
      poly(ctx, p.hairShade, [[48,29],[58,39],[56,61],[49,69],[44,48]]);
      poly(ctx, p.hairShade, [[68,28],[78,37],[75,56],[68,68],[64,46]]);
      poly(ctx, p.hairShade, [[90,31],[98,39],[95,56],[87,62],[85,43]]);
    } else {
      poly(ctx, p.hair, [[33,39],[41,23],[56,15],[74,16],[90,25],[98,38],[90,39],[83,46],[76,37],[69,49],[62,38],[55,49],[47,40],[39,47]]);
      poly(ctx, p.hairLight, [[44,26],[57,18],[72,19],[86,25],[78,28],[62,27],[50,31]]);
      poly(ctx, p.hairShade, [[46,31],[55,40],[54,58],[47,68],[43,48]]);
      poly(ctx, p.hairShade, [[73,28],[83,36],[80,55],[72,66],[68,45]]);
      poly(ctx, p.hair, [[71,17],[80,13],[91,17],[92,27],[82,24]]);
    }
  }

  function brows(ctx, p, emotion) {
    const c = p.hairDeep;
    if (emotion === "sad") {
      stroke(ctx, c, 46, 49, 57, 46, 2);
      stroke(ctx, c, 71, 46, 82, 49, 2);
    } else if (emotion === "serious") {
      stroke(ctx, c, 45, 47, 57, 51, 2);
      stroke(ctx, c, 71, 51, 83, 47, 2);
    } else if (["surprised", "blush"].includes(emotion)) {
      stroke(ctx, c, 47, 45, 57, 44, 2);
      stroke(ctx, c, 71, 44, 81, 45, 2);
    } else {
      stroke(ctx, c, 46, 48, 57, 46, 2);
      stroke(ctx, c, 71, 46, 82, 48, 2);
    }
  }

  function eyes(ctx, p, emotion, character) {
    if (emotion === "happy") {
      stroke(ctx, p.outline, 45, 57, 51, 60, 2);
      stroke(ctx, p.outline, 51, 60, 58, 57, 2);
      stroke(ctx, p.outline, 70, 57, 77, 60, 2);
      stroke(ctx, p.outline, 77, 60, 83, 57, 2);
      return;
    }

    const tall = emotion === "surprised" ? 11 : emotion === "sad" ? 8 : emotion === "serious" ? 7 : 10;
    const y = emotion === "serious" ? 54 : 53;
    const leftX = character === "julian" ? 44 : 43;
    const rightX = character === "julian" ? 70 : 71;

    poly(ctx, p.outline, [[leftX,y+2],[leftX+4,y],[leftX+14,y+1],[leftX+17,y+4],[leftX+14,y+tall],[leftX+3,y+tall],[leftX,y+tall-2]]);
    poly(ctx, p.outline, [[rightX,y+4],[rightX+3,y+1],[rightX+13,y],[rightX+17,y+2],[rightX+17,y+tall-2],[rightX+14,y+tall],[rightX+3,y+tall]]);
    px(ctx, "#fffdfb", leftX+2, y+2, 13, tall-3);
    px(ctx, "#fffdfb", rightX+2, y+2, 13, tall-3);
    px(ctx, p.eye, leftX+6, y+3, 7, tall-3);
    px(ctx, p.eye, rightX+5, y+3, 7, tall-3);
    px(ctx, p.outline, leftX+8, y+6, 3, Math.max(3, tall-6));
    px(ctx, p.outline, rightX+7, y+6, 3, Math.max(3, tall-6));
    px(ctx, p.eyeLight, leftX+6, y+3, 3, 3);
    px(ctx, p.eyeLight, rightX+5, y+3, 3, 3);
    px(ctx, "#ffffff", leftX+7, y+3, 1, 1);
    px(ctx, "#ffffff", rightX+6, y+3, 1, 1);
  }

  function features(ctx, p, emotion, character) {
    brows(ctx, p, emotion);
    eyes(ctx, p, emotion, character);
    px(ctx, p.skinShade, 63, 64, 2, 7);
    px(ctx, p.skinDeep, 62, 70, 4, 2);

    if (["soft", "blush", "surprised"].includes(emotion)) {
      px(ctx, "rgba(232,117,135,.32)", 41, 68, 13, 5);
      px(ctx, "rgba(232,117,135,.32)", 76, 68, 13, 5);
      stroke(ctx, "rgba(255,195,201,.6)", 43, 70, 51, 70, 1);
      stroke(ctx, "rgba(255,195,201,.6)", 78, 70, 86, 70, 1);
    }

    if (emotion === "happy") {
      px(ctx, p.skinDeep, 57, 75, 14, 3);
      px(ctx, p.skinDeep, 60, 78, 8, 3);
      px(ctx, "#ef9aa2", 61, 78, 6, 2);
    } else if (emotion === "sad") {
      stroke(ctx, p.skinDeep, 58, 78, 70, 75, 2);
      px(ctx, "rgba(118,155,205,.65)", 39, 68, 2, 8);
    } else if (emotion === "surprised") {
      px(ctx, p.skinDeep, 61, 74, 7, 9);
      px(ctx, "#ef9aa2", 62, 78, 5, 3);
    } else if (emotion === "blush") {
      px(ctx, p.skinDeep, 58, 75, 13, 4);
      px(ctx, "#ef9aa2", 60, 77, 9, 2);
      if (character === "ethan") poly(ctx, "#d9e7f7", [[92,67],[96,76],[92,82],[89,75]]);
      if (character === "julian") { px(ctx, "#f7e1b9", 92, 57, 3, 15); px(ctx, "#f7e1b9", 91, 75, 5, 5); }
    } else if (emotion === "soft") {
      stroke(ctx, p.skinDeep, 57, 75, 71, 76, 2);
    } else if (emotion === "serious") {
      px(ctx, p.skinDeep, 58, 75, 12, 2);
    } else {
      stroke(ctx, p.skinDeep, 58, 75, 70, 75, 2);
    }

    if (emotion === "happy" && character !== "ethan") {
      px(ctx, "rgba(255,255,255,.9)", 22, 45, 2, 10);
      px(ctx, "rgba(255,255,255,.9)", 18, 49, 10, 2);
    }
  }

  function otomePortrait(canvas, character, emotion = "neutral") {
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 128, 128);
    if (!character) return;

    const p = palette(character);
    backHair(ctx, p, character);
    uniform(ctx, p, character);
    face(ctx, p);
    features(ctx, p, emotion, character);
    frontHair(ctx, p, character);

    px(ctx, "rgba(255,255,255,.04)", 0, 0, 128, 18);
    px(ctx, "rgba(20,12,18,.12)", 0, 121, 128, 7);
  }

  drawPortrait = otomePortrait;
  window.drawPortrait = otomePortrait;

  if (typeof updateCreatorPreview === "function") updateCreatorPreview();
  if (typeof currentNode !== "undefined" && currentNode) {
    const canvas = document.getElementById("portrait-canvas");
    if (canvas) otomePortrait(canvas, currentNode.portrait, currentNode.emotion || "neutral");
  }
})();
