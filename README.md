# Siddh Patel - Portfolio Site

A static portfolio site (resume + projects + blog) that reuses the JSON data files from `resume_generator/` so the resume on the web stays in lock-step with the .docx files.

## Stack

- Plain HTML / CSS / JS - no build step
- Tailwind CSS via CDN
- Inter font from Google Fonts
- Vanilla `fetch` to load JSON resumes + blog posts

## Project Structure

```
portfolio/
├── index.html              # single-page site with all sections
├── assets/styles.css       # small overrides on top of Tailwind
├── js/app.js               # renders resume / projects / blog from JSON
├── data/
│   ├── analytics_engineer.json    (copied from resume_generator)
│   ├── bi_solutions_architect.json
│   ├── director_bi.json
│   ├── senior_data_engineer.json
│   └── blog.json                  (your posts - edit this!)
├── README.md
└── .gitignore
```

## Run locally

`fetch()` won't work on `file://` URLs, so serve over HTTP:

```bash
# any one of these works:
python -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000
```

Then open http://localhost:8000

## Editing content

| Want to change | Edit                                            |
|----------------|-------------------------------------------------|
| Resume content | `data/<variant>.json` (or the source files in `../resume_generator/data/` and copy over) |
| Add a blog post| `data/blog.json` - append a new object to `posts[]`  |
| Hero copy      | `index.html` - the `#hero` section              |
| About copy     | `index.html` - the `#about` section             |
| Colors         | `<script>` block in `index.html` (Tailwind config)  |

## Deploy to GitHub Pages

### Option A - separate repo (recommended)

1. Create a new GitHub repo, e.g. **`siddh-portfolio`** (public).
2. From `D:\Resume\portfolio\`:

   ```powershell
   cd D:\Resume\portfolio
   git init -b main
   git add -A
   git commit -m "Initial portfolio site"
   git remote add origin https://github.com/Sidppatel/siddh-portfolio.git
   git push -u origin main
   ```

3. On GitHub: **Settings -> Pages -> Source = `main` branch, root folder -> Save**.
4. Wait ~1 minute, your site is live at `https://sidppatel.github.io/siddh-portfolio/`.

### Option B - user site (URL is just `sidppatel.github.io`)

Create a repo named **exactly** `sidppatel.github.io`, push the contents of `portfolio/` to its `main` branch. Pages auto-publishes - the URL is `https://sidppatel.github.io`.

### Option C - alongside resume_generator in `/docs`

If you want both in one repo:

```
resume_generator/        (your existing repo)
├── ...                  (existing files)
└── docs/                (move portfolio/ contents here)
    ├── index.html
    └── ...
```

In Pages settings: source = `main` branch, **/docs** folder.

## Custom domain (optional)

1. Buy a domain (e.g. on Namecheap, Cloudflare Registrar, or Porkbun).
2. In your DNS provider, add either:
   - **Apex** (siddhpatel.dev): four A records pointing at `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **www** (www.siddhpatel.dev): a CNAME to `sidppatel.github.io`
3. In the repo, **Settings -> Pages -> Custom domain** -> enter your domain, save. GitHub creates a `CNAME` file for you.
4. Tick **Enforce HTTPS** once the cert provisioning finishes (~10-30 minutes).

## SEO checklist (when you're ready)

- [ ] Add Open Graph image to `index.html` (`<meta property="og:image" ...>`)
- [ ] Add `sitemap.xml` and `robots.txt`
- [ ] Verify the site in Google Search Console
- [ ] Add JSON-LD `Person` structured data with your name, title, sameAs links

## License

Personal portfolio - all rights reserved.
