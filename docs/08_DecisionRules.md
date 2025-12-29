# 08_DecisionRules.md

- Railsは使用せず、Vercelサーバーレスに統一。
- 画像はオリジナル形式を優先。
- ZIP生成はサーバーレスで可能な範囲で対応。
- Lazy Load画像は `data-src` 属性を優先して取得。
- 最大取得件数は50件まで（MVP想定）。
