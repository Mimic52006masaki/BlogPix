# 04_DataModel.md

## 1. Image
| フィールド        | 型       | 説明                       |
|-----------------|----------|----------------------------|
| id              | string   | 一意識別子                 |
| url             | string   | 画像URL                     |
| width           | number   | 画像幅（px）               |
| height          | number   | 画像高さ（px）             |
| selected        | boolean  | 選択状態                    |
| format          | string   | 元のフォーマット（PNG/JPG）|

## 2. API Request
- URL取得API
```json
{ "url": "https://example.com/blog/post1" }

## ダウンロードAPI
{ "images": ["id1", "id2"], "format": "png" }
