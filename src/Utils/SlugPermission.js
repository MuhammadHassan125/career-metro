export const getPermissionsFromLocalStorage = () => {
  let permissionSlugs = [];
  try {
    const storedPermissions = localStorage.getItem("userPermissions");
    console.log("Raw stored permissions:", storedPermissions);
    permissionSlugs = storedPermissions ? JSON.parse(storedPermissions) : [];
    console.log("Parsed permission slugs:", permissionSlugs);
  } catch (error) {
    console.error("Failed to parse userPermissions:", error);
    permissionSlugs = [];
  }
  return permissionSlugs;
};


export const hasSlugAction = (roleName, action) => {
  // Debug logs
  console.log("Checking permission for:", { roleName, action });
  
  // Super Admin check
  if (roleName === "Super Admin") {
    console.log("Is Super Admin, returning true");
    return true;
  }

  // Get permissions
  const permissionSlugs = getPermissionsFromLocalStorage();
  console.log("All permission slugs:", permissionSlugs);

  // Check for exact match first
  if (permissionSlugs.some(slug => slug === action || slug.endsWith(`-${action}`))) {
    console.log("Found matching action");
    return true;
  }

  return false;
};