# AI 融资风险监控

追踪美国 AI 产业链与云厂商融资压力的静态网站，地址是 <https://iforgotid.github.io/ai-risk>。

页面由 [Eleventy](https://www.11ty.dev/) 从 Markdown 周报和两个数据文件生成。GitHub Actions 在每次推送到 `main` 时构建并发布到 GitHub Pages。不需要密钥。

## 本地预览

```bash
npm ci
npm run serve
```

浏览器打开 <http://localhost:8080/ai-risk/>。`npm test` 会构建，并检查来源链接是否原样留在页面里。

## 新增一期周报

1. 复制 `templates/brief.md` 为 `src/briefs/YYYY-MM-DD.md`。
2. 填写判断、警报和正文。链接保持原文，不要写入简报里没有的数字。
3. 在 `src/_data/indicators.csv` **末尾追加一行**。表头不要改。某一列这周没有新数字就留空，不要沿用上一行。各列含义：

   | 列 | 内容 |
   | --- | --- |
   | `date` | 简报日期，`YYYY-MM-DD` |
   | `coreweave_bond_yield` | CoreWeave 债券收益率 / 利差 |
   | `coreweave_cds` | CoreWeave 5 年期 CDS |
   | `ai_borrower_spread_median` | AI 借款人利差中位数 |
   | `jnk_spread_median` | JNK 高收益债利差中位数 |
   | `gpu_h100` / `gpu_h200` / `gpu_b200` | 对应型号的租金 |
   | `nvda_inventory` | 英伟达库存 |
   | `nvda_receivables` | 英伟达应收账款 |
   | `notes` | 这一行里各数字各自的观察日 |
   | `sources` | 来源 URL，空格分隔，原样粘贴 |

4. 在 `src/_data/circular.yaml` 的 `weeks` 末尾追加一周。只写简报里已经出现的担保、供应商信用、股权投资或股权换算力。没有新事实就把 `entries` 写成 `[]`，并用 `note` 说明。
5. 提交并推送到 `main`。Actions 会构建并发布。首页、归档和指标页都会自动带上这一期。

## 启用 GitHub Pages

仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。

选好之前，工作流即使在 `main` 上也不会把网站发布出去。选好之后，对 `main` 的推送会部署到 <https://iforgotid.github.io/ai-risk>。
