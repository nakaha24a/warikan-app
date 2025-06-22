//HTMLから取ってくる
const setupContainer = document.getElementById('setupContainer');
const appContainer = document.getElementById('appContainer');
const finalResultPage = document.getElementById('finalResultPage');
const step2 = document.getElementById('step2');
const finalResultText = document.getElementById('final-result-text');
const numPeopleSelect = document.getElementById('numPeople');
const nameForm = document.getElementById('nameForm');
const notification = document.getElementById('notification');
const emptyTableMessage = document.getElementById('empty-table-message');

let participants = [];
let productCounter = 1;

// 画面上部にお知らせを出す機能
function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = type; // 'error' or 'success' (default)
  
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// ---- 初期設定の画面 ----

document.getElementById('createNameInputs').onclick = () => {
  const num = parseInt(numPeopleSelect.value);
  nameForm.innerHTML = '';
  for (let i = 0; i < num; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `メンバー${i + 1}`;
    nameForm.appendChild(input);
  }
  step2.classList.remove('hidden');
};

document.getElementById('goToApp').onclick = () => {
  const inputs = nameForm.querySelectorAll('input');
  let newParticipants = [];
  inputs.forEach((input, index) => {
    const name = input.value.trim();
    newParticipants.push(name || `メンバー${index + 1}`);
  });
  
  const hasDuplicates = new Set(newParticipants).size !== newParticipants.length;
  if (hasDuplicates) {
    showNotification('メンバー名が重複しています！', 'error');
    return;
  }

  participants = newParticipants;
  initializeApp();
  setupContainer.classList.add('hidden');
  appContainer.classList.remove('hidden');
};

document.getElementById('resetApp').onclick = () => {
  // Simplification of alert to use custom notification and direct reset
  showNotification('アプリをリセットしました。', 'success');
  setTimeout(() => { // Give time for notification to show before reloading
    location.reload();
  }, 500); 
}

// ---- 割り勘アプリ本体の準備 ----
function initializeApp() {
  updateParticipantHeaders();
  updateParticipantList();
  document.querySelector('#productTable tbody').innerHTML = '';
  updateEmptyTableMessage();
  productCounter = 1;
}



function updateParticipantHeaders() {
  const headerRow = document.getElementById('tableHeader');
  // 一旦名前ヘッダーを全部消す
  while (headerRow.children.length > 6) {
    headerRow.removeChild(headerRow.children[4]);
  }
  // 最新のメンバーリストでヘッダーを作り直す
  participants.slice().reverse().forEach(name => {
    const th = document.createElement('th');
    th.textContent = name;
    headerRow.insertBefore(th, headerRow.children[4]);
  });
}

function updateParticipantList() {
  const listContainer = document.getElementById('participant-list-container');
  listContainer.innerHTML = '';
  if (participants.length === 0) {
    listContainer.textContent = 'メンバーがいません。';
  } else {
    participants.forEach(name => {
      const tag = document.createElement('div');
      tag.className = 'participant-tag';
      tag.textContent = name;
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.onclick = () => removeParticipantByName(name);
      tag.appendChild(removeBtn);
      listContainer.appendChild(tag);
    });
  }
}

function updateEmptyTableMessage() {
  const hasRows = document.querySelector('#productTable tbody tr') !== null;
  emptyTableMessage.classList.toggle('hidden', hasRows);
}


// ---- メンバーや商品の追加・削除 ----

function addParticipant() {
  const newNameInput = document.getElementById('newParticipant');
  const newName = newNameInput.value.trim();
  if (!newName) {
    showNotification('名前を入力してください。', 'error');
    return;
  }
  if (participants.includes(newName)) {
    showNotification('その名前は既に使用されています。', 'error');
    return;
  }
  participants.push(newName);
  updateParticipantHeaders();
  updateParticipantList();

  // 既存の商品リストにも新しいメンバー用のチェックボックスを追加
  document.querySelectorAll('#productTable tbody tr').forEach(row => {
    const cell = row.insertCell(4);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
      const price = parseFloat(row.cells[2].textContent.replace('円', ''));
      calculateSplitPrice(row, price);
    });
    cell.appendChild(checkbox);
  });
  newNameInput.value = '';
  showNotification(`${newName}さんを追加しました。`);
}

function removeParticipantByName(nameToRemove) {
  // Simplified alert to use custom notification
  if (!confirm(`${nameToRemove}さんを削除しますか？`)) { // Keeping confirm for destructive action
    return;
  }

  const index = participants.indexOf(nameToRemove);
  if (index === -1) return;

  participants.splice(index, 1);
  updateParticipantHeaders();
  updateParticipantList();

  // 商品リストからそのメンバーの列を削除
  document.querySelectorAll('#productTable tbody tr').forEach(row => {
    row.deleteCell(index + 4);
    const price = parseFloat(row.cells[2].textContent.replace('円', ''));
    calculateSplitPrice(row, price);
  });
  showNotification(`${nameToRemove}さんを削除しました。`);
}

