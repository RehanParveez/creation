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
    "user:read": "View user accounts.",
    "user:create": "Create user accounts.",
    "user:update": "Update user accounts.",
    "user:delete": "Delete user accounts.",

    "role:read": "View roles.",
    "role:create": "Create roles.",
    "role:update": "Update roles.",
    "role:delete": "Delete roles.",

    "permission:read": "View permissions.",

    "organization:read": "View organizations.",
    "organization:create": "Create organizations.",
    "organization:update": "Update organizations.",
    "organization:members:read": "View organization members.",
    "organization:members:manage": "Manage organization members.",
    "organization:roles:read": "View organization roles.",
    "organization:roles:manage": "Manage organization roles.",
    "organization:permissions:read": "View organization permissions.",
    "organization:switch": "Switch organizations.",

    "client:read": "View clients.",
    "client:create": "Create clients.",
    "client:update": "Update clients.",
    "client:delete": "Delete clients.",

    "project:read": "View projects.",
    "project:create": "Create projects.",
    "project:update": "Update projects.",
    "project:delete": "Delete projects.",

    "site_log:read": "View site logs.",
    "site_log:create": "Create site logs.",
    "site_log:update": "Update site logs.",
    "site_log:submit": "Submit site logs.",
    "site_log:review": "Review site logs.",
    "site_log:approve": "Approve site logs.",
    "site_log:return": "Return site logs.",

    "site_log_issue:read": "View site log issues.",
    "site_log_issue:create": "Create site log issues.",
    "site_log_issue:update": "Update site log issues.",
    "site_log_issue:resolve": "Resolve site log issues.",

    "site_log_attachment:create": "Create site log attachments.",
    "site_log_attachment:delete": "Delete site log attachments.",

    "budget:read": "View project budgets.",
    "budget:create": "Create project budgets.",
    "budget:update": "Update project budgets.",
    "budget:delete": "Delete project budgets.",
    "budget:approve": "Approve project budgets.",

    "material_request:read": "View material requests.",
    "material_request:create": "Create material requests.",
    "material_request:update": "Update material requests.",
    "material_request:approve": "Approve material requests.",

    "supplier:read": "View suppliers.",
    "supplier:create": "Create suppliers.",
    "supplier:update": "Update suppliers.",
    "supplier:delete": "Delete suppliers.",

    "purchase_order:read": "View purchase orders.",
    "purchase_order:create": "Create purchase orders.",
    "purchase_order:update": "Update purchase orders.",
    "purchase_order:approve": "Approve purchase orders.",

    "goods_receipt:read": "View goods receipts.",
    "goods_receipt:create": "Create goods receipts.",

    "expense:read": "View expenses.",
    "expense:create": "Create expenses.",
    "expense:update": "Update expenses.",
    "expense:approve": "Approve expenses.",

    "dashboard:read": "View dashboards.",
}

ROLE_PERMISSIONS = {
    "Company Admin": set(PERMISSIONS.keys()),
    "Project Manager": {
    "user:read",

    "organization:members:manage",

    "client:read",
    "client:create",
    "client:update",
    "client:delete",

    "project:read",
    "project:create",
    "project:update",
    "project:delete",

    "budget:read",
    "budget:create",
    "budget:update",
    "budget:approve",

    "site_log:read",
    "site_log:create",
    "site_log:update",
    "site_log:submit",
    "site_log:review",
    "site_log:approve",
    "site_log:return",

    "site_log_issue:read",
    "site_log_issue:create",
    "site_log_issue:update",
    "site_log_issue:resolve",

    "site_log_attachment:create",
    "site_log_attachment:delete",

    "material_request:read",
    "material_request:create",
    "material_request:approve",

    "supplier:read",
    "supplier:create",
    "supplier:update",
    "supplier:delete",

    "purchase_order:read",
    "purchase_order:create",
    "purchase_order:approve",

    "goods_receipt:read",
    "goods_receipt:create",

    "expense:read",
    "expense:create",

    "dashboard:read",
},
    "Site Supervisor": {
    "project:read",

    "site_log:read",
    "site_log:create",
    "site_log:update",
    "site_log:submit",

    "site_log_issue:read",
    "site_log_issue:create",
    "site_log_issue:update",
    "site_log_issue:resolve",

    "site_log_attachment:create",
    "site_log_attachment:delete",

    "material_request:create",

    "dashboard:read",
},
    "Procurement Officer": {
    "project:read",

    "supplier:read",
    "supplier:create",
    "supplier:update",
    "supplier:delete",

    "material_request:read",
    "material_request:create",
    "material_request:update",
    "material_request:approve",

    "purchase_order:read",
    "purchase_order:create",
    "purchase_order:update",
    "purchase_order:approve",

    "goods_receipt:read",
    "goods_receipt:create",

    "dashboard:read",
},
    "Storekeeper": {
    "project:read",

    "material_request:read",

    "goods_receipt:read",
    "goods_receipt:create",

    "dashboard:read",
},
    "Finance Officer": {
    "project:read",

    "budget:read",
    "budget:create",
    "budget:update",
    "budget:approve",

    "expense:read",
    "expense:create",
    "expense:update",
    "expense:approve",

    "dashboard:read",
},
    "Client": {
    "project:read",
    "budget:read",
    "site_log:read",
    "dashboard:read",
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
            await session.flush()

        desired_permissions = ROLE_PERMISSIONS.get(name, set())

        role.permissions.clear()

        for code in desired_permissions:
            permission = permission_map.get(code)

            if permission is not None:
                role.permissions.append(permission)
        
        for code in desired_permissions:
            if code in permission_map:
                role.permissions.append(permission_map[code])

    await session.commit()