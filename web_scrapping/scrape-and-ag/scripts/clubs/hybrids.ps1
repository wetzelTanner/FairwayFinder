#PowerShell Script that Runs Club/Drivers Scripts

cd "../../../playwright_files/playwright-node-files/clubs/hybrids"
node "scrap_hybrids.js"
cd "../../../../scrape-and-ag/web-src-scraping/clubs/hybrids"
node "ocr_hybrids.js"
cd "../../../data-ag/clubs/hybrids/"
node "analyze_hybrids.js"
cd "../../../../scrape-and-ag/scripts/clubs"