# 09_ImplementationGuide.md

## 1. フロント
- ページ構成
  - URL入力フォーム
  - 画像グリッド
  - 操作ボタン（全選択/全解除/ダウンロード）
- 状態管理
  - React useState / useReducer で画像リストと選択状態を保持
- ダウンロード
  - 選択画像のIDリストをAPIに送信
  - ZIPダウンロードリンクを生成

## 2. サーバー
- API Route: `/api/fetch-images`
  - axiosでHTML取得
  - cheerioで `<img>` タグ解析
  - 広告除外ロジック
  - Lazy Load対応
  - JSONで画像リスト返却
- API Route: `/api/download-zip`
  - axiosで画像取得
  - sharpで変換
  - jszipでZIP化
  - ブラウザに返却
