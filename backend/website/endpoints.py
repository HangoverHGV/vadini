from fastapi import APIRouter
from fastapi.responses import FileResponse, RedirectResponse
import os

router = APIRouter()

# Get the directory of the current file to build absolute paths.
# This makes it robust, regardless of where the app is run from.
WEBSITE_DIR = os.path.dirname(os.path.abspath(__file__))

@router.get("/", include_in_schema=False)
async def root():
    """
    Redirects the root URL to the login page.
    """
    return RedirectResponse(url="/login")

@router.get("/login", include_in_schema=False)
async def get_login_page():
    """
    Serves the login.html page.
    """
    return FileResponse(os.path.join(WEBSITE_DIR, "login.html"))

@router.get("/signup", include_in_schema=False)
async def get_signup_page():
    """
    Serves the signup.html page.
    """
    return FileResponse(os.path.join(WEBSITE_DIR, "signup.html"))
