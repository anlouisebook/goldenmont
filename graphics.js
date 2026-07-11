/* Detailed procedural pixel graphics for Goldenmont Academy. */
(() => {
  const W = 128;
  const H = 128;

  function rect(ctx, color, x, y, w, h) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function poly(ctx, color, points) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
  }

  function line(ctx, color, x1, y1, x2, y2, width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function dot(ctx, color, x, y, size = 2) {
    rect(ctx, color, x, y, size, size);
  }

  function portraitPalette(character) {
    const skinSets = {
      fair: { skin: "#f4cdb2", light: "#ffe2cc", shade: "#c98568", deep: "#9f5f51" },
      warm: { skin: "#d9a27e", light: "#f1bd98", shade: "#aa6d55", deep: "#7f493e" },
      deep: { skin: "#8d5c45", light: "#b57b5c", shade: "#6d4034", deep: "#4d2b28" }
    };
    const hairSets = {
      black: { hair: "#25242c", light: "#494652", shade: "#15151b", deep: "#0c0c11" },
      brown: { hair: "#654134", light: "#9a674d", shade: "#432b28", deep: "#291b1d" },
      blonde: { hair: "#d3a253", light: "#f0ce7d", shade: "#9a682f", deep: "#684421" }
    };
    const eyeSets = { brown: "#56372c", green: "#386047", blue: "#315f83" };

    if (character === "ethan") {
      return {
        ...skinSets.warm,
        hair: "#252731", hairLight: "#4b4e60", hairShade: "#151720", hairDeep: "#0c0d13",
        eye: "#3f5f72", uniform: "#26364e", uniformLight: "#3e5270", uniformShade: "#172238",
        trim: "#d5a85b", accent: "#7a3040", lip: "#8e4d4c"
      };
    }
    if (character === "julian") {
      return {
        ...skinSets.fair,
        hair: "#b8793d", hairLight: "#e3ad65", hairShade: "#86522e", hairDeep: "#55301f",
        eye: "#665071", uniform: "#28364f", uniformLight: "#415473", uniformShade: "#182338",
        trim: "#d8aa57", accent: "#7d3040", lip: "#9c5550"
      };
    }

    const skin = skinSets[state.player.skin] || skinSets.warm;
    const hair = hairSets[state.player.hair] || hairSets.brown;
    return {
      ...skin,
      hair: hair.hair, hairLight: hair.light, hairShade: hair.shade, hairDeep: hair.deep,
      eye: eyeSets[state.player.eyes] || eyeSets.brown,
      uniform: "#28364f", uniformLight: "#415473", uniformShade: "#182338",
      trim: "#d8aa57", accent: "#7f2f45", lip: "#9a4d54"
    };
  }

  function drawUniform(ctx, p, character) {
    rect(ctx, "rgba(26,18,24,.28)", 20, 118, 88, 7);
    poly(ctx, p.uniformShade, [[17,128],[21,103],[38,88],[54,84],[74,84],[91,89],[107,103],[111,128]]);
    poly(ctx, p.uniform, [[20,128],[24,105],[40,91],[53,87],[75,87],[90,92],[104,105],[108,128]]);
    poly(ctx, p.uniformLight, [[24,124],[28,107],[42,95],[47,96],[40,126]]);
    poly(ctx, p.uniformLight, [[104,124],[100,107],[86,95],[81,96],[88,126]]);
    poly(ctx, "#fff3e4", [[49,84],[59,92],[64,111],[42,94]]);
    poly(ctx, "#f3e4d4", [[79,84],[69,92],[64,111],[86,94]]);
    poly(ctx, p.trim, [[40,91],[45,92],[52,113],[49,114]]);
    poly(ctx, p.trim, [[88,91],[83,92],[76,113],[79,114]]);
    line(ctx, p.trim, 27, 106, 42, 95, 2);
    line(ctx, p.trim, 101, 106, 86, 95, 2);

    if (character === "player") {
      poly(ctx, p.accent, [[51,96],[62,91],[64,100],[54,105]]);
      poly(ctx, p.accent, [[77,96],[66,91],[64,100],[74,105]]);
      rect(ctx, "#5d1f35", 60, 97, 8, 9);
      rect(ctx, p.trim, 62, 99, 4, 3);
    } else {
      poly(ctx, p.accent, [[59,91],[69,91],[67,112],[63,119],[60,111]]);
      rect(ctx, "#531e2f", 61, 92, 6, 4);
      line(ctx, "rgba(255,255,255,.22)", 64, 96, 64, 110, 1);
    }

    rect(ctx, p.trim, 92, 105, 6, 8);
    rect(ctx, p.uniformShade, 94, 107, 2, 4);
  }

  function drawFaceBase(ctx, p, character) {
    if (character === "player") {
      poly(ctx, p.hairDeep, [[27,39],[31,24],[43,16],[61,12],[80,15],[94,26],[101,45],[99,93],[88,104],[76,93],[43,96],[29,104]]);
      poly(ctx, p.hair, [[29,43],[32,26],[45,17],[62,14],[79,17],[92,28],[98,45],[95,91],[84,98],[82,76],[45,78],[43,98],[31,92]]);
      poly(ctx, p.hairShade, [[30,65],[39,46],[43,93],[34,101]]);
      poly(ctx, p.hairShade, [[98,62],[89,44],[85,94],[94,101]]);
    }

    rect(ctx, p.skinShade, 43, 78, 42, 15);
    rect(ctx, p.skin, 48, 75, 32, 18);
    poly(ctx, p.deep, [[38,39],[44,28],[57,22],[72,22],[86,29],[92,41],[91,67],[83,81],[73,88],[55,88],[44,80],[37,67]]);
    poly(ctx, p.skin, [[40,39],[46,29],[58,24],[71,24],[84,30],[90,41],[89,65],[81,78],[72,84],[56,84],[47,79],[40,66]]);
    poly(ctx, p.light, [[44,38],[50,29],[60,26],[70,26],[77,30],[72,34],[55,34],[48,43],[47,62],[51,72],[57,79],[49,76],[43,65]]);
    poly(ctx, p.shade, [[82,31],[88,42],[87,65],[80,76],[72,82],[75,71],[78,59],[78,39]]);
    rect(ctx, p.skinShade, 34, 48, 7, 20);
    rect(ctx, p.skin, 35, 50, 6, 16);
    rect(ctx, p.light, 36, 53, 2, 8);
    rect(ctx, p.skinShade, 89, 48, 7, 20);
    rect(ctx, p.skin, 89, 50, 6, 16);
    rect(ctx, p.light, 92, 53, 2, 8);
  }

  function drawPlayerHair(ctx, p) {
    poly(ctx, p.hairShade, [[35,37],[39,23],[54,16],[72,15],[90,24],[95,39],[88,36],[81,31],[69,27],[54,28],[43,35]]);
    poly(ctx, p.hair, [[37,38],[42,24],[55,18],[71,17],[87,24],[92,36],[81,31],[68,29],[56,30],[45,37]]);
    poly(ctx, p.hairLight, [[48,23],[58,18],[70,18],[82,23],[72,22],[61,23],[53,29]]);
    poly(ctx, p.hairShade, [[40,35],[50,28],[53,53],[45,64],[40,55]]);
    poly(ctx, p.hair, [[48,29],[60,24],[58,53],[50,60]]);
    poly(ctx, p.hairShade, [[58,26],[70,22],[68,50],[61,57]]);
    poly(ctx, p.hair, [[69,23],[82,27],[77,48],[69,54]]);
    poly(ctx, p.hairShade, [[81,28],[91,35],[88,58],[78,48]]);
    rect(ctx, p.accent, 83, 22, 11, 11);
    rect(ctx, "#5a2033", 87, 25, 5, 6);
    poly(ctx, p.accent, [[84,27],[77,22],[78,34]]);
    poly(ctx, p.accent, [[93,27],[101,22],[99,35]]);
    dot(ctx, p.trim, 87, 24, 2);
    for (const [x, y, w, h] of [[34,49,3,32],[39,70,3,25],[91,48,3,33],[86,72,3,24],[31,80,3,16],[96,78,3,18]]) rect(ctx, p.hairLight, x, y, w, h);
  }

  function drawEthanHair(ctx, p) {
    poly(ctx, p.hairDeep, [[31,42],[34,26],[43,19],[53,14],[62,18],[69,11],[76,18],[87,15],[91,24],[101,27],[95,37],[98,47],[88,43],[84,53],[76,43],[68,50],[60,39],[50,47],[45,37],[38,50]]);
    poly(ctx, p.hair, [[34,40],[37,27],[47,20],[57,18],[63,22],[69,15],[75,21],[85,19],[89,27],[97,29],[91,37],[94,43],[86,40],[81,49],[75,39],[67,46],[60,36],[51,43],[47,34],[40,45]]);
    poly(ctx, p.hairLight, [[43,27],[53,20],[59,21],[51,30]]);
    poly(ctx, p.hairLight, [[69,18],[75,22],[70,32],[64,29]]);
    poly(ctx, p.hairLight, [[82,22],[88,28],[80,35],[76,31]]);
    rect(ctx, p.hairShade, 35, 38, 6, 25);
    rect(ctx, p.hairShade, 88, 38, 6, 24);
  }

  function drawJulianHair(ctx, p) {
    poly(ctx, p.hairDeep, [[31,40],[34,27],[45,18],[58,14],[73,15],[88,20],[97,30],[94,45],[88,40],[83,52],[75,42],[66,50],[59,38],[50,48],[43,38],[36,51]]);
    poly(ctx, p.hair, [[34,39],[38,28],[48,20],[60,16],[73,17],[86,22],[94,31],[91,42],[85,38],[80,48],[73,38],[65,46],[59,35],[51,44],[45,35],[38,47]]);
    poly(ctx, p.hairLight, [[45,25],[58,18],[70,19],[61,24],[52,31]]);
    poly(ctx, p.hairLight, [[70,20],[84,24],[89,30],[79,27]]);
    poly(ctx, p.hairShade, [[58,22],[67,18],[62,42],[56,48]]);
    poly(ctx, p.hairShade, [[78,25],[89,31],[84,48],[76,40]]);
    rect(ctx, p.hairShade, 35, 38, 5, 24);
    rect(ctx, p.hairShade, 88, 38, 5, 21);
  }

  function drawEyesAndExpression(ctx, p, character, emotion) {
    const closedHappy = emotion === "happy";
    const sad = emotion === "sad";
    const serious = emotion === "serious";
    const surprised = emotion === "surprised";
    const blushing = ["blush", "soft", "surprised"].includes(emotion);
    const browY = sad ? 49 : serious ? 47 : surprised ? 46 : 48;
    const brow = character === "ethan" ? p.hairDeep : p.hairShade;

    if (sad) {
      line(ctx, brow, 46, browY + 2, 56, browY, 2);
      line(ctx, brow, 73, browY, 83, browY + 2, 2);
    } else if (serious) {
      line(ctx, brow, 46, browY, 57, browY + 2, 2);
      line(ctx, brow, 72, browY + 2, 83, browY, 2);
    } else if (surprised) {
      line(ctx, brow, 47, browY, 56, browY, 1);
      line(ctx, brow, 73, browY, 82, browY, 1);
    } else {
      line(ctx, brow, 46, browY, 56, browY - 1, 2);
      line(ctx, brow, 73, browY - 1, 83, browY, 2);
    }

    if (closedHappy) {
      line(ctx, p.hairDeep, 47, 57, 52, 60, 2);
      line(ctx, p.hairDeep, 52, 60, 57, 57, 2);
      line(ctx, p.hairDeep, 72, 57, 77, 60, 2);
      line(ctx, p.hairDeep, 77, 60, 82, 57, 2);
    } else {
      const eyeH = surprised ? 8 : 7;
      rect(ctx, p.hairDeep, 46, 53, 12, eyeH);
      rect(ctx, p.hairDeep, 71, 53, 12, eyeH);
      rect(ctx, "#fff8ee", 48, 54, 9, eyeH - 2);
      rect(ctx, "#fff8ee", 72, 54, 9, eyeH - 2);
      rect(ctx, p.eye, 51, 54, 5, eyeH - 1);
      rect(ctx, p.eye, 74, 54, 5, eyeH - 1);
      rect(ctx, "#17151b", 53, 56, 3, Math.max(3, eyeH - 3));
      rect(ctx, "#17151b", 74, 56, 3, Math.max(3, eyeH - 3));
      dot(ctx, "#ffffff", 52, 54, 2);
      dot(ctx, "#ffffff", 75, 54, 2);
      rect(ctx, p.hairDeep, 45, 52, 13, 2);
      rect(ctx, p.hairDeep, 71, 52, 13, 2);
      if (character === "player") {
        dot(ctx, p.hairDeep, 45, 55, 2);
        dot(ctx, p.hairDeep, 83, 55, 2);
      }
    }

    rect(ctx, p.shade, 63, 61, 2, 7);
    dot(ctx, p.light, 62, 61, 1);
    rect(ctx, p.deep, 61, 68, 5, 1);

    if (blushing) {
      rect(ctx, "rgba(211,83,91,.42)", 42, 65, 14, 6);
      rect(ctx, "rgba(211,83,91,.42)", 74, 65, 14, 6);
      line(ctx, "rgba(255,185,173,.75)", 44, 67, 48, 65, 1);
      line(ctx, "rgba(255,185,173,.75)", 49, 69, 53, 67, 1);
      line(ctx, "rgba(255,185,173,.75)", 76, 67, 80, 65, 1);
      line(ctx, "rgba(255,185,173,.75)", 81, 69, 85, 67, 1);
    }

    if (emotion === "happy") {
      rect(ctx, p.lip, 57, 71, 16, 2);
      poly(ctx, "#7d343e", [[58,72],[72,72],[68,77],[62,77]]);
      rect(ctx, "#f2a4a5", 62, 75, 7, 2);
    } else if (emotion === "sad") {
      rect(ctx, p.lip, 60, 74, 10, 2);
      rect(ctx, p.lip, 63, 72, 4, 2);
    } else if (emotion === "surprised" || emotion === "blush") {
      rect(ctx, "#71323b", 61, 71, 8, 6);
      rect(ctx, "#e99996", 63, 75, 4, 1);
    } else if (emotion === "soft") {
      rect(ctx, p.lip, 58, 71, 14, 2);
      rect(ctx, p.lip, 61, 73, 8, 1);
    } else if (emotion === "serious") {
      rect(ctx, p.lip, 59, 72, 12, 2);
    } else {
      rect(ctx, p.lip, 60, 72, 10, 2);
      dot(ctx, p.light, 61, 71, 2);
    }

    if (emotion === "surprised") {
      rect(ctx, "#f4f8ff", 96, 50, 3, 7);
      rect(ctx, "#b6d4e5", 97, 57, 3, 6);
      dot(ctx, "#f4f8ff", 97, 64, 2);
    }
    if (emotion === "blush") {
      rect(ctx, "#f4f8ff", 94, 52, 3, 6);
      rect(ctx, "#b6d4e5", 95, 58, 3, 5);
    }
  }

  function addPortraitFinish(ctx, p, character) {
    if (character === "player") {
      line(ctx, p.hairLight, 38, 52, 36, 84, 1);
      line(ctx, p.hairLight, 91, 49, 93, 83, 1);
    } else {
      line(ctx, p.hairLight, 39, 35, 36, 58, 1);
      line(ctx, p.hairLight, 90, 34, 92, 56, 1);
    }
    rect(ctx, "rgba(255,255,255,.10)", 0, 0, 128, 1);
    for (let y = 7; y < 128; y += 8) rect(ctx, "rgba(255,255,255,.035)", 0, y, 128, 1);
  }

  function detailedDrawPortrait(canvas, character, emotion = "neutral") {
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, W, H);
    if (!character) return;
    const p = portraitPalette(character);
    drawUniform(ctx, p, character);
    drawFaceBase(ctx, p, character);
    if (character === "player") drawPlayerHair(ctx, p);
    else if (character === "ethan") drawEthanHair(ctx, p);
    else drawJulianHair(ctx, p);
    drawEyesAndExpression(ctx, p, character, emotion);
    addPortraitFinish(ctx, p, character);
  }

  function skyGradient(ctx, top, bottom) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 78);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
  }

  function drawCloud(ctx, x, y) {
    rect(ctx, "rgba(255,255,255,.70)", x + 4, y, 12, 3);
    rect(ctx, "rgba(255,255,255,.70)", x, y + 3, 22, 4);
    rect(ctx, "rgba(255,255,255,.40)", x + 7, y + 7, 16, 2);
  }

  function drawWindow(ctx, x, y, w, h) {
    rect(ctx, "#5c4a48", x - 2, y - 2, w + 4, h + 4);
    rect(ctx, "#b9dde1", x, y, w, h);
    rect(ctx, "#e9f6ee", x + 2, y + 2, w - 4, h - 4);
    rect(ctx, "#7aa9ae", x + Math.floor(w / 2) - 1, y, 2, h);
    rect(ctx, "#7aa9ae", x, y + Math.floor(h / 2) - 1, w, 2);
    rect(ctx, "rgba(255,255,255,.65)", x + 3, y + 3, 5, h - 6);
  }

  function drawFloorPerspective(ctx, base, lineColor) {
    rect(ctx, base, 0, 85, 128, 43);
    for (let x = -64; x <= 192; x += 16) line(ctx, lineColor, 64, 85, x, 128, 1);
    for (let y = 94; y < 128; y += 9) line(ctx, lineColor, 0, y, 128, y, 1);
  }

  function detailedDrawBackground(canvas, location) {
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, W, H);

    if (["gate", "courtyard", "rooftop", "town"].includes(location)) {
      skyGradient(ctx, "#83b9d1", "#d7d4bd");
      drawCloud(ctx, 10, 13);
      drawCloud(ctx, 88, 24);

      if (location === "rooftop") {
        rect(ctx, "#66757c", 0, 79, 128, 49);
        rect(ctx, "#4f5d64", 0, 76, 128, 6);
        rect(ctx, "#2f3b42", 0, 60, 128, 4);
        for (let x = 4; x < 128; x += 14) rect(ctx, "#34434b", x, 57, 3, 23);
        for (let x = 0; x < 128; x += 16) line(ctx, "#788890", x, 81, x + 14, 128, 1);
      } else if (location === "town") {
        rect(ctx, "#684454", 0, 62, 128, 66);
        for (let x = 0; x < 128; x += 32) {
          rect(ctx, x % 64 === 0 ? "#d9ad76" : "#c58c75", x, 39 + (x % 3) * 3, 30, 44);
          rect(ctx, "#744654", x + 4, 48, 6, 11);
          rect(ctx, "#744654", x + 18, 48, 6, 11);
          poly(ctx, "#5c3442", [[x - 2,40],[x + 15,29],[x + 32,40]]);
        }
        line(ctx, "#5c3040", 0, 31, 128, 48, 2);
        for (let x = 8; x < 128; x += 18) {
          rect(ctx, "#f3d27c", x, 36 + (x % 4), 5, 7);
          dot(ctx, "#fff2b8", x + 1, 37 + (x % 4), 2);
        }
        rect(ctx, "#957067", 0, 97, 128, 31);
        for (let x = 0; x < 128; x += 16) line(ctx, "#765650", x, 98, x + 4, 128, 1);
      } else {
        rect(ctx, "#839761", 0, 89, 128, 39);
        rect(ctx, "#d7ceb3", 17, 39, 94, 53);
        rect(ctx, "#b89f77", 17, 39, 94, 5);
        rect(ctx, "#f0e5c7", 24, 46, 80, 46);
        rect(ctx, "#6a4250", 56, 60, 17, 32);
        rect(ctx, "#d3ad55", 61, 63, 7, 5);
        for (const x of [30, 43, 82, 95]) drawWindow(ctx, x, 54, 9, 18);
        rect(ctx, "#986052", 21, 45, 86, 4);
        rect(ctx, "#d8b45e", 43, 34, 42, 5);
        rect(ctx, "#6f4753", 50, 29, 28, 5);
        if (location === "gate") {
          rect(ctx, "#373943", 2, 66, 124, 4);
          for (let x = 4; x < 128; x += 10) {
            rect(ctx, "#2e3039", x, 61, 3, 42);
            poly(ctx, "#2e3039", [[x - 1,61],[x + 1,56],[x + 4,61]]);
          }
          rect(ctx, "#4e3737", 0, 101, 128, 27);
        } else {
          rect(ctx, "#476444", 3, 70, 25, 32);
          rect(ctx, "#5f8050", 0, 66, 32, 16);
          rect(ctx, "#476444", 101, 70, 24, 32);
          rect(ctx, "#5f8050", 96, 65, 32, 17);
          for (let x = 8; x < 121; x += 14) dot(ctx, "#d79b9f", x, 78 + (x % 6), 3);
          rect(ctx, "#a78e73", 47, 100, 35, 5);
          rect(ctx, "#766453", 51, 105, 3, 18);
          rect(ctx, "#766453", 75, 105, 3, 18);
        }
      }
    } else {
      const wallColors = {
        classroom: ["#d8e4df", "#efe2c5"], library: ["#665154", "#d7c195"], hallway: ["#cfddd7", "#eee0c5"],
        bedroom: ["#8a738f", "#d9bfc3"], artroom: ["#cadbd5", "#efe0c7"]
      };
      const [top, wall] = wallColors[location] || wallColors.classroom;
      rect(ctx, top, 0, 0, 128, 18);
      rect(ctx, wall, 0, 18, 128, 72);
      rect(ctx, "#9d7b61", 0, 86, 128, 4);
      drawFloorPerspective(ctx, location === "bedroom" ? "#725c6d" : "#856a55", "rgba(65,43,38,.25)");

      if (location === "library") {
        rect(ctx, "#3e2927", 0, 14, 31, 91);
        rect(ctx, "#3e2927", 97, 14, 31, 91);
        for (const baseX of [3, 100]) {
          for (let y = 22; y < 96; y += 17) {
            rect(ctx, "#b58c5b", baseX, y + 13, 25, 2);
            const books = ["#8f3d4b", "#466b80", "#bb873e", "#60784c", "#75528b"];
            books.forEach((color, i) => rect(ctx, color, baseX + i * 5, y, 4, 13 - (i % 2) * 2));
          }
        }
        drawWindow(ctx, 43, 22, 42, 43);
        rect(ctx, "#6b4a36", 40, 82, 48, 9);
        rect(ctx, "#4b342a", 45, 91, 4, 26);
        rect(ctx, "#4b342a", 79, 91, 4, 26);
        rect(ctx, "#f2e5bb", 53, 77, 17, 4);
      } else if (location === "artroom") {
        drawWindow(ctx, 8, 25, 36, 40);
        rect(ctx, "#79533f", 53, 62, 31, 4);
        rect(ctx, "#624334", 63, 66, 5, 40);
        poly(ctx, "#5a3b31", [[50,106],[64,70],[68,70],[82,106]]);
        rect(ctx, "#f6e8ce", 49, 29, 39, 33);
        rect(ctx, "#b46a58", 55, 36, 12, 9);
        rect(ctx, "#6b8e68", 67, 42, 13, 11);
        rect(ctx, "#d6ac56", 72, 34, 8, 6);
        rect(ctx, "#9b6b52", 94, 72, 22, 13);
        for (let x = 97; x < 115; x += 4) dot(ctx, ["#b54f5f", "#4e7894", "#d5a44f"][x % 3], x, 75 + (x % 5), 3);
      } else if (location === "bedroom") {
        drawWindow(ctx, 79, 20, 34, 38);
        rect(ctx, "#6f5264", 7, 70, 66, 37);
        rect(ctx, "#eaded7", 11, 73, 58, 21);
        rect(ctx, "#b98391", 12, 77, 24, 13);
        rect(ctx, "#8c6577", 8, 105, 5, 18);
        rect(ctx, "#8c6577", 67, 105, 5, 18);
        rect(ctx, "#d8ad58", 92, 59, 4, 47);
        rect(ctx, "#665063", 83, 61, 23, 4);
        rect(ctx, "#f1cc76", 86, 50, 17, 10);
      } else if (location === "hallway") {
        for (const x of [7, 44, 81]) {
          rect(ctx, "#75513f", x, 31, 27, 55);
          rect(ctx, "#9f7557", x + 3, 34, 21, 49);
          dot(ctx, "#d9b257", x + 20, 60, 3);
        }
        rect(ctx, "#5f2d3f", 0, 18, 128, 5);
        rect(ctx, "#d7ab54", 0, 22, 128, 2);
      } else {
        drawWindow(ctx, 12, 22, 40, 39);
        drawWindow(ctx, 76, 22, 40, 39);
        rect(ctx, "#72503d", 14, 73, 42, 20);
        rect(ctx, "#d5b68b", 11, 69, 48, 7);
        rect(ctx, "#72503d", 72, 73, 42, 20);
        rect(ctx, "#d5b68b", 69, 69, 48, 7);
        rect(ctx, "#4d6a55", 57, 35, 14, 22);
        rect(ctx, "#e9dec4", 59, 37, 10, 18);
      }
    }

    for (let y = 0; y < 128; y += 8) rect(ctx, "rgba(255,255,255,.035)", 0, y, 128, 1);
    rect(ctx, "rgba(30,20,26,.16)", 0, 124, 128, 4);
  }

  drawPortrait = detailedDrawPortrait;
  drawBackground = detailedDrawBackground;
  window.drawPortrait = detailedDrawPortrait;
  window.drawBackground = detailedDrawBackground;
  if (typeof updateCreatorPreview === "function") updateCreatorPreview();
})();
