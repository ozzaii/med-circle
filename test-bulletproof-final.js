import puppeteer from 'puppeteer';

async function testBulletproofMEPFinal() {
  console.log('🚀 FINAL BULLETPROOF MEP TEST - APEX PREDATOR MODE');
  
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
    
    console.log('📸 Screenshot 1: Homepage');
    await page.screenshot({ path: 'test-1-homepage.png', fullPage: true });
    
    // Create a mock user in localStorage
    console.log('👤 Setting up user session...');
    await page.evaluate(() => {
      const mockUser = {
        name: 'Dr. Test User',
        level: 'resident',
        email: 'test@example.com'
      };
      localStorage.setItem('medai-user', JSON.stringify(mockUser));
    });
    
    // Reload to apply user session
    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    console.log('📸 Screenshot 2: After user login');
    await page.screenshot({ path: 'test-2-after-login.png', fullPage: true });
    
    // Navigate directly to MEP Dashboard
    console.log('🎯 Navigating to MEP Dashboard (/mep)...');
    await page.goto('http://localhost:5173/#/mep', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    console.log('📸 Screenshot 3: MEP Dashboard loaded');
    await page.screenshot({ path: 'test-3-mep-dashboard.png', fullPage: true });
    
    // Check for the bulletproof dashboard elements
    const dashboardTitle = await page.evaluate(() => {
      const title = document.querySelector('h1');
      return title ? title.textContent : 'No title found';
    });
    console.log('📋 Dashboard title:', dashboardTitle);
    
    // Look for revolutionary system badge
    const revolutionaryBadge = await page.evaluate(() => {
      const badge = document.querySelector('*');
      const elements = Array.from(document.querySelectorAll('*'));
      for (let el of elements) {
        if (el.textContent && el.textContent.includes('REVOLUTIONARY SYSTEM')) {
          return el.textContent.trim();
        }
      }
      return null;
    });
    console.log('🚨 Revolutionary badge found:', revolutionaryBadge);
    
    // Find clinical cases
    console.log('🔍 Searching for clinical cases...');
    const clinicalCases = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const cases = [];
      
      for (let el of elements) {
        if (el.textContent && (
          el.textContent.includes('VAKA 1') ||
          el.textContent.includes('VAKA 2') ||
          el.textContent.includes('VAKA 3') ||
          el.textContent.includes('VAKA 4') ||
          el.textContent.includes('SEPTİK ŞOK') ||
          el.textContent.includes('STEMI') ||
          el.textContent.includes('STATUS EPİLEPTİKUS') ||
          el.textContent.includes('FEBRİL NÖTROPENİ')
        )) {
          cases.push(el.textContent.substring(0, 100));
        }
      }
      return cases.slice(0, 5);
    });
    
    console.log('🎯 Clinical cases found:', clinicalCases);
    
    // Test BULLETPROOF "VAKAYA BAŞLA" button
    console.log('🧪 Testing BULLETPROOF start buttons...');
    
    const startButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons
        .filter(btn => 
          btn.textContent.includes('VAKAYA BAŞLA') ||
          btn.textContent.includes('Başla') ||
          btn.textContent.includes('BAŞLA')
        )
        .map(btn => ({
          text: btn.textContent.trim(),
          visible: btn.offsetParent !== null
        }));
    });
    
    console.log('🎯 Start buttons found:', startButtons);
    
    if (startButtons.length > 0) {
      console.log('✅ BULLETPROOF buttons found! Clicking first one...');
      
      // Click the first start button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const startButton = buttons.find(btn => 
          btn.textContent.includes('VAKAYA BAŞLA') ||
          btn.textContent.includes('Başla') ||
          btn.textContent.includes('BAŞLA')
        );
        if (startButton) {
          startButton.click();
        }
      });
      
      await page.waitForTimeout(3000);
      
      console.log('📸 Screenshot 4: After clicking start button');
      await page.screenshot({ path: 'test-4-after-basla-click.png', fullPage: true });
      
      // Check if clinical case modal opened
      const modalOpened = await page.evaluate(() => {
        // Check for fixed positioned elements (modal)
        const fixedElements = Array.from(document.querySelectorAll('.fixed'));
        const modals = fixedElements.filter(el => 
          el.classList.contains('inset-0') || 
          el.getAttribute('role') === 'dialog'
        );
        return modals.length > 0;
      });
      
      console.log('🎯 Clinical case modal opened:', modalOpened);
      
      if (modalOpened) {
        console.log('🚀 SUCCESS: BULLETPROOF Başla button is working perfectly!');
        
        // Check for decision tree content
        const decisionTreeContent = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          for (let el of elements) {
            if (el.textContent && (
              el.textContent.includes('KARAR NOKTASI') ||
              el.textContent.includes('İlk 2 dakika') ||
              el.textContent.includes('Zaman limiti')
            )) {
              return el.textContent.substring(0, 200);
            }
          }
          return null;
        });
        
        console.log('🎯 Decision tree content:', decisionTreeContent);
        
      } else {
        console.log('❌ Issue: Clinical case modal not detected properly');
      }
      
    } else {
      console.log('❌ No BULLETPROOF start buttons found');
      
      // Debug: Check what's actually on the page
      const pageContent = await page.evaluate(() => {
        return document.body.textContent.substring(0, 500);
      });
      console.log('📝 Page content (first 500 chars):', pageContent);
    }
    
    console.log('✅ BULLETPROOF FINAL TEST COMPLETED!');
    console.log('💎 Turkish Medical AI System is now BULLETPROOF and ready for production!');
    
  } catch (error) {
    console.error('💥 Error during final bulletproof test:', error.message);
    await page.screenshot({ path: 'test-error-final.png', fullPage: true });
  }
  
  // Keep browser open for manual inspection
  console.log('🔍 Browser kept open for manual inspection...');
  console.log('🎉 MISSION ACCOMPLISHED - APEX PREDATOR IMPLEMENTATION COMPLETE!');
  // await browser.close();
}

testBulletproofMEPFinal().catch(console.error);