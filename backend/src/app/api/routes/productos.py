from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas import ProductoCreate, ProductoResponse
from app.services import ProductoService

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=list[ProductoResponse])
def listar_productos(db: Session = Depends(get_db)):
    return ProductoService.listar_productos(db)


@router.post("/", response_model=ProductoResponse)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    return ProductoService.crear_producto(db, producto)


@router.get("/buscar",response_model=list[ProductoResponse])
def listar_productos_por_nombre(nombre: str, db: Session = Depends(get_db)):
    return ProductoService.listar_productos_por_nombre(db, nombre)