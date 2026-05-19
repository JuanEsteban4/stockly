from pydantic import BaseModel


class ProductoCreate(BaseModel):
    nombre: str
    descripcion: str | None = None
    sku: str
    precio_costo: float
    precio_venta: float
    stock_actual: int = 0
    stock_minimo: int = 5


class ProductoResponse(ProductoCreate):
    id: int

    class Config:
        from_attributes = True