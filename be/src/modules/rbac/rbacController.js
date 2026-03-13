import prisma from "../../../config/db/prismaClient.js";

// ======================
// ROLES
// ======================

export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        role_permission: {
          include: {
            permission: true,
          },
        },
      },
    });

    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      permissions: role.role_permission.map((rp) => rp.permission),
    }));

    res.status(200).json({ roles: formattedRoles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        role_permission: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const formattedRole = {
      id: role.id,
      name: role.name,
      permissions: role.role_permission.map((rp) => rp.permission),
    };

    res.status(200).json({ role: formattedRole });
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name, permissionIds } = req.body;
    
    const result = await prisma.$transaction(async (tx) => {
      const newRole = await tx.role.create({
        data: { name },
      });

      if (permissionIds && permissionIds.length > 0) {
        await tx.role_permission.createMany({
          data: permissionIds.map((pId) => ({
            role_id: newRole.id,
            permission_id: pId,
          })),
        });
      }

      return newRole;
    });

    res.status(201).json({ role: result, message: "Role created successfully" });
  } catch (error) {
    console.error("Error creating role:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Role name already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedRole = await prisma.role.update({
      where: { id },
      data: { name },
    });
    res.status(200).json({ role: updatedRole, message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use a transaction to ensure both associated permissions and the role are deleted
    await prisma.$transaction([
      prisma.role_permission.deleteMany({
        where: { role_id: id },
      }),
      prisma.role.delete({
        where: { id },
      }),
    ]);

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Role not found" });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ 
        message: "Cannot delete role because it is still assigned to users. Please reassign users before deleting." 
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// PERMISSIONS
// ======================

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.status(200).json({ permissions });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.status(200).json({ permission });
  } catch (error) {
    console.error("Error fetching permission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name, label, description, module: moduleName } = req.body;
    const newPermission = await prisma.permission.create({
      data: { 
        name,
        label,
        description,
        module: moduleName
      },
    });
    res.status(201).json({ permission: newPermission, message: "Permission created successfully" });
  } catch (error) {
    console.error("Error creating permission:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Permission name already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, label, description, module: moduleName } = req.body;
    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: { 
        name,
        label,
        description,
        module: moduleName
      },
    });
    res.status(200).json({ permission: updatedPermission, message: "Permission updated successfully" });
  } catch (error) {
    console.error("Error updating permission:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    // Use a transaction to ensure both associated role assignments and the permission are deleted
    await prisma.$transaction([
      prisma.role_permission.deleteMany({
        where: { permission_id: id },
      }),
      prisma.permission.delete({
        where: { id },
      }),
    ]);

    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    console.error("Error deleting permission:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// ROLE-PERMISSION ASSIGNMENT
// ======================

export const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionId } = req.body;

    const rolePermission = await prisma.role_permission.create({
      data: {
        role_id: roleId,
        permission_id: permissionId,
      },
      include: {
        permission: true,
      }
    });

    res.status(201).json({ 
      message: "Permission assigned to role successfully",
      assignment: rolePermission 
    });
  } catch (error) {
    console.error("Error assigning permission to role:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Permission already assigned to this role" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removePermissionFromRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.params;

    const existing = await prisma.role_permission.findFirst({
        where: {
            role_id: roleId,
            permission_id: permissionId
        }
    });

    if (!existing) {
        return res.status(404).json({ message: "Assignment not found" });
    }

    await prisma.role_permission.delete({
      where: { id: existing.id }
    });

    res.status(200).json({ message: "Permission removed from role successfully" });
  } catch (error) {
    console.error("Error removing permission from role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
