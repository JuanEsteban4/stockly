from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship 
from app.core.database import Base


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String)
    sku = Column(String, unique=True)
    precio_costo = Column(Float, default=0)
    precio_venta = Column(Float, default=0)
    stock_actual = Column(Integer, default=0)
    stock_minimo = Column(Integer, default=5)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    categoria = relationship("Categoria", back_populates="productos")