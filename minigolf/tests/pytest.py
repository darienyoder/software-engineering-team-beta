import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys  # Import Keys for keyboard actions
import os
import threading
import http.server
import socketserver
import selenium.common.exceptions

# Define the port and path to your HTML file
PORT = 8000
HTML_FILE = "index.html"  # Update to your actual file name
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))  # Absolute path of the script
DIRECTORY = os.path.join(os.path.dirname(SCRIPT_DIR))  # Adjust if your HTML is in the 'minigolf' subdirectory
  # Correct the path separator

# Function to start the local HTTP server in a separate thread
def start_server(port, directory):
    handler = http.server.SimpleHTTPRequestHandler
    os.chdir(directory)  # Change the directory to serve files from
    httpd = socketserver.TCPServer(("", port), handler)
    
    # Start the server in a new thread so that the main program can continue
    server_thread = threading.Thread(target=httpd.serve_forever)
    server_thread.daemon = True  # Ensure the thread closes when the main program exits
    server_thread.start()
    print(f"Server started at http://localhost:{port}")
    return httpd

# Function to check if the server is running
def wait_for_server(timeout=45):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(f'http://localhost:{PORT}/{HTML_FILE}')
            if response.status_code == 200:
                return True
        except requests.ConnectionError:
            time.sleep(1)  # Wait a moment before retrying
    return False

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode
chrome_options.add_argument("--no-sandbox")  # Required for CI environments
chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems

# Automatically download and configure ChromeDriver
service = Service(ChromeDriverManager().install())

# Initialize the WebDriver
driver = webdriver.Chrome(service=service, options=chrome_options)

# Function to wait for element to be clickable
def wait_for_clickable(element, timeout=45):
    WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable(element)
    )

# Function to attempt click with retries
def click_element_with_retry(element, retries=3, delay=1):
    for attempt in range(retries):
        try:
            element.click()
            return True
        except selenium.common.exceptions.ElementNotInteractableException:
            if attempt < retries - 1:
                time.sleep(delay)  # Wait and try again
            else:
                raise  # Re-raise the exception if all retries fail
    return False

try:
    # Start the HTTP server
    server_process = start_server(PORT, DIRECTORY)

    # Wait for the server to be up and serving the HTML file
    if not wait_for_server():
        print("Server did not start in time.")
        exit(1)

    # Navigate to the page using Selenium
    driver.get(f'http://localhost:{PORT}/{HTML_FILE}')
    
    # Wait until the loading button is clickable
    loading_button = WebDriverWait(driver, 45).until(
        EC.element_to_be_clickable((By.ID, "loading-button"))
    )

    # Click the loading button
    click_element_with_retry(loading_button)

    # Wait for the start button to be clickable
    start_button = WebDriverWait(driver, 45).until(
        EC.element_to_be_clickable((By.ID, "start-button"))
    )

    # Click the start button
    click_element_with_retry(start_button)

    # After clicking the start button, send the backtick key (` ` `) directly to the browser window
    driver.send_keys('`')  # Send backtick as a string

    # Optionally, capture console logs to check for errors
    logs = driver.get_log('browser')
    has_errors = False

    for log in logs:
        print(f"{log['level']}: {log['message']}")
        if "❌" in log['message']:  # Check for failure indicators
            has_errors = True

    if has_errors:
        print("One or more tests failed.")
        exit(1)
    else:
        print("All tests passed.")
        exit(0)

finally:
    # Close the driver
    driver.quit()
