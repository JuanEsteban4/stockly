from fastapi import FastAPI

from app.core.database import Base, engine
import app.models

from app.api.routes import routers

app = FastAPI(title="Stockly API")

#Init db
Base.metadata.create_all(bind=engine)

#Add the routes 
for router in routers:
    app.include_router(router)
#Then we add the missing ones

@app.get("/")
def root():
    return {"message": "Stockly backend running"}