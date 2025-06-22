# warikan-app
割り勘システム
# みんなの割り勘アプリ

このプロジェクトは、シンプルで使いやすい割り勘計算ウェブアプリケーションです。

## 概要

このアプリケーションは、以下の機能を提供します。

* **参加者の名前設定**: 割り勘に参加するメンバーの名前を設定します。
* **品目と金額の追加**: 購入した品目とその金額をリストに追加します。
* **メンバー別支払いチェック**: 各品目について、誰が支払いに参加するかをチェックできます。
* **自動計算と精算結果表示**: 自動で1人あたりの金額を計算し、精算結果を表示します。
* **端数調整**: 計算で発生した端数を適切に調整します。

*　本アプリは現在、HTML/CSS/JavaScript によるフロントエンドのみで動作しています。バックエンド（Flask + SQL Server）はうまくつながらなかったため今後の実装予定であり、現在は仮のロジックで機能を確認できるようにしています。


## 技術スタック

* **フロントエンド**: HTML, CSS, JavaScript (Vanilla JS)
    * `warikan.html`: アプリケーションの骨格となるHTML構造。
    * `warikan.css`: アプリケーションのスタイル。
    * `warikan.js`: （参加者管理、品目追加、計算、UI操作）。

---


現在、バックエンドは完全に実装されていません。データベース (SQL Server) との接続自体は試みましたが、**データの挿入部分で不具合が続いたため、今回はフロントエンドのみで完結する形**にしています。

しかし、今バックエンドで試していることを説明します。

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
    }

    Participants ||--o{ Product_Participants : has
    Products ||--o{ Product_Participants : has
graph TD
    subgraph Frontend [現在の割り勘アプリ - JavaScript/HTML/CSS]
        A[ユーザー操作: メンバー設定] --> B{参加者名の入力/確定}
        A --> C{品目と金額の入力}
        A --> D{各品目の支払メンバー選択}
        A --> E{メンバー追加/削除}
        A --> F{品目削除}
    end

    subgraph Backend [Flask API（予定）]
        G[参加者管理API]
        H[品目管理API]
        I[データ取得API]
    end

    subgraph Database [SQL Server（SSMS）]
        J[Participants テーブル]
        K[Products テーブル]
        L[Product_Participants テーブル]
    end

    B -- POST:参加者配列 --> G
    C -- POST:品目と金額 --> H
    D -- PUT:チェック状態更新 --> H
    E -- POST/DELETE:メンバー操作 --> G
    F -- DELETE:品目削除 --> H

    G -- SQL操作 --> J
    H -- SQL操作 --> K
    H -- SQL操作 --> L
    I -- SELECT:データ取得 --> J & K & L
    I --> A
