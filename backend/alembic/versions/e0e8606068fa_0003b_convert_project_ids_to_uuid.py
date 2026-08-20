"""0003b convert project ids to uuid

Revision ID: b8f41c923d11
Revises: af42dc7647e6
Create Date: 2026-08-20 <current_timestamp>

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b8f41c923d11'
down_revision: Union[str, None] = 'af42dc7647e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:

    op.drop_constraint(
        "projects_client_id_fkey",
        "projects",
        type_="foreignkey",
    )

    op.drop_constraint(
        "milestones_project_id_fkey",
        "milestones",
        type_="foreignkey",
    )

    op.drop_constraint(
        "project_members_project_id_fkey",
        "project_members",
        type_="foreignkey",
    )

    op.alter_column(
        "clients",
        "id",
        existing_type=sa.VARCHAR(),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using="id::uuid",
    )


    op.alter_column(
        "projects",
        "id",
        existing_type=sa.VARCHAR(),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using="id::uuid",
    )

    op.alter_column(
        "projects",
        "client_id",
        existing_type=sa.VARCHAR(),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=True,
        postgresql_using="client_id::uuid",
    )

    op.alter_column(
        "milestones",
        "id",
        existing_type=sa.VARCHAR(),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using="id::uuid",
    )

    op.alter_column(
        "milestones",
        "project_id",
        existing_type=sa.VARCHAR(),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using="project_id::uuid",
    )

    op.alter_column(
        "project_members",
        "id",
        existing_type=sa.VARCHAR(),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using="id::uuid",
    )

    op.alter_column(
        "project_members",
        "project_id",
        existing_type=sa.VARCHAR(),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using="project_id::uuid",
    )

    op.create_foreign_key(
        "projects_client_id_fkey",
        "projects",
        "clients",
        ["client_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_foreign_key(
        "milestones_project_id_fkey",
        "milestones",
        "projects",
        ["project_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_foreign_key(
        "project_members_project_id_fkey",
        "project_members",
        "projects",
        ["project_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.execute(
        "ALTER TYPE projectstatus RENAME TO project_status"
    )

    op.execute(
        "ALTER TYPE milestonestatus RENAME TO milestone_status"
    )

    op.execute(
        "ALTER TYPE projectrole RENAME TO project_role"
    )

    op.alter_column(
        "projects",
        "status",
        existing_type=postgresql.ENUM(
            "DRAFT",
            "ACTIVE",
            "ON_HOLD",
            "COMPLETED",
            "CANCELLED",
            name="project_status",
        ),
        existing_nullable=False,
    )

    op.alter_column(
        "milestones",
        "status",
        existing_type=postgresql.ENUM(
            "PENDING",
            "IN_PROGRESS",
            "COMPLETED",
            name="milestone_status",
        ),
        existing_nullable=False,
    )

    op.alter_column(
        "project_members",
        "role",
        existing_type=postgresql.ENUM(
            "MANAGER",
            "ENGINEER",
            "VIEWER",
            name="project_role",
        ),
        existing_nullable=False,
    )

    op.create_index(
        "ix_projects_client_id",
        "projects",
        ["client_id"],
        unique=False,
    )

    op.create_index(
        "ix_projects_org_status",
        "projects",
        ["organization_id", "status"],
        unique=False,
    )

    op.create_index(
        "ix_projects_status",
        "projects",
        ["status"],
        unique=False,
    )

    op.create_index(
        "ix_milestones_status",
        "milestones",
        ["status"],
        unique=False,
    )


    op.create_unique_constraint(
        "uq_project_member_project_user",
        "project_members",
        ["project_id", "user_id"],
    )

def downgrade() -> None:

    op.drop_constraint(
        "uq_project_member_project_user",
        "project_members",
        type_="unique",
    )

    op.drop_index(
        "ix_milestones_status",
        table_name="milestones",
    )

    op.drop_index(
        "ix_projects_status",
        table_name="projects",
    )

    op.drop_index(
        "ix_projects_org_status",
        table_name="projects",
    )

    op.drop_index(
        "ix_projects_client_id",
        table_name="projects",
    )

    op.drop_constraint(
        "projects_client_id_fkey",
        "projects",
        type_="foreignkey",
    )

    op.drop_constraint(
        "milestones_project_id_fkey",
        "milestones",
        type_="foreignkey",
    )

    op.drop_constraint(
        "project_members_project_id_fkey",
        "project_members",
        type_="foreignkey",
    )


    op.execute(
        "ALTER TYPE project_status RENAME TO projectstatus"
    )

    op.execute(
        "ALTER TYPE milestone_status RENAME TO milestonestatus"
    )

    op.execute(
        "ALTER TYPE project_role RENAME TO projectrole"
    )

    op.alter_column(
        "project_members",
        "project_id",
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.VARCHAR(),
        existing_nullable=False,
        postgresql_using="project_id::text",
    )

    op.alter_column(
        "project_members",
        "id",
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.VARCHAR(),
        existing_nullable=False,
        postgresql_using="id::text",
    )

    op.alter_column(
        "milestones",
        "project_id",
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.VARCHAR(),
        existing_nullable=False,
        postgresql_using="project_id::text",
    )

    op.alter_column(
        "milestones",
        "id",
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.VARCHAR(),
        existing_nullable=False,
        postgresql_using="id::text",
    )

    op.alter_column(
        "projects",
        "client_id",
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.VARCHAR(),
        existing_nullable=True,
        postgresql_using="client_id::text",
    )

    op.alter_column(
        "projects",
        "id",
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.VARCHAR(),
        existing_nullable=False,
        postgresql_using="id::text",
    )


    op.alter_column(
        "clients",
        "id",
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.VARCHAR(),
        existing_nullable=False,
        postgresql_using="id::text",
    )

    op.create_foreign_key(
        "projects_client_id_fkey",
        "projects",
        "clients",
        ["client_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_foreign_key(
        "milestones_project_id_fkey",
        "milestones",
        "projects",
        ["project_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_foreign_key(
        "project_members_project_id_fkey",
        "project_members",
        "projects",
        ["project_id"],
        ["id"],
        ondelete="CASCADE",
    )