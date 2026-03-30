// ═══════════════════════════════════════════════════════════
//  batch.js  —  Procesamiento por lotes de fotos de hojas
// ═══════════════════════════════════════════════════════════

// Estado del lote
const batchQueue = [];        // { id, file, name, status, result, thumb }
let batchProcessing = false;

// Status posibles: 'pending' | 'processing' | 'done' | 'error' | 'saved'

// ─── Ingreso de archivos ──────────────────────────────────

function batchDragOver(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.add('drag-over');
}

function batchDragLeave(e) {
  document.getElementById('dropzone').classList.remove('drag-over');
}

function batchDrop(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
  if (files.length === 0) { showToast('Solo se aceptan imágenes', 'error'); return; }
  addFilesToQueue(files);
}

function batchFilesSelected(event) {
  const files = Array.from(event.target.files);
  addFilesToQueue(files);
  event.target.value = '';  // reset para permitir re-seleccionar mismos archivos
}

function addFilesToQueue(files) {
  if (!isConfigReady()) {
    showToast('Primero guarda la configuración del ensayo', 'error');
    showTab('config');
    return;
  }

  files.forEach(file => {
    const id = `batch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const name = cleanFileName(file.name);
    batchQueue.push({ id, file, name, status: 'pending', result: null, thumb: null });
  });

  document.getElementById('batch-queue-section').style.display = 'block';
  document.getElementById('batch-summary').style.display = 'none';
  updateBatchGrid();
  updateBatchCountLabel();
  showToast(`${files.length} foto${files.length > 1 ? 's' : ''} agregada${files.length > 1 ? 's' : ''} a la cola`, 'success');
}

// Limpiar nombre de archivo para usarlo como ID
function cleanFileName(filename) {
  return filename
    .replace(/\.[^.]+$/, '')          // quitar extensión
    .replace(/[_\-\.]+/g, ' ')        // guiones/puntos → espacios
    .replace(/\b\w/g, c => c.toUpperCase()) // Title Case
    .trim();
}

// ─── Renderizar grid de tarjetas ─────────────────────────

function updateBatchGrid() {
  const grid = document.getElementById('batch-grid');
  grid.innerHTML = '';

  batchQueue.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = `batch-card status-${item.status}`;
    card.id = `card-${item.id}`;

    const thumbSrc = item.thumb || '';
    const statusIcon = {
      pending:    '⏳',
      processing: '⚙️',
      done:       '✅',
      error:      '⚠️',
      saved:      '💾'
    }[item.status] || '⏳';

    const scoreHtml = item.result ? (() => {
      const pct = Math.round(item.result.correct / item.result.validTotal * 100);
      return `<div class="card-score ${pct>=60?'good':pct>=40?'mid':'low'}">${pct}%</div>`;
    })() : '';

    const errorHtml = item.error ?
      `<div class="card-error">${item.error}</div>` : '';

    card.innerHTML = `
      <div class="card-thumb">
        ${thumbSrc
          ? `<img src="${thumbSrc}" alt="preview" />`
          : `<div class="thumb-placeholder"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`
        }
        <div class="card-status-icon">${statusIcon}</div>
        ${scoreHtml}
      </div>
      <div class="card-body">
        <div class="card-name-row">
          <input class="card-name-input" type="text" value="${escHtml(item.name)}"
                 onchange="batchUpdateName('${item.id}', this.value)"
                 placeholder="Nombre del alumno..."
                 ${item.status === 'saved' ? 'disabled' : ''} />
          ${item.status === 'pending' || item.status === 'error'
            ? `<button class="card-remove-btn" onclick="batchRemoveItem('${item.id}')" title="Quitar">✕</button>`
            : ''}
        </div>
        ${errorHtml}
        ${item.status === 'done'
          ? `<div class="card-actions">
               <button class="btn-save-card btn-primary" onclick="batchSaveItem('${item.id}')">
                 <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Guardar
               </button>
               <button class="btn-ghost btn-sm" onclick="batchRetryItem('${item.id}')">
                 <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Reprocesar
               </button>
             </div>`
          : ''}
        ${item.status === 'saved'
          ? `<div class="card-saved-label">✓ Guardado en resultados</div>`
          : ''}
        ${item.status === 'error'
          ? `<button class="btn-ghost btn-sm" onclick="batchRetryItem('${item.id}')">
               <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Reintentar
             </button>`
          : ''}
      </div>
    `;

    // Generar thumbnail si no existe aún
    if (!item.thumb && item.file) {
      generateThumb(item, card.querySelector('.card-thumb img, .thumb-placeholder'));
    }

    grid.appendChild(card);
  });
}

async function generateThumb(item, el) {
  const url = URL.createObjectURL(item.file);
  item.thumb = url;
  // Actualizar solo la imagen sin re-render completo
  const container = document.querySelector(`#card-${item.id} .card-thumb`);
  if (container) {
    const placeholder = container.querySelector('.thumb-placeholder');
    if (placeholder) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'preview';
      placeholder.replaceWith(img);
    }
  }
}

function updateBatchCountLabel() {
  const pending = batchQueue.filter(i => i.status === 'pending' || i.status === 'error').length;
  const total   = batchQueue.length;
  document.getElementById('batch-count-label').textContent =
    `${total} foto${total !== 1 ? 's' : ''} en cola · ${pending} pendiente${pending !== 1 ? 's' : ''}`;
}

// ─── Acciones sobre items ─────────────────────────────────

function batchUpdateName(id, value) {
  const item = batchQueue.find(i => i.id === id);
  if (item) item.name = value.trim() || `Alumno ${id.slice(-4)}`;
}

function batchRemoveItem(id) {
  const idx = batchQueue.findIndex(i => i.id === id);
  if (idx !== -1) batchQueue.splice(idx, 1);
  updateBatchGrid();
  updateBatchCountLabel();
  if (batchQueue.length === 0) {
    document.getElementById('batch-queue-section').style.display = 'none';
  }
}

function batchClearAll() {
  if (batchQueue.length === 0) return;
  if (!confirm('¿Limpiar toda la cola? Las hojas ya guardadas no se eliminan de resultados.')) return;
  batchQueue.length = 0;
  updateBatchGrid();
  updateBatchCountLabel();
  document.getElementById('batch-queue-section').style.display = 'none';
  document.getElementById('batch-summary').style.display = 'none';
}

async function batchSaveItem(id) {
  const item = batchQueue.find(i => i.id === id);
  if (!item || !item.result) return;
  const entry = {
    id: item.name || `Alumno ${id.slice(-4)}`,
    ...item.result,
    timestamp: Date.now()
  };
  addScanResult(entry);
  item.status = 'saved';

  // Actualizar solo esa card
  const card = document.getElementById(`card-${item.id}`);
  if (card) {
    card.className = `batch-card status-saved`;
    card.querySelector('.card-status-icon').textContent = '💾';
    const actions = card.querySelector('.card-actions');
    if (actions) {
      actions.outerHTML = `<div class="card-saved-label">✓ Guardado en resultados</div>`;
    }
    // Deshabilitar input de nombre
    const inp = card.querySelector('.card-name-input');
    if (inp) inp.disabled = true;
  }

  updateBatchCountLabel();
  const count = getScanResults().length;
  document.getElementById('scan-count').textContent = `${count} hoja${count !== 1 ? 's' : ''}`;
  showToast(`"${item.name}" guardado ✓`, 'success');
}

async function batchRetryItem(id) {
  const item = batchQueue.find(i => i.id === id);
  if (!item) return;
  item.status = 'pending';
  item.result = null;
  item.error  = null;
  updateCardStatus(id, 'pending');
  // Procesar solo ese item
  await processBatchItem(item);
}

// ─── Procesamiento ────────────────────────────────────────

async function batchProcessAll() {
  if (batchProcessing) return;
  const pending = batchQueue.filter(i => i.status === 'pending' || i.status === 'error');
  if (pending.length === 0) {
    showToast('No hay fotos pendientes de procesar', 'info');
    return;
  }

  batchProcessing = true;
  document.getElementById('batch-process-btn').disabled = true;

  // Mostrar barra de progreso
  const progressBar = document.getElementById('batch-progress-bar');
  progressBar.style.display = 'block';
  let done = 0;
  const total = pending.length;

  for (const item of pending) {
    document.getElementById('bp-label').textContent = `Procesando "${item.name}"...`;
    document.getElementById('bp-count').textContent = `${done} / ${total}`;
    document.getElementById('bp-fill').style.width = `${(done / total) * 100}%`;

    await processBatchItem(item);
    done++;
  }

  document.getElementById('bp-label').textContent = 'Completado';
  document.getElementById('bp-count').textContent = `${done} / ${total}`;
  document.getElementById('bp-fill').style.width = '100%';

  batchProcessing = false;
  document.getElementById('batch-process-btn').disabled = false;

  showBatchSummary();
}

async function processBatchItem(item) {
  updateCardStatus(item.id, 'processing');

  try {
    const dataUrl = await fileToDataUrl(item.file);
    const img = await loadImage(dataUrl);

    // Usar el motor OMR de scanner.js
    let processedCanvas;
    if (typeof cv !== 'undefined' && opencvReady) {
      processedCanvas = await detectAndWarpOpenCV(img, () => {});
    } else {
      processedCanvas = await detectAndWarpFallback(img, () => {});
    }

    const config = getConfig();
    const answers = detectAnswers(processedCanvas, config.numQuestions, () => {});
    const result  = evaluateAnswers(answers, config);

    item.result = { ...result, answers };
    item.status = 'done';
    item.error  = null;

  } catch (err) {
    item.status = 'error';
    item.error  = `Error: ${err.message}`;
    console.error(`[batch] Error en ${item.name}:`, err);
  }

  // Re-render solo esa card para no re-renderizar todo
  refreshCard(item);
}

function refreshCard(item) {
  const old = document.getElementById(`card-${item.id}`);
  if (!old) return;

  const tmp = document.createElement('div');
  tmp.id = `card-temp-${item.id}`;
  old.parentNode.insertBefore(tmp, old);
  old.remove();

  // Re-insertar en la misma posición
  const statusIcon = { pending:'⏳', processing:'⚙️', done:'✅', error:'⚠️', saved:'💾' }[item.status] || '⏳';
  const scoreHtml = item.result ? (() => {
    const pct = Math.round(item.result.correct / item.result.validTotal * 100);
    return `<div class="card-score ${pct>=60?'good':pct>=40?'mid':'low'}">${pct}%</div>`;
  })() : '';

  const card = document.createElement('div');
  card.className = `batch-card status-${item.status}`;
  card.id = `card-${item.id}`;
  card.innerHTML = `
    <div class="card-thumb">
      ${item.thumb
        ? `<img src="${item.thumb}" alt="preview" />`
        : `<div class="thumb-placeholder"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div>`
      }
      <div class="card-status-icon">${statusIcon}</div>
      ${scoreHtml}
    </div>
    <div class="card-body">
      <div class="card-name-row">
        <input class="card-name-input" type="text" value="${escHtml(item.name)}"
               onchange="batchUpdateName('${item.id}', this.value)"
               placeholder="Nombre del alumno..."
               ${item.status === 'saved' ? 'disabled' : ''} />
        ${item.status === 'pending' || item.status === 'error'
          ? `<button class="card-remove-btn" onclick="batchRemoveItem('${item.id}')" title="Quitar">✕</button>`
          : ''}
      </div>
      ${item.error ? `<div class="card-error">${escHtml(item.error)}</div>` : ''}
      ${item.status === 'done'
        ? `<div class="card-mini-stats">
             ${miniStats(item.result)}
           </div>
           <div class="card-actions">
             <button class="btn-save-card btn-primary" onclick="batchSaveItem('${item.id}')">
               <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Guardar
             </button>
             <button class="btn-ghost btn-sm" onclick="batchRetryItem('${item.id}')">
               <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Reprocesar
             </button>
           </div>`
        : ''}
      ${item.status === 'saved'
        ? `<div class="card-saved-label">✓ Guardado en resultados</div>`
        : ''}
      ${item.status === 'error'
        ? `<button class="btn-ghost btn-sm" onclick="batchRetryItem('${item.id}')">
             <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Reintentar
           </button>`
        : ''}
    </div>
  `;

  tmp.parentNode.insertBefore(card, tmp);
  tmp.remove();
}

function miniStats(result) {
  if (!result) return '';
  const pct = Math.round(result.correct / result.validTotal * 100);
  return `
    <span class="ms green">✓${result.correct}</span>
    <span class="ms red">✗${result.incorrect}</span>
    <span class="ms gray">—${result.omit}</span>
    <span class="ms ${pct>=60?'green':pct>=40?'orange':'red'}">${pct}%</span>
  `;
}

function updateCardStatus(id, status) {
  const card = document.getElementById(`card-${id}`);
  if (!card) return;
  card.className = `batch-card status-${status}`;
  const icon = { pending:'⏳', processing:'⚙️', done:'✅', error:'⚠️', saved:'💾' }[status];
  const el = card.querySelector('.card-status-icon');
  if (el) el.textContent = icon;
}

// ─── Resumen final ────────────────────────────────────────

function showBatchSummary() {
  const done    = batchQueue.filter(i => i.status === 'done').length;
  const errors  = batchQueue.filter(i => i.status === 'error');
  const saved   = batchQueue.filter(i => i.status === 'saved').length;
  const total   = batchQueue.length;

  const summaryEl = document.getElementById('batch-summary');
  const statsEl   = document.getElementById('bs-stats');
  const errorsEl  = document.getElementById('bs-errors');

  statsEl.innerHTML = `
    <div class="bs-stat green">✅ ${done + saved} procesadas</div>
    <div class="bs-stat red">⚠️ ${errors.length} con error</div>
    <div class="bs-stat gray">📋 Total: ${total}</div>
  `;

  if (errors.length > 0) {
    errorsEl.innerHTML = `
      <p class="bs-error-title">Fotos con error (revisa iluminación y marcadores):</p>
      <ul>${errors.map(e => `<li>${escHtml(e.name)}</li>`).join('')}</ul>
    `;
  } else {
    errorsEl.innerHTML = '';
  }

  summaryEl.style.display = 'block';
  summaryEl.scrollIntoView({ behavior: 'smooth' });

  if (done > 0) {
    showToast(`${done} hojas procesadas — guarda cada una para los resultados`, 'success');
  }
}

// ─── Guardar todo de una vez ──────────────────────────────
function batchSaveAll() {
  const toSave = batchQueue.filter(i => i.status === 'done');
  if (toSave.length === 0) { showToast('No hay hojas listas para guardar', 'info'); return; }
  toSave.forEach(item => batchSaveItem(item.id));
  showToast(`${toSave.length} hojas guardadas ✓`, 'success');
}

// ─── Utilidades ──────────────────────────────────────────

function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload  = e => res(e.target.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
