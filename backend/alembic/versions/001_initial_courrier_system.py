"""Initial courrier system

Revision ID: 001
Revises: 
Create Date: 2025-02-03 21:34:49.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Table Departement
    op.create_table('departement',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nom_departement', sa.String(length=100), nullable=False),
        sa.Column('sigle_departement', sa.String(length=20), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('sigle_departement')
    )

    # Table Service
    op.create_table('service',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nom_service', sa.String(length=100), nullable=False),
        sa.Column('departement_id', sa.Integer(), nullable=False),
        sa.Column('tutelle_service_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['departement_id'], ['departement.id'], ),
        sa.ForeignKeyConstraint(['tutelle_service_id'], ['service.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('id != tutelle_service_id', name='check_self_reference')
    )

    # Table Fonction
    op.create_table('fonction',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nom_fonction', sa.String(length=100), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['service_id'], ['service.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Table Utilisateur
    op.create_table('utilisateur',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nom_prenoms', sa.String(length=100), nullable=False),
        sa.Column('fonction_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['fonction_id'], ['fonction.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('fonction_id')
    )

    # Table Courrier_envoie
    op.create_table('courrier_envoie',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('expediteur', sa.String(length=100), nullable=False),
        sa.Column('date_envoie', sa.DateTime(), nullable=False),
        sa.Column('num_origine', sa.String(length=50), nullable=True),
        sa.Column('objet', sa.Text(), nullable=False),
        sa.Column('joint', sa.Boolean(), default=False),
        sa.Column('note_1', sa.Text(), nullable=True),
        sa.Column('note_2', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Table Instructions
    op.create_table('instructions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nom_instruction', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Table Courrier_recu
    op.create_table('courrier_recu',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('courrier_envoie_id', sa.Integer(), nullable=False),
        sa.Column('utilisateur_id', sa.Integer(), nullable=False),
        sa.Column('instruction_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['courrier_envoie_id'], ['courrier_envoie.id'], ),
        sa.ForeignKeyConstraint(['utilisateur_id'], ['utilisateur.id'], ),
        sa.ForeignKeyConstraint(['instruction_id'], ['instructions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Création des index
    op.create_index('idx_service_dept', 'service', ['departement_id'])
    op.create_index('idx_fonction_service', 'fonction', ['service_id'])
    op.create_index('idx_user_fonction', 'utilisateur', ['fonction_id'])
    op.create_index('idx_courrier_recu_refs', 'courrier_recu', 
                    ['courrier_envoie_id', 'utilisateur_id', 'instruction_id'])

    # Insertion des instructions par défaut
    op.execute("""
        INSERT INTO instructions (nom_instruction) VALUES
        ('Pour représenter le ministre'),
        ('Pour instruction à prendre'),
        ('Pour examen et suite à donner'),
        ('Etudes et synthèse'),
        ('Note à l''attention du Ministre'),
        ('Pour avis et suggestion'),
        ('Pour suivi'),
        ('Pour attribution'),
        ('Pour disposition à prendre'),
        ('Pour information'),
        ('Pour diffusion'),
        ('Pour exploitation et nécessaire à faire'),
        ('Avec avis favorable'),
        ('Pour en parler au Ministre'),
        ('Pour préparer un projet réponse'),
        ('Délai d''exécution'),
        ('Pour en rendre compte au Ministre'),
        ('Pour préparer une réunion'),
        ('Pour un exposé thématique')
    """)

def downgrade() -> None:
    # Suppression des index
    op.drop_index('idx_courrier_recu_refs')
    op.drop_index('idx_user_fonction')
    op.drop_index('idx_fonction_service')
    op.drop_index('idx_service_dept')

    # Suppression des tables dans l'ordre inverse de leur création
    op.drop_table('courrier_recu')
    op.drop_table('instructions')
    op.drop_table('courrier_envoie')
    op.drop_table('utilisateur')
    op.drop_table('fonction')
    op.drop_table('service')
    op.drop_table('departement')
