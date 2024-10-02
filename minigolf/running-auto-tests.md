# Oz's Guide to end pain and suffering

## Automated Testing on Github

whenever a commit is pushed to the main branch, the tests will run.

This is really cool because it uses the pre-existing test framework.

## Running it locally

First navigate to the project root, not minigolf (this is needed because otherwise the github workflow wouldn't run)
```
cd {github-folder-name}
```

then install dependencies: (You should only need to do this once)
```
sudo apt-get update
sudo apt-get install -y \
    libxss1 \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libgconf-2-4 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    libxdamage1 \
    libxext6 \
    fonts-liberation \
    libgbm1 \
    xdg-utils \
    wget

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb || sudo apt-get -f install -y

python -m pip install --upgrade pip
pip install selenium webdriver-manager requests
```

Run the testing script:
```
python minigolf/pytest.py
```