function addProduct(name, price, checkedStatus = null, fromUserInput = true) {
  const productName = name ?? document.getElementById('productName').value.trim();
  const productPrice = price ?? parseFloat(document.getElementById('productPrice').value);

  if (!productName || isNaN(productPrice) || productPrice <= 0) {
    showNotification('正しい品目と金額を入力してください。', 'error');
    return;
  }
  const tableBody = document.querySelector('#productTable tbody');
  const row = tableBody.insertRow();

  row.insertCell(0).style.display = 'none';
  row.cells[0].textContent = String(productCounter).padStart(3, '0');
  row.insertCell(1).textContent = productName;
  row.insertCell(2).textContent = `${productPrice}円`;
  row.insertCell(3).textContent = `0円`;

  participants.forEach((p, i) => {
    const cell = row.insertCell(4);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if(checkedStatus) checkbox.checked = checkedStatus[i];
    checkbox.addEventListener('change', () => {
        calculateSplitPrice(row, productPrice);
    });
    cell.appendChild(checkbox);
  });

  const selectAllCell = row.insertCell(row.cells.length);
  const selectAllBtn = document.createElement('button');
  selectAllBtn.textContent = '全員';
  selectAllBtn.onclick = () => toggleSelectAll(row, selectAllBtn);
  selectAllCell.appendChild(selectAllBtn);

  const deleteCell = row.insertCell(row.cells.length);
  const delBtn = document.createElement('button');
  delBtn.textContent = '削除';
  delBtn.className = 'danger-outline';
  delBtn.onclick = () => {
      row.remove();
      updateEmptyTableMessage();
  };
  deleteCell.appendChild(delBtn);

  calculateSplitPrice(row, productPrice);
  productCounter++;
  
  if (fromUserInput) {
    const nameInput = document.getElementById('productName');
    nameInput.value = '';
    document.getElementById('productPrice').value = '';
    nameInput.focus(); 
  }
  updateEmptyTableMessage();
}

// ---- 計算関連 ----

function calculateSplitPrice(row, productPrice) {
  const checkboxes = row.querySelectorAll('input[type="checkbox"]');
  const checkedCount = Array.from(checkboxes).filter(c => c.checked).length;
  const split = checkedCount > 0 ? productPrice / checkedCount : 0;
  row.cells[3].textContent = `${Math.round(split)}円`;

  const isAllSelected = Array.from(checkboxes).every(c => c.checked);
  const selectAllBtn = row.querySelector('button');
  if (selectAllBtn) {
    selectAllBtn.textContent = isAllSelected ? '解除' : '全員';
  }
}

function toggleSelectAll(row, btn) {
  const checkboxes = row.querySelectorAll('input[type="checkbox"]');
  const isAllSelected = Array.from(checkboxes).every(c => c.checked);
  checkboxes.forEach(c => c.checked = !isAllSelected);
  const productPrice = parseFloat(row.cells[2].textContent.replace('円', ''));
  calculateSplitPrice(row, productPrice);
}

function calculateTotals() {
  const totals = {};
  participants.forEach(p => totals[p] = 0);

  document.querySelectorAll('#productTable tbody tr').forEach(row => {
    const checkboxes = Array.from(row.querySelectorAll('input[type="checkbox"]'));
    const price = parseFloat(row.cells[2].textContent.replace('円', ''));
    const checkedCount = checkboxes.filter(c => c.checked).length;

    if (checkedCount > 0) {
      const splitAmount = price / checkedCount;
      checkboxes.forEach((cb, i) => {
        if (cb.checked) {
          const participantName = participants[i];
          if(participantName) {
            totals[participantName] += splitAmount;
          }
        }
      });
    }
  });

  for (const p in totals) {
    totals[p] = Math.round(totals[p]);
  }
  return totals;
}

// 最終精算
function finalizeBill() {
  const rows = document.querySelectorAll('#productTable tbody tr');
  if (rows.length === 0) {
    showNotification('精算するものがありません！', 'error');
    return;
  }
  if (participants.length === 0) {
    showNotification('メンバーがいません！', 'error');
    return;
  }

  const totals = calculateTotals();
  const roundedTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);

  let actualTotal = 0;
  rows.forEach(row => {
    actualTotal += parseFloat(row.cells[2].textContent.replace('円', ''));
  });
  const remainder = actualTotal - roundedTotal;
  
  // 端数が出たら、最初のメンバーに調整をお願いする
  if (remainder !== 0 && participants.length > 0) {
    totals[participants[0]] += remainder;
  }

  const average = participants.length > 0 ? actualTotal / participants.length : 0;
  
  // 結果画面の組み立て
  finalResultText.innerHTML = '<h3>ひとりずつの金額</h3>';
  Object.entries(totals).forEach(([name, amount]) => {
    finalResultText.innerHTML += `<div class="final-payment"><span class="name">${name}さん</span><span class="amount">${amount.toLocaleString()}円</span></div>`;
  });

  // --- 端数調整のテキストを分かりやすく ---
  let remainderText;
  if (remainder > 0) {
    // 1円余った場合
    remainderText = `<p><span>端数調整</span><strong>${participants[0]}さん</strong>の支払いに <strong>${remainder.toLocaleString()}円</strong> を追加しました</p>`;
  } else if (remainder < 0) {
    //1円足りなかった場合
    remainderText = `<p><span>端数調整</span><strong>${participants[0]}さん</strong>の支払いから <strong>${Math.abs(remainder).toLocaleString()}円</strong> を引きました</p>`;
  } else {
    // 端数がない場合
    remainderText = '<p><span>端数調整</span><strong>なし</strong></p>';
  }

  
  finalResultText.innerHTML += `<div class="summary-box">
      <p><span>全体の合計金額</span><strong>${actualTotal.toLocaleString()}円</strong></p>
      ${remainderText}
      <p><span>(参考) 均等に割った場合</span><strong>${Math.round(average).toLocaleString()}円</strong> /人</p>
    </div>`;

  appContainer.classList.add('hidden');
  setupContainer.classList.add('hidden');
  finalResultPage.classList.remove('hidden');
}


// ----戻るボタンの処理 ----
document.getElementById('backToApp').addEventListener('click', () => {
  finalResultPage.classList.add('hidden'); // 結果画面を隠す
  appContainer.classList.remove('hidden'); // 入力画面を表示する
});