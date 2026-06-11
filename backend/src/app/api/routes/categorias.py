from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas import CategoriaCreate, CategoriaResponse
from app.services import CategoriaService

router = APIRouter(prefix="/categorias", tags=["Categorias"])

@router.get("/", response_model=list[CategoriaResponse])
def listar_productos(db: Session = Depends(get_db)):
    return CategoriaService.listar_categorias(db)


@router.post("/", response_model=CategoriaResponse)
def crear_producto(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    return CategoriaService.crear_categoria(db, categoria)


@router.get("/buscar",response_model=list[CategoriaResponse])
def listar_productos_por_nombre(nombre: str, db: Session = Depends(get_db)):
    return CategoriaService.listar_categorias_por_nombre(db, nombre)