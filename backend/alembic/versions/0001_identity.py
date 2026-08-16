from collections.abc import Sequence
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0001_identity"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
  op.create_table(
    "users",
    sa.Column(
      "id",
      postgresql.UUID(as_uuid=True),
      primary_key=True,
      nullable=False,
    ),
    sa.Column(
      "email",
      sa.String(length=320),
      nullable=False,
    ),
    sa.Column(
      "password_hash",
      sa.String(length=255),
      nullable=False,
    ),
    sa.Column(
      "first_name",
      sa.String(length=100),
      nullable=False,
    ),
    sa.Column(
      "last_name",
      sa.String(length=100),
      nullable=False,
    ),
    sa.Column(
      "is_active",
      sa.Boolean(),
      nullable=False,
      server_default=sa.true(),
    ),
    sa.Column(
      "is_verified",
      sa.Boolean(),
      nullable=False,
      server_default=sa.false(),
    ),
    sa.Column(
      "failed_login_attempts",
      sa.Integer(),
      nullable=False,
      server_default="0",
    ),
    sa.Column(
      "locked_until",
      sa.DateTime(timezone=True),
      nullable=True,
    ),
    sa.Column(
      "last_login_at",
      sa.DateTime(timezone=True),
      nullable=True,
    ),
    sa.Column(
      "password_changed_at",
      sa.DateTime(timezone=True),
      nullable=True,
    ),
    sa.Column(
      "created_at",
      sa.DateTime(timezone=True),
      nullable=False,
    ),
    sa.Column(
      "updated_at",
      sa.DateTime(timezone=True),
      nullable=False,
    ),
    sa.UniqueConstraint(
      "email", name = "uq_users_email",
    ),
  )

  op.create_index(
    "ix_users_email",
    "users",
    ["email"],
  )

  op.create_index(
    "ix_users_is_active",
    "users",
    ["is_active"],
  )

  op.create_index(
    "ix_users_active_email",
    "users",
    ["is_active", "email"],
  )

  op.create_table(
    "roles",
    sa.Column(
      "id",
      postgresql.UUID(as_uuid=True),
      primary_key=True,
      nullable=False,
    ),
    sa.Column(
      "name",
      sa.String(length=100),
      nullable=False,
    ),
    sa.Column(
      "description",
      sa.Text(),
      nullable=True,
    ),
    sa.Column(
      "is_system",
      sa.Boolean(),
      nullable=False,
      server_default=sa.true(),
    ),
    sa.Column(
      "created_at",
      sa.DateTime(timezone=True),
      nullable=False,
    ),
    sa.Column(
      "updated_at",
      sa.DateTime(timezone=True),
      nullable=False,
    ),
    sa.UniqueConstraint(
      "name",
      name = "uq_roles_name",
    ),
  )

  op.create_index(
    "ix_roles_name",
    "roles",
    ["name"],
  )

  op.create_table(
    "permissions",
    sa.Column(
      "id",
      postgresql.UUID(as_uuid=True),
      primary_key=True,
      nullable=False,
    ),
    sa.Column(
      "code",
      sa.String(length=150),
      nullable=False,
    ),
    sa.Column(
      "description",
      sa.Text(),
      nullable=True,
    ),
    sa.Column(
      "created_at",
      sa.DateTime(timezone=True),
      nullable=False,
    ),
    sa.Column(
      "updated_at",
      sa.DateTime(timezone=True),
      nullable=False,
    ),
    sa.UniqueConstraint(
      "code",
      name = "uq_permissions_code",
    ),
  )

  op.create_index(
    "ix_permissions_code",
    "permissions",
    ["code"],
  )

  op.create_table(
    "role_permissions",
    sa.Column(
      "role_id",
      postgresql.UUID(as_uuid=True),
      nullable=False,
    ),
    sa.Column(
      "permission_id",
      postgresql.UUID(as_uuid=True),
      nullable=False,
    ),
    sa.ForeignKeyConstraint(
      ["role_id"],
      ["roles.id"],
      ondelete="CASCADE",
    ),
    sa.ForeignKeyConstraint(
      ["permission_id"],
      ["permissions.id"],
      ondelete="CASCADE",
    ),
    sa.PrimaryKeyConstraint(
      "role_id",
      "permission_id",
    ),
  )

  op.create_table(
    "refresh_tokens",
    sa.Column(
      "id",
      postgresql.UUID(as_uuid=True),
      primary_key=True,
      nullable=False,
    ),
    sa.Column(
      "user_id",
      postgresql.UUID(as_uuid=True),
      nullable=False,
    ),
    sa.Column(
      "token_hash",
      sa.String(length=64),
      nullable=False,
    ),
    sa.Column(
      "expires_at",
      sa.DateTime(timezone=True),
      nullable=False,
    ),
    sa.Column(
      "revoked_at",
      sa.DateTime(timezone=True),
      nullable=True,
    ),
    sa.Column(
      "replaced_by_id",
      postgresql.UUID(as_uuid=True),
      nullable=True,
    ),
    sa.Column(
      "user_agent",
      sa.String(length=500),
      nullable=True,
    ),
    sa.Column(
      "ip_address",
      sa.String(length=64),
      nullable=True,
    ),
    sa.Column(
      "created_at",
      sa.DateTime(timezone=True),
      nullable=False,
    ),
    sa.Column(
      "updated_at",
      sa.DateTime(timezone=True),
      nullable=False,
    ),
    sa.ForeignKeyConstraint(
      ["user_id"],
      ["users.id"],
      ondelete="CASCADE",
    ),
    sa.ForeignKeyConstraint(
      ["replaced_by_id"],
      ["refresh_tokens.id"],
      ondelete="SET NULL",
    ),
    sa.UniqueConstraint(
      "token_hash",
      name = "uq_refresh_tokens_token_hash",
    ),
  )

  op.create_index(
    "ix_refresh_tokens_user_id",
    "refresh_tokens",
    ["user_id"],
  )

  op.create_index(
    "ix_refresh_tokens_token_hash",
    "refresh_tokens",
    ["token_hash"],
  )

  op.create_index(
    "ix_refresh_tokens_expires_at",
    "refresh_tokens",
    ["expires_at"],
  )

  op.create_index(
    "ix_refresh_tokens_user_active",
    "refresh_tokens",
    ["user_id", "revoked_at", "expires_at"],
  )


def downgrade() -> None:
  op.drop_index(
    "ix_refresh_tokens_user_active",
    table_name = "refresh_tokens",
  )
  op.drop_index(
    "ix_refresh_tokens_expires_at",
    table_name = "refresh_tokens",
  )
  op.drop_index(
    "ix_refresh_tokens_token_hash",
    table_name = "refresh_tokens",
  )
  op.drop_index(
    "ix_refresh_tokens_user_id",
    table_name = "refresh_tokens",
  )

  op.drop_table("refresh_tokens")
  op.drop_table("role_permissions")

  op.drop_index(
    "ix_permissions_code",
    table_name = "permissions",
  )
  op.drop_table("permissions")

  op.drop_index(
    "ix_roles_name",
    table_name = "roles",
  )
  op.drop_table("roles")

  op.drop_index(
    "ix_users_active_email",
    table_name = "users",
  )
  op.drop_index(
    "ix_users_is_active",
    table_name = "users",
  )
  op.drop_index(
    "ix_users_email",
    table_name = "users",
  )
  op.drop_table("users")