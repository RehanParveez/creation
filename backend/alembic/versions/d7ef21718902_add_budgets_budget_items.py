"""add budgets & budget items

Revision ID: d7ef21718902
Revises: b8f41c923d11
Create Date: 2026-08-20 06:14:58.121456

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "d7ef21718902"
down_revision: Union[str, None] = "b8f41c923d11"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()

    budget_status = postgresql.ENUM(
        "DRAFT",
        "PENDING_APPROVAL",
        "APPROVED",
        "REJECTED",
        name="budget_status",
    )

    budget_status.create(bind, checkfirst=True)

    op.create_table(
        "budgets",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "organization_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "project_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "name",
            sa.String(length=200),
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "status",
            postgresql.ENUM(
                "DRAFT",
                "PENDING_APPROVAL",
                "APPROVED",
                "REJECTED",
                name="budget_status",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column(
            "approved_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "approved_by",
            postgresql.UUID(as_uuid=True),
            nullable=True,
        ),
        sa.Column(
            "rejection_reason",
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
        sa.ForeignKeyConstraint(
            ["approved_by"],
            ["users.id"],
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organizations.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["project_id"],
            ["projects.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "project_id",
            name="uq_budget_project",
        ),
    )

    op.create_index(
        "ix_budgets_org_status",
        "budgets",
        ["organization_id", "status"],
        unique=False,
    )

    op.create_index(
        "ix_budgets_organization_id",
        "budgets",
        ["organization_id"],
        unique=False,
    )

    op.create_index(
        "ix_budgets_project_id",
        "budgets",
        ["project_id"],
        unique=False,
    )

    op.create_index(
        "ix_budgets_status",
        "budgets",
        ["status"],
        unique=False,
    )

    budget_item_category = postgresql.ENUM(
        "MATERIALS",
        "LABOUR",
        "EQUIPMENT",
        "SUBCONTRACTOR",
        "OTHER",
        name="budget_item_category",
    )

    budget_item_category.create(bind, checkfirst=True)

    op.create_table(
        "budget_items",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "budget_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "item_code",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.String(length=500),
            nullable=False,
        ),
        sa.Column(
            "category",
            postgresql.ENUM(
                "MATERIALS",
                "LABOUR",
                "EQUIPMENT",
                "SUBCONTRACTOR",
                "OTHER",
                name="budget_item_category",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column(
            "unit",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "planned_quantity",
            sa.Numeric(
                precision=18,
                scale=4,
            ),
            nullable=False,
        ),
        sa.Column(
            "estimated_unit_cost",
            sa.Numeric(
                precision=18,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "estimated_total_cost",
            sa.Numeric(
                precision=18,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "actual_cost",
            sa.Numeric(
                precision=18,
                scale=2,
            ),
            nullable=False,
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
        sa.CheckConstraint(
            "actual_cost >= 0",
            name="ck_budget_item_actual_nonnegative",
        ),
        sa.CheckConstraint(
            "estimated_total_cost >= 0",
            name="ck_budget_item_total_nonnegative",
        ),
        sa.CheckConstraint(
            "estimated_unit_cost >= 0",
            name="ck_budget_item_unit_cost_nonnegative",
        ),
        sa.CheckConstraint(
            "planned_quantity > 0",
            name="ck_budget_item_quantity_positive",
        ),
        sa.ForeignKeyConstraint(
            ["budget_id"],
            ["budgets.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "budget_id",
            "item_code",
            name="uq_budget_item_code",
        ),
    )

    op.create_index(
        "ix_budget_items_budget_id",
        "budget_items",
        ["budget_id"],
        unique=False,
    )

    op.create_index(
        "ix_budget_items_category",
        "budget_items",
        ["category"],
        unique=False,
    )


def downgrade() -> None:

    op.drop_index(
        "ix_budget_items_category",
        table_name="budget_items",
    )

    op.drop_index(
        "ix_budget_items_budget_id",
        table_name="budget_items",
    )

    op.drop_table("budget_items")


    op.drop_index(
        "ix_budgets_status",
        table_name="budgets",
    )

    op.drop_index(
        "ix_budgets_project_id",
        table_name="budgets",
    )

    op.drop_index(
        "ix_budgets_organization_id",
        table_name="budgets",
    )

    op.drop_index(
        "ix_budgets_org_status",
        table_name="budgets",
    )

    op.drop_table("budgets")

    op.execute(
        "DROP TYPE IF EXISTS budget_item_category"
    )

    op.execute(
        "DROP TYPE IF EXISTS budget_status"
    )