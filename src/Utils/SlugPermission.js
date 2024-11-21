export const getPermissionsFromLocalStorage = () => {
  let permissionSlugs = [];
  try {
    const storedPermissions = localStorage.getItem("userPermissions");
    permissionSlugs = storedPermissions ? JSON.parse(storedPermissions) : [];
  } catch (error) {
    permissionSlugs = [];
  }
  return permissionSlugs;
};


export const hasSlugAction = (roleName, action) => {

  if (roleName === "Super Admin") {
    return true;
  }

  // Get permissions
  const permissionSlugs = getPermissionsFromLocalStorage();

  // Check for exact match first
  if (permissionSlugs.some(slug => slug === action || slug.endsWith(`-${action}`))) {
    return true;
  }

  return false;
};