from pydantic import BaseModel


class CategoriaCreate(BaseModel):
    nombre: str


class CategoriaResponse(CategoriaCreate):
    id: int

    class Config:
        from_attributes = True