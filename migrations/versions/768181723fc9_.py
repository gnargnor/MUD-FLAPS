"""empty message

Revision ID: 768181723fc9
Revises: 
Create Date: 2018-01-15 22:07:07.495711

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '768181723fc9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=64), nullable=True),
    sa.Column('password_hash', sa.String(length=128), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    op.create_table('world',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creator_id', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('name', sa.String(length=128), nullable=True),
    sa.Column('desc', sa.String(), nullable=True),
    sa.Column('game_count', sa.Integer(), nullable=True),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_world_active'), 'world', ['active'], unique=False)
    op.create_index(op.f('ix_world_date_created'), 'world', ['date_created'], unique=False)
    op.create_index(op.f('ix_world_name'), 'world', ['name'], unique=True)
    op.create_table('location',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creator_id', sa.Integer(), nullable=True),
    sa.Column('world_id', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('x', sa.Integer(), nullable=True),
    sa.Column('y', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=128), nullable=True),
    sa.Column('desc', sa.String(), nullable=True),
    sa.Column('short_desc', sa.String(), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['world_id'], ['world.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_location_date_created'), 'location', ['date_created'], unique=False)
    op.create_index(op.f('ix_location_name'), 'location', ['name'], unique=True)
    op.create_table('exit',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creator_id', sa.Integer(), nullable=True),
    sa.Column('location_id', sa.Integer(), nullable=True),
    sa.Column('dest_loc_id', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('desc', sa.String(length=128), nullable=True),
    sa.Column('direction', sa.String(), nullable=True),
    sa.Column('is_open', sa.Boolean(), nullable=True),
    sa.Column('is_unlocked', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['dest_loc_id'], ['location.id'], ),
    sa.ForeignKeyConstraint(['location_id'], ['location.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_exit_date_created'), 'exit', ['date_created'], unique=False)
    op.create_table('item',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creator_id', sa.Integer(), nullable=True),
    sa.Column('world_id', sa.Integer(), nullable=True),
    sa.Column('location_id', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('name', sa.String(length=128), nullable=True),
    sa.Column('desc', sa.String(), nullable=True),
    sa.Column('targets', sa.String(), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['location_id'], ['location.id'], ),
    sa.ForeignKeyConstraint(['world_id'], ['world.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_item_date_created'), 'item', ['date_created'], unique=False)
    op.create_index(op.f('ix_item_name'), 'item', ['name'], unique=True)
    op.create_table('sight',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creator_id', sa.Integer(), nullable=True),
    sa.Column('world_id', sa.Integer(), nullable=True),
    sa.Column('location_id', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('name', sa.String(length=128), nullable=True),
    sa.Column('desc', sa.String(), nullable=True),
    sa.Column('important', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['location_id'], ['location.id'], ),
    sa.ForeignKeyConstraint(['world_id'], ['world.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sight_date_created'), 'sight', ['date_created'], unique=False)
    op.create_index(op.f('ix_sight_name'), 'sight', ['name'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_sight_name'), table_name='sight')
    op.drop_index(op.f('ix_sight_date_created'), table_name='sight')
    op.drop_table('sight')
    op.drop_index(op.f('ix_item_name'), table_name='item')
    op.drop_index(op.f('ix_item_date_created'), table_name='item')
    op.drop_table('item')
    op.drop_index(op.f('ix_exit_date_created'), table_name='exit')
    op.drop_table('exit')
    op.drop_index(op.f('ix_location_name'), table_name='location')
    op.drop_index(op.f('ix_location_date_created'), table_name='location')
    op.drop_table('location')
    op.drop_index(op.f('ix_world_name'), table_name='world')
    op.drop_index(op.f('ix_world_date_created'), table_name='world')
    op.drop_index(op.f('ix_world_active'), table_name='world')
    op.drop_table('world')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###
