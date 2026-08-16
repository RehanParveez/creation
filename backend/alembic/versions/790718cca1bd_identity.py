"""identity

Revision ID: 790718cca1bd
Revises: 0001_identity
Create Date: 2026-08-16 13:05:18.310273

"""
from __future__ import annotations

from collections.abc import Sequence
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "790718cca1bd"
down_revision: str | None = "0001_identity"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Create the user_roles association table
    op.create_table(
        "user_roles",
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("role_id", sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(["role_id"], ["roles.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id", "role_id"),
    )

    # Ensure unique constraints and indexes match SQLAlchemy models explicitly
    op.create_unique_constraint("uq_permissions_code", "permissions", ["code"])
    op.drop_index("ix_permissions_code", table_name="permissions")
    op.create_index("ix_permissions_code", "permissions", ["code"], unique=True)

    op.create_unique_constraint("uq_refresh_tokens_token_hash", "refresh_tokens", ["token_hash"])
    op.drop_index("ix_refresh_tokens_token_hash", table_name="refresh_tokens")
    op.create_index("ix_refresh_tokens_token_hash", "refresh_tokens", ["token_hash"], unique=True)

    op.create_unique_constraint("uq_roles_name", "roles", ["name"])
    op.drop_index("ix_roles_name", table_name="roles")
    op.create_index("ix_roles_name", "roles", ["name"], unique=True)

    op.create_unique_constraint("uq_users_email", "users", ["email"])
    op.drop_index("ix_users_email", table_name="users")
    op.create_index("ix_users_email", "users", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_users_email", table_name="users")
    op.create_index("ix_users_email", "users", ["email"], unique=False)
    op.drop_constraint("uq_users_email", "users", type_="unique")

    op.drop_index("ix_roles_name", table_name="roles")
    op.create_index("ix_roles_name", "roles", ["name"], unique=False)
    op.drop_constraint("uq_roles_name", "roles", type_="unique")

    op.drop_index("ix_refresh_tokens_token_hash", table_name="refresh_tokens")
    op.create_index("ix_refresh_tokens_token_hash", "refresh_tokens", ["token_hash"], unique=False)
    op.drop_constraint("uq_refresh_tokens_token_hash", "refresh_tokens", type_="unique")

    op.drop_index("ix_permissions_code", table_name="permissions")
    op.create_index("ix_permissions_code", "permissions", ["code"], unique=False)
    op.drop_constraint("uq_permissions_code", "permissions", type_="unique")

    op.drop_table("user_roles")