# GitHub Upload Instructions

Follow these steps to upload your Math Star website to GitHub:

## 1. Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter a repository name (e.g., "math-star-website")
4. Add an optional description: "Math Star tutoring website for grades 1-10"
5. Choose whether to make the repository public or private
6. Do NOT initialize the repository with a README, .gitignore, or license
7. Click "Create repository"

## 2. Push Your Local Repository to GitHub

After creating the repository, GitHub will show you commands to push an existing repository. Use the following commands in your terminal:

```bash
cd ~/math-star-website

# Add the GitHub repository as a remote
git remote add origin https://github.com/YOUR-USERNAME/math-star-website.git

# Push your code to GitHub
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## 3. Verify Your Upload

1. Refresh your GitHub repository page
2. You should see all your website files listed
3. Click on individual files to view their contents

## 4. Enable GitHub Pages (Optional)

To make your website accessible online through GitHub Pages:

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. After a few minutes, your site will be available at: `https://YOUR-USERNAME.github.io/math-star-website`

## 5. Connect Your Custom Domain (Optional)

If you want to use your math-star.org domain with GitHub Pages:

1. In your repository's "Settings", go to the "GitHub Pages" section
2. Under "Custom domain", enter "www.math-star.org"
3. Click "Save"
4. Add a CNAME record in your domain's DNS settings pointing to `YOUR-USERNAME.github.io`
5. Add A records pointing to GitHub Pages' IP addresses:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153

## Need Help?

If you encounter any issues, refer to GitHub's documentation:
- [Creating a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [Adding an existing project to GitHub](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)
- [Setting up GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
