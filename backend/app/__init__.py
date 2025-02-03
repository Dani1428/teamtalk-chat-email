from .database import Base, engine
from .models import *

# Créer les tables si elles n'existent pas
Base.metadata.create_all(bind=engine)
