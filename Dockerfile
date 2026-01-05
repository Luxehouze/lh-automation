# Image resmi Playwright (sudah ada Node + Chromium/Firefox/WebKit + deps Linux)
# Versi disamakan dengan @playwright/test kamu: ^1.57.0
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# Folder kerja di dalam container
WORKDIR /usr/src/app

# Copy package.json (dan package-lock kalau ada) dulu
COPY package*.json ./

# Install dependencies (devDependencies juga perlu karena ini test project)
RUN npm install

# Copy semua source code
COPY . .

# (Opsional) kalau mau paksa install ulang browser:
# RUN npx playwright install --with-deps

# Default command: jalankan Playwright test runner
CMD ["npm", "run", "cucumber"]
