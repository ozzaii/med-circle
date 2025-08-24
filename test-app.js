import puppeteer from 'puppeteer';

async function testMedicalAI() {
  console.log('🚀 Starting Turkish Medical AI System Test...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log('📍 Navigating to localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    
    console.log('📸 Taking screenshot of homepage...');
    await page.screenshot({ path: 'homepage.png', fullPage: true });
    
    // Check if MEP Modules link exists
    console.log('🔍 Looking for MEP Modules...');
    const mepModulesLink = await page.$('a[href*="mep"]');
    if (mepModulesLink) {
      console.log('✅ MEP Modules link found!');
      await mepModulesLink.click();
      await page.waitForTimeout(2000);
      
      console.log('📸 Taking screenshot of MEP Dashboard...');
      await page.screenshot({ path: 'mep-dashboard.png', fullPage: true });
      
      // Look for clinical cases
      console.log('🔍 Looking for clinical cases...');
      const clinicalCases = await page.$$eval('*', (elements) => {
        return elements
          .filter(el => el.textContent && el.textContent.includes('VAKA'))
          .map(el => el.textContent.trim())
          .slice(0, 5);
      });
      
      console.log('📋 Found clinical content:', clinicalCases);
      
      // Check for Septic Shock case specifically
      const septicShockCase = await page.$('*:contains("SEPTİK ŞOK")');
      if (septicShockCase) {
        console.log('🎯 Septic Shock case found! Clicking...');
        await septicShockCase.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'septic-shock-case.png', fullPage: true });
      }
      
    } else {
      console.log('❌ MEP Modules link not found. Checking current page content...');
      
      const pageTitle = await page.title();
      console.log('📄 Page title:', pageTitle);
      
      const pageContent = await page.$eval('body', el => el.textContent.substring(0, 500));
      console.log('📝 Page content preview:', pageContent);
      
      // Check sidebar navigation
      const sidebarLinks = await page.$$eval('nav a, .sidebar a, [role="navigation"] a', 
        links => links.map(link => ({ text: link.textContent.trim(), href: link.href }))
      );
      console.log('🧭 Available navigation:', sidebarLinks);
    }
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('💥 Error during testing:', error.message);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  }
  
  // Keep browser open for manual inspection
  console.log('🔍 Browser kept open for manual inspection...');
  // await browser.close();
}

testMedicalAI().catch(console.error);