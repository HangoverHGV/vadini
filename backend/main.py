from configs import app, is_prod
from user.endpoints import router as user_router
from products.endpoints import router as products_router
from website.endpoints import router as website_router


app.include_router(user_router, prefix='/user', tags=['user'])
app.include_router(products_router, prefix='/products', tags=['products'])
app.include_router(website_router)



if __name__ == '__main__':
    import uvicorn
    if is_prod:
        uvicorn.run(app, host='0.0.0.0', port=8002)
    else:
        uvicorn.run(app, host='0.0.0.0', port=8002, reload=True)