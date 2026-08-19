from __future__ import annotations
from app.modules.identity.models import Permission, Role
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

SYSTEM_ROLES = {
    "Company Admin": "Full access to the organization workspace.",
    "Project Manager": "Manage projects and operational workflows.",
    "Site Supervisor": "Record and view site progress.",
    "Procurement Officer": "Manage procurement workflows.",
    "Storekeeper": "Receive and manage delivered materials.",
    "Finance Officer": "Manage financial workflows and expenses.",
    "Client": "Read-only access for client users.",
}

PERMISSIONS = {
    "user.view": "View user accounts.",
    "user.manage": "Manage user accounts.",
    "role.view": "View roles.",
    "role.manage": "Manage roles.",
    "permission.view": "View permissions.",
    "organization.users.manage": "Manage organization members.",
    "project.view": "View projects.",
    "project.create": "Create projects.",
    "project.update": "Update projects.",
    "budget.view": "View project budgets.",
    "budget.manage": "Manage project budgets.",
    "budget.approve": "Approve project budgets.",
    "site_log.create": "Create site progress reports.",
    "site_log.view": "View site progress reports.",
    "material_request.create": "Create material requests.",
    "material_request.view": "View material requests.",
    "material_request.approve": "Approve material requests.",
    "supplier.manage": "Manage suppliers.",
    "purchase_order.create": "Create purchase orders.",
    "purchase_order.approve": "Approve purchase orders.",
    "goods_receipt.create": "Record goods receipts.",
    "expense.create": "Create expenses.",
    "expense.view": "View expenses.",
    "dashboard.view": "View project dashboards.",
}

ROLE_PERMISSIONS = {
    "Company Admin": set(PERMISSIONS.keys()),
    "Project Manager": {
        "user.view",
        "organization.users.manage",
        "project.view",
        "project.create",
        "project.update",
        "budget.view",
        "budget.manage",
        "budget.approve",
        "site_log.create",
        "site_log.view",
        "material_request.create",
        "material_request.approve",
        "supplier.manage",
        "purchase_order.create",
        "purchase_order.approve",
        "goods_receipt.create",
        "expense.create",
        "expense.view",
        "dashboard.view",
    },
    "Site Supervisor": {
        "project.view",
        "site_log.create",
        "site_log.view",
        "material_request.create",
        "dashboard.view",
    },
    "Procurement Officer": {
        "project.view",
        "supplier.manage",
        "material_request.view",
        "purchase_order.create",
        "purchase_order.approve",
        "goods_receipt.create",
        "dashboard.view",
    },
    "Storekeeper": {
        "project.view",
        "material_request.view",
        "goods_receipt.create",
        "dashboard.view",
    },
    "Finance Officer": {
        "project.view",
        "budget.view",
        "expense.create",
        "expense.view",
        "dashboard.view",
    },
    "Client": {
        "project.view",
        "budget.view",
        "site_log.view",
        "dashboard.view",
    },
}

async def seed_identity_data(session: AsyncSession) -> None:

    permission_map: dict[str, Permission] = {}
    for code, description in PERMISSIONS.items():
        result = await session.execute(
            select(Permission).where(Permission.code == code)
        )
        permission = result.scalar_one_or_none()

        if permission is None:
            permission = Permission(
                code=code,
                description=description,
            )
            session.add(permission)

        permission_map[code] = permission

    await session.flush()

    for name, description in SYSTEM_ROLES.items():
        result = await session.execute(
            select(Role)
            .options(selectinload(Role.permissions))
            .where(Role.name == name)
        )
        role = result.scalar_one_or_none()

        if role is None:
            role = Role(
                name=name,
                description=description,
                is_system=True,
            )
            session.add(role)

        desired_permissions = ROLE_PERMISSIONS.get(name, set())

        if role is None:
            role = Role(
                name=name,
                description=description,
                is_system=True,
            )
            session.add(role)
            await session.flush() 

        desired_permissions = ROLE_PERMISSIONS.get(name, set())
        role.permissions.clear()
        for code in desired_permissions:
            if code in permission_map:
                role.permissions.append(permission_map[code])

    await session.commit()