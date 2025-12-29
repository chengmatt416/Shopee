# Shopee 簡易賣場網站

一個功能完整的電商平台，包含前台購物功能和後台管理系統。

## 功能特色

### 後台管理
- 📦 **商品管理**: 新增、編輯、刪除商品（名稱、相片、價格）
- 🎉 **促銷活動**: 設定批量優惠（達到特定數量享特價）
- 📊 **銷售報表**: 查看訂單明細並下載報表
- 📄 **合約下載**: 下載購買合約

### 前台購物
- 🛍️ **商品總覽**: 瀏覽所有可購買商品
- 📱 **商品介紹**: 查看詳細商品資訊
- 🛒 **購物車**: 管理購買項目和數量
- ✍️ **簽名功能**: 結帳時電子簽名確認
- 📥 **明細下載**: 完成訂單後下載收據和合約

## 技術棧

- **框架**: Next.js 16 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **簽名**: signature_pad
- **PDF 生成**: jsPDF + html2canvas
- **部署**: Vercel

## 安裝與運行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置專案
npm run build

# 生產模式
npm start
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 部署到 Vercel

1. 將代碼推送到 GitHub
2. 在 Vercel 連接你的 GitHub 倉庫
3. Vercel 會自動偵測 Next.js 專案並部署

或使用 Vercel CLI:

```bash
npm install -g vercel
vercel
```

## 使用說明

### 後台管理 (/admin)
1. 商品管理: 新增商品資訊，包含名稱、描述、價格、庫存和圖片
2. 促銷活動: 為特定商品設定「買N件以上享優惠價」的促銷
3. 銷售報表: 查看所有訂單並下載 CSV 報表

### 前台購物
1. 瀏覽商品: 在首頁或商品總覽頁查看所有商品
2. 加入購物車: 選擇商品並加入購物車
3. 結帳: 在購物車頁面前往結帳
4. 簽名: 在結帳頁面簽名確認訂單
5. 下載收據: 訂單完成後可下載 PDF 收據和 TXT 合約

## 專案結構

```
├── app/
│   ├── admin/              # 後台管理頁面
│   ├── products/           # 商品展示頁面
│   ├── cart/              # 購物車
│   ├── checkout/          # 結帳和確認
│   └── api/               # API 路由
├── data/                  # JSON 資料儲存
├── types/                 # TypeScript 類型定義
└── components/            # 可重用元件
```

## 功能演示

### 前台功能
1. **首頁**: 顯示主要導航，包含商品總覽和後台管理入口
2. **商品總覽**: 展示所有商品，包含促銷標示和庫存資訊
3. **商品詳情**: 查看單一商品的詳細資訊和促銷說明
4. **購物車**: 管理購買項目，支援數量調整和移除
5. **結帳**: 使用電子簽名確認訂單
6. **訂單確認**: 下載 PDF 收據和 TXT 合約

### 後台功能
1. **商品管理**: CRUD 操作，管理商品資訊
2. **促銷活動**: 設定基於數量的批量折扣
3. **銷售報表**: 查看所有訂單並下載 CSV 報表

## 資料存儲

本專案使用 JSON 檔案作為簡易資料庫：
- `data/products.json`: 商品資料
- `data/promotions.json`: 促銷活動資料
- `data/orders.json`: 訂單資料

## 部署說明

### Vercel 部署
1. 將專案推送到 GitHub
2. 在 Vercel 導入專案
3. Vercel 會自動偵測 Next.js 並部署

### 環境需求
- Node.js 18+ 
- npm 或 yarn

## 開發筆記

- 使用 Next.js App Router (非 Pages Router)
- TypeScript 確保類型安全
- Tailwind CSS v4 提供現代化樣式
- Client-side 狀態管理使用 localStorage
- 簽名功能使用 signature_pad 函式庫

## License

MIT