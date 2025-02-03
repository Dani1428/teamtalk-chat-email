from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Schemas de base
class DepartementBase(BaseModel):
    nom_departement: str = Field(..., max_length=100)
    sigle_departement: Optional[str] = Field(None, max_length=20)

class ServiceBase(BaseModel):
    nom_service: str = Field(..., max_length=100)
    departement_id: int
    tutelle_service_id: Optional[int] = None

class FonctionBase(BaseModel):
    nom_fonction: str = Field(..., max_length=100)
    service_id: int

class UtilisateurBase(BaseModel):
    nom_prenoms: str = Field(..., max_length=100)
    fonction_id: int

class CourrierEnvoieBase(BaseModel):
    expediteur: str = Field(..., max_length=100)
    date_envoie: datetime
    num_origine: Optional[str] = Field(None, max_length=50)
    objet: str
    joint: bool = False
    note_1: Optional[str] = None
    note_2: Optional[str] = None

class InstructionBase(BaseModel):
    nom_instruction: str = Field(..., max_length=100)

class CourrierRecuBase(BaseModel):
    courrier_envoie_id: int
    utilisateur_id: int
    instruction_id: int

# Schemas pour la création
class DepartementCreate(DepartementBase):
    pass

class ServiceCreate(ServiceBase):
    pass

class FonctionCreate(FonctionBase):
    pass

class UtilisateurCreate(UtilisateurBase):
    pass

class CourrierEnvoieCreate(CourrierEnvoieBase):
    pass

class InstructionCreate(InstructionBase):
    pass

class CourrierRecuCreate(CourrierRecuBase):
    pass

# Schemas pour la lecture
class Departement(DepartementBase):
    id: int
    
    class Config:
        orm_mode = True

class Service(ServiceBase):
    id: int
    departement: Departement
    service_tutelle: Optional['Service'] = None
    
    class Config:
        orm_mode = True

class Fonction(FonctionBase):
    id: int
    service: Service
    
    class Config:
        orm_mode = True

class Utilisateur(UtilisateurBase):
    id: int
    fonction: Fonction
    
    class Config:
        orm_mode = True

class Instruction(InstructionBase):
    id: int
    
    class Config:
        orm_mode = True

class CourrierEnvoie(CourrierEnvoieBase):
    id: int
    courriers_recus: List['CourrierRecu']
    
    class Config:
        orm_mode = True

class CourrierRecu(CourrierRecuBase):
    id: int
    courrier_envoie: CourrierEnvoie
    utilisateur: Utilisateur
    instruction: Instruction
    
    class Config:
        orm_mode = True

# Mise à jour des références circulaires
Service.update_forward_refs()
CourrierEnvoie.update_forward_refs()

# Schemas pour les réponses avec pagination
class CourrierPage(BaseModel):
    total: int
    items: List[CourrierEnvoie]
    
class ServicePage(BaseModel):
    total: int
    items: List[Service]

# Schemas pour les statistiques
class CourrierStats(BaseModel):
    total_envoyes: int
    total_recus: int
    par_instruction: dict[str, int]
    par_departement: dict[str, int]

# Schemas pour les filtres
class CourrierFilter(BaseModel):
    date_debut: Optional[datetime] = None
    date_fin: Optional[datetime] = None
    departement_id: Optional[int] = None
    instruction_id: Optional[int] = None
    expediteur: Optional[str] = None
    objet_contains: Optional[str] = None
