// ═══════════════════════════════════════════════════════════
//  scanner.js  —  Motor de escaneo OMR con OpenCV.js
// ═══════════════════════════════════════════════════════════

let videoStream = null;
let cameraActive = false;
let opencvReady = false;
let pendingResult = null;   // resultado esperando confirmación

// Llamado desde index.html cuando OpenCV carga
window.onOpenCvReady = () => {
  opencvReady = true;
  document.getElementById('capture-btn').disabled = false;
  showToast('OpenCV listo ✓', 'success');
};
window.onOpenCvError = () => {
  opencvReady = false;
  showToast('OpenCV no disponible, usando procesamiento alternativo', 'info');
};

// ─── Cámara ──────────────────────────────────────────────
async function toggleCamera() {
  if (cameraActive) {
    stopCamera();
  } else {
    await startCamera();
  }
}

async function startCamera() {
  const video = document.getElementById('video');
  const status = document.getElementById('camera-status');
  const toggleBtn = document.getElementById('toggle-camera');

  try {
    status.textContent = 'Solicitando acceso a cámara...';
    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    };
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = videoStream;
    await video.play();

    cameraActive = true;
    document.getElementById('camera-container').classList.add('active');
    toggleBtn.innerHTML = `<svg viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v6a3 3 0 006 0V9"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 12H3m21 0h-3"/></svg> Detener cámara`;
    status.textContent = '';
    document.getElementById('scan-line').style.display = 'block';
    showToast('Cámara activada', 'success');
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
    showToast('No se pudo acceder a la cámara', 'error');
  }
}

function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(t => t.stop());
    videoStream = null;
  }
  const video = document.getElementById('video');
  video.srcObject = null;
  cameraActive = false;
  document.getElementById('camera-container').classList.remove('active');
  document.getElementById('toggle-camera').innerHTML =
    `<svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> Activar Cámara`;
  document.getElementById('scan-line').style.display = 'none';
}

// ─── Captura y procesamiento ─────────────────────────────
async function captureAndProcess() {
  if (!cameraActive) {
    showToast('Primero activa la cámara', 'error');
    return;
  }
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  const imageData = canvas.toDataURL('image/jpeg', 0.95);
  await processImage(imageData);
}

async function processUploadedFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    await processImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

// ─── Motor OMR principal ──────────────────────────────────
async function processImage(dataUrl) {
  if (!isConfigReady()) {
    showToast('Primero completa la configuración', 'error');
    showTab('config');
    return;
  }

  document.getElementById('process-preview').style.display = 'block';
  const log = document.getElementById('process-log');
  log.innerHTML = '';

  function addLog(msg, ok = true) {
    const el = document.createElement('div');
    el.className = 'log-line ' + (ok ? 'ok' : 'warn');
    el.textContent = (ok ? '✓ ' : '⚠ ') + msg;
    log.appendChild(el);
  }

  const config = getConfig();
  const numQ = config.numQuestions;

  try {
    // 1. Cargar imagen
    const img = await loadImage(dataUrl);
    addLog(`Imagen cargada: ${img.width}×${img.height}px`);

    // 2. Detectar y corregir perspectiva
    let processedCanvas;
    if (opencvReady && typeof cv !== 'undefined') {
      processedCanvas = await detectAndWarpOpenCV(img, addLog);
    } else {
      processedCanvas = await detectAndWarpFallback(img, addLog);
    }

    // Mostrar imagen procesada
    const displayCanvas = document.getElementById('processed-canvas');
    displayCanvas.width = processedCanvas.width;
    displayCanvas.height = processedCanvas.height;
    displayCanvas.getContext('2d').drawImage(processedCanvas, 0, 0);
    addLog('Perspectiva corregida');

    // 3. Detectar respuestas en la grilla
    const answers = detectAnswers(processedCanvas, numQ, addLog);
    addLog(`Grilla procesada: ${numQ} preguntas`);

    // 4. Evaluar respuestas
    const evalResult = evaluateAnswers(answers, config);

    // 5. Mostrar resultado previo al escaneo
    pendingResult = { answers, evalResult, timestamp: Date.now() };
    showScanResultPreview(evalResult, answers);

    // 6. Mostrar caja de identificación
    document.getElementById('student-id-box').style.display = 'block';
    document.getElementById('student-id').value = '';
    document.getElementById('student-id').focus();

  } catch (err) {
    addLog('Error en procesamiento: ' + err.message, false);
    showToast('Error al procesar imagen', 'error');
    console.error(err);
  }
}

