from functools import wraps
from fastapi import HTTPException, status, UploadFile
from PIL import Image
from typing import Tuple
from configs import IMAGES_LARGE, IMAGES_MEDIUM, IMAGES_SMALL, IMAGE_WEBP_QUALITY
import io
import uuid
import os
from pathlib import Path
from datetime import datetime

def active_user_required(func):
    """
    FastAPI decorator to ensure the user is active.

    This decorator checks if a 'current_user' object is passed to the decorated
    function and if that user's 'is_active' attribute is True.

    It assumes that the decorated endpoint has a dependency that provides
    a `current_user` keyword argument (e.g., `Depends(get_current_user)`).

    Raises:
        HTTPException(401): If the user is not found or is not active.
    """
    @wraps(func)
    async def wrapper(*args, **kwargs):
        current_user = kwargs.get('current_user')
        # Ensure the user exists and is active.
        if not current_user or not current_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required: User is not active or not found."
            )
        return await func(*args, **kwargs)
    return wrapper

def superuser_required(func):
    """
    FastAPI decorator to ensure the user is a superuser.

    The decorator checks if current user is superuser 
    """
    @wraps(func)
    async def wrapper(*args, **kwargs):
        current_user = kwargs.get('current_user')
        # Ensure the user is a superuser.
        if not current_user or not current_user.is_superuser or not current_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required: User is not a superuser or not active."
            )
        return await func(*args, **kwargs)
    return wrapper

async def process_and_save_image(image: UploadFile) -> str:
    """
    Processes an uploaded image, creates large, medium, and small WebP versions,
    and saves them to the appropriate directories.

    Args:
        image (UploadFile): The uploaded image from a FastAPI endpoint.

    Returns:
        str: The unique filename (e.g., '2023/11/some-uuid.webp') for the saved images.
    """
    # Define max widths for each size variant
    size_variants = {
        "large": (2500, IMAGES_LARGE),
        "medium": (1920, IMAGES_MEDIUM),
        "small": (1200, IMAGES_SMALL),
    }

    # Generate a unique filename and path structure
    now = datetime.now()
    year = str(now.year)
    month = str(now.month).zfill(2)
    unique_id = uuid.uuid4()
    filename = f"{unique_id}.webp"
    relative_path = Path(year) / month

    # Read image content into memory
    contents = await image.read()
    img = Image.open(io.BytesIO(contents))

    # Ensure image is in a compatible mode for saving as WebP
    if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')

    original_width, original_height = img.size

    for size_name, (max_width, save_dir) in size_variants.items():
        # Only resize if the original is wider than the target max width
        if original_width > max_width:
            aspect_ratio = original_height / original_width
            new_width = max_width
            new_height = int(new_width * aspect_ratio)
            resized_img = img.resize((new_width, new_height), Image.LANCZOS)
        else:
            # Use the original image if it's already small enough
            resized_img = img

        # Create the destination directory
        destination_dir = Path(save_dir) / relative_path
        os.makedirs(destination_dir, exist_ok=True)

        # Save the processed image as WebP
        save_path = destination_dir / filename
        resized_img.save(save_path, 'WEBP', quality=IMAGE_WEBP_QUALITY)

    # Return the relative path and filename, which can be stored in the database
    return (relative_path / filename).as_posix()
