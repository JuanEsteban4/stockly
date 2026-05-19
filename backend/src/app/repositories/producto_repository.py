from sqlalchemy.orm import Session
from app.models.producto import Producto
from app.schemas import ProductoCreate


class ProductoRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Producto).all()

    @staticmethod
    def create(db: Session, producto: ProductoCreate):
        db_producto = Producto(**producto.model_dump())
        db.add(db_producto)
        db.commit()
        db.refresh(db_producto)
        return db_producto
    
    @staticmethod
    def get_by_name(db: Session, name: str) -> list[Producto]:
        return db.query(Producto).filter(
            Producto.nombre.ilike(f"%{name}%")
        ).all()