// ─── OpenCV: detección de marcadores y perspectiva ────────
async function detectAndWarpOpenCV(img, addLog) {
  const src = cv.imread(imageToCanvas(img));
  const gray = new cv.Mat();
  const thresh = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.threshold(gray, thresh, 60, 255, cv.THRESH_BINARY_INV);
  cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // Buscar los 4 cuadrados negros grandes en esquinas
  const squares = [];
  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);
    const area = cv.contourArea(cnt);
    if (area < 500 || area > 30000) continue;

    const peri = cv.arcLength(cnt, true);
    const approx = new cv.Mat();
    cv.approxPolyDP(cnt, approx, 0.04 * peri, true);

    if (approx.rows === 4) {
      const rect = cv.boundingRect(cnt);
      const ratio = rect.width / rect.height;
      if (ratio > 0.6 && ratio < 1.6) {
        squares.push({
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
          area,
          w: rect.width,
          h: rect.height
        });
      }
    }
    approx.delete();
    cnt.delete();
  }

  gray.delete(); thresh.delete(); contours.delete(); hierarchy.delete();

  // Intentar seleccionar 4 esquinas
  if (squares.length >= 4) {
    const sorted = selectCornerMarkers(squares, src.cols, src.rows);
    if (sorted) {
      addLog(`Marcadores detectados (${squares.length} candidatos)`);
      const warped = perspectiveWarp(src, sorted);
      src.delete();
      return matToCanvas(warped);
    }
  }

  addLog('Marcadores no detectados, usando región completa', false);
  const canvas = matToCanvas(src);
  src.delete();
  return canvas;
}

function selectCornerMarkers(squares, W, H) {
  // Clasificar por cuadrante
  const cx = W / 2, cy = H / 2;
  const tl = squares.filter(s => s.x < cx && s.y < cy).sort((a,b) => b.area - a.area)[0];
  const tr = squares.filter(s => s.x > cx && s.y < cy).sort((a,b) => b.area - a.area)[0];
  const bl = squares.filter(s => s.x < cx && s.y > cy).sort((a,b) => b.area - a.area)[0];
  const br = squares.filter(s => s.x > cx && s.y > cy).sort((a,b) => b.area - a.area)[0];
  if (!tl || !tr || !bl || !br) return null;
  return [tl, tr, bl, br];
}

function perspectiveWarp(src, corners) {
  const [tl, tr, bl, br] = corners;
  // Tamaño destino (proporción carta)
  const W = 800, H = 1100;
  const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    tl.x, tl.y,
    tr.x, tr.y,
    bl.x, bl.y,
    br.x, br.y
  ]);
  const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0, 0,
    W, 0,
    0, H,
    W, H
  ]);
  const M = cv.getPerspectiveTransform(srcPts, dstPts);
  const dst = new cv.Mat();
  const dsize = new cv.Size(W, H);
  cv.warpPerspective(src, dst, M, dsize);
  srcPts.delete(); dstPts.delete(); M.delete();
  return dst;
}

// ─── Fallback sin OpenCV ──────────────────────────────────
async function detectAndWarpFallback(img, addLog) {
  addLog('Procesamiento alternativo (sin OpenCV)', false);
  const canvas = document.createElement('canvas');
  // Normalizar a 800×1100
  canvas.width = 800;
  canvas.height = 1100;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 800, 1100);
  return canvas;
}

// ─── Detectar respuestas en grilla ───────────────────────
function detectAnswers(canvas, numQ, addLog) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Área de respuestas: estimada según diseño de la hoja
  // 5 columnas × 17 filas, con márgenes aproximados
  const COLS = 5;
  const ROWS_PER_COL = 17;
  const ANSWERS_PER_Q = 4;

  // Márgenes del área de respuestas (ajustables)
  const marginL = W * 0.06;
  const marginR = W * 0.06;
  const marginT = H * 0.10;
  const marginB = H * 0.08;

  const areaW = W - marginL - marginR;
  const areaH = H - marginT - marginB;

  const colW   = areaW / COLS;          // ancho de cada columna-grupo
  const rowH   = areaH / ROWS_PER_COL;  // alto de cada fila
  const cellW  = colW / (ANSWERS_PER_Q + 0.5); // ancho aprox por burbuja
  const bubbleSize = Math.min(cellW * 0.7, rowH * 0.7);

  const answers = []; // 'A'|'B'|'C'|'D'|'INVALID'|'OMIT'

  for (let q = 0; q < numQ; q++) {
    const col  = Math.floor(q / ROWS_PER_COL);   // 0-4
    const row  = q % ROWS_PER_COL;               // 0-16

    const x0 = marginL + col * colW + cellW * 0.3;
    const y0 = marginT + row * rowH + rowH * 0.15;

    const marked = [];

    for (let a = 0; a < ANSWERS_PER_Q; a++) {
      const bx = Math.round(x0 + a * cellW + cellW * 0.1);
      const by = Math.round(y0);
      const bw = Math.round(bubbleSize);
      const bh = Math.round(bubbleSize);

      // Asegurarse de no salir del canvas
      if (bx < 0 || by < 0 || bx + bw > W || by + bh > H) continue;

      const imageData = ctx.getImageData(bx, by, bw, bh);
      const darkness = computeDarkness(imageData.data);

      if (darkness > 0.30) {  // umbral: 30% de píxeles oscuros
        marked.push(a);
      }
    }

    if (marked.length === 0) {
      answers.push('OMIT');
    } else if (marked.length === 1) {
      answers.push(ANSWERS[marked[0]]);
    } else {
      answers.push('INVALID');
    }
  }

  const omits   = answers.filter(a => a === 'OMIT').length;
  const invalids = answers.filter(a => a === 'INVALID').length;
  addLog(`Omitidas: ${omits}, Inválidas: ${invalids}`);

  return answers;
}

