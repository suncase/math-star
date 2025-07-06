# GitHub Personal Access Token Guide

To upload your Math Star website to GitHub, follow these steps to create and use a personal access token:

## 1. Create a Personal Access Token on GitHub

1. Go to [GitHub.com](https://github.com) and sign in to your account
2. Click on your profile picture in the top-right corner
3. Select "Settings"
4. Scroll down and click on "Developer settings" in the left sidebar
5. Click on "Personal access tokens" and then "Tokens (classic)"
6. Click "Generate new token" and then "Generate new token (classic)"
7. Give your token a descriptive name like "Math Star Website Upload"
8. Select the following scopes:
   - `repo` (Full control of private repositories)
9. Click "Generate token"
10. **IMPORTANT**: Copy the token immediately and save it somewhere secure. You won't be able to see it again!

## 2. Use the Token to Push Your Code

Open Terminal and run the following commands, replacing `YOUR_TOKEN` with the token you just created:

```bash
cd ~/math-star-website

# Configure Git to use the token
git remote set-url origin https://YOUR_TOKEN@github.com/suncase/math-star.git

# Push your code
git push -u origin main
```

## 3. Verify Your Upload

1. Go to https://github.com/suncase/math-star
2. You should see all your website files in the repository

## Alternative: Upload Files Manually

If the above method doesn't work, you can upload your files manually:

1. Go to https://github.com/suncase/math-star
2. Click "Add file" > "Upload files"
3. Drag and drop files from the ~/math-star-clean directory
4. Click "Commit changes"

Note: You may need to upload files in batches if there are many files.
