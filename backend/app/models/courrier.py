from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Departement(Base):
    __tablename__ = "departement"

    id = Column(Integer, primary_key=True, index=True)
    nom_departement = Column(String(100), nullable=False)
    sigle_departement = Column(String(20), unique=True)
    
    # Relations
    services = relationship("Service", back_populates="departement")

class Service(Base):
    __tablename__ = "service"

    id = Column(Integer, primary_key=True, index=True)
    nom_service = Column(String(100), nullable=False)
    departement_id = Column(Integer, ForeignKey("departement.id"), nullable=False)
    tutelle_service_id = Column(Integer, ForeignKey("service.id"), nullable=True)
    
    # Relations
    departement = relationship("Departement", back_populates="services")
    service_tutelle = relationship("Service", remote_side=[id], backref="services_sous_tutelle")
    fonctions = relationship("Fonction", back_populates="service")

    # Contrainte pour empêcher l'auto-référence
    __table_args__ = (
        CheckConstraint('id != tutelle_service_id', name='check_self_reference'),
    )

class Fonction(Base):
    __tablename__ = "fonction"

    id = Column(Integer, primary_key=True, index=True)
    nom_fonction = Column(String(100), nullable=False)
    service_id = Column(Integer, ForeignKey("service.id"), nullable=False)
    
    # Relations
    service = relationship("Service", back_populates="fonctions")
    utilisateur = relationship("Utilisateur", back_populates="fonction", uselist=False)

class Utilisateur(Base):
    __tablename__ = "utilisateur"

    id = Column(Integer, primary_key=True, index=True)
    nom_prenoms = Column(String(100), nullable=False)
    fonction_id = Column(Integer, ForeignKey("fonction.id"), nullable=False, unique=True)
    
    # Relations
    fonction = relationship("Fonction", back_populates="utilisateur")
    courriers_recus = relationship("CourrierRecu", back_populates="utilisateur")

class CourrierEnvoie(Base):
    __tablename__ = "courrier_envoie"

    id = Column(Integer, primary_key=True, index=True)
    expediteur = Column(String(100), nullable=False)
    date_envoie = Column(DateTime, nullable=False)
    num_origine = Column(String(50))
    objet = Column(Text, nullable=False)
    joint = Column(Boolean, default=False)
    note_1 = Column(Text)
    note_2 = Column(Text)
    
    # Relations
    courriers_recus = relationship("CourrierRecu", back_populates="courrier_envoie")

class Instruction(Base):
    __tablename__ = "instructions"

    id = Column(Integer, primary_key=True, index=True)
    nom_instruction = Column(String(100), nullable=False)
    
    # Relations
    courriers_recus = relationship("CourrierRecu", back_populates="instruction")

class CourrierRecu(Base):
    __tablename__ = "courrier_recu"

    id = Column(Integer, primary_key=True, index=True)
    courrier_envoie_id = Column(Integer, ForeignKey("courrier_envoie.id"), nullable=False)
    utilisateur_id = Column(Integer, ForeignKey("utilisateur.id"), nullable=False)
    instruction_id = Column(Integer, ForeignKey("instructions.id"), nullable=False)
    
    # Relations
    courrier_envoie = relationship("CourrierEnvoie", back_populates="courriers_recus")
    utilisateur = relationship("Utilisateur", back_populates="courriers_recus")
    instruction = relationship("Instruction", back_populates="courriers_recus")
