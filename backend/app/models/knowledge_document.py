from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin


class KnowledgeDocument(Base, TimestampMixin):
    """Knowledge base document entity for RAG grounding and conservation guidance."""
    __tablename__ = "knowledge_documents"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String(255), nullable=False, default="IUCN / National Biodiversity Authority")
    category: Mapped[str] = mapped_column(
        String(100), nullable=False, default="conservation_guidance", index=True
    )  # species_information, habitat_information, conservation_guidance, sdg15, invasive_species, ecosystem_management
    embedding_reference: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    def __repr__(self) -> str:
        return f"<KnowledgeDocument id={self.id} title='{self.title}' category='{self.category}'>"