// % de píxeles oscuros en región
function computeDarkness(data) {
  let dark = 0;
  const total = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    if (lum < 100) dark++;
  }
  return dark / total;
}

// ─── Evaluación ──────────────────────────────────────────
function evaluateAnswers(detected, config) {
  const { questions } = config;
  let correct = 0, incorrect = 0, omit = 0;
  const bySkill  = Array(SKILLS.length).fill(null).map(() => ({ correct: 0, total: 0 }));
  const byUnit   = Array(UNITS.length).fill(null).map(() => ({ correct: 0, total: 0 }));
  const detail   = [];

  for (let i = 0; i < config.numQuestions; i++) {
    const q     = questions[i];
    const det   = detected[i] || 'OMIT';
    const isPilot = q.pilot;

    let status;
    if (det === 'OMIT')    { status = 'omit'; omit++; }
    else if (det === 'INVALID') { status = 'invalid'; incorrect++; }
    else if (det === q.answer) { status = 'correct'; if (!isPilot) correct++; }
    else { status = 'incorrect'; if (!isPilot) incorrect++; }

    if (!isPilot) {
      bySkill[q.skill].total++;
      byUnit[q.unit].total++;
      if (status === 'correct') {
        bySkill[q.skill].correct++;
        byUnit[q.unit].correct++;
      }
    }

    detail.push({ q: i + 1, expected: q.answer, detected: det, status, pilot: isPilot });
  }

  const validTotal = config.numQuestions - questions.filter(q => q.pilot).length;

  return { correct, incorrect, omit, validTotal, bySkill, byUnit, detail };
}

// ─── Preview inmediato ────────────────────────────────────
function showScanResultPreview(result, answers) {
  const pct = result.validTotal > 0 ? Math.round(result.correct / result.validTotal * 100) : 0;
  const div = document.getElementById('scan-result-preview');

  const skillRows = result.bySkill.map((s, i) => {
    const p = s.total > 0 ? Math.round(s.correct / s.total * 100) : 0;
    return `<div class="mini-skill">
      <span>${SKILLS[i]}</span>
      <div class="mini-bar"><div class="mini-fill" style="width:${p}%"></div></div>
      <span>${s.correct}/${s.total}</span>
    </div>`;
  }).join('');

  div.innerHTML = `
    <div class="preview-header">
      <div class="preview-score">
        <span class="score-big">${result.correct}</span>
        <span class="score-label">/ ${result.validTotal}</span>
      </div>
      <div class="preview-pct ${pct >= 60 ? 'good' : pct >= 40 ? 'mid' : 'low'}">${pct}%</div>
    </div>
    <div class="preview-stats">
      <div class="pstat green">✓ ${result.correct} Correctas</div>
      <div class="pstat red">✗ ${result.incorrect} Incorrectas</div>
      <div class="pstat gray">— ${result.omit} Omitidas</div>
    </div>
    <div class="preview-skills">${skillRows}</div>
  `;
  div.style.display = 'block';
  div.scrollIntoView({ behavior: 'smooth' });
}

// ─── Confirmar y guardar resultado ───────────────────────
function confirmResult() {
  if (!pendingResult) {
    showToast('No hay resultado pendiente', 'error');
    return;
  }
  const studentId = document.getElementById('student-id').value.trim() || `Alumno ${Date.now()}`;
  const entry = {
    id: studentId,
    ...pendingResult.evalResult,
    answers: pendingResult.answers,
    timestamp: pendingResult.timestamp
  };
  addScanResult(entry);
  pendingResult = null;

  document.getElementById('scan-result-preview').style.display = 'none';
  document.getElementById('student-id-box').style.display = 'none';
  document.getElementById('process-preview').style.display = 'none';

  const count = getScanResults().length;
  document.getElementById('scan-count').textContent = `${count} hoja${count !== 1 ? 's' : ''}`;

  showToast(`Resultado de "${studentId}" guardado ✓`, 'success');
}

// ─── Utilidades ──────────────────────────────────────────
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function imageToCanvas(img) {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  c.getContext('2d').drawImage(img, 0, 0);
  return c;
}

function matToCanvas(mat) {
  const c = document.createElement('canvas');
  c.width = mat.cols; c.height = mat.rows;
  cv.imshow(c, mat);
  mat.delete();
  return c;
}
