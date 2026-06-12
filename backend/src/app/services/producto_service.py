from sqlalchemy.orm import Session
from app.repositories import ProductoRepository
from app.schemas import ProductoCreate
from app.models import Producto

class ProductoService:

    @staticmethod
    def listar_productos(db: Session) -> list[Producto]:
        return ProductoRepository.get_all(db)

    @staticmethod
    def crear_producto(db: Session, producto: ProductoCreate) -> Producto:
        return ProductoRepository.create(db, producto)
    
    @staticmethod
    def listar_productos_por_nombre(db: Session, name: str) -> list[Producto]:
        return ProductoRepository.get_by_name(db, name)
    
    @staticmethod
    def obtener_productos_por_sku(db: Session, sku: str)-> Producto:
        return ProductoRepository.get_by_sku(db, sku)