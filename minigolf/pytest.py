import subprocess
import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import os

# Define the port and path to your HTML file
PORT = 8000
HTML_FILE = "index.html"  # Update to your actual file name
DIRECTORY = os.path.dirname(os.path.abspath('minigolf/' + HTML_FILE))  # Correct the path separator

# Function to start the local server
def start_server(port):
    return subprocess.Popen(
        ['python', '-m', 'http.server', str(port)],
        cwd=DIRECTORY,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

# Function to check if the server is running
def wait_for_server(port, timeout=45):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(f'http://localhost:{port}')
            if response.status_code == 200:
                return True
        except requests.ConnectionError:
            time.sleep(1)  # Wait a moment before retrying
    return False

# Start the local server
server_process = start_server(PORT)

# Wait for the server to start
if not wait_for_server(PORT):
    print("Server did not start in time.")
    server_process.terminate()
    exit(1)

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode
chrome_options.add_argument("--no-sandbox")  # Required for CI environments
chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems

# Automatically download and configure ChromeDriver
service = Service(ChromeDriverManager().install())

# Initialize the WebDriver
driver = webdriver.Chrome(service=service, options=chrome_options)

try:
    # Open your HTML file via the local server
    driver.get(f'http://localhost:{PORT}/{HTML_FILE}')

    time.sleep(20)

    # Execute additional JavaScript functions if needed
    driver.execute_script("startGame()")
    time.sleep(2)
    driver.execute_script("runTests()")
    time.sleep(10)

    # Capture console logs
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

    # Terminate the server
    server_process.terminate()
    server_process.wait()  # Wait for the server process to exit
