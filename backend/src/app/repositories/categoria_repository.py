from sqlalchemy.orm import Session
from app.models import Categoria
from app.schemas import CategoriaCreate


class CategoriaRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Categoria).all()

    @staticmethod
    def create(db: Session, categoria: CategoriaCreate) -> Categoria:
        db_categoria = Categoria(**categoria.model_dump())
        db.add(db_categoria)
        db.commit()
        db.refresh(db_categoria)
        return db_categoria

    @staticmethod
    def get_by_name(db: Session, name: str) -> list[Categoria]:
        return db.query(Categoria).filter(
            Categoria.nombre.ilike(f"%{name}%")
        ).all()