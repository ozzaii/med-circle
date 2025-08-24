import puppeteer from 'puppeteer';

async function testBulletproofMEP() {
  console.log('🚨 TESTING BULLETPROOF MEP DASHBOARD...');
  
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
    await page.screenshot({ path: 'homepage-test.png', fullPage: true });
    
    // Look for MEP Modules navigation
    console.log('🔍 Looking for MEP Modules navigation...');
    
    // Wait for and click MEP Modules link
    try {
      await page.waitForSelector('a[href*="/mep"], a[href*="mep"], button:contains("MEP"), *:contains("MEP Modules")', { timeout: 5000 });
      
      // Try different selectors for MEP navigation
      const mepSelectors = [
        'a[href*="/mep"]',
        'a[href*="mep"]', 
        'button[aria-label*="MEP"]',
        'nav a:contains("MEP")',
        '*:contains("MEP Modules")'
      ];
      
      let mepElement = null;
      for (const selector of mepSelectors) {
        try {
          mepElement = await page.$(selector);
          if (mepElement) {
            console.log(`✅ Found MEP navigation with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Try next selector
        }
      }
      
      if (mepElement) {
        await mepElement.click();
        await page.waitForTimeout(2000);
        console.log('✅ Clicked MEP navigation!');
      } else {
        // Manual navigation to MEP dashboard
        console.log('🔄 Manually navigating to MEP Dashboard...');
        await page.goto('http://localhost:5173/mep', { waitUntil: 'networkidle2' });
      }
      
    } catch (error) {
      console.log('🔄 MEP nav not found, trying direct navigation...');
      await page.goto('http://localhost:5173/mep', { waitUntil: 'networkidle2' });
    }
    
    console.log('📸 Taking screenshot of MEP Dashboard...');
    await page.screenshot({ path: 'mep-dashboard-bulletproof.png', fullPage: true });
    
    // Check if bulletproof dashboard loaded
    const dashboardTitle = await page.$eval('h1', el => el.textContent).catch(() => 'Not found');
    console.log('📋 Dashboard title:', dashboardTitle);
    
    // Look for the revolutionary clinical cases
    console.log('🚨 Looking for BULLETPROOF clinical cases...');
    
    const clinicalCases = await page.$$eval('*', (elements) => {
      return elements
        .filter(el => el.textContent && (
          el.textContent.includes('VAKA 1') || 
          el.textContent.includes('VAKA 2') ||
          el.textContent.includes('VAKA 3') ||
          el.textContent.includes('VAKA 4') ||
          el.textContent.includes('SEPTİK ŞOK') ||
          el.textContent.includes('STEMI') ||
          el.textContent.includes('STATUS EPİLEPTİKUS') ||
          el.textContent.includes('FEBRİL NÖTROPENİ')
        ))
        .map(el => el.textContent.trim())
        .slice(0, 10);
    });
    
    console.log('🎯 Found clinical content:', clinicalCases);
    
    // Test the BULLETPROOF "VAKAYA BAŞLA" button
    console.log('🧪 Testing BULLETPROOF Başla button functionality...');
    
    const startButtons = await page.$$('button:contains("VAKAYA BAŞLA"), button:contains("Başla"), button:contains("Vakayı"), *:contains("VAKAYA BAŞLA")');
    
    if (startButtons.length > 0) {
      console.log(`✅ Found ${startButtons.length} start button(s)!`);
      
      // Click the first start button
      await startButtons[0].click();
      await page.waitForTimeout(3000);
      
      console.log('📸 Taking screenshot after button click...');
      await page.screenshot({ path: 'after-basla-click.png', fullPage: true });
      
      // Check if clinical case modal opened
      const modalVisible = await page.$('.fixed.inset-0, [role="dialog"], .modal') !== null;
      console.log('🎯 Clinical case modal opened:', modalVisible);
      
      if (modalVisible) {
        console.log('🚀 SUCCESS: BULLETPROOF Başla button is working!');
      } else {
        console.log('❌ Issue: Clinical case modal not detected');
      }
      
    } else {
      console.log('❌ No start buttons found');
      
      // Check page content for debugging
      const pageContent = await page.$eval('body', el => el.textContent.substring(0, 1000));
      console.log('📝 Page content for debugging:', pageContent);
    }
    
    console.log('✅ BULLETPROOF TEST COMPLETED!');
    
  } catch (error) {
    console.error('💥 Error during bulletproof testing:', error.message);
    await page.screenshot({ path: 'error-bulletproof.png', fullPage: true });
  }
  
  // Keep browser open for inspection
  console.log('🔍 Browser kept open for manual inspection...');
  // await browser.close();
}

testBulletproofMEP().catch(console.error);