from fastapi import FastAPI

from app.core.database import Base, engine
from app.models import producto
from app.api.routes import productos

app = FastAPI(title="Stockly API")

#Init db
Base.metadata.create_all(bind=engine)

#Add the routes 
app.include_router(productos.router)
#Then we add the missing ones

@app.get("/")
def root():
    return {"message": "Stockly backend running"}