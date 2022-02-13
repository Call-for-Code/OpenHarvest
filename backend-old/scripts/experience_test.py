import os, time, sys, datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys

date = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")

# Do an action on the app's landing page
options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome(options=options)
driver.get(os.environ["APP_URL"]); # Open a browser to the app's landing page
item_box = driver.find_element_by_xpath("//input[@placeholder='item']") # Locate the text box
item_box.send_keys(date) # Enter some text
item_box.send_keys(Keys.ENTER) # Press ENTER

# Verify the action on the app's landing page
time.sleep(3)
output = driver.find_element_by_id('responseArea').text.splitlines()
print("The last entry in the 'responseArea' element is: {}".format(output[-1]))
if output[-1] == date:
    print("Experience Test Successful")
else:
    sys.exit("Experience Test Failed")
