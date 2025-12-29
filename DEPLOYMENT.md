# Vercel 部署指南

## 方法一：通過 Vercel Dashboard 部署

1. **準備工作**
   - 確保代碼已推送到 GitHub
   - 註冊並登入 [Vercel](https://vercel.com)

2. **導入專案**
   - 點擊 "New Project"
   - 選擇 GitHub 倉庫 `chengmatt416/Shopee`
   - Vercel 會自動偵測到 Next.js 專案

3. **配置**
   - Framework Preset: Next.js (自動選擇)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **部署**
   - 點擊 "Deploy"
   - 等待建置完成（約 2-3 分鐘）
   - 部署完成後會獲得一個 `.vercel.app` 網址

## 方法二：使用 Vercel CLI

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 在專案目錄執行
cd /path/to/Shopee
vercel

# 首次部署會詢問一些問題：
# Set up and deploy "~/Shopee"? [Y/n] y
# Which scope do you want to deploy to? (選擇你的帳號)
# Link to existing project? [y/N] n
# What's your project's name? shopee
# In which directory is your code located? ./
# Auto-detected Project Settings (Next.js)
# Want to override the settings? [y/N] n

# 部署完成！
```

## 後續更新

每次推送到 GitHub，Vercel 會自動重新部署：
```bash
git add .
git commit -m "Update features"
git push origin main
```

## 環境變量（如需要）

在 Vercel Dashboard > Project Settings > Environment Variables 設置：
```
# 範例（目前專案不需要）
# DATABASE_URL=your-database-url
# API_KEY=your-api-key
```

## 自訂域名

1. 前往 Vercel Dashboard > Project Settings > Domains
2. 添加你的域名
3. 在域名提供商設置 DNS 記錄（Vercel 會提供詳細指示）

## 注意事項

⚠️ **資料持久化問題**
- 目前專案使用 JSON 檔案儲存資料
- Vercel 的檔案系統是唯讀的，每次部署會重置資料
- **生產環境建議使用外部資料庫**：
  - Vercel Postgres
  - MongoDB Atlas
  - Supabase
  - PlanetScale

## 建議的生產環境改進

如果要將此專案用於生產環境，建議：

1. **資料庫**: 使用 Vercel Postgres 或 MongoDB Atlas
2. **檔案上傳**: 使用 Vercel Blob 或 AWS S3 儲存商品圖片
3. **認證**: 添加 NextAuth.js 進行用戶認證
4. **API 保護**: 為管理端點添加認證中間件
5. **監控**: 設置 Vercel Analytics

## 測試部署

部署後測試以下功能：
- ✅ 首頁載入
- ✅ 商品列表顯示
- ✅ 購物車功能
- ✅ 結帳流程
- ✅ 管理後台（注意：資料會在重新部署時重置）

## 支援

遇到問題？查看：
- [Vercel 文檔](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
