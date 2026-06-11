from sqlalchemy.orm import Session
from app.repositories import CategoriaRepository
from app.schemas import CategoriaCreate
from app.models import Categoria

class CategoriaService:

    @staticmethod
    def listar_categorias(db: Session) -> list[Categoria]:
        return CategoriaRepository.get_all(db)

    @staticmethod
    def crear_categoria(db: Session, producto: CategoriaCreate) -> Categoria:
        return CategoriaRepository.create(db, producto)
    
    @staticmethod
    def listar_categorias_por_nombre(db: Session, name: str) -> list[Categoria]:
        return CategoriaRepository.get_by_name(db, name)