import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Mock window.print
        await page.add_init_script("window.print = () => { console.log('window.print called'); }")
        
        await page.goto('http://localhost:3000')
        
        # Add item
        print("Adding item to cart...")
        await page.locator('text="Add to Order"').first.click()
        
        # Click Checkout & Print
        print("Clicking Checkout...")
        await page.locator('button:has-text("Checkout & Print")').click()
        
        # Wait a bit for the checkout effect
        await asyncio.sleep(1)

        # Force the bill to be visible for the screenshot
        print("Making bill visible for screenshot...")
        await page.evaluate("""() => {
            const bill = document.getElementById('printable-bill');
            if (bill) {
                bill.style.display = 'block';
                bill.style.position = 'fixed';
                bill.style.top = '50%';
                bill.style.left = '50%';
                bill.style.transform = 'translate(-50%, -50%)';
                bill.style.zIndex = '9999';
                bill.style.background = 'white';
                bill.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
            }
        }""")
        
        # Check if text exists in DOM
        content = await page.content()
        if "RECEIPT" in content:
            print("Receipt found in DOM")
        else:
            print("Receipt NOT found in DOM")
            
        await page.screenshot(path='/home/jules/verification/pos_bill_final.png', full_page=True)
        print("Screenshot saved to /home/jules/verification/pos_bill_final.png")
        await browser.close()

asyncio.run(run())
