# todo.md

## 1. フロントエンド
- [x] Next.js プロジェクト初期化
- [x] TailwindCSS 設定
- [x] URL入力フォームコンポーネント作成
- [x] 画像グリッドコンポーネント作成
- [x] ImageCardコンポーネント作成
- [x] 全選択・全解除ボタン実装
- [x] ダウンロードボタン実装
- [x] フォーマット変換選択ドロップダウン実装
- [x] サムネイル最適化表示（next/image）
- [x] エラーメッセージ表示
- [x] 選択状態のuseState/useReducer管理
- [x] スクロール無限ロード実装（※仮定: 最大50件）

## 2. サーバーサイド (Vercel API Routes)
- [x] `/api/fetch-images` 実装
  - [x] axiosでHTML取得
  - [x] cheerioで画像抽出
  - [x] 広告除外ロジック実装
  - [x] Lazy Load対応
- [x] `/api/download-zip` 実装
  - [x] 画像取得
  - [x] sharpでフォーマット変換
  - [x] jszipでZIP生成
  - [x] ブラウザに返却

## 3. テスト
- [x] URL取得API単体テスト
- [x] ZIPダウンロードAPI単体テスト
- [x] フロント画像選択操作テスト
- [x] 全選択・全解除動作テスト
- [x] ダウンロード動作テスト

## 4. ドキュメント
- [x] READMEにセットアップ手順記載
- [x] 開発者向けAPI仕様書作成
- [x] ユーザーマニュアル作成（MVP用）
