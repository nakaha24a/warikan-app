# みんなの割り勘アプリ

このプロジェクトは、シンプルで使いやすい割り勘計算ウェブアプリケーションです。

## 概要

このアプリケーションは、以下の機能を提供します。

* **参加者の名前設定**: 割り勘に参加するメンバーの名前を設定します。
* **品目と金額の追加**: 購入した品目とその金額をリストに追加します。
* **メンバー別支払いチェック**: 各品目について、誰が支払いに参加するかをチェックできます。
* **自動計算と精算結果表示**: 自動で1人あたりの金額を計算し、精算結果を表示します。
* **端数調整**: 計算で発生した端数を適切に調整します。

**本アプリは現在、HTML/CSS/JavaScriptによるフロントエンドのみで動作しています。** 

## 技術スタック

* **フロントエンド**: HTML, CSS, JavaScript (Vanilla JS)
    * `warikan.html`: アプリケーションの骨格となるHTML構造。
    * `warikan.css`: アプリケーションのスタイル。
    * `warikan.js`: 参加者管理、品目追加、計算、UI操作）。

---
現在、バックエンドは完全に実装されていません。データベース (SQL Server) との接続自体は試みましたが、**データの挿入部分で不具合が続いたため、今回はフロントエンドのみで完結する形**にしています。


#### 1. 想定されるデータベースのER図 (SQL Server)

以下は、データの関連性を示すER図です。

```mermaid
erDiagram
    Participants {
        INT id PK "参加者ID"
        VARCHAR name "参加者名"
        VARCHAR session_id "セッションID"
    }

    Products {
        INT id PK "商品ID"
        VARCHAR name "商品名"
        INT price "金額"
        VARCHAR session_id "セッションID"
    }

    Product_Participants {
        INT product_id FK "商品ID"
        INT participant_id FK "参加者ID"
        BIT is_checked "支払いチェック"
    }

    Participants ||--o{ Product_Participants : "has product payment"
    Products ||--o{ Product_Participants : "has participant"
