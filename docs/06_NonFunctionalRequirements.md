# 06_NonFunctionalRequirements.md

- 処理時間: 画像取得+ZIP化は10秒以内
- ブラウザ互換性: Chrome, Safari, Firefox
- エラーハンドリング:
  - 無効URL
  - 画像取得失敗
  - サーバータイムアウト
- セキュリティ:
  - CORS対応
  - 外部URL取得時の検証
