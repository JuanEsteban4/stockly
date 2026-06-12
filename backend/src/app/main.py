from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
import app.models

from app.api.routes import routers

app = FastAPI(title="Stockly API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:4173",   # Vite preview
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Init db
Base.metadata.create_all(bind=engine)

#Add the routes 
for router in routers:
    app.include_router(router)
#Then we add the missing ones

@app.get("/")
def root():
    return {"message": "Stockly backend running"}