function 生成フォーム() {
    const 人数 = document.getElementById('人数').value;
    const 名前フォーム = document.getElementById('名前フォーム');
    名前フォーム.innerHTML = ''; // 既存のフォームをクリア
  
    for (let i = 1; i <= 人数; i++) {
        const ラベル = document.createElement('label');
        ラベル.textContent = `名前 (${i}):`;
        
        const 入力 = document.createElement('input');
        入力.type = 'text';
        入力.className = "name-input";  // クラスを付与

        名前フォーム.appendChild(ラベル);
        名前フォーム.appendChild(入力);
    }
  
    // 「次へ」ボタンを表示
    document.getElementById('次へ').style.display = "block";
}

// 「次へ」ボタンを押したときに Flask にデータを送信
document.getElementById('次へ').addEventListener('click', () => {
    const inputs = document.querySelectorAll(".name-input");
    const nameList = Array.from(inputs).map(input => input.value.trim()).filter(name => name);

    if (nameList.length === 0) {
        alert("名前を入力してください！");
        return;
    }

    fetch("/insert_names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: nameList })
    }).then(response => response.json())
      .then(data => {
          if (data.message) {
              window.location.href = "/next";  // 正常なら次のページへ遷移
          }
      }).catch(error => console.error("エラー:", error));
});