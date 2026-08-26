# 郑泽锋｜学术简历站点

这是一个基于 al-folio v1.x 的个人学术主页与简历站点。简历内容位于 `_data/cv.yml`，使用 RenderCV 数据格式并由 `al_folio_cv` 插件渲染；论文页由 `_bibliography/papers.bib` 和 Jekyll Scholar 自动生成。

## 已完成的内容

- 中文主页、简历页、论文成果页和开源项目页
- GitHub、Google Scholar 与 ORCID 的公开身份链接
- 基于公开作者、出版社与校方资料整理的教育经历、研究主题和论文
- GitHub Pages 自动部署工作流

## 发布到 GitHub Pages

1. 新建名为 `zzf495.github.io` 的 GitHub 仓库。
2. 将本目录全部内容推送到该仓库的 `main` 分支。
3. 在仓库 **Settings → Pages** 中选择 **GitHub Actions** 作为发布源。
4. 工作流完成后访问 `https://zzf495.github.io`。

若使用项目仓库而非用户主页，请将 `_config.yml` 的 `baseurl` 改为 `/<repository-name>`。

## 本地预览

需要 Ruby 3.2+ 和 Bundler：

```powershell
bundle install
bundle exec jekyll serve
```

然后访问 `http://localhost:4000`。当前工作环境没有安装 Ruby，因此未在本机启动 Jekyll；YAML 与站点文件结构已按 al-folio v1 插件化装配方式创建。

## 发布前请核对

本简历仅填入可从公开 GitHub、Google Scholar、ORCID、出版社与校方资料核实的信息。请在发布前补充或确认：预计博士毕业时间、个人照片、联系电话和求职意向。
