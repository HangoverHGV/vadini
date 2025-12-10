from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from wait_for_db import wait_for_db
from user.cookie import OAuth2PasswordBearerWithCookie
import redis
from os import getenv, path, makedirs, getcwd
from user import models
from database import engine, SessionLocal

# ---------- #


# JWT CONFIG

SECRET_KEY = getenv("SECRET_KEY")
ALGORITHM = getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_DAYS = 1

# ---------- #

# Wait for database to be initialized

wait_for_db()

# ---------- #

# SWAGGER CONFIG

SWAGGER_UI_PARAMETERS = {
    'deepLinking': True
}

# ---------- #

SWAGGER_UI_INIT_OAUTH = {
    'clientId': '',
    'clientSecret': '',
    'realm': 'CMS API',
    'appName': 'CMS API',
    'scopeSeparator': ' ',
    'scopes': 'read write',
    'useBasicAuthenticationWithAccessCodeGrant': True
}

# ---------- #

# OAUTH2 CONFIG

oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl='/user/token')

# ---------- #

# REDIS CONFIG

REDIS_HOST = getenv("REDIS_HOST")
REDIS_PORT = getenv("REDIS_PORT")
REDIS_PASSWORD = getenv("REDIS_PASSWORD")
REDIS_DB = getenv("REDIS_DB")

redis_config = {
    'host': REDIS_HOST,
    'port': REDIS_PORT,
    'password': REDIS_PASSWORD if REDIS_PASSWORD else None,
    'db': REDIS_DB
}

redis_client = redis.Redis(**{k:v for k ,v in redis_config.items() if v is not None})

# ---------- #

# FAST API APP

app = FastAPI(swagger_ui_parameters=SWAGGER_UI_PARAMETERS, swagger_ui_init_oauth=SWAGGER_UI_INIT_OAUTH,
              root_path='api',
              docs_url='/docs',
              redoc_url='/redoc',
              openapi_url='/openapi.json',
              title='CMS API',
              description='CMS API',
              openapi_schema=oauth2_scheme
            )

## Cors

is_prod = getenv("PRODUCTION")
print(is_prod)

if is_prod:
    origins = [
        'https://sudurasimontaj.com'
    ]
else:
    origins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- #


# Database 

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- #

# MEDIA PATH

HTML_PATH = path.join(getcwd(), 'website')
IMAGES_PATH = path.join(getcwd(), 'images')
IMAGES_LARGE = path.join(IMAGES_PATH, 'large')
IMAGES_MEDIUM = path.join(IMAGES_PATH, 'medium')
IMAGES_SMALL = path.join(IMAGES_PATH, 'small')

PATHS = [HTML_PATH, IMAGES_PATH, IMAGES_LARGE, IMAGES_MEDIUM, IMAGES_SMALL]

for p in PATHS:
    if not path.exists(p):
        makedirs(p, exist_ok=True)

# ---------- #

# IMAGE PARAMETERS

IMAGE_MAX_WIDTH = 1200 
IMAGE_WEBP_QUALITY = 85 # 0 (worst) to 100 (best)

# ---------- #
