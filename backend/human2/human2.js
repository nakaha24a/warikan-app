document.addEventListener("DOMContentLoaded", () => {
    fetch("/next")  // Flask の `/next` ルートからデータ取得
        .then(response => response.json())
        .then(data => {
            const headerRow = document.getElementById("header-row");
            data.names.forEach(person => {
                const th = document.createElement("th");
                th.textContent = person.name;
                headerRow.appendChild(th);
            });
        })
        .catch(error => console.error("データ取得エラー:", error));
});